// # Simple Globe viewer + a vector tile layer

// Define initial camera position

var wgapp = {};
wgapp.center = {};
wgapp.center.lat = 35.68129033294029;
wgapp.center.lng = 139.7605207;

wgapp.three_object = {};
wgapp.three_object.layerId = "3dObject_layer";
wgapp.three_object.currentData = "./data/test.csv";
wgapp.three_object.csvColumnList = ["name", "lng", "lat", "angle"];
wgapp.three_object.objectSize = 20;
wgapp.three_object.elevationScale = 0.2;
wgapp.three_object.colorIndex = 4;
wgapp.three_object.timestep = 3600000;

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
  "id": wgapp.three_object.layerId,
  "url": wgapp.three_object.currentData,
  "column": wgapp.three_object.csvColumnList,
  "size": wgapp.three_object.objectSize,
  "scale": wgapp.three_object.elevationScale,
  "color": colorList[wgapp.three_object.colorIndex],
  "opacity": 1.0
};

var threeObjectLayer = Create3dObjectLayer(view, config);

itowns.View.prototype.addLayer.call(view, threeObjectLayer);

threeObjectLayer.whenReady.then(() => {
  threeObjectLayer.update3dObject();
});

add3dObjectController();

function updatethreeObjectLayer(currentTime){
  wgapp.three_object.currentData = "./data/" + currentTime + ".csv"

  let layerConfig = {
    "id": wgapp.three_object.layerId,
    "url": wgapp.three_object.currentData,
    "column": wgapp.three_object.csvColumnList,
    "size": wgapp.three_object.objectSize,
    "scale": wgapp.three_object.elevationScale,
    "color": colorList[wgapp.three_object.colorIndex],
    "opacity": 1.0
  };

  view.removeLayer(wgapp.three_object.layerId);

  threeObjectLayer = Create3dObjectLayer(view, layerConfig);
  view.addLayer(threeObjectLayer);

  threeObjectLayer.whenReady.then(() => {
    threeObjectLayer.update3dObject();
  });
}

function add3dObjectController(){
  $('#viewerDiv > div').append('<div id="control_panel"></div>');

  $('#control_panel').append('<div id="size"></div>');
  $('#size').append('<div id="label">size</div>');
  $('#size').append('<div id="plus">＋</div>');
  $('#size').append('<div id="minus">－</div>');
  $('#size > #plus').on('click', function () {
    wgapp.three_object.objectSize += 5;
    threeObjectLayer.size = wgapp.three_object.objectSize;
    threeObjectLayer.update3dObject();
  });
  $('#size > #minus').on('click', function () {
    wgapp.three_object.objectSize = Math.max(20, wgapp.three_object.objectSize - 5);
    threeObjectLayer.size = wgapp.three_object.objectSize;
    threeObjectLayer.update3dObject();
  });

  $('#control_panel').append('<div id="color"></div>');
  $('#color').append('<div id="label">color</div>');
  $('#color').append('<div id="plus">＋</div>');
  $('#color').append('<div id="minus">－</div>');
  $('#color > #plus').on('click', function () {
    wgapp.three_object.colorIndex = (wgapp.three_object.colorIndex + 1) % 6;
    threeObjectLayer.color = colorList[wgapp.three_object.colorIndex];
    threeObjectLayer.update3dObject();
  });
  $('#color > #minus').on('click', function () {
    wgapp.three_object.colorIndex = (wgapp.three_object.colorIndex + 5) % 6;
    threeObjectLayer.color = colorList[wgapp.three_object.colorIndex];
    threeObjectLayer.update3dObject();
  });
}

