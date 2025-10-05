import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';





import testGeoJSON from '../data/testGeoJSON.json';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const t = translations[language];
  const prevLang = useRef(language);
  // Si cambia el idioma, limpia mensajes y vuelve a pedir recomendación si había mensajes
  useEffect(() => {
    if (prevLang.current !== language) {
      if (messages.length > 0) {
        setMessages([]);
        setTimeout(() => handleGetRecommendation(), 200); // Llama de nuevo tras limpiar
      }
      prevLang.current = language;
    }
    // eslint-disable-next-line
  }, [language]);

  // Función para pedir recomendación al backend usando testGeoJSON
  const handleGetRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/get_recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geoData: testGeoJSON, language })
      });
      const data = await response.json();
      if (data && data.recommendations) {
        // Si el backend ya parseó, pero el campo text viene con varias recomendaciones juntas, dividirlas
        const recs = data.recommendations;
        if (
          recs.length === 1 &&
          recs[0].text &&
          /([\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF])\s*\*\*(.*?)\*\*:?/u.test(recs[0].text)
        ) {
          // Parsear el string en varias recomendaciones
          const regex = /([\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF])\s*\*\*(.*?)\*\*:?\s*([^\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF]*)/gu;
          let match;
          const parsed = [];
          while ((match = regex.exec(recs[0].text)) !== null) {
            parsed.push({
              icon: match[1],
              title: match[2],
              text: match[3].replace(/\*\*/g, '').trim()
            });
          }
          setMessages(parsed.length ? parsed : recs);
        } else {
          setMessages(recs);
        }
      } else if (data && data.recommendation) {
        // Si el backend manda un solo string, parsear aquí por emojis y negritas
        const text = data.recommendation;
        const regex = /([\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF])\s*\*\*(.*?)\*\*:?\s*([^\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF]*)/gu;
        let match;
        const parsed = [];
        while ((match = regex.exec(text)) !== null) {
          parsed.push({
            icon: match[1],
            title: match[2],
            text: match[3].replace(/\*\*/g, '').trim()
          });
        }
        setMessages(parsed.length ? parsed : [{ icon: '💡', title: language === 'en' ? 'Recommendation' : 'Recomendación', text }]);
      } else if (data && data.message) {
        setMessages([{ icon: '🤖', title: language === 'en' ? 'Recommendation' : 'Recomendación', text: data.message }]);
      } else {
        setMessages([{ icon: '❓', title: language === 'en' ? 'No response' : 'Sin respuesta', text: language === 'en' ? 'No valid recommendation received.' : 'No se recibió una recomendación válida.' }]);
      }
    } catch (err) {
  setError(language === 'en' ? 'Error getting recommendation.' : 'Error al obtener recomendación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#2D2E33] text-white rounded-lg shadow-xl w-full mx-auto mt-10 p-4">
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          {language === 'en' ? 'Virtual Agronomy Advisor' : 'Asesor Agrónomo Virtual'}
        </h2>
        <p className="text text-gray-300 mt-1">
          {language === 'en'
            ? 'Get precise and personalized recommendations to optimize your agricultural production.'
            : 'Recibe recomendaciones precisas y personalizadas para optimizar tu producción agrícola.'}
        </p>
      </div>

      {/* Botón para obtener recomendación */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleGetRecommendation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? language === 'en' ? 'Getting recommendation...' : 'Obteniendo recomendación...'
            : language === 'en' ? 'Get AI Recommendation' : 'Obtener recomendación IA'}
        </button>
      </div>

      {/* Mensajes */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start bg-[#44464d] p-3 rounded-md">
            <span className="text-2xl mr-3">{message.icon}</span>
            <div>
              <b className="font-semibold block">{message.title}</b>
              <p className="text-sm text-gray-300">{message.text}</p>
            </div>
          </div>
        ))}
  {error && <div className="text-red-400">{error}</div>}
      </div>

      {/* Pie de página */}
      <div className="mt-6 flex justify-between items-center text-gray-400 text-sm">
        <button
          className="flex items-center hover:text-white"
          onClick={() => { if (messages.length > 0) setMessages([]); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {language === 'en' ? 'Close' : 'Cerrar'}
        </button>
        <span>{language === 'en' ? 'Powered by Gemini AI' : 'Impulsado por Gemini IA'}</span>
      </div>
    </div>
  );
};

export default ChatBox;