---
description: Vas a proporcionar los comandos disponibles para solicitar al MCP. Tienes disponible los comandos existentes
---

Muestra INMEDIATAMENTE y sin añadir texto extra esta hoja de referencia de comandos para el script `story_server.py`:

## 🎮 PANEL DE CONTROL (Cheat Sheet)

### 1. ✍️ GENERACIÓN AUTOMÁTICA (MCP)
* **`loop_trabajo_narrativo(iteraciones=1, inicio_capitulo=X)`**
    * *Uso:* Escribe el capítulo X usando el script automáticamente.
    * *Ejemplo:* `loop_trabajo_narrativo(iteraciones=1, inicio_capitulo=5)`

### 2. 🔄 SINCRONIZACIÓN (Vital tras escribir a mano)
* **`generar_metadata_desde_capitulo(num_cap=X)`**
    * *Uso:* Lee el archivo .md que he escrito/editado a mano y actualiza la memoria del sistema.
    * *Ejemplo:* `generar_metadata_desde_capitulo(num_cap=5)`

### 3. 🧠 MANTENIMIENTO
* **Actualizar Contexto:** "Actualiza el archivo contexto/historia.md con [Nuevas reglas...]"