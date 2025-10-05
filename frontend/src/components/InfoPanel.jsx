import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
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
  // Idioma y traducciones
  const { language } = useLanguage();
  const t = translations[language];
  // Formateo de fechas
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const meses = language === 'en'
      ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  };
  // --- FUNCIONES PARA DESCARGA ---
  const handleDownloadPDF = async () => {
    const uuid = uuidv4();
    const doc = new jsPDF({ background: '#202126' });
    // Fondo oscuro
    doc.setFillColor(32, 33, 38);
    doc.rect(0, 0, 210, 297, 'F');
    // Logo (si existe)
    try {
      const logoUrl = require('../assets/Logo.webp');
      const img = new window.Image();
      img.src = logoUrl;
      await new Promise(res => { img.onload = res; });
      doc.addImage(img, 'WEBP', 80, 8, 50, 18);
    } catch (e) { /* Si no hay logo, ignora */ }
    // Título centrado
    doc.setFontSize(20);
    doc.setTextColor('#67fb2c');
  doc.text(language === 'en' ? 'Crop Report' : 'Reporte de Cultivo', 105, 35, { align: 'center' });
    doc.setDrawColor('#67fb2c');
    doc.line(30, 38, 180, 38);
    // Datos principales
    doc.setFontSize(13);
    doc.setTextColor('#ffffff');
    let y = 48;
    doc.text(`UUID:`, 20, y); doc.setTextColor('#ffd600'); doc.text(uuid, 50, y);
    doc.setTextColor('#ffffff');
  y += 8; doc.text(`${language === 'en' ? 'Crop:' : 'Cultivo:'}`, 20, y); doc.setTextColor('#fb2c36'); doc.text(`${t.crops[crop] || crop || '-'}`, 50, y);
    doc.setTextColor('#ffffff');
  y += 8; doc.text(`${t.municipality}:`, 20, y); doc.setTextColor('#67fb2c'); doc.text(`${municipio || '-'}`, 50, y);
    doc.setTextColor('#ffffff');
  y += 8; doc.text(`${language === 'en' ? 'Estimated Peak Bloom:' : 'Pico Estimado de Floración:'}`, 20, y); doc.setTextColor('#ffd600'); doc.text(`${formatFecha(peakDate)}`, 80, y);
    doc.setTextColor('#ffffff');
    let pollText = '-';
    if (pollinationWindow && pollinationWindow.includes('/')) {
      const [pollStart, pollEnd] = pollinationWindow.split('/');
      pollText = `${formatFecha(pollStart)} – ${formatFecha(pollEnd)}`;
    }
    y += 8;
  doc.text(`${language === 'en' ? 'Optimal Pollination Window:' : 'Ventana Óptima de Polinización:'}`, 20, y);
    doc.setTextColor('#ffd600');
    // Si el texto es largo, usar splitTextToSize para ajustar
    const pollLines = doc.splitTextToSize(`${pollText}`, 100);
    doc.text(pollLines, 90, y);
    doc.setTextColor('#ffffff');
    y += 8 + (pollLines.length - 1) * 7;
  doc.text(`${language === 'en' ? 'Days Remaining:' : 'Días Restantes:'}`, 20, y); doc.setTextColor('#ffffff'); doc.text(`${typeof dias === 'number' && !isNaN(dias) ? dias : '-'}`, 60, y);
    // Tabla NDVI
    let filteredSeries = [];
    if (feature && feature.properties && feature.properties.time_series) {
      filteredSeries = feature.properties.time_series.filter(ts => {
        if (ts.crop || ts.cultivo) {
          return (ts.crop || ts.cultivo) === crop;
        }
        return true;
      });
    }
    y += 15;
    if (filteredSeries.length > 0) {
      doc.setTextColor('#67fb2c');
      doc.setFontSize(15);
  doc.text(language === 'en' ? 'NDVI Evolution' : 'Evolución NDVI', 105, y, { align: 'center' });
      y += 3;
      autoTable(doc, {
        startY: y + 5,
        head: [[
          language === 'en' ? 'Date' : 'Fecha',
          'NDVI',
          language === 'en' ? 'Max Temp (°C)' : 'Temp Max (°C)',
          language === 'en' ? 'Precip (mm)' : 'Precip (mm)',
          language === 'en' ? 'Type' : 'Tipo',
        ]],
        body: filteredSeries.map((ts, i) => [
          ts.date,
          ts.ndvi_value !== undefined ? ts.ndvi_value.toFixed(2) : '-',
          ts.max_temp_c !== undefined ? ts.max_temp_c.toFixed(1) : '-',
          ts.precipitation_mm !== undefined ? ts.precipitation_mm.toFixed(1) : '-',
          ts.type || '-'
        ]),
        headStyles: { fillColor: [103, 251, 44], textColor: 32, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fillColor: [32, 33, 38], textColor: 255, halign: 'center' },
        alternateRowStyles: { fillColor: [39, 40, 65] },
        styles: { fontSize: 10, cellPadding: 2 },
        margin: { left: 10, right: 10 },
        theme: 'grid',
      });
      y = doc.lastAutoTable.finalY + 10;
      // Agregar gráfica NDVI si existe un canvas en la página
      const ndviCanvas = document.querySelector('canvas');
      if (ndviCanvas) {
        const imgData = ndviCanvas.toDataURL('image/png');
        doc.setFontSize(13);
        doc.setTextColor('#67fb2c');
  doc.text(language === 'en' ? 'NDVI Chart' : 'Gráfica NDVI', 105, y, { align: 'center' });
        y += 3;
        doc.addImage(imgData, 'PNG', 25, y + 5, 160, 50);
      }
    } else {
      doc.setFontSize(12);
      doc.setTextColor('#fb2c36');
  doc.text(language === 'en' ? 'No NDVI data for this crop.' : 'No hay datos de NDVI para este cultivo.', 20, y);
    }
  doc.save(`reporte_${municipio || 'cultivo'}_${uuid}.pdf`);
  };

  const handleDownloadCSV = () => {
    const uuid = uuidv4();
    // Encabezado bonito y metadatos
    let csv = '';
  csv += (language === 'en' ? 'CROP REPORT' : 'REPORTE DE CULTIVO') + '\n';
    csv += '-----------------------------\n';
    csv += `UUID:,${uuid}\n`;
  csv += `${language === 'en' ? 'Crop:' : 'Cultivo:'},${t.crops[crop] || crop || '-'}\n`;
  csv += `${t.municipality},${municipio || '-'}\n`;
  csv += `${language === 'en' ? 'Estimated Peak Bloom:' : 'Pico Estimado de Floración:'},${formatFecha(peakDate)}\n`;
    let pollText = '-';
    if (pollinationWindow && pollinationWindow.includes('/')) {
      const [pollStart, pollEnd] = pollinationWindow.split('/');
      pollText = `${formatFecha(pollStart)} – ${formatFecha(pollEnd)}`;
    }
  csv += `${language === 'en' ? 'Optimal Pollination Window:' : 'Ventana Óptima de Polinización:'},${pollText}\n`;
  csv += `${language === 'en' ? 'Days Remaining:' : 'Días Restantes:'},${typeof dias === 'number' && !isNaN(dias) ? dias : '-'}\n`;
    csv += '\n-----------------------------\n';
  csv += (language === 'en' ? 'NDVI Table' : 'Tabla NDVI') + '\n';
  csv += `${language === 'en' ? 'Date' : 'Fecha'},NDVI,${language === 'en' ? 'Max Temp (°C)' : 'Temp Max (°C)'},${language === 'en' ? 'Precip (mm)' : 'Precip (mm)'},${language === 'en' ? 'Type' : 'Tipo'}\n`;
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
          ts.date,
          ts.ndvi_value !== undefined ? ts.ndvi_value : '',
          ts.max_temp_c !== undefined ? ts.max_temp_c : '',
          ts.precipitation_mm !== undefined ? ts.precipitation_mm : '',
          ts.type || ''
        ].join(',') + '\n';
      });
    } else {
      csv += ',,,,\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `reporte_${municipio || 'cultivo'}_${uuid}.csv`);
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
          {language === 'en'
            ? 'No data to display. Use the search filters to view information for an available municipality and crop.'
            : 'No hay datos para mostrar. Usa los filtros de búsqueda para ver información de un municipio y cultivo disponible.'}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">
        {language === 'en' ? 'Crop Status' : 'Estado del Cultivo'} <span>{t.crops[crop] || crop}</span><br/>
        <span className="text-lg">{language === 'en' ? 'in' : 'en'} {municipio}</span>
      </h2>
      <div className="">
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">
          {language === 'en' ? 'Estimated Peak Bloom:' : 'Pico Estimado de Floración:'} <br/>
          <span className=" text-[22px] text-yellow-400 font-semibold">{formatFecha(peakDate)}</span>
        </p>
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">
          {language === 'en' ? 'Optimal Pollination Window:' : 'Ventana Óptima de Polinización:'} <br/>
          <span className="text-[22px] text-yellow-400 font-semibold">{pollStart && pollEnd ? `${formatFecha(pollStart)} – ${formatFecha(pollEnd)}` : '-'}</span>
        </p>
        <p className="text-[17px] mb-4 text-[#d1d5dcc7]">
          {language === 'en' ? 'Days Remaining:' : 'Días Restantes:'} <br/>
          <span className="text-[22px] text-white font-semibold">{typeof dias === 'number' && !isNaN(dias) ? `${dias} ${language === 'en' ? 'days' : 'días'}` : '-'}</span>
        </p>
      </div>
      <hr className="border-gray-600 my-4" />
      <h2 className="text-xl font-semibold mb-4 text-center">
        {language === 'en' ? 'Crop Evolution' : 'Evolución del Cultivo'}<br/>
      </h2>
      <NDVIChart feature={feature || null} />
      {/*
      <div className="mt-4 flex gap-4">
        <button className="bg-[#272841] text-white px-4 py-4 rounded-xl border-2 border-blue-500 hover:bg-blue-500 w-full flex items-center justify-center gap-2">
          Generar Plan de Acción <SiGooglegemini className='text-2xl' />
        </button>
        <button className="bg-gray-800 text-white px-4 py-4 rounded-xl border-2 border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2">
          <HiOutlineDocumentDownload className='text-2xl' />
        </button>
      </div>
      */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-[#fb2c363e] text-white px-4 py-3 rounded-xl border-2 border-red-500 hover:bg-red-500 w-full flex items-center justify-center gap-2"
          onClick={handleDownloadPDF}
        >
          <FaFilePdf className='text-2xl' />
          {language === 'en' ? 'Download PDF Report' : 'Descargar Reporte PDF'}
        </button>
        <button
          className="bg-[#67fb2c3e] text-white px-4 py-3 rounded-xl border-2 border-green-500 hover:bg-green-500 w-full flex items-center justify-center gap-2"
          onClick={handleDownloadCSV}
        >
          <FaFileCsv className='text-2xl' />
          {language === 'en' ? 'Download CSV Report' : 'Descargar Reporte CSV'}
        </button>
      </div>
      <div className="mt-4 p-4 rounded">
        <ChatBox />
      </div>
    </div>
  );
};

export default InfoPanel;