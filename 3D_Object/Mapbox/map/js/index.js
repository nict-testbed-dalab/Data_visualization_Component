let wgapp = {};

wgapp.val = 1;

$(function() {

  mapboxgl.accessToken = "pk.eyJ1IjoibXVyYW5hZ2EiLCJhIjoiY2wxMjU4ZjBnMDAwejNibXhrMmp6b3NweCJ9.o4JF8rJyfGYrodp6TaQROA";
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

  wgapp.mvobject = {};
  wgapp.mvobject.layerId = "mvobject_layer";
  wgapp.mvobject.sourceId = "mvobject_source";
  wgapp.mvobject.currentData = "./data/sample.geojson";
  wgapp.mvobject.objectSize = 150;
  wgapp.mvobject.colorIndex = 0;
  wgapp.mvobject.timestep = 3600000;

  wgapp.map.on('load', function() {
    addObjectController();
    addMovingObjectLayer(wgapp.map, wgapp.mvobject.currentData, wgapp.mvobject.layerId, wgapp.mvobject.sourceId, "red", wgapp.mvobject.objectSize)
  });
});

const colorList = ["red", "yellow", "green", "cyan", "blue", "magenta"];

function updateLayers(pDate) {
   let ct = new Date(Math.floor(pDate.currentTime / wgapp.mvobject.timestep) * wgapp.mvobject.timestep);
   var formatDate = String(ct.getFullYear()).padStart(4, '0') + String(ct.getMonth() + 1).padStart(2, '0') + String(ct.getDate()).padStart(2, '0');
   var formatTime = String(ct.getHours()).padStart(2, '0') + String(ct.getMinutes()).padStart(2, '0');
   console.log("updateDate " + formatDate + " " + formatTime);
   wgapp.mvobject.currentData = "./data/" + formatDate + formatTime + ".geojson";
   updateMovingObjectLayer(wgapp.map, wgapp.mvobject.currentData, wgapp.mvobject.layerId, wgapp.mvobject.sourceId, colorList[wgapp.mvobject.colorIndex], wgapp.mvobject.objectSize);
}

function addObjectController(){
  $('#map').append('<div id="mvobject_controller"></div>');

  $('#mvobject_controller').append('<div id="size"></div>');
  $('#size').append('<div id="label">size</div>');
  $('#size').append('<div id="plus">＋</div>');
  $('#size').append('<div id="minus">－</div>');
  $('#size > #plus').on('click', function () {
    wgapp.mvobject.objectSize += 10;
    updateMovingObjectLayer(wgapp.map, wgapp.mvobject.currentData, wgapp.mvobject.layerId, wgapp.mvobject.sourceId, colorList[wgapp.mvobject.colorIndex], wgapp.mvobject.objectSize);
  });
  $('#size > #minus').on('click', function () {
    wgapp.mvobject.objectSize = Math.max(50, wgapp.mvobject.objectSize - 10);
    updateMovingObjectLayer(wgapp.map, wgapp.mvobject.currentData, wgapp.mvobject.layerId, wgapp.mvobject.sourceId, colorList[wgapp.mvobject.colorIndex], wgapp.mvobject.objectSize);
  });

  $('#mvobject_controller').append('<div id="color"></div>');
  $('#color').append('<div id="label">color</div>');
  $('#color').append('<div id="plus">＋</div>');
  $('#color').append('<div id="minus">－</div>');
  $('#color > #plus').on('click', function () {
    wgapp.mvobject.colorIndex = (wgapp.mvobject.colorIndex + 1) % 6;
    updateMovingObjectLayer(wgapp.map, wgapp.mvobject.currentData, wgapp.mvobject.layerId, wgapp.mvobject.sourceId, colorList[wgapp.mvobject.colorIndex], wgapp.mvobject.objectSize);
  });
  $('#color > #minus').on('click', function () {
    wgapp.mvobject.colorIndex = (wgapp.mvobject.colorIndex + 5) % 6;
    updateMovingObjectLayer(wgapp.map, wgapp.mvobject.currentData, wgapp.mvobject.layerId, wgapp.mvobject.sourceId, colorList[wgapp.mvobject.colorIndex], wgapp.mvobject.objectSize);
  });
}

