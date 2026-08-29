import os
import re

base_path = r"c:\Users\javie\Desktop\Automatizar_Historias\info_capitulos"
output_file = r"c:\Users\javie\Desktop\Automatizar_Historias\Info_todos_capitulos.txt"

def numerical_sort(value):
    numbers = re.compile(r'(\d+)')
    parts = numbers.split(value)
    parts[1::2] = map(int, parts[1::2])
    return parts

try:
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Get all items in directory
        items = os.listdir(base_path)
        # Filter for directories starting with cap_
        cap_dirs = [d for d in items if os.path.isdir(os.path.join(base_path, d)) and d.startswith('cap_')]
        # Sort numerically
        cap_dirs.sort(key=numerical_sort)

        for cap_dir in cap_dirs:
            outfile.write(f"\n{'='*50}\n")
            outfile.write(f"CAPITULO: {cap_dir}\n")
            outfile.write(f"{'='*50}\n\n")
            
            cap_path = os.path.join(base_path, cap_dir)
            files = os.listdir(cap_path)
            # Sort files alphabetically or by some logic? Alphabetical is fine.
            files.sort()
            
            for filename in files:
                file_path = os.path.join(cap_path, filename)
                if os.path.isfile(file_path):
                    outfile.write(f"--- Archivo: {filename} ---\n")
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"[Error leyendo archivo: {e}]")
                    outfile.write("\n\n")
                    
    print(f"Successfully created {output_file}")

except Exception as e:
    print(f"An error occurred: {e}")
