// # Simple Globe viewer + a vector tile layer

// Define initial camera position

var wgapp = {};
wgapp.center = {};
wgapp.center.lat = 35.68129033294029;
wgapp.center.lng = 139.76652062736588;

wgapp.north      = 0;
wgapp.east       = 0;
wgapp.south      = 0;
wgapp.west       = 0;

wgapp.zoom       = 0;
wgapp.direction  = 0;
wgapp.pitch      = 13;

wgapp.layerId = 'plane_group';

var placement = {
  coord: new itowns.Coordinates('EPSG:4326', 139.76652062736588, 35.68129033294029),
  range: 12000,
}
var promises = [];

// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
var viewerDiv = document.getElementById('viewerDiv');

// Instanciate iTowns GlobeView*
wgapp.view = new itowns.GlobeView(viewerDiv, placement);

// define pole texture
wgapp.view.tileLayer.noTextureColor = new itowns.THREE.Color(0x95c1e1);

wgapp.view.getLayerById('atmosphere').visible = false;
wgapp.view.getLayerById('atmosphere').fog.enable = false;

setupLoadingScreen(viewerDiv, wgapp.view);

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

wgapp.view.addLayer(colorLayer1);

function createPlaneGroupLayer(layerId, filename){
  const sourceFromFormat = new itowns.FileSource({
    url: filename,
    crs: 'EPSG:4326',
    format: 'application/json',
  });

  let layer = new itowns.ColorLayer(layerId, {
    source: sourceFromFormat,
  });

  return layer;
}

wgapp.view.addLayer(createPlaneGroupLayer(wgapp.layerId, './data/sample.json'));

function updateLayer(currentTime){
  if(wgapp.view.getLayerById(wgapp.layerId)){
    wgapp.view.removeLayer(wgapp.layerId);
  }
  layer = createPlaneGroupLayer(wgapp.layerId, "./data/" + currentTime + ".json");
  wgapp.view.addLayer(layer);
}

