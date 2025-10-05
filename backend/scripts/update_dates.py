import json
from collections import defaultdict
from datetime import datetime
import os

# Paths
INPUT_PATH = os.path.join('..', 'data', 'agro_data.json')
OUTPUT_PATH = os.path.join('..', 'data', 'agro_data_2.json')

# Cargar datos
with open(INPUT_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Calcular promedios de fechas por cultivo usando datos "predicted"
peak_dates = defaultdict(list)
harvest_dates = defaultdict(list)

for feature in data['features']:
    props = feature['properties']
    crops = props.get('top_crops', [])
    ts = props.get('time_series', [])
    for entry in ts:
        if entry.get('type') == 'predicted':
            date = entry.get('date')
            status = entry.get('status')
            if status == 'peak_bloom':
                for crop in crops:
                    peak_dates[crop].append(date)
            elif status == 'fruiting':
                for crop in crops:
                    harvest_dates[crop].append(date)

# Función para obtener la fecha más común o una por defecto
def get_best_date(dates, default):
    if not dates:
        return default
    return max(set(dates), key=dates.count)

# Fechas por defecto si no hay datos
default_peak = "2026-04-16"
default_harvest = "2026-10-18"

# Actualizar fechas en cada municipio
for feature in data['features']:
    props = feature['properties']
    crops = props.get('top_crops', [])
    ts = props.get('time_series', [])
    peak = None
    harvest = None
    for entry in ts:
        if entry.get('type') == 'predicted':
            if entry.get('status') == 'peak_bloom':
                peak = entry.get('date')
            elif entry.get('status') == 'fruiting':
                harvest = entry.get('date')
    if not peak and crops:
        peak = get_best_date(peak_dates[crops[0]], default_peak)
    if not harvest and crops:
        harvest = get_best_date(harvest_dates[crops[0]], default_harvest)
    props['predicted_peak_date'] = peak
    props['predicted_harvest_date'] = harvest

# Guardar archivo actualizado
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fechas actualizadas correctamente. Archivo guardado en agro_data_2.json.")
