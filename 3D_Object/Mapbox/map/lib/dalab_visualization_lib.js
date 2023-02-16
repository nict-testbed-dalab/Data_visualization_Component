/**/
/**/
/**/
function addBargraphLayer(map, file, dataname, layerId, sourceId, color, radiusSize, elevationScale) {
  map.addSource(sourceId, {
    "type": "geojson",
    "data": {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    'id': layerId,
    'type': 'fill-extrusion',
    'source': sourceId,
    'paint': {
      'fill-extrusion-color': color,
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base'],
      'fill-extrusion-opacity': 0.75
    }
  });

  updateBargraphLayer(map, file, dataname, layerId, sourceId, color, radiusSize, elevationScale);
}

function updateBargraphLayer(map, file, dataname, layerId, sourceId, color, radiusSize, elevationScale) {
  if(file.split('.').pop() == "csv"){
    updateBargraphLayerByCsvFile(map, file, dataname, layerId, sourceId, color, radiusSize, elevationScale);
  } else if(file.split('.').pop() == "geojson") {
    updateBargraphLayerByGeoJsonFile(map, file, dataname, layerId, sourceId, color, radiusSize, elevationScale);
  }
}

function updateBargraphLayerByCsvFile(map, csvfile, column, layerId, sourceId, color, radiusSize, elevationScale){
  d3.csv(csvfile).then(function(csvdata) {
    let data = createSourceByCsvData(csvdata, column, radiusSize, elevationScale);
    map.getSource(sourceId).setData(data);
    map.setLayoutProperty(layerId, 'visibility', 'visible');
    map.setPaintProperty(layerId, 'fill-extrusion-color', color);

  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + csvfile);
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    }
  });
}

function createSourceByCsvData(csvdata, column, radiusSize, elevationScale){
  let data = {
    "type": "FeatureCollection",
    "features": []
  };

  csvdata.map(function(d, i) {
    const properties = {
      index : i,
      height : (parseFloat(d[column]) * elevationScale),
      base : 0
    };
    const options = {
      steps: 4,
      units: 'meters',
      properties: properties
    };
    const feature = turf.circle(turf.point([parseFloat(d.lng), parseFloat(d.lat)]), radiusSize, options);
    data.properties = properties;
    data.features.push(feature);
  });

  return data;
}

function updateBargraphLayerByGeoJsonFile(map, geojsonfile, key, layerId, sourceId, color, radiusSize, elevationScale) {
  d3.json(geojsonfile).then(function(geojsonData) {
    let data = createSourceDataByGeoJsonData(geojsonData, key, radiusSize, elevationScale);
    map.getSource(sourceId).setData(data);
    map.setLayoutProperty(layerId, 'visibility', 'visible');
    map.setPaintProperty(layerId, 'fill-extrusion-color', color);
  }).catch(function(error) {
    console.log(error);
    console.log("error : readGeoJson " + geojsonfile);
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    }
  });
}

function createSourceDataByGeoJsonData(geojsonData, key, radiusSize, elevationScale){
  let data = {
    "type": "FeatureCollection",
    "features": []
  };

  geojsonData.features.forEach(function (object, i) {
    object.properties.height = object.properties[key] * elevationScale;
    object.properties.base = 0;
    object.properties.index = i;

    const point = object.geometry.coordinates
    const options = {
      steps: 4,
      units: 'meters',
      properties: object.properties
    };
    const feature = turf.circle(point, radiusSize, options);

    data.features.push(feature);
  });
  return data;
}


/**/
/**/
/**/
function addMovingObjectLayer(map, file, layerId, sourceId, colorName, sizeName, heightName, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale) {
  map.addSource(sourceId, {
    "type": "geojson",
    "data": {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    'id': layerId,
    'type': 'fill-extrusion',
    'source': sourceId,
    'paint': {
      'fill-extrusion-color': ['get', 'color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base'],
      'fill-extrusion-opacity': 0.85
    }
  });

  updateMovingObjectLayer(map, file, layerId, sourceId, colorName, sizeName, heightName, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale);
}

function updateMovingObjectLayer(map, file, layerId, sourceId, colorName, sizeName, heightName, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale) {
  if(file.split('.').pop() == "csv"){
    updateMovingObjectLayerByCsvFile(map, file, layerId, sourceId, colorName, sizeName, heightName, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale);
  } else if(file.split('.').pop() == "geojson") {
    updateMovingObjectLayerByGeoJsonFile(map, file, layerId, sourceId, colorName, sizeName, heightName, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale);
  }
}

function updateMovingObjectLayerByCsvFile(map, csvfile, layerId, sourceId, colorColumn, sizeColumn, heightColumn, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale){
  d3.csv(csvfile).then(function(csvdata) {
    let data = createMovingObjectSourceByCsvData(csvdata, colorColumn, sizeColumn, heightColumn, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale);
    map.getSource(sourceId).setData(data);
    map.setLayoutProperty(layerId, 'visibility', 'visible');
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + csvfile);
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    }
  });
}

