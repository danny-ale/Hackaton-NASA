
import React from 'react';
import { MapContainer, TileLayer, Circle, ScaleControl, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

const statusColorMap = {
  dormancy: "#a16207",
  growth: "#84cc16",
  peak_bloom: "#facc15",
  fruiting: "#166534",
  Latencia: "#a16207",
  Crecimiento: "#84cc16",
  "Floración máxima": "#facc15",
  Fructificación: "#166534",
  Dormancy: "#a16207",
  Growth: "#84cc16",
  "Peak bloom": "#facc15",
  Fruiting: "#166534",
};

const AgroMap = ({ geoData, dateIndex, maxSteps }) => {
  const { language } = useLanguage();
  const t = translations[language];
  // Para Point, simplemente usar las coordenadas
  const getFeatureCenter = (geometry) => {
    if (geometry.type === "Point") {
      return [geometry.coordinates[1], geometry.coordinates[0]];
    }
    // Si fuera Polygon, calcular centroide (no usado en agro_data.json actual)
    if (geometry.type === "Polygon") {
      const coords = geometry.coordinates[0];
      let lat = 0, lng = 0, n = coords.length;
      coords.forEach(([lng_, lat_]) => {
        lat += lat_;
        lng += lng_;
      });
      return [lat / n, lng / n];
    }
    return [25.7, -100.3];
  };

  // Calcula el radio del círculo según el valor de NDVI
  const getRadiusByNDVI = (ndvi) => {
    // NDVI suele estar entre 0.3 (bajo) y 0.9 (alto)
    const minNDVI = 0.3;
    const maxNDVI = 0.9;
    const minRadius = 6000; // metros
    const maxRadius = 20000; // metros
    if (typeof ndvi !== 'number') return minRadius;
    // Normaliza ndvi entre 0 y 1
    const norm = Math.max(0, Math.min(1, (ndvi - minNDVI) / (maxNDVI - minNDVI)));
    return minRadius + norm * (maxRadius - minRadius);
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
        const center = getFeatureCenter(feature.geometry);
        const ts = feature.properties.time_series || [];
        if (!ts[dateIndex]) return null;
        const status = ts[dateIndex]?.status;
        const color = statusColorMap[status] || "#52525b";
        const ndvi = ts[dateIndex]?.ndvi_value;
        const radius = getRadiusByNDVI(ndvi);
        return (
          <Circle
            key={idx}
            center={center}
            radius={radius}
            pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: 0.7, weight: 0 }}
          >
            <Popup>
              <div>
                <b>{t.municipality}:</b> {feature.properties.municipality_name} <br />
                <b>{t.top_crops}:</b> {feature.properties.top_crops.join(', ')} <br />
                <b>Fecha:</b> {ts[dateIndex]?.date} <br />
                <b>{t.status[ts[dateIndex]?.status] || t.status[ts[dateIndex]?.status] || ts[dateIndex]?.status}:</b> ({ts[dateIndex]?.type})<br />
                <b>{t.ndvi_value}:</b> {ts[dateIndex]?.ndvi_value} <br />
                <b>{t.max_temp_c}:</b> {ts[dateIndex]?.max_temp_c} <br />
                <b>{t.precipitation_mm}:</b> {ts[dateIndex]?.precipitation_mm}
              </div>
            </Popup>
          </Circle>
        );
      })}
      <ScaleControl position="bottomleft" />
    </MapContainer>
  );
};

export default AgroMap;