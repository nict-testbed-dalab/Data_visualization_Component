let wgapp = {};

wgapp.val = 1;

wgapp.layerId = 'plane_group'

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
    addPlaneGroupLayer(wgapp.map, wgapp.layerId, './data/sample.json');
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
    getFillColor: d => convertColor(d.value),
    getLineColor: [255, 0, 0],
    opacity: 0.5,
  });

  return layer;
}

function updatePlaneGroupLayer(formatDt){
  const layerId = wgapp.layerId;
  if (wgapp.map.getLayer(layerId)) {
    wgapp.map.removeLayer(layerId);
  }
  addPlaneGroupLayer(wgapp.map, layerId, './data/' + formatDt + '.json');
}

function convertColor(val){
  let r = (parseInt(Math.min(val, 16 * 16* 16 - 1) / (16 * 16))) * 16;
  let g = (parseInt(val / 16) % 16) * 16;
  let b = (val % 16) * 16;
  return [r, g, b];
}
