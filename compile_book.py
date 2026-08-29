import os
import re
import datetime

# Config
source_dir = r"c:\Users\javie\Desktop\Automatizar_Historias\capitulos_best-seller"
output_file = r"c:\Users\javie\Desktop\Automatizar_Historias\Libro_Best-seller.md"
cover_image = r"Portadas/Portada_Frontal.jpg"
year = datetime.datetime.now().year

# Front Matter & Header
# Digital Structure: Cover -> Title/Copyright -> TOC -> Content
header = f"""---
title: "EXTRAMUROS"
author: "J.S. NOVAR"
language: "es"
description: "Thriller de supervivencia en un mundo de biología titánica."
toc: true
---

![Portada]({cover_image})

<div style="page-break-after: always;"></div>
\\newpage

# EXTRAMUROS

**J.S. NOVAR**

Copyright © {year} J.S. NOVAR
Todos los derechos reservados.

Esta es una obra de ficción. Los nombres, personajes, lugares e incidentes son producto de la imaginación del autor o se utilizan de manera ficticia. Cualquier semejanza con personas reales, vivas o muertas, eventos o lugares es pura coincidencia.

<div style="page-break-after: always;"></div>
\\newpage

"""

def get_chapter_number(filename):
    match = re.search(r"cap_(\d+)\.md", filename)
    if match:
        return int(match.group(1))
    return 0

def compile_book():
    files = [f for f in os.listdir(source_dir) if f.startswith("cap_") and f.endswith(".md")]
    files.sort(key=get_chapter_number)
    
    with open(output_file, "w", encoding="utf-8") as outfile:
        # Write Front Matter
        outfile.write(header)
        
        # Loop through chapters
        for i, filename in enumerate(files):
            path = os.path.join(source_dir, filename)
            with open(path, "r", encoding="utf-8-sig") as infile:
                content = infile.read()
                
                # Strip YAML frontmatter from individual chapters if present to avoid broken formatting
                content = re.sub(r'^---\n(.*?)\n---\n', '', content, flags=re.DOTALL)
                
                outfile.write(content.strip())
                outfile.write("\n\n") 
                
                # Add page break between chapters (except after the last one)
                if i < len(files) - 1:
                    outfile.write("\n<div style=\"page-break-after: always;\"></div>\n\\newpage\n\n")
    
    print(f"Compiled {len(files)} chapters to {output_file} with Digital structure.")

if __name__ == "__main__":
    compile_book()
