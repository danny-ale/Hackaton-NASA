import React, { useState, useEffect } from 'react';
import AgroMap from './AgroMap';
import TimePlayer from './TimePlayer';
import { useLanguage } from '../context/LanguageContext';
import { translateAgroData } from '../utils/translations';

const Dashboard = () => {
  const [featureCollection, setFeatureCollection] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    fetch('/api/agro_data')
      .then(response => response.json())
      .then(data => {
        setRawData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los datos:", error);
        setIsLoading(false);
      });
  }, []);

  // Traducir los datos cada vez que cambie el idioma o los datos crudos
  useEffect(() => {
    if (rawData) {
      setFeatureCollection(translateAgroData(rawData, language));
    }
  }, [rawData, language]);

  if (isLoading) {
    return <div>{language === 'en' ? 'Loading agricultural data...' : 'Cargando datos agrícolas...'}</div>;
  }

  return (
    <div>
      <AgroMap 
        geoData={featureCollection} 
        dateIndex={currentDateIndex} 
        onDateChange={setCurrentDateIndex} 
      />
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <TimePlayer 
          totalSteps={featureCollection.features[0].properties.time_series.length}
          currentStep={currentDateIndex}
          onStepChange={setCurrentDateIndex}
        />
      </div>
    </div>
  );
};

export default Dashboard;