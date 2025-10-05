import React, { useState, useEffect } from 'react';
import AgroMap from './AgroMap';
import TimePlayer from './TimePlayer';

const Dashboard = () => {
  const [featureCollection, setFeatureCollection] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agro_data')
      .then(response => response.json())
      .then(data => {
        setFeatureCollection(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los datos:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Cargando datos agrícolas...</div>;
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