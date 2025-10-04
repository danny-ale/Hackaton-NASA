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

    prompt = f"""
    Actúa como un experto agrónomo para un agricultor en Nuevo León.
    
    Basado en nuestro análisis de datos satelitales de la NASA, hemos generado el siguiente pronóstico para el cultivo de '{crop}' en la región de '{municipality}':
    - Pico de Floración Estimado: {peak_date}
    - Inicio de Cosecha Estimado: {harvest_date}

    Por favor, genera un plan de acción práctico y conciso dividido en tres fases clave:
    1.  **Pre-Floración:** ¿Qué hacer ahora para prepararse?
    2.  **Polinización:** Consejos para la semana del pico de floración.
    3.  **Post-Floración:** Cuidados para asegurar el fruto hasta la cosecha.

    Usa un lenguaje claro, directo y amigable para el agricultor.
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