function createMovingObjectSourceByCsvData(csvdata, colorColumn, sizeColumn, heightColumn, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale){
  let data = {
    "type": "FeatureCollection",
    "features": []
  };

  csvdata.map(function(d, i) {
    let size = parseFloat(d[sizeColumn]) * sizeScale + sizeBase;

    const objProperties = {
      index : i,
      height : sizeBase / 2,
      color : getColorCode(d[colorColumn], colorMin, colorMax),
      base : 0,
      opacity : 0.9
    };
    let objFeature = createMovingObjectPolygon(parseFloat(d.lng), parseFloat(d.lat), size, parseFloat(d.direction), objProperties);
    data.features.push(objFeature);

    const barProperties = {
      index : i,
      height : (parseFloat(d[heightColumn]) * barScale),
      color : barColor,
      base : sizeBase / 2,
      opacity : 0.7
    };
    const options = {
      steps: 4,
      units: 'meters',
      properties: barProperties
    };
    let barFeature = turf.circle(turf.point([parseFloat(d.lng), parseFloat(d.lat)]), sizeBase / 4, options);
    data.features.push(barFeature);

  });

  return data;
}

function updateMovingObjectLayerByGeoJsonFile(map, geojsonfile, layerId, sourceId, colorKey, sizeKey, heightKey, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale) {
  d3.json(geojsonfile).then(function(geojsonData) {
    let data = createMovingObjectSourceDataByGeoJsonData(geojsonData, colorKey, sizeKey, heightKey, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale);
    map.getSource(sourceId).setData(data);
    map.setLayoutProperty(layerId, 'visibility', 'visible');
  }).catch(function(error) {
    console.log(error);
    console.log("error : readGeoJson " + geojsonfile);
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    }
  });
}

function createMovingObjectSourceDataByGeoJsonData(geojsonData, colorKey, sizeKey, heightKey, colorMin, colorMax, sizeBase, sizeScale, barColor, barScale){
  let data = {
    "type": "FeatureCollection",
    "features": []
  };

  geojsonData.features.forEach(function (object, i) {

    let size = parseFloat(object.properties[sizeKey]) * sizeScale + sizeBase;

    const objProperties = {
      index : i,
      height : sizeBase / 2,
      color : getColorCode(object.properties[colorKey], colorMin, colorMax),
      base : 0,
      opacity : 0.9
    };
    let objFeature = createMovingObjectPolygon(object.geometry.coordinates[0], object.geometry.coordinates[1], size, object.properties.direction, objProperties);
    data.features.push(objFeature);

    const barProperties = {
      index : i,
      height : (parseFloat(object.properties[heightKey]) * barScale),
      color : barColor,
      base : sizeBase / 2,
      opacity : 0.7
    };
    const options = {
      steps: 4,
      units: 'meters',
      properties: barProperties
    };
    let barFeature = turf.circle(object.geometry.coordinates, sizeBase / 4, options);
    data.features.push(barFeature);
  });

  return data;
}

function createMovingObjectPolygon(centerLng, centerLat, size, direction, properties) {
  const point = turf.point([centerLng, centerLat]);
  let options = {
    units: 'meters',
  };

  let f = turf.destination(point, size,     0, options);
  let lb = turf.destination(point, size, -160, options);
  let rb = turf.destination(point, size,  160, options);

  feature = turf.polygon([[
    [f.geometry.coordinates[0], f.geometry.coordinates[1]],
    [lb.geometry.coordinates[0], lb.geometry.coordinates[1]],
    [rb.geometry.coordinates[0], rb.geometry.coordinates[1]],
    [f.geometry.coordinates[0], f.geometry.coordinates[1]]
  ]], properties);

  feature = turf.transformRotate(feature, direction, {pivot: point});

  return feature;
}

/**/
/**/
/**/
function addPlaneGroupLayer(map, filename, dataname, layerId){
  d3.json(filename).then(function(data) {
    planeGroupLayer = createPlaneGroupLayer(data.features, dataname, layerId);
    map.addLayer(planeGroupLayer);
  }).catch(function(error){
    console.log(error);
    console.log("error : readGeoJSON " + filename);
  });
}

function createPlaneGroupLayer(planeData, key, layerId){
  const layer = new deck.MapboxLayer({
    id: layerId,
    type: deck.PolygonLayer,
    data: planeData,
    getPolygon: d => d.geometry.coordinates,
    getElevation: d => 0,
    getFillColor: d => convertColor(d.properties[key]),
    getLineColor: [255, 0, 0],
    opacity: 0.5,
  });

  return layer;
}

function updatePlaneGroupLayer(map, filename, dataname, layerId){
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  addPlaneGroupLayer(map, filename, dataname, layerId);
}

/**/
/**/
/**/
function addPointCloudLayer(map, filename, dataname, layerId){
  if(filename.split('.').pop() == "csv"){
    addPointCloudLayerByCSV(map, filename, dataname, layerId);
  } else if(filename.split('.').pop() == "geojson") {
    addPointCloudLayerByGeoJson(map, filename, dataname, layerId);
  }
}

function updatePointCloudLayer(map, filename, dataname, layerId){
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  addPointCloudLayer(map, filename, dataname, layerId);
}

