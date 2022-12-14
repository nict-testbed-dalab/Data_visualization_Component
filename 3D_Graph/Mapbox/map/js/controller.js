function isReady(){
  if(!wgapp.map || wgapp.map == undefined) {
    return false;
  } else {
    return true;
  }
}

function getMap(){
  return wgapp.map;
}

function setPosition(pPosition){
  //console.log(pPosition);
  if(!wgapp.map || wgapp.map == undefined) {
    return;
  }
  wgapp.map.setCenter([pPosition.center.lng, pPosition.center.lat]);
  wgapp.map.setZoom(pPosition.zoom);
  wgapp.map.setPitch(pPosition.pitch);
  wgapp.map.setBearing(pPosition.direction);
}

function updateDate(pDate){
  updateLayers(pDate);
}

