import json

def handler(request):
    if request.method != "GET":
        return (json.dumps({"error": "Método no permitido"}), 405, {"Content-Type": "application/json"})
    try:
        with open("../data/agro_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return (json.dumps(data), 200, {"Content-Type": "application/json"})
    except FileNotFoundError:
        return (json.dumps({"error": "El archivo de datos no fue encontrado."}), 404, {"Content-Type": "application/json"})
