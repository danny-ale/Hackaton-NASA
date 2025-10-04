import React from 'react';
import NDVIChart from './NDVIChart';

const InfoPanel = () => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex items-center mb-4">
        <img src="/path-to-nasa-logo.png" alt="NASA Logo" className="h-8 mr-2" />
        <h2 className="text-xl font-bold">Bloom Monitor NL</h2>
      </div>
      <h3 className="text-lg font-bold mb-2">Estado del Cultivo en Montemorelos</h3>
      <p className="mb-2">Fecha Estimada de Pico de Floración: <strong>05 Abril, 2026</strong></p>
      <p className="mb-4">Ventana Óptima: <strong>02 – 08 Abril, 2026</strong></p>
      <NDVIChart />
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
        Generar Plan de Acción (IA Gemini)
      </button>
    </div>
  );
};

export default InfoPanel;