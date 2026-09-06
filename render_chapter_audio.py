import os
import sys
import asyncio
import edge_tts
import torch
import subprocess
import argparse
from rvc_python.infer import RVCInference

BASE_VOICE = "es-ES-AlvaroNeural"
MODEL_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.pth"
INDEX_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.index"
FFMPEG = r"C:\Program Files\kineforge\resources\bin\ffmpeg.exe"

def clean_text_for_tts(raw_text):
    lines = []
    for line in raw_text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        # Replace markdown formatting
        line = line.replace("*", "").replace("—", ", ").replace(">", "")
        lines.append(line)
    return " \n".join(lines)

async def process_chapter(chapter_num):
    cap_str = f"cap_{int(chapter_num):02d}"
    cap_dir = os.path.join(r"c:\Users\sanch\OneDrive\Escritorio\Extramuros\Version Nueva\capitulos", cap_str)
    text_file = os.path.join(cap_dir, f"{cap_str}.txt")
    
    if not os.path.exists(text_file):
        print(f"[ERROR] No se encuentra {text_file}")
        return

    with open(text_file, "r", encoding="utf-8") as f:
        raw_text = f.read()

    cleaned = clean_text_for_tts(raw_text)
    
    temp_wav_in = os.path.join(cap_dir, f"temp_{cap_str}_base.wav")
    temp_wav_out = os.path.join(cap_dir, f"temp_{cap_str}_lavat.wav")
    final_mp3 = os.path.join(cap_dir, f"Audio_{cap_str.upper()}_JoseLavat.mp3")
    
    print(f"[*] [1/3] Generando locución base con Edge-TTS para {cap_str}...")
    communicate = edge_tts.Communicate(cleaned, BASE_VOICE)
    await communicate.save(temp_wav_in)
    
    print(f"[*] [2/3] Aplicando modelo RVC de José Lavat a {cap_str}...")
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    rvc = RVCInference(device=device)
    rvc.load_model(MODEL_PATH, index_path=INDEX_PATH if os.path.exists(INDEX_PATH) else "")
    rvc.set_params(f0up_key=-4, f0method="pm", index_rate=0.5, protect=0.33)
    rvc.infer_file(temp_wav_in, temp_wav_out)
    
    print(f"[*] [3/3] Exportando a MP3 de alta calidad (192k)...")
    subprocess.run([FFMPEG, "-y", "-i", temp_wav_out, "-b:a", "192k", final_mp3], check=True)
    
    # Limpieza de temporales
    for temp in [temp_wav_in, temp_wav_out]:
        if os.path.exists(temp):
            try:
                os.remove(temp)
            except:
                pass
                
    print(f"\n[ÉXITO] Audiolibro de José Lavat guardado en:\n{final_mp3}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--capitulo", type=int, default=1, help="Número de capítulo a procesar")
    args = parser.parse_args()
    
    asyncio.run(process_chapter(args.capitulo))
