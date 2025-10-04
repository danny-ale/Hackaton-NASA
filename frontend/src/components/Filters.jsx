import React from 'react';

const Filters = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">NASA AgroBloom NL 🐝</h1>
      <select className="p-2 border border-gray-300 rounded">
        <option value="">Selecciona Cultivo</option>
        <option value="naranja">Naranja Navel</option>
        <option value="manzana">Manzana</option>
        <option value="nogal">Nogal</option>
      </select>
      <select className="p-2 border border-gray-300 rounded">
        <option value="">Selecciona Región/Municipio</option>
        <option value="allende">Allende</option>
        <option value="montemorelos">Montemorelos</option>
        <option value="general-teran">General Terán</option>
      </select>
    </div>
  );
};

export default Filters;