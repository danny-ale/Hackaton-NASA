import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
    <div>
      <h1>Mapa de Polinización</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <MapContainer center={[25.6866, -100.3161]} zoom={10} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mapData && <GeoJSON data={mapData} style={styleFeature} />}
      </MapContainer>
    </div>
  );
};

export default App;