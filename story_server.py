import os
import time
import glob
import sys
import google.generativeai as genai
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

# --- CONFIGURACION INICIAL ---
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 1. FORZAR CODIFICACION UTF-8 (Vital para Windows)
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass 

if not api_key: 
    print("[ERROR CRITICO] Falta GEMINI_API_KEY en .env", file=sys.stderr)
    raise ValueError("Falta GEMINI_API_KEY en .env")

genai.configure(api_key=api_key)

mcp = FastMCP("Narrative_Architect_Ultimate")

# Forzar directorio de trabajo
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# --- CONFIGURACION DE MODELOS (TU SELECCION) ---
MODELO_ARQUITECTO = "gemini-2.5-pro"
MODELO_ESCRITOR = "gemini-2.5-pro" 
OBJETIVO_PALABRAS_TOTAL = 90000 

# --- PERSONALIDADES DE LA IA (NUEVO: CONTROL DE TONO) ---
# Esto evita que el modelo se ponga "Cyberpunk" o use palabras raras.

SYS_ARQUITECTO = """
Eres un Editor Senior de Thriller y Misterio "Grounded" (Realista).
TU OBJETIVO: Estructura lógica, ritmo de investigación, coherencia.
PROHIBIDO: Elementos de ciencia ficción, neones, tecnología futurista o deus ex machina.
"""


SYS_ESCRITOR = """
Eres un Novelista Best-Seller de Misterio Contemporáneo.
ESTILO DE PROSA:
- Natural, invisible y directo.
- Muestra, no cuentes (Show, don't tell).
- PROHIBIDO: Palabras rebuscadas, jerga científica innecesaria o tono cyberpunk.
- PROHIBIDO ESTRICTAMENTE: Términos informáticos o de videojuegos ("renderizado", "glitch", "lag", "NPC", "matriz"). Usa términos físicos u ópticos sin ser demasiado friki.
- AMBIENTACIÓN: Realismo sucio pero contemporáneo (año actual).
"""


# --- FUNCIONES DE SEGURIDAD ---

def safe_llm(model_name, sys_instruction, user_prompt, is_pro_model=False):
    """
    Wrapper blindado. Detecta respuestas vacias (bug preview) y gestiona cuotas.
    """
    max_retries = 3
    
    # GESTION DE TIEMPOS (Pausas preventivas)
    if is_pro_model:
        print(f"      [ESPERA] Pausa de seguridad (35s) para modelo Pro ({model_name})...", file=sys.stderr)
        time.sleep(35)
    else:
        time.sleep(10) # Aumentamos un poco la espera base para el modelo inestable

    print(f"      [API] Consultando a {model_name}...", file=sys.stderr)
    
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel(model_name=model_name, system_instruction=sys_instruction)
            response = model.generate_content(user_prompt)
            
            # --- CORRECCION CRITICA: DETECTOR DE RESPUESTA VACIA ---
            if not response.candidates or not response.candidates[0].content.parts:
                print(f"      [WARNING] La API devolvio respuesta vacia (Bug del modelo Preview).", file=sys.stderr)
                raise ValueError("Respuesta vacia de la API.")
                
            return response.text
            
        except Exception as e:
            error_msg = str(e)
            print(f"      [RETRY] Intento {attempt+1}/{max_retries} fallo: {error_msg}", file=sys.stderr)
            
            # Estrategia de espera exponencial
            if "429" in error_msg or "Quota" in error_msg:
                wait = 60 * (attempt + 1)
                print(f"      [QUOTA] Limite excedido. Esperando {wait}s...", file=sys.stderr)
                time.sleep(wait)
            else:
                # Si es el bug de respuesta vacia, esperamos 15s y probamos de nuevo
                print(f"      [BUG PREVIEW] Reintentando en 15s...", file=sys.stderr)
                time.sleep(15)
            
            # Si fallan todos los intentos
            if attempt == max_retries - 1:
                raise Exception(f"[ERROR FATAL] El modelo {model_name} fallo 3 veces seguidas.")

def leer(ruta):
    if os.path.exists(ruta):
        with open(ruta, "r", encoding="utf-8") as f: return f.read()
    return ""

def guardar(ruta, contenido):
    dirname = os.path.dirname(ruta)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(ruta, "w", encoding="utf-8") as f: f.write(contenido)

def contar_total_palabras():
    total = 0
    for arch in glob.glob("capitulos/*.md"):
        try:
            total += len(leer(arch).split())
        except: pass
    return total

def actualizar_kpis(palabras_cap):
    total = contar_total_palabras()
    porc = (total/OBJETIVO_PALABRAS_TOTAL)*100
    estado = f"""# ESTADO DE LA OBRA
- Fecha: {time.strftime("%Y-%m-%d %H:%M:%S")}
- Objetivo: {OBJETIVO_PALABRAS_TOTAL} palabras.
- Escrito: {total} palabras ({porc:.2f}%)
- Ultimo Cap: {palabras_cap} palabras.
"""
    guardar("progreso_obra.md", estado)

# --- NUEVA HERRAMIENTA: INGENIERÍA INVERSA ---

