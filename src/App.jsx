import * as React from 'react';
import Map, { Marker } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYm93biIsImEiOiJja2gwNWIwZ2QwNHN4MndtdXl3emp0dWFqIn0.4RGtPo5zLG44diQLF_FpnQ';
const MAPBOX_STYLE = 'mapbox://styles/bown/clmq6a7q804sk01phh67e8szi';

function App() {
  return (
    <Map
      initialViewState={{
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={MAPBOX_STYLE}
      mapboxAccessToken={MAPBOX_TOKEN}>
      <Marker longitude={-122.4} latitude={37.8} color="red" />
    </Map>
  );
}

export default App
