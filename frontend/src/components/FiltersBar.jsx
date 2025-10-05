import React from 'react';
import agroData from '../../../backend/data/agro_data.json';
import { FaFilter } from 'react-icons/fa';
import { PiPlantBold } from 'react-icons/pi';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaCalendarAlt } from 'react-icons/fa';
import { LuClockAlert } from 'react-icons/lu';

const FiltersBar = ({ filters, setFilters, onApply }) => {

  // Municipios únicos
  const municipios = Array.from(new Set(agroData.features.map(f => f.properties.municipality_name)));
  // Si no hay municipio seleccionado, usar el primero para mostrar cultivos
  const municipioActivo = filters.municipio || municipios[0];
  const selectedMun = agroData.features.find(f => f.properties.municipality_name === municipioActivo);
  const cultivos = selectedMun ? selectedMun.properties.top_crops : [];

  // Obtener años únicos de la time_series del municipio/cultivo seleccionado
  let temporadas = [];
  if (selectedMun && filters.cultivo) {
    const series = selectedMun.properties.time_series || [];
    temporadas = Array.from(new Set(
      series
        .filter(entry => !filters.cultivo || selectedMun.properties.top_crops.includes(filters.cultivo))
        .map(entry => new Date(entry.date).getFullYear().toString())
    ));
    temporadas.sort((a, b) => b.localeCompare(a)); // Descendente
  }

  // Para temporada personalizada
  const isPersonalizada = filters.temporada === 'Personalizada';
  const [customRange, setCustomRange] = React.useState({ desde: '', hasta: '' });

  // Cuando cambia el rango personalizado, actualizar filtros
  React.useEffect(() => {
    if (isPersonalizada && customRange.desde && customRange.hasta) {
      setFilters(f => ({ ...f, temporada_desde: customRange.desde, temporada_hasta: customRange.hasta }));
    }
  }, [customRange, isPersonalizada, setFilters]);

  // Calcular fechas para el filtro de "Última actualización"
  const today = new Date();
  const dateToString = (date) => date.toISOString().slice(0, 10);
  const ultimaFecha = selectedMun && selectedMun.properties.time_series.length > 0
    ? selectedMun.properties.time_series[selectedMun.properties.time_series.length - 1].date
    : dateToString(today);
  const hace1Semana = dateToString(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
  const hace1Mes = dateToString(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000));

  // Solo aplicar filtros automáticamente en el primer render
  const firstLoad = React.useRef(true);
  React.useEffect(() => {
    if (firstLoad.current) {
      if ((!filters.municipio || !filters.cultivo) && municipios.length > 0 && cultivos.length > 0) {
        setFilters(f => {
          const nuevo = {
            ...f,
            municipio: f.municipio || municipios[0],
            cultivo: cultivos[0],
          };
          if (typeof onApply === 'function') {
            setTimeout(() => onApply(), 0);
          }
          return nuevo;
        });
      } else if (filters.municipio && cultivos.length > 0 && !cultivos.includes(filters.cultivo)) {
        setFilters(f => {
          const nuevo = { ...f, cultivo: cultivos[0] };
          if (typeof onApply === 'function') {
            setTimeout(() => onApply(), 0);
          }
          return nuevo;
        });
      } else if (filters.municipio && filters.cultivo && typeof onApply === 'function') {
        setTimeout(() => onApply(), 0);
      }
      firstLoad.current = false;
    } else {
      // Cuando cambian los cultivos y no hay cultivo seleccionado, selecciona el primero
      if (cultivos.length > 0 && !filters.cultivo) {
        setFilters(f => ({ ...f, cultivo: cultivos[0] }));
      } else if (filters.municipio && cultivos.length > 0 && !cultivos.includes(filters.cultivo)) {
        setFilters(f => ({ ...f, cultivo: cultivos[0] }));
      }
    }
  }, [filters.municipio, cultivos]);

  return (
    <div className="bg-[#202126] p-4 mt-[10px] flex flex-wrap gap-8 rounded-lg shadow-md justify-center">
      <div className='flex flex-col py-2'>
        <label className="text-white text-2xl font-bold mb-2">Filtros de busqueda: </label>
      </div>
      <div className='flex flex-col w-[15%]'>
        <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
          <label className="mb-1 ml-3 self-start flex items-center text-sm">
            <FaMapLocationDot className="mr-2" /> Región/Municipio
          </label>
        </div>
        <select
          className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm"
          value={filters.municipio}
          onChange={e => setFilters(f => ({ ...f, municipio: e.target.value }))}
        >
          {municipios.map(mun => (
            <option key={mun} className="py-1">{mun}</option>
          ))}
        </select>
      </div>
      <div className='flex flex-col w-[15%]'>
        <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
          <label className="mb-1 ml-3 self-start flex items-center text-sm">
            <PiPlantBold className="mr-2" /> Cultivo
          </label>
        </div>
        <select
          className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm"
          value={filters.cultivo}
          onChange={e => setFilters(f => ({ ...f, cultivo: e.target.value }))}
        >
          {cultivos.map(cul => (
            <option key={cul} className="py-1">{cul}</option>
          ))}
        </select>
      </div>
      <div className='flex flex-col w-[15%]'>
        <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
          <label className="mb-1 ml-3 self-start flex items-center text-sm">
            <FaCalendarAlt className="mr-2" /> Temporada
          </label>
        </div>
        <select
          className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm"
          value={filters.temporada}
          onChange={e => {
            setFilters(f => ({ ...f, temporada: e.target.value, temporada_desde: '', temporada_hasta: '' }));
            if (e.target.value !== 'Personalizada') setCustomRange({ desde: '', hasta: '' });
          }}
        >
          {temporadas.length === 0 && <option className="py-1">-</option>}
          {temporadas.map(year => (
            <option key={year} className="py-1">{year}</option>
          ))}
          <option className="py-1" value="Personalizada">Personalizada</option>
        </select>
        {isPersonalizada && (
          <div className="flex flex-row gap-2 mt-2">
            <select
              className="bg-[#3F4045] text-white border border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm w-1/2"
              value={customRange.desde}
              onChange={e => setCustomRange(r => ({ ...r, desde: e.target.value }))}
            >
              <option value="">Desde</option>
              {temporadas.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              className="bg-[#3F4045] text-white border border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm w-1/2"
              value={customRange.hasta}
              onChange={e => setCustomRange(r => ({ ...r, hasta: e.target.value }))}
            >
              <option value="">Hasta</option>
              {temporadas.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className='flex flex-col w-[15%]'>
        <div className="flex flex-col items-center text-white bg-[#2D2E33] p-1 rounded-t-lg">
          <label className="mb-1 ml-3 self-start flex items-center text-sm">
            <LuClockAlert className="mr-2" /> Última actualización
          </label>
        </div>
        <select
          className="bg-[#3F4045] text-white border border-gray-600 rounded-b-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full text-sm"
          value={filters.actualizacion}
          onChange={e => {
            let fecha = '';
            if (e.target.value === 'Última') fecha = ultimaFecha;
            else if (e.target.value === 'Hace 1 semana') fecha = hace1Semana;
            else if (e.target.value === 'Hace 1 mes') fecha = hace1Mes;
            setFilters(f => ({ ...f, actualizacion: e.target.value, fechaSeleccionada: fecha }));
          }}
        >
          <option className="py-1">Última</option>
          <option className="py-1">Hace 1 semana</option>
          <option className="py-1">Hace 1 mes</option>
        </select>
      </div>
      <div className="flex flex-col w-[15%] justify-end pb-2">
        <button
          className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-full border border-white hover:bg-gray-600 cursor-pointer font-semibold mt-auto shadow"
          style={{ minWidth: '100%' }}
          onClick={onApply}
        >
          <FaFilter className="mr-2" />
          Aplicar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltersBar;