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
    center: [139.7665, 35.6812], 
    zoom: 14,
    pitch: 60,
  });

  wgapp.map.on('load', () => {
    addPlaneGroupLayer(wgapp.map, './data_plane/sample.geojson', "value", "plain_group");
    addRelativePositionPointLayer(wgapp.map, './data/sample.geojson', "plain_group", "point_cloud");
  });

});

function updateLayers(pDate) {
  let ct = new Date(Math.floor(pDate.currentTime / 3600000) * 3600000);
  var formatDate = String(ct.getFullYear()).padStart(4, '0') + String(ct.getMonth() + 1).padStart(2, '0') + String(ct.getDate()).padStart(2, '0');
  var formatTime = String(ct.getHours()).padStart(2, '0') + String(ct.getMinutes()).padStart(2, '0');
  console.log("updateDate " + formatDate + " " + formatTime);
  addRelativePositionPointLayer(wgapp.map, './data/' + formatDate + formatTime + '.geojson', "plain_group", "point_cloud");
  updateRelativePositionPointLayer(wgapp.map, './data/' + formatDate + formatTime + '.geojson', "plain_group", "point_cloud");
}
