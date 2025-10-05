import React from 'react';
import { SiGooglegemini } from 'react-icons/si';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import { FaFilePdf,  FaFileCsv} from 'react-icons/fa6';
import NDVIChart from './NDVIChart';
import ChatBox from './ChatBox';

const InfoPanel = () => {
  return (
    <div className="bg-[#202126] text-white px-15 py-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Estado del Cultivo <span>[Naranja Navel]</span><br/><span className="text-lg">en [Montemorelos]</span></h2>
      <div className="">
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">Pico Estimado de Floración: <br/> <span className=" text-[22px] text-yellow-400 font-semibold">05 Abril 2026</span></p>
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">Ventana Óptima de Polinización: <br/> <span className="text-[22px] text-yellow-400 font-semibold">02–08 Abril 2026</span></p>
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">Días Restantes: <br/> <span className="text-[22px] text-white font-semibold">15 días</span></p>
      </div>
      <hr className="border-gray-600 my-4" />
      <h2 className="text-xl font-semibold mb-4 text-center">Evolución del Cultivo<br/><span className="text-[17px] text-[#d1d5dcc7]">(Ultimos 3 meses)</span></h2>
      <NDVIChart />
      <div className="mt-4 flex gap-4">
        <button className="bg-[#272841] text-white px-4 py-4 rounded-xl border-2 border-blue-500 hover:bg-blue-500 w-full flex items-center justify-center gap-2">
          Generar Plan de Acción <SiGooglegemini className='text-2xl' />
        </button>
        <button className="bg-gray-800 text-white px-4 py-4 rounded-xl border-2 border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2">
          <HiOutlineDocumentDownload className='text-2xl' />
        </button>
      </div>
      <div className="mt-6 flex gap-4">
        <button className="bg-[#fb2c363e] text-white px-4 py-3 rounded-xl border-2 border-red-500 hover:bg-red-500 w-full flex items-center justify-center gap-2">
          <FaFilePdf className='text-2xl' /> Descargar Reporte PDF
        </button>
        <button className="bg-[#67fb2c3e] text-white px-4 py-3 rounded-xl border-2 border-green-500 hover:bg-green-500 w-full flex items-center justify-center gap-2">
          <FaFileCsv className='text-2xl' /> Descargar Reporte CSV
        </button>
      </div>
      <div className="mt-4 p-4 rounded">
        <ChatBox />
      </div>
    </div>
  );
};

export default InfoPanel;