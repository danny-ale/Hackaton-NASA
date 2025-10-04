from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/pollen_data', methods=['GET'])
def get_pollen_data():
    with open('data/pollen_data.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)