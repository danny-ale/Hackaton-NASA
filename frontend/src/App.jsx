
import React, { useEffect, useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import InfoPanel from './components/InfoPanel';
import MapLegend from './components/MapLegend';
import Logo from './assets/logo.webp';
import AgroMap from './components/AgroMap';
import TimePlayer from './components/TimePlayer';

import agroData from '../../backend/data/agro_data.json';

const App = () => {
  const [mapData, setMapData] = useState(agroData);
  const [dateIndex, setDateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maxSteps, setMaxSteps] = useState(0);
  // Estado de filtros: uno para el formulario, otro para los aplicados
  const [formFilters, setFormFilters] = useState({
    municipio: '',
    cultivo: '',
    temporada: '',
    actualizacion: '',
  });
  const [filters, setFilters] = useState(formFilters);
  // Estado para el feature filtrado
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { language } = useLanguage();

  // Calcular el máximo número de pasos de la serie temporal entre todos los features
  useEffect(() => {
    if (mapData && mapData.features && mapData.features.length > 0) {
      setIsLoading(false);
      const steps = Math.max(
        ...mapData.features.map(f => f.properties.time_series?.length || 0)
      );
      setMaxSteps(steps);
      // Si el índice actual es mayor al nuevo máximo, reiniciar
      if (dateIndex >= steps) setDateIndex(0);
    }
  }, [mapData]);

  // Actualizar el feature seleccionado cuando cambian los filtros aplicados
  // Función para limpiar nombre de cultivo (sin emoji, minúsculas, sin espacios extras)
  const cleanCrop = str => (str || "").toLowerCase().replace(/[^a-záéíóúñ0-9 ]/gi, '').replace(/\s+/g, ' ').trim();

  // Filtrar la serie temporal según temporada y fecha de actualización
  function filterTimeSeries(feature, filters) {
    if (!feature) return [];
    let series = feature.properties.time_series || [];
    // Filtrar por temporada (año o rango personalizado)
    if (filters.temporada === 'Personalizada' && filters.temporada_desde && filters.temporada_hasta) {
      const desde = parseInt(filters.temporada_desde);
      const hasta = parseInt(filters.temporada_hasta);
      series = series.filter(entry => {
        const year = new Date(entry.date).getFullYear();
        return year >= desde && year <= hasta;
      });
    } else if (filters.temporada) {
      series = series.filter(entry => new Date(entry.date).getFullYear().toString() === filters.temporada);
    }
    // Filtrar por fecha seleccionada (actualización)
    if (filters.fechaSeleccionada) {
      // Si la fecha existe en la serie, mostrar solo esa fecha
      const found = series.find(entry => entry.date === filters.fechaSeleccionada);
      if (found) return [found];
    }
    return series;
  }

  useEffect(() => {
    if (!mapData?.features) return;
    // Buscar por municipio
    let feature = mapData.features.find(f => f.properties.municipality_name === filters.municipio);
    // Si no hay feature para el municipio, usar el primero
    if (!feature) feature = mapData.features[0];
    // Si hay feature y no hay cultivo seleccionado, seleccionar el primero
    if (feature && (!filters.cultivo || !feature.properties.top_crops.includes(filters.cultivo))) {
      if (feature.properties.top_crops && feature.properties.top_crops.length > 0) {
        // Actualizar el filtro de cultivo automáticamente
        setFilters(prev => ({ ...prev, cultivo: feature.properties.top_crops[0] }));
        return; // Esperar a que el filtro se actualice antes de continuar
      }
    }
    // Filtrar la serie temporal según temporada y fecha
    if (feature) {
      const filteredSeries = filterTimeSeries(feature, filters);
      // Crear un nuevo feature con la serie filtrada
      setSelectedFeature({
        ...feature,
        properties: {
          ...feature.properties,
          time_series: filteredSeries
        }
      });
    } else {
      setSelectedFeature(null);
    }
  }, [filters, mapData, setFilters]);

  useEffect(() => {
    if (isPlaying && maxSteps > 0) {
      const timer = setInterval(() => {
        setDateIndex((prevIndex) => {
          if (prevIndex >= maxSteps - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, maxSteps]);

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  // Filtrar features para el mapa según los filtros
  function filterFeaturesForMap(features, filters) {
    return features
      .filter(f => {
        if (filters.municipio && f.properties.municipality_name !== filters.municipio) return false;
        if (filters.cultivo && !f.properties.top_crops?.some(crop => cleanCrop(crop).includes(cleanCrop(filters.cultivo)))) return false;
        return true;
      })
      .map(f => {
        // Filtrar la serie temporal igual que en la gráfica
        const filteredSeries = filterTimeSeries(f, filters);
        return {
          ...f,
          properties: {
            ...f.properties,
            time_series: filteredSeries
          }
        };
      })
      .filter(f => (f.properties.time_series && f.properties.time_series.length > 0));
  }

  // Datos filtrados para el mapa
  const filteredMapData = {
    ...mapData,
    features: filterFeaturesForMap(mapData.features, filters)
  };

  return (
  <div className="bg-[#0f111a] text-white min-h-screen p-3 sm:p-6 md:p-8">
      <Navbar />
      <FiltersBar
        filters={formFilters}
        setFilters={setFormFilters}
        onApply={() => {
          setFilters(formFilters);
          console.log("Filters applied:", formFilters);
        }}
      />
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-10 flex-1">
        {/* Mapa y controles */}
  <div className="col-span-1 flex flex-col gap-4 md:gap-6">
          <div className="h-64 sm:h-96 lg:h-auto w-full mb-2 md:mb-4">
            <AgroMap geoData={filteredMapData} dateIndex={dateIndex} maxSteps={maxSteps} />
          </div>
          <div className="flex flex-col space-y-3 md:space-y-4 w-full">
            {maxSteps > 0 ? (
              <TimePlayer
                currentStep={dateIndex}
                totalSteps={maxSteps}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onStepChange={setDateIndex}
                onReset={() => setDateIndex(0)}
              />
            ) : (
              <div className="text-red-400 text-center text-xs sm:text-base">No hay datos de serie temporal para mostrar el slider.</div>
            )}
          </div>
          <MapLegend />
        </div>
        {/* InfoPanel */}
  <div className="col-span-1 mt-4 md:mt-6 lg:mt-0">
          {selectedFeature && (() => {
            const crop = filters.cultivo;
            const hasCrop = selectedFeature?.properties?.top_crops?.some(c => cleanCrop(c).includes(cleanCrop(crop)));
            const peakDate = selectedFeature?.properties?.predicted_peak_date;
            let pollStart = null, pollEnd = null;
            if (peakDate) {
              const peak = new Date(peakDate);
              pollStart = new Date(peak); pollStart.setDate(peak.getDate() - 3);
              pollEnd = new Date(peak); pollEnd.setDate(peak.getDate() + 1);
            }
            const pollinationWindow = pollStart && pollEnd ? `${pollStart.toISOString().slice(0,10)}/${pollEnd.toISOString().slice(0,10)}` : null;
            return (
              <InfoPanel
                crop={crop}
                municipio={selectedFeature?.properties?.municipality_name}
                peakDate={peakDate}
                pollinationWindow={pollinationWindow}
                showNoDataWarning={!hasCrop}
                feature={selectedFeature}
              />
            );
          })()}
        </div>
      </div>
      {/* Footer */}
  <footer className="bg-[#1E2024] text-white py-4 text-center mt-10 md:mt-14 w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8">
          <img src={Logo} alt="Logo" className="h-10 sm:h-15 mb-2 sm:mb-0" />          
          <a href="https://www.spaceappschallenge.org/2025/challenges/bloomwatch-an-earth-observation-application-for-global-flowering-phenology/?tab=resources" className="hover:underline text-xs sm:text-base">
            {language === 'en' ? 'Resources' : 'Recursos'}
          </a>
          <a href="https://www.nasa.gov/privacy/" className="hover:underline text-xs sm:text-base">
            {language === 'en' ? 'Hackathon Policies' : 'Políticas Hackaton'}
          </a>
          <a href="https://www.spaceappschallenge.org/2025/challenges/" className="hover:underline text-xs sm:text-base">
            {language === 'en' ? 'Hackathon Space Apps Challenge NASA 2025' : 'Hackaton Space Apps Challenge NASA 2025'}
          </a>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mt-2">
          <span>
            {language === 'en'
              ? 'Developed in 2025 © All rights reserved.'
              : 'Desarrollado en 2025 © Todos los derechos reservados.'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;