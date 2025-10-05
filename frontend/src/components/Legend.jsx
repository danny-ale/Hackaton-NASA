import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Legend = () => {
  const { language } = useLanguage();
  const labels = language === 'en'
    ? [
        'Dormancy',
        'Vegetative growth',
        'Optimal pollination window',
        'Fruit growth',
        'Peak bloom',
      ]
    : [
        'Dormancia',
        'Crecimiento vegetativo',
        'Ventana óptima de polinización',
        'Crecimiento de fruto',
        'Pico de floración',
      ];
  const colors = [
    'bg-brown-500',
    'bg-green-300',
    'bg-yellow-400',
    'bg-green-700',
    'bg-yellow-600',
  ];
  return (
    <div className="flex justify-around p-4 bg-gray-100 border-t">
      {labels.map((label, i) => (
        <div className="flex items-center" key={label}>
          <div className={`w-4 h-4 ${colors[i]} mr-2`}></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;