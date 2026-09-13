import os
import sys
import asyncio
import edge_tts
import torch
from rvc_python.infer import RVCInference

# Configuration
BASE_VOICE = "es-ES-AlvaroNeural"  # or "es-MX-JorgeNeural"
MODEL_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.pth"
INDEX_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.index"
OUTPUT_DIR = r"c:\Users\sanch\OneDrive\Escritorio\Extramuros\Version Nueva\capitulos\cap_01"
TEMP_BASE_WAV = os.path.join(OUTPUT_DIR, "temp_base_tts.wav")
FINAL_OUTPUT_MP3 = os.path.join(OUTPUT_DIR, "Audio_Cap_01_JoseLavat.mp3")

TEXT_FILE = os.path.join(OUTPUT_DIR, "cap_01.txt")

async def generate_tts(text, output_file):
    print(f"[*] Generando audio base con Edge-TTS ({BASE_VOICE})...")
    # Clean markdown headers or symbols if needed
    clean_text = text.replace("#", "").replace("*", "").replace("—", ", ").replace(">", "")
    communicate = edge_tts.Communicate(clean_text, BASE_VOICE)
    await communicate.save(output_file)
    print(f"[OK] Audio base guardado en {output_file}")

def apply_rvc(input_wav, output_wav):
    print(f"[*] Aplicando modelo RVC de José Lavat...")
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    print(f"[*] Dispositivo: {device}")
    
    rvc = RVCInference(device=device)
    rvc.load_model(MODEL_PATH, index_path=INDEX_PATH if os.path.exists(INDEX_PATH) else "")
    rvc.set_params(
        f0up_key=-4,          # Pitch shift for deep narrator voice
        f0method="pm",        # Fast and robust on CPU
        index_rate=0.5,
        protect=0.33,
        rms_mix_rate=1.0
    )
    rvc.infer_file(input_wav, output_wav)
    print(f"[OK] Inferencia completada con éxito: {output_wav}")

async def main():
    if not os.path.exists(TEXT_FILE):
        print(f"Error: {TEXT_FILE} no encontrado.")
        return
    
    with open(TEXT_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    # Generate base audio
    await generate_tts(text, TEMP_BASE_WAV)
    
    # Convert with Jose Lavat RVC
    apply_rvc(TEMP_BASE_WAV, FINAL_OUTPUT_MP3)
    
    # Clean temp
    if os.path.exists(TEMP_BASE_WAV):
        try:
            os.remove(TEMP_BASE_WAV)
        except:
            pass
            
    print(f"\n[ÉXITO] Audiolibro de José Lavat generado en:\n{FINAL_OUTPUT_MP3}")

if __name__ == "__main__":
    asyncio.run(main())
