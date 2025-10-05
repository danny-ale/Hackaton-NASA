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
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex-1 flex items-center justify-center h-64">
        <p>Mapa Interactivo</p>
      </div>
      <div className="mt-4 flex justify-around bg-gray-800 p-2 rounded">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-brown-500 mr-2"></div>
          <span>Dormancia</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-300 mr-2"></div>
          <span>Inicio de crecimiento</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span>Ventana óptima</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-700 mr-2"></div>
          <span>Crecimiento de fruto</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-pink-500 mr-2"></div>
          <span>Pico de floración 🌸</span>
        </div>
      </div>
      <footer className="mt-4 text-gray-400 text-sm text-center">
        Datos de NASA | Desarrollado en Hackathon 2024
      </footer>
    </div>
  );
};

export default MapView;