// Traducciones para los datos y la UI
export const translations = {
  es: {
    crops: {
      Naranja: 'Naranja',
      Toronja: 'Toronja',
      Mandarina: 'Mandarina',
      'Nogal Pecanero': 'Nogal Pecanero',
      Manzana: 'Manzana',
      Papa: 'Papa',
    },
    status: {
      dormancy: 'Latencia',
      growth: 'Crecimiento',
      peak_bloom: 'Floración máxima',
      fruiting: 'Fructificación',
    },
    municipality: 'Municipio',
    top_crops: 'Principales cultivos',
    predicted_peak_date: 'Fecha pico predicha',
    predicted_harvest_date: 'Fecha de cosecha predicha',
    ndvi_value: 'NDVI',
    max_temp_c: 'Temp. Máx (°C)',
    precipitation_mm: 'Precipitación (mm)',
  },
  en: {
    crops: {
      Naranja: 'Orange',
      Toronja: 'Grapefruit',
      Mandarina: 'Mandarin',
      'Nogal Pecanero': 'Pecan',
      Manzana: 'Apple',
      Papa: 'Potato',
    },
    status: {
      dormancy: 'Dormancy',
      growth: 'Growth',
      peak_bloom: 'Peak bloom',
      fruiting: 'Fruiting',
    },
    municipality: 'Municipality',
    top_crops: 'Top crops',
    predicted_peak_date: 'Predicted peak date',
    predicted_harvest_date: 'Predicted harvest date',
    ndvi_value: 'NDVI',
    max_temp_c: 'Max Temp (°C)',
    precipitation_mm: 'Precipitation (mm)',
  },
};

// Función para traducir los datos de agro_data.json según el idioma
export function translateAgroData(data, lang = 'es') {
  const t = translations[lang];
  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        top_crops: feature.properties.top_crops.map((crop) => t.crops[crop] || crop),
        time_series: feature.properties.time_series.map((ts) => ({
          ...ts,
          status: t.status[ts.status] || ts.status,
        })),
      },
    })),
  };
}
