

/**
 * 360度画像保存ライブラリ
 *
 * @class CreateSphereMapView
 */
class CreateSphereMap {
  /**
   * Creates an instance of CreateSphereMapView.
   * @param {*} view メインビュー
   * @param {*} initBackGroundLayersFunc サブビューの初期化時に呼び出される関数。引数としてサブビューのviewが渡される。
指定した場合、指定したGUIToolがviewに反映される。
   * @param {*} [GUITools=null] 指定した場合、指定したGUIToolがviewに反映される。
   * @memberof CreateSphereMapView
   */
  constructor(view, initBackGroundLayersFunc, GUITools = null) {
    //domの作成
    this.createDom();

    //itownsのviewerの初期化
    let initSize = 512

    this.GUITools = GUITools;

    this.view = view;

    //キューブマップのスクショを撮る用のviewの初期化
    this.initBackGroundViewer(this.view, initBackGroundLayersFunc);
    this.initView(this.backGroundView, this.view.camera.camera3D.near, view.camera.camera3D.far, initSize, initSize);

    //キューブマップ作製用の変数
    this.CUBE_MAP_IMAGE_TYPE = [
      "RIGHT",
      "LEFT",
      "TOP",
      "DOWN",
      "FRONT",
      "BACK"
    ]
    this.animationCount = 0;

    this.timeout = 2;

    //スフィアマップレンダラの初期化
    this.initSphereMapRenderer();
  }

