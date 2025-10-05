import React from 'react';
import { PiPlantBold } from 'react-icons/pi';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaCalendarAlt } from 'react-icons/fa';
import { LuClockAlert } from 'react-icons/lu';

const FiltersBar = () => {
  return (
    <div className="bg-[#202126] p-4 mt-[10px] flex flex-wrap gap-8 rounded-lg shadow-md justify-center">
        
        <div className='flex flex-col py-2'>
        <label className="text-white text-2xl font-bold mb-2">Filtros de busqueda: </label>    
        </div>
      
      <div className='flex flex-col w-[15%]'>
         <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
        <label className="mb-1 ml-3 self-start flex items-center text-sm">
          <PiPlantBold className="mr-2" /> Cultivo
        </label>
      </div>
       <select className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm">
          <option className="py-1">Naranja Navel 🍊</option>
          <option className="py-1">Nogal Pecane 🌰</option>
          <option className="py-1">Mandarina 🍊</option>
        </select>
      </div>
     
      <div className='flex flex-col w-[15%]'>
         <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
        <label className="mb-1 ml-3 self-start flex items-center text-sm">
          <FaMapLocationDot className="mr-2" /> Región/Municipio
        </label>
      </div>
       <select className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm">
          <option className="py-1">Allende</option>
          <option className="py-1">Montemorelos</option>
          <option className="py-1">General Terán</option>
        </select>
      </div>

      <div className='flex flex-col w-[15%]'>
         <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
        <label className="mb-1 ml-3 self-start flex items-center text-sm">
          <FaCalendarAlt className="mr-2" /> Temporada
        </label>
      </div>
       <select className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm">
          <option className="py-1">2024</option>
          <option className="py-1">2025</option>
        </select>
      </div>

      <div className='flex flex-col w-[15%]'>
         <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
        <label className="mb-1 ml-3 self-start flex items-center text-sm">
          <LuClockAlert className="mr-2" /> Última actualización
        </label>
      </div>
       <select className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm">
          <option className="py-1">Última</option>
          <option className="py-1">Hace 1 semana</option>
          <option className="py-1">Hace 1 mes</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;