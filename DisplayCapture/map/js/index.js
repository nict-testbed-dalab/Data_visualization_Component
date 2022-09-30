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
    zoom: 14 
  });

  //console.log(wgapp.map.getCenter());
});