  //private
  /**
   * HTMLの作成
   * @memberof CreateSphereMap
   */
  createDom() {
    // エンコーダを読み込む
    let body = document.body;
    let jpegEncoderBasic = document.createElement("script");
    jpegEncoderBasic.type = "text/javascript";
    jpegEncoderBasic.src = "./js/projectNict/jpeg_encoder_basic.js";
    body.appendChild(jpegEncoderBasic);

    // サブビュー表示用のDOM
    let createSphereMapDom = document.createElement("div");
    createSphereMapDom.id = "createSphereMapDom";
    {
      let createSphereMapDom_backGroundViewerDiv = document.createElement("div");
      createSphereMapDom_backGroundViewerDiv.id = "createSphereMapDom_backGroundViewerDiv";
      {

      }
      createSphereMapDom.appendChild(createSphereMapDom_backGroundViewerDiv);

      //画像レンダリング用のdom
      let createSphereMapDom_sphereMapViewer = document.createElement("div");
      createSphereMapDom_sphereMapViewer.id = "createSphereMapDom_sphereMapViewer";
      {

      }
      createSphereMapDom.appendChild(createSphereMapDom_sphereMapViewer)

      //出来た画像保存用のdom
      // 前後左右上下を作成する
      let createSphereMapDom_mapImages = document.createElement("div");
      createSphereMapDom_mapImages.id = "createSphereMapDom_mapImages";
      {
        let createSphereMapDom_RIGHT = document.createElement("a");
        createSphereMapDom_RIGHT.id = "createSphereMapDom_RIGHT";
        createSphereMapDom_RIGHT.classList.add("cubeMapImages", "button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_RIGHT)

        let createSphereMapDom_LEFT = document.createElement("a");
        createSphereMapDom_LEFT.id = "createSphereMapDom_LEFT";
        createSphereMapDom_LEFT.classList.add("cubeMapImages", "button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_LEFT)

        let createSphereMapDom_TOP = document.createElement("a");
        createSphereMapDom_TOP.id = "createSphereMapDom_TOP";
        createSphereMapDom_TOP.classList.add("cubeMapImages", "button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_TOP)

        let createSphereMapDom_DOWN = document.createElement("a");
        createSphereMapDom_DOWN.id = "createSphereMapDom_DOWN";
        createSphereMapDom_DOWN.classList.add("cubeMapImages", "button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_DOWN)

        let createSphereMapDom_FRONT = document.createElement("a");
        createSphereMapDom_FRONT.id = "createSphereMapDom_FRONT";
        createSphereMapDom_FRONT.classList.add("cubeMapImages", "button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_FRONT)

        let createSphereMapDom_BACK = document.createElement("a");
        createSphereMapDom_BACK.id = "createSphereMapDom_BACK";
        createSphereMapDom_BACK.classList.add("cubeMapImages", "button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_BACK)

        let createSphereMapDom_SPHEREMAP = document.createElement("a");
        createSphereMapDom_SPHEREMAP.id = "createSphereMapDom_SPHEREMAP";
        createSphereMapDom_SPHEREMAP.classList.add("button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_SPHEREMAP)

        let createSphereMapDom_SPHEREMAP_WITHMETA = document.createElement("a");
        createSphereMapDom_SPHEREMAP_WITHMETA.id = "createSphereMapDom_SPHEREMAP_WITHMETA";
        createSphereMapDom_SPHEREMAP_WITHMETA.classList.add("button")
        {

        }
        createSphereMapDom_mapImages.appendChild(createSphereMapDom_SPHEREMAP_WITHMETA)
      }
      createSphereMapDom.appendChild(createSphereMapDom_mapImages);
    }
    body.appendChild(createSphereMapDom);
  }

  /**
   * 初期化処理
   *
   * @param {*} view スフィアマップ
   * @param {*} near 近接点
   * @param {*} far 遠点
   * @param {*} height 画面サイズ
   * @param {number} [width=0] 画面サイズ
   * @memberof CreateSphereMap
   */
  initView(view, near, far, height, width = 0) {
    //スフィアマップの設定
    if (view.controls) {
      view.controls.enabled = false;
    }
    view.camera.camera3D.fov = 90;
    view.camera.camera3D.near = near;
    view.camera.camera3D.far = far;
    view.camera.camera3D.aspect = 1;
    view.camera.camera3D.height = height;
    view.camera.camera3D.width = width;
    view.camera.height = height;
    view.camera.width = width;
    view.mainLoop.gfxEngine.renderer.setSize(width, height);
    view.mainLoop.gfxEngine.renderer.setPixelRatio(1);

    if (view.controls) {
      view.controls.enabled = true;
    }

    //サブビューの設定
    let viewerDiv = view.mainLoop.gfxEngine.renderer.domElement
    viewerDiv.height = height;
    viewerDiv.width = height;
    viewerDiv.style.height = height + "px";
    viewerDiv.style.width = height + "px";

    viewerDiv.style.position = "absolute";
    viewerDiv.style.left = "calc(50% - 256px)";
    viewerDiv.style.top = "calc(50% - 256px)";
    view.camera.camera3D.updateProjectionMatrix();
    if (view.controls) {
      view.controls.enabled = true;
    }
    view.notifyChange(view.camera);
  }

  /**
   * 裏で描画するviewの更新
   *
   * @param {*} mainView メインビュー
   * @param {*} initBackGroundLayersFunc 初期化完了時に呼ぶ出す処理
   * @memberof CreateSphereMap
   */
  initBackGroundViewer(mainView, initBackGroundLayersFunc) {
    this.backGroundViewerDiv = document.getElementById("createSphereMapDom_backGroundViewerDiv");
    this.backGroundView = new itowns.GlobeView(this.backGroundViewerDiv, placement, {
      noControls: true,
    });
    setupLoadingScreen(this.backGroundViewerDiv, this.backGroundView);

    //mainViewの描画後の同期
    this.updateBackgroundViewer = () => {
      let position = mainView.camera.camera3D.position;
      let normPosition = new itowns.THREE.Vector3(position.x, position.y, position.z);
      normPosition.normalize();

      let camera = this.backGroundView.camera.camera3D;
      camera.position.copy(position);
      camera.up.copy(mainView.camera.camera3D.up);
      camera.lookAt(normPosition);

      this.backGroundView.notifyChange(camera);
    }
    mainView.addFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_RENDER, this.updateBackgroundViewer);

    initBackGroundLayersFunc(this.backGroundView);

    this.syncGUITools(mainView)

    this.backGroundView.notifyChange();
  }

  /**
   * GUIToolをビューに設定する
   *
   * @param {*} mainView メインビュー
   * @memberof CreateSphereMap
   */
  syncGUITools(mainView) {
    let layers = this.backGroundView.getLayers();
    let mainLayers = mainView.getLayers();

    this.backGroundView.addEventListener(itowns.VIEW_EVENTS.LAYER_ADDED, () => {
      layers = this.backGroundView.getLayers();
      mainLayers = mainView.getLayers();

      if (this.GUITools) {
        for (let a in this.GUITools.gui.__folders) {
          if (a === "Color Layers" || a === "Elevation Layers") {
            for (let i in this.GUITools.gui.__folders[a].__folders) {
              for (let j in layers) {
                if (layers[j].id === i) {
                  for (let k in this.GUITools.gui.__folders[a].__folders[i].__controllers) {
                    this.GUITools.gui.__folders[a].__folders[i].__controllers[k].onChange((value) => {
                      layers = this.backGroundView.getLayers();
                      mainLayers = mainView.getLayers();

                      let paramName = this.GUITools.gui.__folders[a].__folders[i].__controllers[k].property;
                      mainLayers[j][paramName] = value;
                      mainView.notifyChange(mainLayers[j]);
                      layers[j][paramName] = value;
                      this.backGroundView.notifyChange(layers[j]);
                    });
                  }
                }
              }
            }
          }
          else if (a === "Debug Tools") {
            console.log("Debug Tools");
          }
          else {
            for (let k in this.GUITools.gui.__folders[a].__controllers) {
              this.GUITools.gui.__folders[a].__controllers[k].onChange((value) => {
                layers = this.backGroundView.getLayers();
                mainLayers = mainView.getLayers();
                let idName = a.substr(6, a.length);

                let paramName = this.GUITools.gui.__folders[a].__controllers[k].property;
                for (let j in mainLayers) {
                  if (mainLayers[j].id === idName) {
                    mainLayers[j][paramName] = value;
                    mainView.notifyChange(mainLayers[a]);
                  }
                }
                for (let j in layers) {
                  if (layers[j].id === idName) {
                    layers[j][paramName] = value;
                    this.backGroundView.notifyChange(layers[a]);
                  }
                }
              });
            }
          }
        }
      }
    })
  }


  /**
   * 360度画像用サブビューの表示/非表示切り替え機能
   * @return {*} 
   * @memberof CreateSphereMap
   */
  toggleShowBackGroundView() {
    // サブビューの透過率を切り替える
    let backGroundViewDiv = document.getElementById("createSphereMapDom_backGroundViewerDiv");
    if (!this.showBackGroundViewFlag) {
      backGroundViewDiv.style.opacity = "1";
      this.showBackGroundViewFlag = true;
      return;
    }
    backGroundViewDiv.style.opacity = "0.00000000001";
    this.showBackGroundViewFlag = false;
  };

  /**
   *360度画像度画像作成機能
   *
   * @param {*} size 解像度
   * @memberof CreateSphereMap
   */
  setDisplaySize(size) {
    // サイズの丸め込みを行う
    console.log("sizeChange")
    if (size > 1024) {
      size = 1024;
    } else if (size < 1) {
      size = 1;
    }

    // 初期化処理を呼び出してビューに反映する
    this.initView(this.backGroundView, 
                  this.backGroundView.camera.camera3D.near, 
                  this.backGroundView.camera.camera3D.far, 
                  size, 
                  size);
  }

  //タイムアウト値設定
  /**
   * 360度画像用サブビュー作成の待ち時間設定機能
   * @param {*} timeout 最大待ち時間
   * @memberof CreateSphereMap
   */
  setTimeOut(timeout) {
    console.log("setTimeOut:" + timeout)
    // タイムアウト時間を更新する
    this.timeout = timeout
  }

  /**
   * 360度画像度画像作成機能
   *
   * @param {*} mainView メインビュー
   * @memberof CreateSphereMap
   */
  downloadSphereMap(mainView) {
    let view = this.backGroundView;
    let upVecX = new itowns.THREE.Vector3(
      1, 0, 0
    );
    let upVecY = new itowns.THREE.Vector3(
      0, 1, 0
    );
    if (mainView.controls) {
      mainView.controls.enabled = false;
      mainView.removeFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_RENDER, this.updateBackgroundViewer);
    }

    let timer;

    // 前後左右上下のビューを作成する
    let firstTimerCallBack = () => {
      if (this.animationCount === 0) {
        console.log("+++++++++++++++++++++++ right");
        //right
        this.rotateAngle(view, upVecX, 180);
        this.rotateAngle(view, upVecY, -180);

        this.animationCount++;
      }
    }
    this.timerCallBack = () => {
      // ビューの作成完了のコールバック処理
      console.log("timerCallBack");
      if (timer !== undefined && timer !== null) {
        console.log("timer:" + timer);
        clearTimeout(timer);
      }
      view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D);
      this.saveImageAsDom(this.CUBE_MAP_IMAGE_TYPE[this.animationCount - 1], view.mainLoop.gfxEngine.renderer);

      if (this.animationCount === 6) {
        // 6画面作成後に実行される
        console.log("cube map complete");
        this.updateBackgroundViewer();

        this.animationCount = 0;
        this.createSphereMap();
        if (mainView.controls) {
          mainView.controls.enabled = true;
          mainView.addFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_RENDER, this.updateBackgroundViewer);
        }
        view.removeFrameRequester(itowns.MAIN_LOOP_EVENTS.UPDATE_END, this.downloadSphereMap_callback);
        return;
      }

      // 表示向き変更イベント登録
      this.createCubeMapRotateEvent(this.animationCount, view);

      // タイムアウト処理追加
      timer = setTimeout(this.timerCallBack, this.timeout * 1000);
      this.animationCount++;
    }

    if (view.mainLoop.scheduler.commandsWaitingExecutionCount() === 0
      && view.mainLoop.renderingState === 0) {
      firstTimerCallBack();
    }
    else {
      timer = setTimeout(firstTimerCallBack, this.timeout * 1000);
    }
    this.downloadSphereMap_callback = () => {
      // スフィアマップダウンロード処理　
      // console.log("updateend-----------------------");
      // console.log("commandsWaitingExecutionCount" + view.mainLoop.scheduler.commandsWaitingExecutionCount());
      // console.log("renderingState:" + view.mainLoop.renderingState);

      if (view.mainLoop.scheduler.commandsWaitingExecutionCount() === 0
        && view.mainLoop.renderingState === 0
      ) {
        console.log("call timerCallBack");
        this.timerCallBack();
      }
    }
    // スフィアマップ更新完了時呼び出しの登録
    view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.UPDATE_END, this.downloadSphereMap_callback);
  }

  /**
   * キューブマップ回転イベント
   * @param {*} animationCount 表示向き変更回数
   * @param {*} view サブビュー
   * @memberof CreateSphereMap
   */
  createCubeMapRotateEvent(animationCount, view) {
    let upVecX = new itowns.THREE.Vector3(
      1, 0, 0
    );
    let upVecY = new itowns.THREE.Vector3(
      0, 1, 0
    );
    // 表示向きごとに設定を変える
    if (animationCount === 0) {
      console.log("+++++++++++++++++++++++ right");
      //right
      this.rotateAngle(view, upVecX, 180);
      this.rotateAngle(view, upVecY, -180);
    }
    else if (animationCount === 1) {
      console.log("+++++++++++++++++++++++ left");
      //left
      this.rotateAngle(view, upVecY, 360);
    }
    else if (this.animationCount === 2) {
      console.log("+++++++++++++++++++++++ top");
      //top
      this.rotateAngle(view, upVecY, -180);
      this.rotateAngle(view, upVecX, 180);
    }
    else if (this.animationCount === 3) {
      console.log("+++++++++++++++++++++++ down");
      //down
      this.rotateAngle(view, upVecX, -360);
    }
    else if (this.animationCount === 4) {
      console.log("+++++++++++++++++++++++ front");
      //front
      this.rotateAngle(view, upVecX, 180);
    }
    else if (this.animationCount === 5) {
      console.log("+++++++++++++++++++++++ back");
      //back
      this.rotateAngle(view, upVecY, 360);
    }
  }

  /**
   *DOMに画像を保存
   *
   * @param {*} type
   * @param {*} renderer
   * @memberof CreateSphereMap
   */
  saveImageAsDom(type, renderer) {
    let dom = document.getElementById("createSphereMapDom_" + type);

    dom.href = renderer.domElement.toDataURL("image/png");
  }

  /**
   *DOMに保存された画像をダウンロード
   *
   * @param {*} type
   * @param {*} fName
   * @memberof CreateSphereMap
   */
  createScreenShot(type, fName) {
    let dom = document.getElementById("createSphereMapDom_" + type);
    dom.download = fName;
    dom.click();
  }

  /**
   *アングルを上ベクトルを軸にして回転する
   *
   * @param {*} view
   * @param {*} upVec
   * @param {*} angle
   * @memberof CreateSphereMap
   */
  rotateAngle(view, upVec, angle) {
    let radian = angle * Math.PI / 360;
    let q = new itowns.THREE.Quaternion();
    //回転軸と角度からクォータニオンを計算
    q.setFromAxisAngle(upVec, radian);

    view.camera.camera3D.quaternion.multiply(q);
    view.camera.camera3D.updateProjectionMatrix();
    view.notifyChange(view.camera.camera3D);
  }

  /**
   *スフィアマップを作成し、ダウンロードする
   *
   * @memberof CreateSphereMap
   */
  createSphereMap() {
    this.initSphereMapRenderer();
    this.convertCubeMapToSphereMap();
  };

  //SM=SphereMap
  /**
   * スフィアマップパラメータ所為化処理
   *
   * @memberof CreateSphereMap
   */
  initSphereMapRenderer() {
    this.SM_width = 1;
    this.SM_height = 1;

    this.SM_renderer = new itowns.THREE.WebGLRenderer();
    //スクリーンサイズのセット
    let sphereMapWidth = this.backGroundView.camera.width * 4;
    let sphereMapHeight = sphereMapWidth / 2;
    this.SM_renderer.setSize(sphereMapWidth, sphereMapHeight);
    console.log("sphereMapWidth:" + sphereMapWidth + " sphereMapHeight:" + sphereMapHeight)
    
    // 背景色の設定
    this.SM_renderer.setClearColor(0xffffff, 1); // ←追加

    let rendererDom = document.getElementById("createSphereMapDom_sphereMapViewer");
    if (rendererDom.children.length > 0) {
      rendererDom.textContent = null;
    }
    rendererDom.appendChild(this.SM_renderer.domElement);


    let vertexShader = `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;
void main()  {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

    let fragmentShader = `
precision mediump float;
uniform samplerCube map;
varying vec2 vUv;
#define M_PI 3.1415926535897932384626433832795
void main()  {
	vec2 uv = vec2(vUv.x+0.25, vUv.y);
	float longitude = uv.x * 2. * M_PI - M_PI + M_PI / 2.;
	float latitude = uv.y * M_PI;
	vec3 dir = vec3(
		- sin( longitude ) * sin( latitude ),
		cos( latitude ),
		- cos( longitude ) * sin( latitude )
	);
	normalize( dir );
	gl_FragColor = textureCube( map, dir );
}
`;
    this.SM_material = new itowns.THREE.RawShaderMaterial({
      uniforms: {
        map: { type: 't', value: null }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: itowns.THREE.DoubleSide,
      transparent: true
    });
    this.SM_scene = new itowns.THREE.Scene();
    this.SM_quad = new itowns.THREE.Mesh(
      new itowns.THREE.PlaneBufferGeometry(1, 1),
      this.SM_material
    );
    this.SM_scene.add(this.SM_quad);

    this.SM_camera = new itowns.THREE.OrthographicCamera(1 / - 2, 1 / 2, 1 / 2, 1 / - 2, -10000, 10000);

    this.SM_canvas = document.createElement('canvas');

    this.setSMSize(sphereMapWidth, sphereMapHeight);
  };

  /**
   *パノラマ画像の大きさを設定
   *
   * @param {*} width
   * @param {*} height
   * @memberof CreateSphereMap
   */
  setSMSize(width, height) {

    this.SM_width = width;
    this.SM_height = height;

    this.SM_quad.scale.set(this.SM_width, this.SM_height, 1);

    this.SM_camera.left = this.SM_width / - 2;
    this.SM_camera.right = this.SM_width / 2;
    this.SM_camera.top = this.SM_height / 2;
    this.SM_camera.bottom = this.SM_height / - 2;

    this.SM_camera.updateProjectionMatrix();

    this.SM_output = new itowns.THREE.WebGLRenderTarget(this.SM_width, this.SM_height, {
      minFilter: itowns.THREE.LinearFilter,
      magFilter: itowns.THREE.LinearFilter,
      wrapS: itowns.THREE.ClampToEdgeWrapping,
      wrapT: itowns.THREE.ClampToEdgeWrapping,
      format: itowns.THREE.RGBAFormat,
      type: itowns.THREE.UnsignedByteType
    });

    this.SM_canvas.width = this.SM_width;
    this.SM_canvas.height = this.SM_height;
  }

  /**
   *スフィアマップをキューブマップに変換
   *
   * @memberof CreateSphereMap
   */
  convertCubeMapToSphereMap() {
    this.SM_renderer.getContext().getExtension('EXT_shader_texture_lod');
    let cubeLoader = new itowns.THREE.CubeTextureLoader();
    let imgPaths = [];
    for (let i = 0; i < 6; i++) {
      let cubeMapDom = document.getElementById("createSphereMapDom_" + this.CUBE_MAP_IMAGE_TYPE[i]);
      imgPaths[i] = cubeMapDom.href;
    }
    let cubeMap = cubeLoader.load(imgPaths, (loadedCubeMap) => {
      console.log("cubeMapLoaded")
      loadedCubeMap.generateMipmaps = true;
      loadedCubeMap.needsUpdate = true;
      this.SM_material.uniforms.map.value = loadedCubeMap

      this.SM_renderer.render(this.SM_scene, this.SM_camera);
      this.SM_renderer.render(this.SM_scene, this.SM_camera, this.SM_output, true);
      this.saveImageAsDom("SPHEREMAP", this.SM_renderer);

      let pixels = new Uint8Array(4 * this.SM_width * this.SM_height);
      this.SM_renderer.readRenderTargetPixels(this.SM_output, 0, 0, this.SM_width, this.SM_height, pixels);

      let imageData = new ImageData(new Uint8ClampedArray(pixels), this.SM_width, this.SM_height);
      // jpeg作成
      let jpegEnc = new JPEGEncoder();
      let jpegURI = jpegEnc.encode({
        width: this.SM_width,
        height: this.SM_height,
        data: imageData.data,
        xmp: this.createXMP(this.SM_width, this.SM_height)
      }, 70);

      let dom = document.getElementById("createSphereMapDom_SPHEREMAP_WITHMETA");
      dom.href = jpegURI;
      dom.download = "sphereMapWithMeta.jpg"
      dom.click();
    });
  };

  //メタ情報を付加
  /**
   *メタ情報を付加
   * @param {*} w
   * @param {*} h
   * @param {number} [heading=0]
   * @param {number} [pitch=0]
   * @param {number} [roll=0]
   * @return {*} 
   * @memberof CreateSphereMap
   */
  createXMP(w, h, heading = 0, pitch = 0, roll = 0) {
    return '<?xpacket begin="ï»¿" id="W5M0MpCehiHzreSzNTczkc9d"?>' +
      '<x:xmpmeta xmlns:x="adobe:ns:meta/" xmptk="Sphere Blur">' +
      '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
      '<rdf:Description rdf:about="" xmlns:GPano="http://ns.google.com/photos/1.0/panorama/">' +
      '<GPano:ProjectionType>equirectangular</GPano:ProjectionType>' +
      '<GPano:UsePanoramaViewer>True</GPano:UsePanoramaViewer>' +
      '<GPano:CroppedAreaImageWidthPixels>' + w + '</GPano:CroppedAreaImageWidthPixels>' +
      '<GPano:CroppedAreaImageHeightPixels>' + h + '</GPano:CroppedAreaImageHeightPixels>' +
      '<GPano:FullPanoWidthPixels>' + w + '</GPano:FullPanoWidthPixels>' +
      '<GPano:FullPanoHeightPixels>' + h + '</GPano:FullPanoHeightPixels>' +
      '<GPano:CroppedAreaLeftPixels>0</GPano:CroppedAreaLeftPixels>' +
      '<GPano:CroppedAreaTopPixels>0</GPano:CroppedAreaTopPixels>' +
      '<GPano:PoseHeadingDegrees>' + heading + '</GPano:PoseHeadingDegrees>' +
      '<GPano:PosePitchDegrees>' + pitch + '</GPano:PosePitchDegrees>' +
      '<GPano:PoseRollDegrees>' + roll + '</GPano:PoseRollDegrees>' +
      '</rdf:Description>' +
      '</rdf:RDF>' +
      '</x:xmpmeta>' +
      '<?xpacket end="r"?>';
  }
}
