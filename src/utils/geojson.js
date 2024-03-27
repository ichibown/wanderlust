export function createGeoJsonFromPolylineData(polylineData) {
  return new Promise((resolve, reject) => {
    const features = polylineData.polylines.map((data) => {
      const coordinates = decodePolyline(data.polyline);
      return {
        type: 'Feature',
        properties: {
          platform: data.platform,
          platformId: data.platformId,
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      };
    });
    const geoJson = {
      type: 'FeatureCollection',
      features: features,
    };
    resolve(geoJson);
  });
}

function decodePolyline(encodedPath, precision = 5) {
  const factor = Math.pow(10, precision);
  const len = encodedPath.length;
  const path = new Array(Math.floor(encodedPath.length / 2));
  let index = 0;
  let lat = 0;
  let lng = 0;
  let pointIndex = 0;

  for (; index < len; ++pointIndex) {
    let result = 1;
    let shift = 0;
    let b;
    do {
      b = encodedPath.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1;
    shift = 0;
    do {
      b = encodedPath.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    // GeoJSON coordinates are [longitude, latitude] order.
    path[pointIndex] = [lng / factor, lat / factor];
  }
  path.length = pointIndex;

  return path;
};
