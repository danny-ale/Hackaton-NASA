import React from 'react';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { SiGooglegemini } from 'react-icons/si';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import { FaFilePdf,  FaFileCsv} from 'react-icons/fa6';
import NDVIChart from './NDVIChart';
import ChatBox from './ChatBox';

const InfoPanel = ({
  crop,
  municipio,
  peakDate,
  pollinationWindow,
  diasRestantes,
  showNoDataWarning = false,
  feature
}) => {
  // Formateo de fechas
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  };
  // --- FUNCIONES PARA DESCARGA ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Reporte de Cultivo`, 10, 15);
    doc.setFontSize(12);
    doc.text(`Cultivo seleccionado: ${crop || '-'}`, 10, 30);
    doc.text(`Municipio: ${municipio || '-'}`, 10, 40);
    doc.text(`Pico Estimado de Floración: ${formatFecha(peakDate)}`, 10, 50);
    let pollText = '-';
    if (pollinationWindow && pollinationWindow.includes('/')) {
      const [pollStart, pollEnd] = pollinationWindow.split('/');
      pollText = `${formatFecha(pollStart)} – ${formatFecha(pollEnd)}`;
    }
    doc.text(`Ventana Óptima de Polinización: ${pollText}`, 10, 60);
    doc.text(`Días Restantes: ${typeof dias === 'number' && !isNaN(dias) ? dias : '-'}`, 10, 70);
    // Filtrar la serie temporal por cultivo seleccionado si es posible
    let filteredSeries = [];
    if (feature && feature.properties && feature.properties.time_series) {
      // Si hay un campo de cultivo en cada entrada, filtrar por crop
      filteredSeries = feature.properties.time_series.filter(ts => {
        // Si hay un campo 'crop' o 'cultivo', filtrar, si no, incluir todos
        if (ts.crop || ts.cultivo) {
          return (ts.crop || ts.cultivo) === crop;
        }
        return true;
      });
    }
    if (filteredSeries.length > 0) {
      doc.text('Evolución NDVI:', 10, 85);
      // Encabezado con el nombre del cultivo
      doc.setFontSize(11);
      doc.text(`Cultivo: ${crop || '-'}`, 10, 92);
      const headers = ['Fecha', 'NDVI', 'Temp Max (°C)', 'Precip (mm)', 'Tipo'];
      let y = 100;
      doc.setFontSize(10);
      doc.text(headers.join(' | '), 10, y);
      y += 7;
      filteredSeries.forEach(ts => {
        const row = [
          ts.date,
          ts.ndvi_value !== undefined ? ts.ndvi_value.toFixed(2) : '-',
          ts.max_temp_c !== undefined ? ts.max_temp_c.toFixed(1) : '-',
          ts.precipitation_mm !== undefined ? ts.precipitation_mm.toFixed(1) : '-',
          ts.type || '-'
        ];
        doc.text(row.join(' | '), 10, y);
        y += 7;
        if (y > 270) { doc.addPage(); y = 15; }
      });
    } else {
      // Si no hay datos, igual mostrar el nombre del cultivo
      doc.setFontSize(11);
      doc.text(`Cultivo: ${crop || '-'}`, 10, 85);
      doc.setFontSize(10);
      doc.text('No hay datos de NDVI para este cultivo.', 10, 95);
    }
    doc.save(`reporte_${municipio || 'cultivo'}.pdf`);
  };

  const handleDownloadCSV = () => {
  let csv = 'Cultivo,Municipio,Fecha,NDVI,Temp Max (°C),Precip (mm),Tipo\n';
    let filteredSeries = [];
    if (feature && feature.properties && feature.properties.time_series) {
      filteredSeries = feature.properties.time_series.filter(ts => {
        if (ts.crop || ts.cultivo) {
          return (ts.crop || ts.cultivo) === crop;
        }
        return true;
      });
    }
    if (filteredSeries.length > 0) {
      filteredSeries.forEach(ts => {
        csv += [
          crop || '',
          municipio || '',
          ts.date,
          ts.ndvi_value !== undefined ? ts.ndvi_value : '',
          ts.max_temp_c !== undefined ? ts.max_temp_c : '',
          ts.precipitation_mm !== undefined ? ts.precipitation_mm : '',
          ts.type || ''
        ].join(',') + '\n';
      });
    } else {
      // Si no hay datos, igual incluir el nombre del cultivo y municipio
      csv += [crop || '', municipio || '', '', '', '', '', ''].join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `reporte_${municipio || 'cultivo'}.csv`);
  };
  let pollStart = null, pollEnd = null;
  if (pollinationWindow && pollinationWindow.includes("/")) {
    [pollStart, pollEnd] = pollinationWindow.split("/");
  }
  // Calcular días restantes
  let dias = diasRestantes;
  if (dias == null && peakDate) {
    const hoy = new Date();
    const peak = new Date(peakDate);
    dias = Math.max(0, Math.ceil((peak - hoy) / (1000*60*60*24)));
  }
  return (
    <div className="bg-[#202126] text-white px-15 py-8 rounded-lg shadow-md">
      {showNoDataWarning && (
        <div className="bg-yellow-700 text-yellow-200 p-2 mb-4 rounded text-center">
          No hay datos para mostrar. Usa los filtros de búsqueda para ver información de un municipio y cultivo disponible.
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Estado del Cultivo <span>{crop}</span><br/><span className="text-lg">en {municipio}</span></h2>
      <div className="">
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">Pico Estimado de Floración: <br/> <span className=" text-[22px] text-yellow-400 font-semibold">{formatFecha(peakDate)}</span></p>
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">Ventana Óptima de Polinización: <br/> <span className="text-[22px] text-yellow-400 font-semibold">{pollStart && pollEnd ? `${formatFecha(pollStart)} – ${formatFecha(pollEnd)}` : '-'}</span></p>
  <p className="text-[17px] mb-4 text-[#d1d5dcc7]">Días Restantes: <br/> <span className="text-[22px] text-white font-semibold">{typeof dias === 'number' && !isNaN(dias) ? `${dias} días` : '-'}</span></p>
      </div>
      <hr className="border-gray-600 my-4" />
      <h2 className="text-xl font-semibold mb-4 text-center">Evolución del Cultivo<br/></h2>
  <NDVIChart feature={feature || null} />
      <div className="mt-4 flex gap-4">
        <button className="bg-[#272841] text-white px-4 py-4 rounded-xl border-2 border-blue-500 hover:bg-blue-500 w-full flex items-center justify-center gap-2">
          Generar Plan de Acción <SiGooglegemini className='text-2xl' />
        </button>
        <button className="bg-gray-800 text-white px-4 py-4 rounded-xl border-2 border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2">
          <HiOutlineDocumentDownload className='text-2xl' />
        </button>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          className="bg-[#fb2c363e] text-white px-4 py-3 rounded-xl border-2 border-red-500 hover:bg-red-500 w-full flex items-center justify-center gap-2"
          onClick={handleDownloadPDF}
        >
          <FaFilePdf className='text-2xl' /> Descargar Reporte PDF
        </button>
        <button
          className="bg-[#67fb2c3e] text-white px-4 py-3 rounded-xl border-2 border-green-500 hover:bg-green-500 w-full flex items-center justify-center gap-2"
          onClick={handleDownloadCSV}
        >
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