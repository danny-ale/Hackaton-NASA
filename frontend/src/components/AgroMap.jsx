import React from 'react';
import { MapContainer, TileLayer, Circle, ScaleControl } from 'react-leaflet';
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

  // Helper para calcular el centroide de un polígono simple
  const getPolygonCenter = (coordinates) => {
    let lat = 0, lng = 0, n = coordinates.length;
    coordinates.forEach(([lng_, lat_]) => {
      lat += lat_;
      lng += lng_;
    });
    return [lat / n, lng / n];
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
      {geoData.features && geoData.features.map((feature, idx) => {
        const coords = feature.geometry.coordinates[0];
        const center = getPolygonCenter(coords);
        const status = feature.properties?.time_series?.[dateIndex]?.status;
        const color = statusColorMap[status] || "#52525b";
        return (
          <Circle
            key={idx}
            center={center}
            radius={10000} // 10km, puedes ajustar el radio
            pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: 0.7, weight: 0 }}
          >
            <>
              <div>
                <b>Municipio:</b> {feature.properties.municipality_name} <br/>
                <b>Fecha:</b> {feature.properties.time_series?.[dateIndex]?.date} <br/>
                <b>Estado:</b> {feature.properties.time_series?.[dateIndex]?.status} ({feature.properties.time_series?.[dateIndex]?.type})
              </div>
            </>
          </Circle>
        );
      })}
      <ScaleControl position="bottomleft" />
    </MapContainer>
  );
};

export default AgroMap;