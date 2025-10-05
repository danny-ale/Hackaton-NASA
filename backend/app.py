# app.py

import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.gemini_client import get_recommendation_from_gemini

app = Flask(__name__)
CORS(app) 


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

    gemini_response = get_recommendation_from_gemini(request_data)

    if "error" in gemini_response:
        return jsonify(gemini_response), 500
    
    return jsonify(gemini_response)


if __name__ == '__main__':
    app.run(debug=True)