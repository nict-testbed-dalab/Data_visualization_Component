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
  wgapp.bargraph.radiusSize = 3;
  wgapp.bargraph.elevationScale = 50;
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
        'fill-extrusion-opacity': 0.6
      }
    });

    addBargraphController();
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });

});

function addBargraphController(){
  $('#map').append('<div id="bargraph_controller"></div>');

  $('#bargraph_controller').append('<div id="radius"></div>');
  $('#radius').append('<div id="label">radius</div>');
  $('#radius').append('<div id="plus">＋</div>');
  $('#radius').append('<div id="minus">－</div>');
  $('#radius > #plus').on('click', function () {
    wgapp.bargraph.radiusSize += 2;
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });
  $('#radius > #minus').on('click', function () {
    wgapp.bargraph.radiusSize = Math.max(3, wgapp.bargraph.radiusSize - 2);
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });

  $('#bargraph_controller').append('<div id="elevation"></div>');
  $('#elevation').append('<div id="label">elevation</div>');
  $('#elevation').append('<div id="plus">＋</div>');
  $('#elevation').append('<div id="minus">－</div>');
  $('#elevation > #plus').on('click', function () {
    wgapp.bargraph.elevationScale += 5;
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });
  $('#elevation > #minus').on('click', function () {
    wgapp.bargraph.elevationScale = Math.max(5, wgapp.bargraph.elevationScale - 5);
    updateBargraphSource(wgapp.bargraph.currentData, wgapp.bargraph.sourceId, wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });

  const colorList = ["red", "yellow", "green", "cyan", "blue", "pink"];
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

function updateBargraphSource(filename, layerId, radiusSize, elevationScale){
  d3.csv(filename).then(function(csvdata) {
    let data = {
      "type": "FeatureCollection",
      "features": csvdata.map(function(d) {
        return {
          type: "Feature",
          properties: { name: d.name, value: parseFloat(d.val) },
          geometry: {
            type: "Point",
            coordinates: [parseFloat(d.lng), parseFloat(d.lat)]
          }
        }
      })
    };
    wgapp.map.getSource(layerId).setData(createSourceData(data, radiusSize, elevationScale));
    wgapp.map.setLayoutProperty(wgapp.bargraph.layerId, 'visibility', 'visible');
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
    if (wgapp.map.getLayer(wgapp.bargraph.layerId)) {
      wgapp.map.setLayoutProperty(wgapp.bargraph.layerId, 'visibility', 'none');
    }
  });
}

function createSourceData(geojsonData, radiusSize, elevationScale){
  let data = {
    "type": "FeatureCollection",
    "features": []
  };

  geojsonData.features.forEach(function (object, i) {

    const point = object.geometry.coordinates

    let xy = wgapp.map.project(point);
    let lnglat = wgapp.map.unproject({x: xy.x += radiusSize, y: xy.y});
    lnglat = turf.point([lnglat.lng, lnglat.lat]);

    const radius = turf.distance(point, lnglat, {units: 'meters'});

    object.properties.height = object.properties.value * elevationScale;
    object.properties.base = 0;
    object.properties.index = i;

    const options = {
      steps: 4,
      units: 'meters',
      properties: object.properties
    };

    const feature = turf.circle(point, radius, options);
    feature.id = i;

    data.features.push(feature);
  });

  return data;
}
