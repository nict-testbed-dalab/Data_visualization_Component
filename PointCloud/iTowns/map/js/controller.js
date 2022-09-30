function isReady(){
  if(!viewerDiv || viewerDiv == undefined) {
    return false;
  } else {
    return true;
  }
}

function getPosition(){
  var p = itowns.CameraUtils.getTransformCameraLookingAtTarget(view, view.camera.camera3D);
  console.log(p);
  var objResult = {center:{lat:0, lng:0}};

  if (p) {

    objResult.center.lat = p.coord.y;
    objResult.center.lng = p.coord.x;

    objResult.north      = wgapp.north;
    objResult.east       = wgapp.east;
    objResult.south      = wgapp.south;
    objResult.west       = wgapp.west;

    objResult.zoom       = wgapp.zoom;
    objResult.direction  = p.heading;
    objResult.pitch      = Math.min(90 - p.tilt, 60);

    console.log(objResult);
    return objResult;
  } else {
    return null;
  }

}

function setPosition(pPosition){
  console.log(pPosition);
  wgapp = JSON.parse(JSON.stringify(pPosition));

  var positionOnGlobe = new itowns.Coordinates('EPSG:4326', pPosition.center.lng, pPosition.center.lat);

  //カメラ位置・角度設定
  var options = {
    coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
    //tilt: pPosition.pitch, //地球表面とカメラのなす角 デフォルトは垂直で90
    tilt: 90 - pPosition.pitch, //地球表面とカメラのなす角 デフォルトは垂直で90
    heading: pPosition.direction, //回転
    range: 2000.0, //カメラと地球の距離
    time: 0, //アニメーションの長さ（ミリ秒）
    stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
  };

  itowns.CameraUtils.transformCameraToLookAtTarget(view, view.camera.camera3D, options);//すぐ移動
}


function updateDate(pDate){
  let ct = new Date(Math.floor(pDate.currentTime / wgapp.pointCloud.timestep) * wgapp.pointCloud.timestep);
  var formatDate = String(ct.getFullYear()).padStart(4, '0') + String(ct.getMonth() + 1).padStart(2, '0') + String(ct.getDate()).padStart(2, '0');
  var formatTime = String(ct.getHours()).padStart(2, '0') + String(ct.getMinutes()).padStart(2, '0');

  updatePointCloudLayer(formatDate + formatTime);

}
