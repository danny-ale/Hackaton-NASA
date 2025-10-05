import React from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const TimePlayer = ({ 
  currentStep, 
  totalSteps, 
  isPlaying, 
  onPlayPause, 
  onStepChange,
  onReset
}) => {
  const maxSteps = totalSteps > 0 ? totalSteps - 1 : 0;
  const { language } = useLanguage();

  return (
  <div className="bg-[#202126] p-2 flex flex-col items-center space-y-2 rounded-full shadow-lg w-full mt-80 md:mt-50 lg:mt-0">
      <div className="flex items-center space-x-4 w-full">
        <button 
          onClick={onReset} 
          className="text-gray-400 hover:text-white transition-colors focus:outline-none p-2"
        >
          <FaRedo />
        </button>

        <button 
          onClick={onPlayPause} 
          className="text-gray-400 hover:text-white transition-colors focus:outline-none p-2 text-lg"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <input
          type="range"
          min="0"
          max={maxSteps}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer custom-slider"
          style={{
            background: `linear-gradient(to right, #bbb ${(currentStep / maxSteps) * 100}%, #444 ${(currentStep / maxSteps) * 100}%)`,
          }}
        />
      </div>
      <div className="text-xs text-gray-300 mt-1">
        {language === 'en'
          ? `Current step: ${currentStep + 1} / ${totalSteps}`
          : `Paso actual: ${currentStep + 1} / ${totalSteps}`}
      </div>
      <style>{`
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #fff;
          box-shadow: 0 0 2px #0003;
          transition: background 0.3s;
        }
        .custom-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #fff;
          box-shadow: 0 0 2px #0003;
          transition: background 0.3s;
        }
        .custom-slider::-ms-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #fff;
          box-shadow: 0 0 2px #0003;
          transition: background 0.3s;
        }
        .custom-slider:focus {
          outline: none;
        }
        .custom-slider::-webkit-slider-runnable-track {
          height: 16px;
          border-radius: 8px;
        }
        .custom-slider::-ms-fill-lower {
          background: #bbb;
        }
        .custom-slider::-ms-fill-upper {
          background: #444;
        }
      `}</style>
    </div>
  );
};

export default TimePlayer;