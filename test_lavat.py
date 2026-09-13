import os
import sys
import asyncio
import edge_tts
import torch
import subprocess
from rvc_python.infer import RVCInference

BASE_VOICE = "es-ES-AlvaroNeural"
MODEL_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.pth"
INDEX_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.index"
FFMPEG = r"C:\Program Files\kineforge\resources\bin\ffmpeg.exe"

TEMP_INPUT = r"c:\Users\sanch\OneDrive\Escritorio\Extramuros\Version Nueva\capitulos\cap_01\temp_input.wav"
TEMP_OUTPUT = r"c:\Users\sanch\OneDrive\Escritorio\Extramuros\Version Nueva\capitulos\cap_01\temp_output.wav"
FINAL_MP3 = r"c:\Users\sanch\OneDrive\Escritorio\Extramuros\Version Nueva\capitulos\cap_01\Audio_Cap_01_JoseLavat.mp3"

sample_text = """Capítulo 1: La Desaparición.
La carpeta del expediente pesaba apenas ciento cincuenta gramos. Demasiado poco para contener la desaparición de la única persona que le quedaba en el mundo.
Leo la dejó caer sobre el escritorio. Eran las tres y catorce de la madrugada."""

async def generate():
    print("[1/3] Generando locución base...")
    communicate = edge_tts.Communicate(sample_text, BASE_VOICE)
    await communicate.save(TEMP_INPUT)
    print("[2/3] Aplicando modelo RVC de José Lavat...")
    rvc = RVCInference(device="cpu")
    rvc.load_model(MODEL_PATH, index_path=INDEX_PATH if os.path.exists(INDEX_PATH) else "")
    rvc.set_params(f0up_key=-4, f0method="pm", index_rate=0.5, protect=0.33)
    rvc.infer_file(TEMP_INPUT, TEMP_OUTPUT)
    
    print("[3/3] Convirtiendo a MP3...")
    subprocess.run([FFMPEG, "-y", "-i", TEMP_OUTPUT, "-b:a", "192k", FINAL_MP3], check=True)
    print("[LISTO] Archivo final generado:", FINAL_MP3)

asyncio.run(generate())