function addPointCloudLayerByGeoJson(map, filename, key, layerId){
  d3.json(filename).then(function(data) {
    pointCloudLayer = createPointCloudLayerByGeoJson(data.features, key, layerId);
    map.addLayer(pointCloudLayer);
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
  });
}

function createPointCloudLayerByGeoJson(pointData, key, layerId){
  const { MapboxLayer, PointCloudLayer } = deck;

  return new MapboxLayer({
    id: layerId,
    type: PointCloudLayer,
    data: pointData,
    getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1], 100],
    getColor: d => convertColor(d.properties[key]),
    sizeUnits: 'meters',
    pointSize: 30,
    opacity: 1
  });
}

function addPointCloudLayerByCSV(map, filename, column, layerId){
  d3.csv(filename).then(function(data) {
    pointCloudLayer = createPointCloudLayerByCSV(data, column, layerId);
    map.addLayer(pointCloudLayer);
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
  });
}

function createPointCloudLayerByCSV(pointData, column, layerId){
  const { MapboxLayer, PointCloudLayer } = deck;

  return new MapboxLayer({
    id: layerId,
    type: PointCloudLayer,
    data: pointData,
    getPosition: d => [Number(d.lng), Number(d.lat), 100],
    getColor: d => convertColor(d[column]),
    sizeUnits: 'meters',
    pointSize: 20,
    opacity: 1
  });
}

/**/
/**/
/**/

function addRelativePositionPointLayer(map, filename, planeLayerId, layerId){
  if(filename.split('.').pop() == "csv"){
    addRelativePositionPointLayerByCSV(map, filename, planeLayerId, layerId);
  } else if(filename.split('.').pop() == "geojson") {
    addRelativePositionPointLayerByGeoJson(map, filename, planeLayerId, layerId);
  }
}

function updateRelativePositionPointLayer(map, filename, planeLayerId, layerId){
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  addRelativePositionPointLayer(map, filename, planeLayerId, layerId);
}

function addRelativePositionPointLayerByGeoJson(map, filename, planeLayerId, layerId){
  d3.json(filename).then(function(data) {
    let planeData = map.getLayer(planeLayerId).implementation.props.data;
    pointCloudLayer = createRelativePositionPointLayerByGeoJson(data.features, planeData, layerId);
    map.addLayer(pointCloudLayer);
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
  });
}

function createRelativePositionPointLayerByGeoJson(pointData, planeData, layerId){
  const { MapboxLayer, PointCloudLayer } = deck;

  return new MapboxLayer({
    id: layerId,
    type: PointCloudLayer,
    data: pointData,
    getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1], 100],
    getColor: d => convertPointColorInPlane(d.geometry.coordinates, planeData),
    sizeUnits: 'meters',
    pointSize: 20,
    opacity: 1
  });
}

function addRelativePositionPointLayerByCSV(map, filename, planeLayerId, layerId){
  d3.csv(filename).then(function(data) {
    let planeData = map.getLayer(planeLayerId).implementation.props.data;
    pointCloudLayer = createRelativePositionPointLayerByCSV(data, planeData, layerId);
    map.addLayer(pointCloudLayer);
  }).catch(function(error){
    console.log(error);
    console.log("error : readCsv " + filename);
  });
}

function createRelativePositionPointLayerByCSV(pointData, planeData, layerId){
  const { MapboxLayer, PointCloudLayer } = deck;

  return new MapboxLayer({
    id: layerId,
    type: PointCloudLayer,
    data: pointData,
    getPosition: d => [Number(d.lng), Number(d.lat), 100],
    getColor: d => convertPointColorInPlane(d.geometry.coordinates, planeData),
    sizeUnits: 'meters',
    pointSize: 30,
    opacity: 1
  });
}

function convertPointColorInPlane(pointData, planeDataArray){
  let defaultColor = [0, 0, 255];
  let insideColor = [255, 0, 0];

  if(!planeDataArray){
    return defaultColor;
  }

  var pt = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": pointData
    }
  };

  for(let planeData of planeDataArray){
    var poly = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": planeData.geometry.coordinates
      }
    };
    if(turf.inside(pt, poly)){
      return insideColor;
    }
  }
  return defaultColor;
}



function getColorCode(val, min, max){
  var rgb = convertColor(val, min, max);
  return "#" + rgb.map(c => ("0" + c.toString(16)).slice(-2)).join("");

}

function convertColor(val, min, max){
  //var max = 100;
  //var min = 0;
  var dif = max - min;
  if(                           val >  max             ) return [                            255,                                0,                               0];
  if(val <= max              && val >= min + 0.75 * dif) return [                            255, parseInt(255 * (100 - val) / 25),                               0];
  if(val <= min + 0.75 * dif && val >= min + 0.5  * dif) return [parseInt(255 * (val - 50) / 25),                              255,                               0];
  if(val <= min + 0.5  * dif && val >= min + 0.25 * dif) return [                              0,                              255, parseInt(255 * (50 - val) / 25)];
  if(val <= min + 0.25 * dif && val >= min             ) return [                              0,         parseInt(255 * val / 25),                             255];
  if(val <  min                                        ) return [                              0,                                0,                             255];
}

