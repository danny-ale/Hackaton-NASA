import React from 'react';
import { MapContainer, TileLayer, GeoJSON, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const statusColorMap = {
  "dormancy": "#a16207",
  "growth": "#84cc16",
  "peak_bloom": "#facc15",
  "fruiting": "#166534",
};

const AgroMap = ({ geoData, dateIndex, onDateChange }) => {
  const styleFeature = (feature) => {
    if (!feature.properties || !feature.properties.time_series || !feature.properties.time_series[dateIndex]) {
      return {
        fillColor: "#52525b",
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

    const status = feature.properties.time_series[dateIndex]?.status;
    const color = statusColorMap[status] || "#52525b";

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  return (
    <MapContainer 
      center={[25.7, -100.3]} 
      zoom={7} 
      minZoom={7} 
      maxZoom={20} 
      maxBounds={[[24.5, -101.5], [26.5, -99.0]]} 
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <GeoJSON 
        key={dateIndex} 
        data={geoData} 
        style={styleFeature} 
        onEachFeature={(feature, layer) => {
          if (!feature.properties || !feature.properties.time_series || !feature.properties.time_series[dateIndex]) {
            return;
          }
          const { municipality_name, time_series } = feature.properties;
          const currentStatus = time_series[dateIndex];

          layer.bindPopup(`
            <b>Municipio:</b> ${municipality_name} <br/>
            <b>Fecha:</b> ${currentStatus.date} <br/>
            <b>Estado:</b> ${currentStatus.status} (${currentStatus.type})
          `);
        }} 
      />
      <ScaleControl position="bottomleft" />
    </MapContainer>
  );
};

export default AgroMap;