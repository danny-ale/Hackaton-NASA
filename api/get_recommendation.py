import json
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../utils'))
from gemini_client import get_recommendation_from_gemini

def handler(request):
    if request.method != "POST":
        return (json.dumps({"error": "Método no permitido"}), 405, {"Content-Type": "application/json"})
    try:
        request_data = request.json()
    except Exception:
        return (json.dumps({"error": "No se recibieron datos en la petición."}), 400, {"Content-Type": "application/json"})
    if not request_data:
        return (json.dumps({"error": "No se recibieron datos en la petición."}), 400, {"Content-Type": "application/json"})
    gemini_response = get_recommendation_from_gemini(request_data)
    if "error" in gemini_response:
        return (json.dumps(gemini_response), 500, {"Content-Type": "application/json"})
    return (json.dumps(gemini_response), 200, {"Content-Type": "application/json"})
