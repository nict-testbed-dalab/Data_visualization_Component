let wgapp = {};

wgapp.val = 1;

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
    center: [139.76652062736588, 35.68129033294029], 
    zoom: 11 
  });

  wgapp.bargraph = {};
  wgapp.bargraph.layerId = "bargraph_layer";
  wgapp.bargraph.sourceId = "bargraph_source";
  wgapp.bargraph.currentData = "./data/test.csv";
  wgapp.bargraph.objectSize = 10;
  wgapp.bargraph.colorIndex = 0;
  wgapp.bargraph.timestep = 3600000;

  wgapp.map.on('load', function() {
    wgapp.map.addSource(wgapp.bargraph.sourceId, {
      "type": "geojson",
      "data": {
        type: 'FeatureCollection',
        features: []
      }
    });

    wgapp.map.addLayer({
      'id': wgapp.bargraph.layerId,
      'type': 'fill-extrusion',
      'source': wgapp.bargraph.sourceId,
      'paint': {
        'fill-extrusion-color': 'red',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base'],
        'fill-extrusion-opacity': 1
      }
    });

    addBargraphController();
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.objectSize);
  });
});

function addBargraphController(){
  $('#map').append('<div id="bargraph_controller"></div>');

  $('#bargraph_controller').append('<div id="size"></div>');
  $('#size').append('<div id="label">size</div>');
  $('#size').append('<div id="plus">＋</div>');
  $('#size').append('<div id="minus">－</div>');
  $('#size > #plus').on('click', function () {
    wgapp.bargraph.objectSize += 2;
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.objectSize);
  });
  $('#size > #minus').on('click', function () {
    wgapp.bargraph.objectSize = Math.max(10, wgapp.bargraph.objectSize - 2);
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.objectSize);
  });

  const colorList = ["red", "yellow", "green", "cyan", "blue", "magenta"];
  $('#bargraph_controller').append('<div id="color"></div>');
  $('#color').append('<div id="label">color</div>');
  $('#color').append('<div id="plus">＋</div>');
  $('#color').append('<div id="minus">－</div>');
  $('#color > #plus').on('click', function () {
    wgapp.bargraph.colorIndex = (wgapp.bargraph.colorIndex + 1) % 6;
    wgapp.map.setPaintProperty(wgapp.bargraph.layerId, 'fill-extrusion-color', colorList[wgapp.bargraph.colorIndex]);
  });
  $('#color > #minus').on('click', function () {
    wgapp.bargraph.colorIndex = (wgapp.bargraph.colorIndex + 5) % 6;
    wgapp.map.setPaintProperty(wgapp.bargraph.layerId, 'fill-extrusion-color', colorList[wgapp.bargraph.colorIndex]);
  });
}

function updateBargraphSource(filename, layerId, size){
  d3.csv(filename).then(function(csvdata) {
    let data = {
      "type": "FeatureCollection",
      "features": csvdata.map(function(d) {
        return {
          type: "Feature",
          properties: { name: d.name, angle: parseFloat(d.angle) },
          geometry: {
            type: "Point",
            coordinates: [parseFloat(d.lng), parseFloat(d.lat)]
          }
        }
      })
    };
    wgapp.map.getSource(layerId).setData(createSourceData(data, size));
    wgapp.map.setLayoutProperty(wgapp.bargraph.layerId, 'visibility', 'visible');
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
    if (wgapp.map.getLayer(wgapp.bargraph.layerId)) {
      wgapp.map.setLayoutProperty(wgapp.bargraph.layerId, 'visibility', 'none');
    }
  });
}

function createSourceData(geojsonData, size){
  let data = {
    "type": "FeatureCollection",
    "features": []
  };

  geojsonData.features.forEach(function (object, i) {

    const point = object.geometry.coordinates;

    object.properties.height = size * 10;
    object.properties.base = 0;
    object.properties.index = i;

    const options = {
      units: 'meters',
      properties: object.properties
    };

    let xy = wgapp.map.project(point);

    const theta = Math.PI / 8;
    let rf = wgapp.map.unproject([xy.x + size * Math.cos((Math.PI / 2) - theta), xy.y + size * Math.sin((Math.PI / 2) - theta)]);
    let lf = wgapp.map.unproject([xy.x + size * Math.cos((Math.PI / 2) + theta), xy.y + size * Math.sin((Math.PI / 2) + theta)]);
    let lb = wgapp.map.unproject([xy.x + size * Math.cos((Math.PI * 3 / 2) - theta), xy.y + size * Math.sin((Math.PI * 3 / 2) - theta)]);
    let rb = wgapp.map.unproject([xy.x + size * Math.cos((Math.PI * 3 / 2) + theta), xy.y + size * Math.sin((Math.PI * 3 / 2) + theta)]);

    let lnglat = wgapp.map.unproject(xy);
    feature = turf.polygon([[
      [rf.lng, rf.lat],
      [lf.lng, lf.lat],
      [lb.lng, lb.lat],
      [rb.lng, rb.lat],
      [rf.lng, rf.lat],
    ]], object.properties);

    feature = turf.transformRotate(feature, object.properties.angle, {pivot: point});

    feature.id = i;

    data.features.push(feature);
  });

  return data;
}

