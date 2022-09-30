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
    center: [139.7665, 35.6812], 
    zoom: 14,
    pitch: 60,
  });

  wgapp.map.on('load', () => {
    addPointCloudLayer(wgapp.map, 'point_cloud', './data/sample.csv');
  });

});

function addPointCloudLayer(map, layerId, filename){
  d3.csv(filename).then(function(data) {
    pointCloudLayer = createPointCloudLayer(layerId, data);
    map.addLayer(pointCloudLayer); 
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
  });
}

function createPointCloudLayer(layerId, pointData){
  const { MapboxLayer, PointCloudLayer } = deck;

  return new MapboxLayer({
    id: layerId,
    type: PointCloudLayer,
    data: pointData,
    getPosition: d => [Number(d.lng), Number(d.lat), Number(d.val)],
    getColor: d => [255, 0, 0],
    sizeUnits: 'meters',
    pointSize: 10,
    opacity: 1
  });
}

function updateBargraph(formatDt){
  console.log("updateBargraph " + formatDt);

  const layerId = 'point_cloud';
  if (wgapp.map.getLayer(layerId)) {
    wgapp.map.removeLayer(layerId);
  }
  addPointCloudLayer(wgapp.map, layerId, './data/' + formatDt + '.csv');
}
