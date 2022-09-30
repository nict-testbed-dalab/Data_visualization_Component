// # Simple Globe viewer + a vector tile layer

// Define initial camera position

var wgapp = {};
wgapp.center = {};
wgapp.center.lat = 35.68129033294029;
wgapp.center.lng = 139.7605207;

wgapp.pointCloud = {};
wgapp.pointCloud.layerId = "pointCloud_layer";
wgapp.pointCloud.currentData = "./data/test.csv";
wgapp.pointCloud.csvColumnList = [ "lng", "lat", "val"];
wgapp.pointCloud.objectSize = 20;
wgapp.pointCloud.elevationScale = 0.2;
wgapp.pointCloud.colorIndex = 4;
wgapp.pointCloud.timestep = 3600000;

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
  "id": wgapp.pointCloud.layerId,
  "url": wgapp.pointCloud.currentData,
  "column": wgapp.pointCloud.csvColumnList,
  "size": wgapp.pointCloud.objectSize,
  "scale": wgapp.pointCloud.elevationScale,
  "color": colorList[wgapp.pointCloud.colorIndex],
  "opacity": 1.0
};

var pointCloudLayer = CreatePointCloudLayer(view, config);

itowns.View.prototype.addLayer.call(view, pointCloudLayer);

pointCloudLayer.whenReady.then(() => {
  pointCloudLayer.updatePointCloud();
});

function updatePointCloudLayer(currentTime){
  wgapp.pointCloud.currentData = "./data/" + currentTime + ".csv"

  let pointCloudLayerConfig = {
    "id": wgapp.pointCloud.layerId,
    "url": wgapp.pointCloud.currentData,
    "column": wgapp.pointCloud.csvColumnList,
    "size": wgapp.pointCloud.objectSize,
    "scale": wgapp.pointCloud.elevationScale,
    "color": colorList[wgapp.pointCloud.colorIndex],
    "opacity": 1.0
  };

  view.removeLayer(wgapp.pointCloud.layerId);

  pointCloudLayer = CreatePointCloudLayer(view, pointCloudLayerConfig);
  view.addLayer(pointCloudLayer);

  pointCloudLayer.whenReady.then(() => {
    pointCloudLayer.updatePointCloud();
  });
}

