import os
import google.generativeai as genai

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("La API Key de Gemini no está configurada en el archivo .env")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('models/gemini-2.5-flash')
except Exception as e:
    print(f"Error al inicializar el modelo de Gemini: {e}")
    model = None


def get_recommendation_from_gemini(data):
    if not model:
        return {"error": "El modelo de Gemini no pudo ser inicializado. Revisa la configuración y la API Key."}

    # Detectar idioma (por defecto español)
    language = data.get('language', 'es')

    # Si el frontend manda geoData, extraer los datos relevantes del primer municipio
    if 'geoData' in data:
        geo = data['geoData']
        if geo and 'features' in geo and len(geo['features']) > 0:
            feature = geo['features'][0]
            crop = feature['properties'].get('crop', 'N/A')
            municipality = feature['properties'].get('municipality_name', 'N/A')
            time_series = feature['properties'].get('time_series', [])
            peak_date = time_series[0].get('date', 'N/A') if time_series else 'N/A'
            harvest_date = time_series[-1].get('date', 'N/A') if time_series else 'N/A'
        else:
            crop = municipality = peak_date = harvest_date = 'N/A'
    else:
        crop = data.get('crop')
        municipality = data.get('municipality')
        peak_date = data.get('peak_date')
        harvest_date = data.get('harvest_date')

    if language == 'en':
        prompt = f"""
        ### ROLE & OBJECTIVE ###
        Act as an expert Agronomist and field advisor, with years of experience working directly with farmers in the region of Nuevo León, Mexico. Your goal is to translate complex satellite data into a simple, practical, and friendly action plan.

        ### FORECAST CONTEXT ###
        Based on our NASA data analysis, we have generated the following forecast for the crop **'{crop}'** in the region of **'{municipality}'**:
        - **Estimated Peak Bloom:** {peak_date}
        - **Estimated Harvest Start:** {harvest_date}

        ### TASK: YOUR ACTION PLAN ###
        Generate ONLY 3 main recommendations, one for each stage, in list format. Each recommendation must have:
        - An emoji at the start (🚜, 🐝, 🍇)
        - A brief and clear title (in bold)
        - A single practical, concrete, and direct tip (max 2 lines)
        - Do not add an introduction or conclusion, just the list of recommendations.

        Example format:
        🚜 **Preparing the Field:** Water consistently and apply phosphorus-rich fertilizer before blooming.
        🐝 **Maximizing Pollination:** Avoid spraying during bloom and place beehives near the crop.
        🍇 **Securing the Harvest:** Maintain irrigation and check plants to prevent pests.

        ### STYLE RULES ###
        - Use very simple and direct language. Imagine you are talking to someone in the field, not in a laboratory.
        - **DO NOT** use technical jargon like "NDVI", "phenology" or "spectral analysis".
        - **DO NOT** mention that you are an AI or language model.
        - Be concise and get to the point.
        """
    else:
        prompt = f"""
        ### ROL Y OBJETIVO ###
        Actúa como un Ingeniero Agrónomo y asesor de campo experto, con años de experiencia trabajando directamente con agricultores en la región de Nuevo León. Tu objetivo es traducir datos satelitales complejos en un plan de acción simple, práctico y amigable.

        ### CONTEXTO DEL PRONÓSTICO ###
        Basado en nuestro análisis de datos de la NASA, hemos generado el siguiente pronóstico para el cultivo de **'{crop}'** en la región de **'{municipality}'**:
        - **Pico de Floración Estimado:** {peak_date}
        - **Inicio de Cosecha Estimado:** {harvest_date}

        ### TAREA: TU PLAN DE ACCIÓN ###
        Genera SOLO 3 recomendaciones principales, una para cada etapa, en formato de lista. Cada recomendación debe tener:
        - Un emoji al inicio (🚜, 🐝, 🍇)
        - Un título breve y claro (en negritas)
        - Un solo consejo práctico, concreto y directo (máximo 2 líneas)
        - No agregues introducción ni conclusión, solo la lista de recomendaciones.

        Ejemplo de formato:
        🚜 **Preparando el Terreno:** Riega de forma constante y aplica fertilizante rico en fósforo antes de la floración.
        🐝 **Maximizando la Polinización:** Evita fumigar durante la floración y coloca colmenas cerca del cultivo.
        🍇 **Asegurando la Cosecha:** Mantén el riego y revisa las plantas para prevenir plagas.

        ### REGLAS DE ESTILO ###
        - Usa un lenguaje muy sencillo y directo. Piensa que le hablas a alguien en el campo, no en un laboratorio.
        - **NO** uses jerga técnica como "NDVI", "fenología" o "análisis espectral".
        - **NO** menciones que eres una inteligencia artificial o un modelo de lenguaje.
        - Sé conciso y ve al grano.
        """

    try:
        response = model.generate_content(prompt)
        text = response.text

        # Parsear la respuesta en formato: emoji **Título:** texto
        import re
        pattern = r"([\U0001F300-\U0001FAFF\u2600-\u26FF\u2700-\u27BF])\s*\*\*(.*?)\*\*:\s*(.*)"
        matches = re.findall(pattern, text)
        recommendations = []
        for icon, title, body in matches:
            recommendations.append({
                "icon": icon,
                "title": title.strip(),
                "text": body.strip()
            })
        # Si no se pudo parsear, devolver todo como un solo mensaje
        if not recommendations:
            recommendations = [{
                "icon": "💡",
                "title": "Recomendación",
                "text": text.strip()
            }]
        return {
            "recommendations": recommendations
        }
    except Exception as e:
        print(f"Error al llamar a la API de Gemini: {e}")
        return {
            "error": f"Hubo un problema al generar la recomendación: {str(e)}"
        }