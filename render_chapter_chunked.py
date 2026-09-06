import os
import sys
import asyncio
import edge_tts
import torch
import subprocess
import argparse
import re
from rvc_python.infer import RVCInference

BASE_VOICE = "es-ES-AlvaroNeural"
MODEL_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.pth"
INDEX_PATH = r"C:\Users\sanch\AppData\Roaming\kineforge\Engine\models\rvc\JoseLavat.index"
FFMPEG = r"C:\Program Files\kineforge\resources\bin\ffmpeg.exe"

def split_text_into_chunks(text, max_chars=400):
    paragraphs = [p.strip() for p in text.split("\n") if p.strip() and not p.strip().startswith("#")]
    chunks = []
    current_chunk = ""
    
    for p in paragraphs:
        # Clean formatting
        clean_p = p.replace("*", "").replace("—", ", ").replace(">", "").strip()
        if not clean_p:
            continue
            
        sentences = re.split(r'(?<=[.!?])\s+', clean_p)
        for s in sentences:
            s = s.strip()
            if not s:
                continue
            if len(current_chunk) + len(s) + 1 <= max_chars:
                current_chunk = (current_chunk + " " + s).strip()
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = s
                
    if current_chunk:
        chunks.append(current_chunk)
        
    return chunks

async def render_chapter(chapter_num):
    cap_str = f"cap_{int(chapter_num):02d}"
    cap_dir = os.path.join(r"c:\Users\sanch\OneDrive\Escritorio\Extramuros\Version Nueva\capitulos", cap_str)
    text_file = os.path.join(cap_dir, f"{cap_str}.txt")
    temp_dir = os.path.join(cap_dir, "temp_chunks")
    os.makedirs(temp_dir, exist_ok=True)
    
    final_mp3 = os.path.join(cap_dir, f"Audio_{cap_str.upper()}_JoseLavat.mp3")
    
    if not os.path.exists(text_file):
        print(f"[ERROR] No se encuentra {text_file}")
        return

    with open(text_file, "r", encoding="utf-8") as f:
        raw_text = f.read()

    chunks = split_text_into_chunks(raw_text)
    total_chunks = len(chunks)
    print(f"[*] Procesando {cap_str} en {total_chunks} fragmentos optimizados...")

    # Initialize RVC once
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    print(f"[*] Cargando modelo RVC de José Lavat en {device}...")
    rvc = RVCInference(device=device)
    rvc.load_model(MODEL_PATH, index_path=INDEX_PATH if os.path.exists(INDEX_PATH) else "")
    rvc.set_params(f0up_key=-4, f0method="pm", index_rate=0.5, protect=0.33)

    converted_files = []
    
    for i, chunk in enumerate(chunks):
        chunk_id = f"{i+1:03d}"
        tts_wav = os.path.join(temp_dir, f"tts_{chunk_id}.wav")
        rvc_wav = os.path.join(temp_dir, f"rvc_{chunk_id}.wav")
        
        print(f"[{i+1}/{total_chunks}] Sintetizando y convirtiendo fragmento {chunk_id}...")
        
        # 1. Edge-TTS
        communicate = edge_tts.Communicate(chunk, BASE_VOICE)
        await communicate.save(tts_wav)
        
        # 2. RVC
        try:
            rvc.infer_file(tts_wav, rvc_wav)
            if os.path.exists(rvc_wav):
                converted_files.append(rvc_wav)
        except Exception as e:
            print(f"[Aviso] Error en RVC fragmento {chunk_id}: {e}")
            converted_files.append(tts_wav)

    # 3. Concatenate all wavs with ffmpeg concat demuxer
    print(f"[*] Concatenando y masterizando audio final a MP3 (192kbps)...")
    list_txt = os.path.join(temp_dir, "concat_list.txt")
    with open(list_txt, "w", encoding="utf-8") as f:
        for wav_path in converted_files:
            # Escape path for ffmpeg concat
            f.write(f"file '{wav_path.replace(os.sep, '/')}'\n")

    subprocess.run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", list_txt,
        "-c:a", "libmp3lame", "-b:a", "192k", final_mp3
    ], check=True)

    # 4. Clean up temp files
    try:
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)
    except:
        pass

    print(f"\n[ÉXITO TOTAL] ¡Capítulo {chapter_num} renderizado con éxito!")
    print(f"Audio disponible en: {final_mp3}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--capitulo", type=int, default=2)
    args = parser.parse_args()
    asyncio.run(render_chapter(args.capitulo))
