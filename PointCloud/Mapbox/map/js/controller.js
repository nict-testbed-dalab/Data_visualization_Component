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
  let ct = new Date(Math.floor(pDate.currentTime / 3600000) * 3600000);
  var formatDate = String(ct.getFullYear()).padStart(4, '0') + String(ct.getMonth() + 1).padStart(2, '0') + String(ct.getDate()).padStart(2, '0');
  var formatTime = String(ct.getHours()).padStart(2, '0') + String(ct.getMinutes()).padStart(2, '0');
  console.log("updateDate " + formatDate + " " + formatTime);
  updateBargraph(formatDate + formatTime);
}

