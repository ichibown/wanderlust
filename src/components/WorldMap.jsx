import { useContext, useEffect, useState } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import { createGeoJsonFromPolylineData } from '../utils/geojson';
import { HomeDataContext } from '../App';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYm93biIsImEiOiJja2gwNWIwZ2QwNHN4MndtdXl3emp0dWFqIn0.4RGtPo5zLG44diQLF_FpnQ';
const MAPBOX_STYLE = 'mapbox://styles/bown/clmq6a7q804sk01phh67e8szi';

const lineStyle = {
  id: 'routes',
  type: 'line',
  source: 'routes',
  paint: {
    "line-color": "#24c789",
    "line-opacity": [
      "match",
      [
        "get",
        "congestion"
      ],
      [
        "heavy",
        "severe"
      ],
      0.5,
      1
    ],
    "line-width": [
      "interpolate",
      [
        "linear"
      ],
      [
        "zoom"
      ],
      0,
      3,
      22,
      1
    ]
  }
}

export default function WorldMap() {
  const homeDataContext = useContext(HomeDataContext);
  const [hasAnim, setHasAnim] = useState(true);
  const [geoJson, setGeoJson] = useState({});
  const [viewState, setViewState] = useState({
    latitude: 39.9163447,
    longitude: 116.3945797,
    zoom: 10.5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasAnim) {
        return;
      }
      setViewState(prevState => {
        const newLongitude = prevState.longitude + 1 / Math.pow(2, prevState.zoom);
        const longitude = newLongitude > 180 ? newLongitude - 360 : newLongitude;
        return {
          ...prevState,
          longitude
        };
      });
    }, 30);
    return () => clearInterval(interval);
  }, [hasAnim]);
  const polylines = homeDataContext.homeData && homeDataContext.homeData.polylines;
  useEffect(() => {
    if (!polylines) {
      return;
    }
    createGeoJsonFromPolylineData(polylines).then(geoJson => {
      setGeoJson(geoJson);
    });
  }, [polylines]);
  return <Map
    {...viewState}
    style={{ width: '100vw', height: '100vh' }}
    mapboxAccessToken={MAPBOX_TOKEN}
    onMove={evt => setViewState(evt.viewState)}
    onClick={() => setHasAnim(!hasAnim)}
    mapStyle={MAPBOX_STYLE}>
    <Source id="route-data" type="geojson" data={geoJson}>
      <Layer {...lineStyle} />
    </Source>
  </Map>;
}
