import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("La API Key de Gemini no está configurada en el archivo .env")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"Error al inicializar el modelo de Gemini: {e}")
    model = None

def get_recommendation_from_gemini(data):

    if not model:
        return {"error": "El modelo de Gemini no pudo ser inicializado. Revisa la configuración y la API Key."}

    # Extraer los datos relevantes del frontend
    crop = data.get('crop')
    municipality = data.get('municipality')
    peak_date = data.get('peak_date')
    harvest_date = data.get('harvest_date')

# Este es el nuevo string para la variable 'prompt' en tu función

    prompt = f"""
    ### ROL Y OBJETIVO ###
    Actúa como un Ingeniero Agrónomo y asesor de campo experto, con años de experiencia trabajando directamente con agricultores en la región de Nuevo León. Tu objetivo es traducir datos satelitales complejos en un plan de acción simple, práctico y amigable.

    ### CONTEXTO DEL PRONÓSTICO ###
    Basado en nuestro análisis de datos de la NASA, hemos generado el siguiente pronóstico para el cultivo de **'{crop}'** en la región de **'{municipality}'**:
    - **Pico de Floración Estimado:** {peak_date}
    - **Inicio de Cosecha Estimado:** {harvest_date}

    ### TAREA: TU PLAN DE ACCIÓN ###
    Genera un **"Plan de Acción Rápido"** para el agricultor. El plan debe ser fácil de leer y muy práctico. Divídelo **EXACTAMENTE** en las siguientes tres secciones, usando títulos en negritas y emojis:

    **1. 🚜 Preparando el Terreno (Pre-Floración):**
    (Aquí dame 2-3 consejos claros sobre preparación, riego y nutrientes en las semanas previas a la fecha pico de floración).

    **2. 🐝 Maximizando la Polinización (Durante la Floración):**
    (Aquí dame 2-3 consejos cruciales para la semana del pico, enfocados en la gestión de polinizadores como abejas y la protección de las flores de riesgos como heladas tardías).

    **3. 🍇 Asegurando la Cosecha (Post-Floración):**
    (Aquí dame 2-3 consejos sobre los cuidados post-floración para asegurar que el fruto se desarrolle bien y llegue sano a la cosecha).

    ### REGLAS DE ESTILO ###
    - Usa un lenguaje muy sencillo y directo. Piensa que le hablas a alguien en el campo, no en un laboratorio.
    - **NO** uses jerga técnica como "NDVI", "fenología" o "análisis espectral".
    - **NO** menciones que eres una inteligencia artificial o un modelo de lenguaje.
    - Sé conciso y ve al grano.
    """

    try:
        response = model.generate_content(prompt)
        return {
            "recommendation": response.text
        }
    except Exception as e:
        print(f"Error al llamar a la API de Gemini: {e}")
        return {
            "error": f"Hubo un problema al generar la recomendación: {str(e)}"
        }