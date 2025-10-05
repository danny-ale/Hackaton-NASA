
import { useLanguage } from '../context/LanguageContext';

const legendLabels = {
  es: ['Dormancia', 'Pico Floración', 'Pico Corazón'],
  en: ['Dormancy', 'Peak Bloom', 'Peak Heart'],
};
const legendColors = ['bg-yellow-800', 'bg-yellow-400', 'bg-green-500'];

const MapLegend = () => {
  const { language } = useLanguage();
  return (
    <div className="bg-[#1E2024] flex justify-center items-center space-x-6 mt-4 py-6 rounded-lg">
      {legendLabels[language].map((label, i) => (
        <div key={label} className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded ${legendColors[i]}`}></div>
          <span className="text-sm text-gray-300">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;