import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Legend from './Legend';

const MapView = () => {
  const styleFeature = (feature) => {
    switch (feature.properties.estado) {
      case 'Dormancia':
        return { fillColor: 'brown', color: 'white', weight: 1, fillOpacity: 0.7 };
      case 'Inicio de crecimiento vegetativo':
        return { fillColor: 'lightgreen', color: 'white', weight: 1, fillOpacity: 0.7 };
      case 'Ventana óptima de polinización':
        return { fillColor: 'gold', color: 'white', weight: 1, fillOpacity: 0.7 };
      case 'Crecimiento de fruto':
        return { fillColor: 'darkgreen', color: 'white', weight: 1, fillOpacity: 0.7 };
      case 'Pico de floración':
        return { fillColor: 'yellow', color: 'white', weight: 1, fillOpacity: 0.7 };
      default:
        return { fillColor: 'gray', color: 'white', weight: 1, fillOpacity: 0.7 };
    }
  };

  return (
    <div className="flex flex-col">
      <MapContainer center={[25.6866, -100.3161]} zoom={10} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Placeholder for GeoJSON data */}
        <GeoJSON data={{}} style={styleFeature} />
      </MapContainer>
      <Legend />
    </div>
  );
};

export default MapView;