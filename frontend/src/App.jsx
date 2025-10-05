import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import InfoPanel from './components/InfoPanel';
import MapLegend from './components/MapLegend';
import Logo from './assets/logo.webp';

const App = () => {
  const [mapData, setMapData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/pollen_data')
      .then((response) => response.json())
      .then((data) => setMapData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const getColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Bajo':
        return 'green';
      case 'Medio':
        return 'yellow';
      case 'Alto':
        return 'orange';
      case 'Muy Alto':
        return 'red';
      default:
        return 'blue';
    }
  };

  const styleFeature = (feature) => {
    return {
      fillColor: getColor(feature.properties.riskLevel),
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    };
  };

  return (
    <div className="bg-[#0f111a] text-white min-h-screen p-4">
      <Navbar />
      <FiltersBar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 flex-1">
        <div className="col-span-1">
          <div className="h-96 lg:h-auto">
            <MapContainer center={[25.6866, -100.3161]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {mapData && <GeoJSON data={mapData} style={styleFeature} />}
            </MapContainer>
          </div>
          <MapLegend />
        </div>
        <div className="col-span-1">
          <InfoPanel />
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-[#1E2024] text-white py-4 text-center mt-8">
        <div className="flex justify-center items-center space-x-8">
          <img src={Logo} alt="Logo" className="h-15" />          
          <a href="/recursos" className="hover:underline">Recursos</a>
          <a href="/politicas" className="hover:underline">Políticas Hackaton</a>
          <a href="/hackaton" className="hover:underline">Hackaton Space Apps Challenge NASA 2025</a>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          <span>Desarrollado en 2025 &copy; Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;