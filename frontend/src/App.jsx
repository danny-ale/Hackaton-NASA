import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import InfoPanel from './components/InfoPanel';
import MapLegend from './components/MapLegend';
import Logo from './assets/logo.webp';
import AgroMap from './components/AgroMap';
import TimePlayer from './components/TimePlayer';
import testGeoJSON from './data/testGeoJSON.json';

const App = () => {
  const [mapData, setMapData] = useState(testGeoJSON);
  const [dateIndex, setDateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Estado inicial en pausa
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/pollen_data')
  //     .then((response) => response.json())
  //     .then((data) => setMapData(data))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  useEffect(() => {
    if (mapData && mapData.features && mapData.features.length > 0) {
      setIsLoading(false);
    }
  }, [mapData]);

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

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setDateIndex((prevIndex) => {
          const totalSteps = mapData?.features?.[0]?.properties?.time_series?.length || 0;
          if (prevIndex >= totalSteps - 1) {
            return 0; // Reiniciar al primer paso para reproducir en bucle
          }
          return prevIndex + 1;
        });
      }, 1000); // Cambiar cada 1 segundo

      return () => clearInterval(timer);
    }
  }, [isPlaying, mapData]);

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="bg-[#0f111a] text-white min-h-screen p-4">
      <Navbar />
      <FiltersBar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 flex-1">
        <div className="col-span-1">
          <div className="h-96 lg:h-auto">
            <AgroMap geoData={mapData} dateIndex={dateIndex} />
          </div>
          <div className="lg:col-span-2 flex flex-col space-y-4">
            {mapData?.features?.[0]?.properties?.time_series?.length > 0 ? (
              <TimePlayer
                currentStep={dateIndex}
                totalSteps={mapData?.features?.[0]?.properties?.time_series?.length || 0}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onStepChange={setDateIndex}
                onReset={() => setDateIndex(0)}
              />
            ) : (
              <div className="text-red-400 text-center">No hay datos de serie temporal para mostrar el slider.</div>
            )}
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