/**
 * Copyright (c) 2016-2018 Research Institute for Information Technology(RIIT), Kyushu University. All rights reserved.
 * Copyright (c) 2016-2018 RIKEN Center for Computational Science. All rights reserved.
 * Copyright (c) 2021-2022 National Institute of Information and Communications Technology (NICT).  All rights reserved.
 */

/**
 * 汎用csvパーサーを,fileSourceに設定する.
 * @param {*} fileSource
 */
function createCSVBargraphSource(itownsView, config) {
  function checkResponse(response) {
    if (!response.ok) {
      let error = new Error(`Error loading ${response.url}: status ${response.status}`);
      error.response = response;
      throw error;
    }
  }

  const arrayBuffer = (url, options = {}) => fetch(url, options).then((response) => {
    checkResponse(response);
    return response.arrayBuffer();
  });

  const bargraphSource = new itowns.FileSource({
    url: config.url,
    crs: 'EPSG:4326',
    // コンストラクタでfetcherが使用され、結果がfetchedDataに入る.
    fetcher: (url, options = {}) => {
      return arrayBuffer(url, options).then((buffer) => {
        return buffer;
      });
    },
    // 後ほど（タイミングはよくわからない）, parserが使用され、返り値はFileSourceがcacheする
    parser: (buffer, options = {}) => {
      let data = new Uint8Array(buffer);
      let converted = Encoding.convert(data, {
        to: 'UNICODE',
        from: 'AUTO'
      });
      let str = Encoding.codeToString(converted);
      let parsed = Papa.parse(str);

      // 初回パース時にジオメトリを生成しておく
      let group = new itowns.THREE.Group();
      for (let i = 0; i < parsed.data.length; ++i) {
        if (parsed.data[i].length !== parsed.data[0].length) continue;
        let material = new itowns.THREE.MeshToonMaterial({ color: 0x5555ff });
        material.opacity = config.opacity;
        const geo = new itowns.THREE.BoxGeometry(1, 1, 1);
        geo.translate(0, 0, -0.5);

        const mesh = new itowns.THREE.Mesh(geo, material);;
        mesh.scale.set(1, 1, 1);
        mesh.lookAt(0, 0, 0);
        mesh.updateMatrixWorld();
        mesh.CSVIndex = i;
        mesh.visible = false;
        group.add(mesh);
      }

      // csvの1行目から、カラム名のindexをkeyIndex[カラム名]に登録する
      const keyList = config.column;
      let keyIndex = {};
      let csvKeys = parsed.data[0];
      for (let key of keyList) {
        keyIndex[key] = null;
        for (let i =0; i < csvKeys.length; i++){
          if(key === csvKeys[i]){
            keyIndex[key] = i;
            break;
          }
        }
      }

      return Promise.resolve({
        bargraphKeyIndex : keyIndex,
        csv: parsed,
        meshGroup: group
      });
    }
  });

  return bargraphSource;
}

function CreateBargraphLayer(itownsView, config) {
  class BarGraphLayer extends itowns.GeometryLayer {
    constructor(itownsView, config) {
      const group = new itowns.THREE.Group();
      const bargraphSource = createCSVBargraphSource(itownsView, config);

      super(config.id, group, {
        source: bargraphSource
      });

      this.group = group;
      this.source = bargraphSource;
      this.itownsView = itownsView;
      this.BarGraphExtent = new itowns.Extent('EPSG:4326', 0, 0, 0);

      this.updateBarGraph = this.updateBarGraph.bind(this);

      // 動的に立体グラフの高さ、幅、色を変更できるようにプロパティを準備
      this.defineLayerProperty('size', this.size || config.size, this.updateBarGraph);
      this.defineLayerProperty('scale', this.scale || config.scale, this.updateBarGraph);
      this.defineLayerProperty('color', this.color || config.color, this.updateBarGraph);
    }

    update(context, layer, node) { }

    preUpdate(context, changeSources) {
      this.source.loadData(this.BarGraphExtent, this).then((data) => {
        if (!data) {
          console.error("Not found bargraph datasource");
        }
        if (!this.group.getObjectById(data.meshGroup.id)) {
          this.group.add(data.meshGroup);
          // wireframeやopacityの変更に対応するにはこれが必要
          for (let i = 0; i < data.meshGroup.children.length; ++i) {
            data.meshGroup.children[i].layer = this;
          }
        }
      });
      this.itownsView.notifyChange();
    }

    convert() { }

    updateBarGraph() {
      this.source.loadData(this.BarGraphExtent, this).then((data) => {
        const csvData = data.csv.data;
        let keyIndex = JSON.parse(JSON.stringify(data.bargraphKeyIndex));
        // 全メッシュにposition/scale/colorを設定して更新
        for (let i = 0; i < data.meshGroup.children.length; ++i) {
          const mesh = data.meshGroup.children[i];
          let isValidData = true;

          let lnglat = {
            "lng": Number(csvData[i][keyIndex.lng]),
            "lat": Number(csvData[i][keyIndex.lat]),
          };
          if (isNaN(lnglat.lng)) {
            lnglat.lng = 0;
            isValidData = false;
          }
          if (isNaN(lnglat.lat)) {
            lnglat.lat = 0;
            isValidData = false;
          }
          // 緯度経度からmeshのpositionを割り出す
          const coord = new itowns.Coordinates('EPSG:4326', lnglat.lng, lnglat.lat, 0);

          // meshの高さを設定
          let bargraphValue= Number(csvData[i][keyIndex.val]) * 100 * this.scale;
          if (isNaN(bargraphValue)) {
            bargraphValue = 0;
          }
          // meshの色を設定
          mesh.material.color.setHex(this.color);

          // meshのさいずを設定
          mesh.scale.set(this.size * 10, this.size * 10, bargraphValue);

          mesh.position.copy(coord.as(this.itownsView.referenceCrs))
          if (!this.itownsView.isPlanarView) {
            const zeroCoord = new itowns.Coordinates('EPSG:4978', 0, 0, 0);
            const zeroVector = zeroCoord.as(this.itownsView.referenceCrs);
            mesh.lookAt(new itowns.THREE.Vector3(zeroVector.x, zeroVector.y, zeroVector.z));
          }
          mesh.visible = isValidData;
          mesh.updateMatrixWorld();
        }
      });
      // 再描画のために変更を通知する
      this.itownsView.notifyChange();
    }
  }
  return new BarGraphLayer(itownsView, config);
}
