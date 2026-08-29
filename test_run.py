
import sys
import os
import time
# Add current dir to path just in case
sys.path.append(os.getcwd())

from story_server import procesar_iteracion_capitulo, loop_trabajo_narrativo

print("Starting DIRECT manual run...", flush=True)

# Test 1: Try running the core logic function directly for chapter 1
try:
    print("Directly calling procesar_iteracion_capitulo(1)...", flush=True)
    # We need to make sure loop_trabajo_narrativo logic variables are okay?
    # No, procesar_iteracion_capitulo is self contained.
    
    res = procesar_iteracion_capitulo(2)
    print(f"Direct call result: {res}", flush=True)
except Exception as e:
    print(f"Direct call FAILED: {e}", flush=True)
    import traceback
    traceback.print_exc()

print("Manual run finished.", flush=True)
