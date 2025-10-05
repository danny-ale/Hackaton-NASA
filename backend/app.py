# app.py

import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.gemini_client import get_recommendation_from_gemini

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "https://nasa-agrobloom.vercel.app"]}}, supports_credentials=True)


@app.route('/api/agro_data', methods=['GET'])
def get_agro_data():
    """
    Endpoint para servir los datos geoespaciales y de predicción al frontend.
    """
    try:
        with open('data/agro_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "El archivo de datos no fue encontrado."}), 404

@app.route('/api/get_recommendation', methods=['POST'])
def handle_recommendation_request():
    request_data = request.get_json()
    if not request_data:
        return jsonify({"error": "No se recibieron datos en la petición."}), 400

    import requests
    try:
        response = requests.post(
            'https://nasa-agrobloom.vercel.app/api/get_recommendation',
            json=request_data,
            timeout=30
        )
        response.raise_for_status()
        gemini_response = response.json()
    except requests.RequestException as e:
        return jsonify({"error": f"Error al conectar con Gemini en Vercel: {str(e)}"}), 500

    if "error" in gemini_response:
        return jsonify(gemini_response), 500
    
    return jsonify(gemini_response)


if __name__ == '__main__':
    app.run(debug=True)