@mcp.tool()
def generar_metadata_desde_capitulo(num_cap: int) -> str:
    """
    Lee un capítulo YA ESCRITO (manual) y genera sus archivos de info.
    Vital para sincronizar el sistema con correcciones manuales.
    """
    ruta_cap = f"capitulos/cap_{num_cap:02d}.md"
    texto_cap = leer(ruta_cap)
    
    if not texto_cap: return f"Error: No existe {ruta_cap}"

    carp_info = f"info_capitulos/cap_{num_cap:02d}"
    
    print(f"[REVERSE] Analizando Cap {num_cap} para generar memoria del sistema...", file=sys.stderr)

    # 1. Extraer Sucesos
    sucesos = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Analiza este capítulo:\n\n{texto_cap}\n\nExtrae la ESCALETA DE SUCESOS (lista numerada de escenas) que ha ocurrido realmente.")
    guardar(f"{carp_info}/sucesos.md", sucesos)

    # 2. Extraer Personajes
    personajes = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Basado en este texto:\n\n{texto_cap}\n\n¿Qué personajes aparecen? ¿Qué sabemos de ellos AHORA? Actualiza sus perfiles.")
    guardar(f"{carp_info}/personajes.md", personajes)

    # 3. Extraer Tramas
    tramas = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Analiza el texto:\n\n{texto_cap}\n\nIdentifica las tramas abiertas, las pistas sembradas y el estado del misterio.")
    guardar(f"{carp_info}/tramas.md", tramas)

    return f"✅ Metadatos regenerados desde Cap {num_cap}."

# --- NUCLEO POR CAPITULO ---

def procesar_iteracion_capitulo(num_cap):
    carp_info = f"info_capitulos/cap_{num_cap:02d}"
    
    # 1. CARGA DE CONTEXTO
    roadmap = leer("contexto/roadmap.md")
    historia = leer("contexto/historia.md")
    chars_global = leer("contexto/personajes.md")
    
    if not roadmap: 
        raise FileNotFoundError("[ERROR] Falta contexto/roadmap.md")

    prev_context = ""
    if num_cap > 1:
        print(f"      [CONTEXTO] Compilando memoria histórica de Cap 01 a {num_cap-1}...", file=sys.stderr)
        historial_tramas = []
        historial_sucesos = []
        
        for i in range(1, num_cap):
            ruta_tramas = f'info_capitulos/cap_{i:02d}/tramas.md'
            ruta_sucesos = f'info_capitulos/cap_{i:02d}/sucesos.md'
            
            if os.path.exists(ruta_tramas):
                historial_tramas.append(f"--- CAPITULO {i} ---\n{leer(ruta_tramas)}")
            if os.path.exists(ruta_sucesos):
                historial_sucesos.append(f"--- CAPITULO {i} ---\n{leer(ruta_sucesos)}")
                
        prev_context = f"HISTORIAL DE TRAMAS:\n{chr(10).join(historial_tramas)}\n\nHISTORIAL DE SUCESOS:\n{chr(10).join(historial_sucesos)}"

    print(f"\n[PROCESO] CAP {num_cap} - FASE 1: ARQUITECTURA", file=sys.stderr)
    
    # A) MEJORA DE ROADMAP (Usando SYS_ARQUITECTO)
    sinopsis = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Contexto: {historia}\nRoadmap: {roadmap}\nCapitulo: {num_cap}\nContinuidad: {prev_context}\n\nTAREA: Extrae y MEJORA la sinopsis del Cap {num_cap}. Mantén el tono de Misterio.")
    
    # B) ESCALETA
    sucesos = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Premisa aprobada: {sinopsis}\n\nCrea la ESCALETA DE SUCESOS (Beats) detallada, escena por escena.")
    guardar(f"{carp_info}/sucesos.md", sucesos)
    
    # C) PERSONAJES
    personajes = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Lista Maestra: {chars_global}\nSucesos: {sucesos}\n\nQuien sale y cual es su objetivo emocional HOY?")
    guardar(f"{carp_info}/personajes.md", personajes)
    
    # D) TRAMAS
    tramas = safe_llm(MODELO_ARQUITECTO, SYS_ARQUITECTO, 
        f"Sucesos: {sucesos}\n\nReporte de tramas: Activas, Nuevas, Cerradas, Latentes.")
    guardar(f"{carp_info}/tramas.md", tramas)
    
    print(f"\n[PROCESO] CAP {num_cap} - FASE 2: ESCRITURA", file=sys.stderr)
    
    # E) ESCRITURA (Usamos SYS_ESCRITOR para prohibir lenguaje raro)
    estilo = leer("contexto/estilo.md")
    texto = safe_llm(MODELO_ESCRITOR, SYS_ESCRITOR, 
        f"ESTILO: {estilo}\nINPUTS: {personajes}\nESCALETA OBLIGATORIA: {sucesos}\nTRAMAS: {tramas}\n\nEscribe el CAPITULO {num_cap}. Minimo 2000 palabras.", 
        is_pro_model=True)
    
    ruta = f"capitulos/cap_{num_cap:02d}.md"
    guardar(ruta, texto)
    actualizar_kpis(len(texto.split()))
    
    return f"[OK] Cap {num_cap} TERMINADO."

# --- HERRAMIENTA PRINCIPAL ---

@mcp.tool()
def loop_trabajo_narrativo(iteraciones: int = 1, inicio_capitulo: int = 1) -> str:
    """Ejecuta la produccion. Iteraciones = caps a escribir seguidos."""
    if iteraciones > 3: return "[ERROR] Max 3 iteraciones por seguridad."
    
    log = []
    print(f"[INICIO] Arrancando loop para {iteraciones} capitulo(s)...", file=sys.stderr)
    
    for i in range(iteraciones):
        cap_actual = inicio_capitulo + i
        try:
            res = procesar_iteracion_capitulo(cap_actual)
            log.append(res)
            
            if i < iteraciones - 1:
                print("[ESPERA] Enfriando 60s entre capitulos...", file=sys.stderr)
                time.sleep(60)
                
        except Exception as e:
            msg = f"[ERROR FATAL] Fallo en Cap {cap_actual}: {str(e)}"
            print(msg, file=sys.stderr)
            log.append(msg)
            break 
            
    return "\n".join(log)

if __name__ == "__main__":
    mcp.run()