import os
import time
from dotenv import load_dotenv
import google.generativeai as genai

# Reutilizamos la configuracion básica
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

MODELO_ARQUITECTO = "gemini-3-flash-preview"

# Funciones de utilidad copiadas/adaptadas para independencia
def safe_llm(model_name, sys_instruction, user_prompt):
    print(f"[AI] Consultando a {model_name}...")
    try:
        model = genai.GenerativeModel(model_name=model_name, system_instruction=sys_instruction)
        response = model.generate_content(user_prompt)
        if not response.candidates or not response.candidates[0].content.parts:
            # Reintento simple
             time.sleep(5)
             response = model.generate_content(user_prompt)
        return response.text
    except Exception as e:
        return f"ERROR GENERATING CONTENT: {e}"

def guardar(ruta, contenido):
    dirname = os.path.dirname(ruta)
    if dirname: os.makedirs(dirname, exist_ok=True)
    with open(ruta, "w", encoding="utf-8") as f: f.write(contenido)
    print(f"[FILE] Guardado: {ruta}")

def leer(ruta):
    if os.path.exists(ruta):
        with open(ruta, "r", encoding="utf-8") as f: return f.read()
    return ""

def main():
    print("=== INICIANDO EXPANSIÓN CREATIVA (MAGNUM OPUS) ===")
    
    # 1. Cargar Contexto Semilla
    historia_seed = leer("contexto/historia.md")
    roadmap_seed = leer("contexto/roadmap.md")
    
    # --- PROMPT 1: BIBLIA DEL MUNDO ---
    sys_world = "Eres un Worldbuilder de élite para thrillers de alto concepto y fantasía épica."
    prompt_world = f"""
    CONTEXTO SEMILLA:
    {historia_seed}
    
    TAREA:
    Escribe la "BIBLIA DE EXTRAMUROS" (Deep Lore).
    Quiero que desarrolles en profundidad:
    
    1. LA RESERVA: 
       - Geografía detallada (barrios, zonas industriales, el límite físico).
       - Sociedad: ¿Cómo se mantiene la mentira? (Adoctrinamiento sutil, control de información).
       - Anomalías: Pequeñas "fallas" que los habitantes ignoran.
       
    2. LAS RELIQUIAS (La Física de lo Imposible):
       - ¿Qué son realmente? (No digas "magia", busca una explicación pseudo-científica o dimensional).
       - La Pieza de Leo: Propiedades físicas exactas, historia, por qué nadie más la notó.
       
    3. EL GRAN MUNDO (Teaser):
       - ¿Qué hay fuera de la Reserva? Describe la flora/fauna titánica que espera.
       
    FORMATO: Markdown profesional.
    """
    
    biblia = safe_llm(MODELO_ARQUITECTO, sys_world, prompt_world)
    guardar("contexto/biblia_mundo.md", biblia)
    
    # --- PROMPT 2: PERFILES PROFUNDOS ---
    sys_chars = "Eres un Psicólogo de Personajes y Novelista Literario."
    prompt_chars = f"""
    CONTEXTO SEMILLA:
    {historia_seed}
    
    TAREA:
    Escribe el "DOSSIER DE PERSONAJES PROFUNDO".
    
    1. LEO:
       - Análisis Psicológico: Su obsesión con el orden como mecanismo de defensa.
       - La Voz Interna: ¿Cómo piensa? ¿Cómo racionaliza lo irracional?
       - El Arco: De "Observador Pasivo" a "Explorador de lo Desconocido".
       
    2. ELENA (La Ausencia Presente):
       - ¿Quién era realmente? ¿Qué sabía ella que Leo no?
       
    3. EL ANTAGONISTA / LA FUERZA OPOSITORA:
       - No un "villano de risa", sino quien mantiene la Reserva funcionando (El Inspector Garrido o alguien superior).
       - Motivación: ¿Por qué creen que "protegen" a la gente?
       
    FORMATO: Markdown detallado.
    """
    
    perfiles = safe_llm(MODELO_ARQUITECTO, sys_chars, prompt_chars)
    guardar("contexto/perfiles_profundos.md", perfiles)
    
    # --- PROMPT 3: ROADMAP DETALLADO (12-16 CAPS) ---
    sys_plot = "Eres un Maestro de Estructura Narrativa (Best Seller Thriller)."
    prompt_plot = f"""
    CONTEXTO SEMILLA:
    {roadmap_seed}
    
    TAREA:
    Expande el esquema de 4 partes en unÍNDICE DE NOVELA DE 14 CAPÍTULOS.
    
    ESTRUCTURA REQUERIDA:
    
    PARTE I: EL ÁNGULO MUERTO (Caps 1-4)
    - Tono: Thriller psicológico. La investigación en la ciudad.
    - Final de Parte I: Leo encuentra la prueba irrefutable de que el mundo es falso.
    
    PARTE II: LA FRONTERA (Caps 5-8)
    - Tono: Tecno-Thriller / Fuga.
    - Leo intenta llegar al límite de la Reserva. Persecución por las "Autoridades".
    - Final de Parte II: Leo cruza el Muro.
    
    PARTE III: TIERRA DE GIGANTES (Caps 9-11)
    - Tono: Survival Horror / Maravilla.
    - Supervivencia en el ecosistema exterior.
    
    PARTE IV: LA VERDAD (Caps 12-14)
    - Revelación final sobre qué es la Reserva y el destino de Elena.
    
    Para cada capítulo: Título Provisional y Sinopsis de un párrafo.
    """
    
    roadmap_full = safe_llm(MODELO_ARQUITECTO, sys_plot, prompt_plot)
    guardar("contexto/roadmap_detallado.md", roadmap_full)

    print("=== EXPANSIÓN COMPLETADA ===")

if __name__ == "__main__":
    main()
