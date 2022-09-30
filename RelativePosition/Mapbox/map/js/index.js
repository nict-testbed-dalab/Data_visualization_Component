let wgapp = {};

wgapp.val = 1;

wgapp.pgLayerId = 'plane_group';
wgapp.ptLayerId = 'point';

$(function() {
  mapboxgl.accessToken = "";
  wgapp.map = new mapboxgl.Map({
    container: 'map', 
    style: {
      "version": 8,
      "sources": {
        "t_pale": {
          "type": "raster",
          "tiles": ["https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"],
          "tileSize": 256
        }
      },
      "layers": [{
        "id": "t_pale",
        "type": "raster",
        "source": "t_pale",
        "minzoom": 0,
        "maxzoom": 18
      }]
    },
    center: [139.7665, 35.6812], 
    zoom: 14,
    pitch: 60,
  });

  wgapp.map.on('load', () => {
    addPlaneGroupLayer(wgapp.map, wgapp.pgLayerId, './data/sample.json');
  });

});

function addPlaneGroupLayer(map, layerId, filename){
  d3.json(filename).then(function(data) {
    planeGroupLayer = createPlaneGroupLayer(layerId, data);
    map.addLayer(planeGroupLayer);
  }).catch(function(error){
    console.log(error);
  });
}

function createPlaneGroupLayer(layerId, planeData){
  const layer = new deck.MapboxLayer({
    id: layerId,
    type: deck.PolygonLayer,
    data: planeData,
    getPolygon: d => d.contour,
    getElevation: d => 0,
    getFillColor: d => [64, 255, 64],
    getLineColor: [255, 0, 0],
    opacity: 0.3,
  });

  return layer;
}

function addPointLayer(map, pointlayerId, filename){
  d3.csv(filename).then(function(data) {
    pointLayer = createPointLayer(pointlayerId, data);
    map.addLayer(pointLayer);
  }).catch(function(error){
    console.log(error);
  });
}


function createPointLayer(layerId, pointData, planeData){
  const layer = new deck.MapboxLayer({
    id: layerId,
    type: deck.PointCloudLayer,
    data: pointData,
    getPosition: d => [Number(d.lng), Number(d.lat), Number(d.val)],
    getColor: d => convertColor([Number(d.lng), Number(d.lat)], planeData),
    sizeUnits: 'meters',
    pointSize: 30,
    opacity: 1
  });

  console.log("createPointLayer", layer);
  return layer;
}

function updateLayers(formatDt){
  updatePlaneGroupLayer(formatDt);
  updatePointLayer(formatDt);
  checkPointLayer(wgapp.map, wgapp.ptLayerId, wgapp.pgLayerId); 
}

function updatePlaneGroupLayer(formatDt){
  let pglayer = wgapp.map.getLayer(wgapp.pgLayerId);
  let filename = './data/' + formatDt + '.json';

  if (pglayer) {
    d3.json(filename).then(function(data) {
      pglayer.implementation.setProps({data:data});
      wgapp.map.setLayoutProperty(wgapp.pgLayerId, 'visibility', 'visible');
    }).catch(function(error){
      //wgapp.map.removeLayer(wgapp.ptLayerId);
      wgapp.map.setLayoutProperty(wgapp.pgLayerId, 'visibility', 'none');
      console.log(error);
    });
  } else {
    addPlaneGroupLayer(wgapp.map, wgapp.pgLayerId, filename);
  }
}

function updatePointLayer(formatDt){
  let ptlayer = wgapp.map.getLayer(wgapp.ptLayerId);
  let filename = './data2/' + formatDt + '.csv';

  if (ptlayer) {
    d3.csv(filename).then(function(data) {
      ptlayer.implementation.setProps({data:data});
      wgapp.map.setLayoutProperty(wgapp.ptLayerId, 'visibility', 'visible');
    }).catch(function(error){
      //wgapp.map.removeLayer(wgapp.ptLayerId);
      wgapp.map.setLayoutProperty(wgapp.ptLayerId, 'visibility', 'none');
      console.log(error);
    });
  } else {
    addPointLayer(wgapp.map, wgapp.ptLayerId, filename);
  }
}

function checkPointLayer(map, pointLayerId, planeGroupLayerId){
  let count = 0;
  const interval = setInterval(() => {
    let ptlayer = map.getLayer(pointLayerId);
    let pglayer = map.getLayer(planeGroupLayerId);
    if(ptlayer != undefined && pglayer != undefined && count < 3){
      let planeData = pglayer.implementation.props.data;
      ptlayer.implementation.setProps({getColor: d => convertColor([Number(d.lng), Number(d.lat)], planeData)});
      clearInterval(interval);
    } else if (count >= 3){
      clearInterval(interval);
    }
    count++;
  }, 1000);
}

function convertColor(pointData, planeDataArray){
  let defaultColor = [0, 0, 255];
  let insideColor = [255, 0, 0];

  if(!planeDataArray){
    return defaultColor;
  }

  var pt = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": pointData
    }
  };

  for(let planeData of planeDataArray){
    var poly = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [planeData.contour]
      }
    };
    if(turf.inside(pt, poly)){
      return insideColor;
    }
  }
  return defaultColor;
}
