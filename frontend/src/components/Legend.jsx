import React from 'react';

const Legend = () => {
  return (
    <div className="flex justify-around p-4 bg-gray-100 border-t">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-brown-500 mr-2"></div>
        <span>Dormancia</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-300 mr-2"></div>
        <span>Crecimiento vegetativo</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
        <span>Ventana óptima de polinización</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-700 mr-2"></div>
        <span>Crecimiento de fruto</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-yellow-600 mr-2"></div>
        <span>Pico de floración</span>
      </div>
    </div>
  );
};

export default Legend;