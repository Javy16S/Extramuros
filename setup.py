import os

# Estructura de carpetas y archivos
structure = {
    "output": {},
    "contexto": {
        "historia.md": "# BIBLIA DE LA HISTORIA\n\n## SINOPSIS\n[Escribe aquí tu resumen...]",
        "personajes.md": "# FICHAS DE PERSONAJES\n\n## PROTAGONISTA\n- Nombre: ...\n- Voz: ...",
        "estilo.md": "# GUÍA DE ESTILO\n\n- Tono: Oscuro y adulto.\n- Narrador: 3ª persona."
    },
    "roadmap.md": "# ROADMAP\n\n- [ ] Capítulo 01\n- [ ] Capítulo 02",
    ".env": "GEMINI_API_KEY=PEGA_TU_CLAVE_AQUI"
}

def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Creado: {path}")

if __name__ == "__main__":
    create_structure(".", structure)
    print("\n🚀 ¡Todo listo! Rellena los .md y ejecuta main.py")