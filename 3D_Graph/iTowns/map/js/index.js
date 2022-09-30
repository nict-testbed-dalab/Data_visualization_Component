// # Simple Globe viewer + a vector tile layer

// Define initial camera position

var wgapp = {};
wgapp.center = {};
wgapp.center.lat = 35.68129033294029;
wgapp.center.lng = 139.7605207;

wgapp.bargraph = {};
wgapp.bargraph.layerId = "bargraph_layer";
wgapp.bargraph.currentData = "./data/test.csv";
wgapp.bargraph.csvColumnList = ["name", "lng", "lat", "val"];
wgapp.bargraph.radiusSize = 20;
wgapp.bargraph.elevationScale = 0.2;
wgapp.bargraph.colorIndex = 4;
wgapp.bargraph.timestep = 3600000;

var placement = {
  coord: new itowns.Coordinates('EPSG:4326', 139.7605207, 35.68129033294029),
  range: 22000,
}
var promises = [];

// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
var viewerDiv = document.getElementById('viewerDiv');

// Instanciate iTowns GlobeView*
var view = new itowns.GlobeView(viewerDiv, placement);

// define pole texture
view.tileLayer.noTextureColor = new itowns.THREE.Color(0x95c1e1);

view.getLayerById('atmosphere').visible = false;
view.getLayerById('atmosphere').fog.enable = false;

setupLoadingScreen(viewerDiv, view);

const tmsSource1 = new itowns.TMSSource({
    format: 'image/png',
    crs: "EPSG:3857",
    url: 'https://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png',
    attribution: {
    name: 'std',
  }
});

const colorLayer1 = new itowns.ColorLayer('地図', {
    source: tmsSource1,
});

view.addLayer(colorLayer1);

// Define a VectorTilesSource to load Vector Tiles data from the geoportail
var mvtSource = new itowns.VectorTilesSource({
  style: 'https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json',
  filter: (layer) => !layer['source-layer'].includes('oro_') && !layer['source-layer'].includes('parcellaire'),
});

const colorList = ["0xff0000", "0xffff00", "0x00ff00", "0x00ffff", "0x0000ff", "0xff00ff"];
var config = {
  "id": wgapp.bargraph.layerId,
  "url": wgapp.bargraph.currentData,
  "column": wgapp.bargraph.csvColumnList,
  "size": wgapp.bargraph.radiusSize,
  "scale": wgapp.bargraph.elevationScale,
  "color": colorList[wgapp.bargraph.colorIndex],
  "opacity": 1.0
};

var bargraphLayer = CreateBargraphLayer(view, config);

itowns.View.prototype.addLayer.call(view, bargraphLayer);

bargraphLayer.whenReady.then(() => {
  bargraphLayer.updateBarGraph();
});

addBargraphController();

function updateBargraphLayer(currentTime){
  wgapp.bargraph.currentData = "./data/" + currentTime + ".csv"

  let bargraphLayerConfig = {
    "id": wgapp.bargraph.layerId,
    "url": wgapp.bargraph.currentData,
    "column": wgapp.bargraph.csvColumnList,
    "size": wgapp.bargraph.radiusSize,
    "scale": wgapp.bargraph.elevationScale,
    "color": colorList[wgapp.bargraph.colorIndex],
    "opacity": 1.0
  };

  view.removeLayer(wgapp.bargraph.layerId);

  bargraphLayer = CreateBargraphLayer(view, bargraphLayerConfig);
  view.addLayer(bargraphLayer);

  bargraphLayer.whenReady.then(() => {
    bargraphLayer.updateBarGraph();
  });
}

function addBargraphController(){
  $('#viewerDiv > div').append('<div id="bargraph_controller"></div>');

  $('#bargraph_controller').append('<div id="radius"></div>');
  $('#radius').append('<div id="label">radius</div>');
  $('#radius').append('<div id="plus">＋</div>');
  $('#radius').append('<div id="minus">－</div>');
  $('#radius > #plus').on('click', function () {
    wgapp.bargraph.radiusSize += 5;
    bargraphLayer.size = wgapp.bargraph.radiusSize;
    bargraphLayer.updateBarGraph();
  });
  $('#radius > #minus').on('click', function () {
    wgapp.bargraph.radiusSize = Math.max(5, wgapp.bargraph.radiusSize - 5);
    bargraphLayer.size = wgapp.bargraph.radiusSize;
    bargraphLayer.updateBarGraph();
  });

  $('#bargraph_controller').append('<div id="elevation"></div>');
  $('#elevation').append('<div id="label">elevation</div>');
  $('#elevation').append('<div id="plus">＋</div>');
  $('#elevation').append('<div id="minus">－</div>');
  $('#elevation > #plus').on('click', function () {
    wgapp.bargraph.elevationScale += 0.05;
    bargraphLayer.scale = wgapp.bargraph.elevationScale;
    bargraphLayer.updateBarGraph();
  });
  $('#elevation > #minus').on('click', function () {
    wgapp.bargraph.elevationScale = Math.max(0.05, wgapp.bargraph.elevationScale - 0.05);
    bargraphLayer.scale = wgapp.bargraph.elevationScale;
    bargraphLayer.updateBarGraph();
  });

  $('#bargraph_controller').append('<div id="color"></div>');
  $('#color').append('<div id="label">color</div>');
  $('#color').append('<div id="plus">＋</div>');
  $('#color').append('<div id="minus">－</div>');
  $('#color > #plus').on('click', function () {
    wgapp.bargraph.colorIndex = (wgapp.bargraph.colorIndex + 1) % 6;
    bargraphLayer.color = colorList[wgapp.bargraph.colorIndex];
    bargraphLayer.updateBarGraph();
  });
  $('#color > #minus').on('click', function () {
    wgapp.bargraph.colorIndex = (wgapp.bargraph.colorIndex + 5) % 6;
    bargraphLayer.color = colorList[wgapp.bargraph.colorIndex];
    bargraphLayer.updateBarGraph();
  });
}

