import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import Legend from './components/Legend';

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
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 flex-1">
        <div className="col-span-1">
          <Filters />
          <div className="h-96 lg:h-auto">
            <MapContainer center={[25.6866, -100.3161]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {mapData && <GeoJSON data={mapData} style={styleFeature} />}
            </MapContainer>
          </div>
        </div>
        <div className="col-span-1">
          <InfoPanel />
          <Legend />
        </div>
      </div>
    </div>
  );
};

export default App;