# generate_crop_catalog.py

import pandas as pd
import os
import json

# --- 1. CONFIGURACIÓN ---
# ¡IMPORTANTE! Asegúrate de que esta ruta apunte a tu carpeta de Descargas.
# Reemplaza 'tu_usuario' con tu nombre de usuario de Mac.
DOWNLOADS_PATH = '/Users/josedejesus/Downloads'

# Nombres de los archivos CSV que vamos a procesar
FILENAMES = [
    'Cierre_agricola_mun_2022.csv',
    'Cierre_agricola_mun_2023.csv',
    'Cierre_agricola_mun_2024.csv' # Asumiendo que ya tienes el de 2024
]

# Ruta donde se guardará el resultado final
OUTPUT_PATH = 'data/crop_catalog.json'

# --- 2. LECTURA Y COMBINACIÓN DE DATOS ---

# Lista para guardar los datos de cada año
all_data = []

print("Leyendo archivos CSV...")
for filename in FILENAMES:
    file_path = os.path.join(DOWNLOADS_PATH, filename)
    try:
        # Intentamos leer el archivo. A veces los CSV de gobierno usan 'latin1'
        df = pd.read_csv(file_path, encoding='latin1')
        all_data.append(df)
        print(f"  - Archivo '{filename}' leído correctamente.")
    except FileNotFoundError:
        print(f"  - AVISO: El archivo '{filename}' no fue encontrado. Se omitirá.")
    except Exception as e:
        print(f"  - ERROR al leer '{filename}': {e}")

# Combinamos los datos de todos los años en un solo DataFrame
if not all_data:
    print("No se encontraron datos para procesar. Saliendo del script.")
    exit()

combined_df = pd.concat(all_data, ignore_index=True)
print("Datos de todos los años combinados.")

# --- 3. PROCESAMIENTO Y ANÁLISIS ---

# Filtramos para quedarnos solo con los datos de Nuevo León
nl_df = combined_df[combined_df['Nomestado'] == 'Nuevo León'].copy()
print("Filtrando datos para Nuevo León...")

# Nos aseguramos de que 'Sembrada' sea un número, convirtiendo errores a NaN y luego a 0
nl_df['Sembrada'] = pd.to_numeric(nl_df['Sembrada'], errors='coerce').fillna(0)

# Agrupamos por municipio y cultivo para sumar las hectáreas sembradas en los 3 años
crop_totals = nl_df.groupby(['Nommunicipio', 'Nomcultivo'])['Sembrada'].sum().reset_index()
print("Calculando los cultivos más importantes por municipio...")

# Para cada municipio, encontramos los 3 cultivos con más hectáreas
top_crops_per_municipality = crop_totals.groupby('Nommunicipio').apply(
    lambda x: x.nlargest(3, 'Sembrada')
).reset_index(drop=True)

# --- 4. CREACIÓN DEL DICCIONARIO FINAL ---

crop_catalog = {}
for municipio, group in top_crops_per_municipality.groupby('Nommunicipio'):
    # Obtenemos la lista de los nombres de cultivo y la guardamos en el diccionario
    crop_catalog[municipio] = group['Nomcultivo'].tolist()

print("Catálogo de cultivos generado.")

# --- 5. GUARDADO DEL ARCHIVO JSON ---

# Creamos la carpeta 'backend/data' si no existe
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# Guardamos el diccionario en un archivo JSON bien formateado
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(crop_catalog, f, ensure_ascii=False, indent=4)

print(f"\n¡Éxito! El archivo '{OUTPUT_PATH}' ha sido creado.")
print("Ya puedes usar este archivo en tu API de Flask.")