import React from 'react';

const messages = [
  {
    icon: '🐝',
    title: '¡Hora clave para tus Naanps en!',
    text: 'Introducir tus colmenas entre el 03 y 02 de abril 🤩',
  },
  {
    icon: '🌡️',
    title: 'Alerta: 4 5 abrir abrir espesor fríos.',
    text: 'Prepara un sistema anti-heladas!',
  },
  {
    icon: '💧',
    title: 'Aumenta un 15% las olas si la cosecha es helada!',
    text: 'Si la cosecha es helada, aumenta un 15% las olas.',
  },
];

const ChatBox = () => {
  return (
    <div className="bg-[#2D2E33] text-white rounded-lg shadow-xl w-full mx-auto mt-10 p-4">
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Asesor Agrónomo Virtual</h2>
        <p className="text-sm text-gray-400">Personaliza (A Asesor)</p>
      </div>

      {/* Mensajes */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start bg-[#44464d] p-3 rounded-md">
            <span className="text-2xl mr-3">{message.icon}</span>
            <div>
              <p className="font-semibold">{message.title}</p>
              <p className="text-sm text-gray-300">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie de página */}
      <div className="mt-6 flex justify-between items-center text-gray-400 text-sm">
        <button className="flex items-center hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Cerrar
        </button>
        <span>Impulsado por Gemini IA</span>
      </div>
    </div>
  );
};

export default ChatBox;