import * as React from 'react';
import MapGL, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYm93biIsImEiOiJja2gwNWIwZ2QwNHN4MndtdXl3emp0dWFqIn0.4RGtPo5zLG44diQLF_FpnQ';
const MAPBOX_STYLE = 'mapbox://styles/bown/clmq6a7q804sk01phh67e8szi';

export default function WorldMap() {
  const [viewState, setViewState] = React.useState({
    latitude: 39.9163447,
    longitude: 116.3945797,
    zoom: 2.5
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setViewState(prevState => {
        const newLongitude = prevState.longitude + 0.1;
        const longitude = newLongitude > 180 ? newLongitude - 360 : newLongitude;
        return {
          ...prevState,
          longitude
        };
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);
  return <MapGL
    {...viewState}
    style={{ width: '100vw', height: '100vh' }}
    mapboxAccessToken={MAPBOX_TOKEN}
    onMove={evt => setViewState(evt.viewState)}
    mapStyle={MAPBOX_STYLE}
  />;
}
