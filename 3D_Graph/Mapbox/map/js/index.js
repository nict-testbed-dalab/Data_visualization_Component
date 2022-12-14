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
  wgapp.bargraph.currentData = "./data/sample.geojson";
  wgapp.bargraph.radiusSize = 300;
  wgapp.bargraph.elevationScale = 50;
  wgapp.bargraph.colorIndex = 0;
  wgapp.bargraph.timestep = 3600000;

  wgapp.map.on('load', function() {
    addBargraphController();
    addBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, "red", wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });

});

const colorList = ["red", "yellow", "green", "cyan", "blue", "pink"];

function updateLayers(pDate){
  let ct = new Date(Math.floor(pDate.currentTime / wgapp.bargraph.timestep) * wgapp.bargraph.timestep);
  var formatDate = String(ct.getFullYear()).padStart(4, '0') + String(ct.getMonth() + 1).padStart(2, '0') + String(ct.getDate()).padStart(2, '0');
  var formatTime = String(ct.getHours()).padStart(2, '0') + String(ct.getMinutes()).padStart(2, '0');
  console.log("updateDate " + formatDate + " " + formatTime);
  wgapp.bargraph.currentData = "./data/" + formatDate + formatTime + ".geojson";
  updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
}

function addBargraphController(){
  $('#map').append('<div id="bargraph_controller"></div>');

  $('#bargraph_controller').append('<div id="radius"></div>');
  $('#radius').append('<div id="label">radius</div>');
  $('#radius').append('<div id="plus">＋</div>');
  $('#radius').append('<div id="minus">－</div>');
  $('#radius > #plus').on('click', function () {
    wgapp.bargraph.radiusSize += 200;
    updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });
  $('#radius > #minus').on('click', function () {
    wgapp.bargraph.radiusSize = Math.max(100, wgapp.bargraph.radiusSize - 200);
    updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });

  $('#bargraph_controller').append('<div id="elevation"></div>');
  $('#elevation').append('<div id="label">elevation</div>');
  $('#elevation').append('<div id="plus">＋</div>');
  $('#elevation').append('<div id="minus">－</div>');
  $('#elevation > #plus').on('click', function () {
    wgapp.bargraph.elevationScale += 5;
    updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });
  $('#elevation > #minus').on('click', function () {
    wgapp.bargraph.elevationScale = Math.max(5, wgapp.bargraph.elevationScale - 5);
    updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });

  $('#bargraph_controller').append('<div id="color"></div>');
  $('#color').append('<div id="label">color</div>');
  $('#color').append('<div id="plus">＋</div>');
  $('#color').append('<div id="minus">－</div>');
  $('#color > #plus').on('click', function () {
    wgapp.bargraph.colorIndex = (wgapp.bargraph.colorIndex + 1) % 6;
    updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });
  $('#color > #minus').on('click', function () {
    wgapp.bargraph.colorIndex = (wgapp.bargraph.colorIndex + 5) % 6;
    updateBargraphLayer(wgapp.map, wgapp.bargraph.currentData, "value", wgapp.bargraph.layerId, wgapp.bargraph.sourceId, colorList[wgapp.bargraph.colorIndex], wgapp.bargraph.radiusSize, wgapp.bargraph.elevationScale);
  });
}

