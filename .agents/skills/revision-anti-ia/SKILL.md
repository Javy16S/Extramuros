---
name: revision-anti-ia
description: Revisión y corrección de estilo (line editing) de capítulos de EXTRAMUROS para eliminar los vicios de la prosa generada por IA - falsos contrastes, adjetivos en cadena, símiles en serie, gerundios, acotaciones enfáticas, palabras comodín, muletillas, cultismos y rupturas de la Ley 6 - con un analizador automático. Úsala al terminar cualquier borrador, cuando el autor pida "revisa", "pule", "corrige el estilo", "suena a IA" o "pásale el filtro", y antes de dar un capítulo por cerrado.
---

# Revisión anti-IA

La prosa generada tiene huellas reconocibles: suena «escrita» en vez de contada. El lector juvenil no sabrá nombrarlas, pero las nota como cansancio. Esta skill las detecta con un script y las corrige con criterio, sin aplanar la voz del autor.

## 1. Paso automático: el analizador
```
python .agents/skills/revision-anti-ia/scripts/analizar_prosa.py <capitulo.md> --prohibidos "<términos Ley 6>"
```
- `--prohibidos`: términos que Leo aún no conoce en ese punto (consúltalo en `contexto/registro_conocimiento.md`). Ej. para el Bloque 1: `"Extramuros,Flujo,Caudal,Quietud,Clase,Segadores,Omega,Puerto Raíz,Bastión,Wayra,Contención"`.
- `--json` para guardar el informe y comparar antes/después.
- El script **señala**, no decide. Un falso positivo se ignora; un patrón repetido se corrige.

Objetivos de referencia (los imprime el propio informe):
| Métrica | Objetivo |
|---|---|
| Media de palabras por frase | 11–17 (acción 6–12) |
| Frases de más de 30 palabras | < 8 % |
| Símiles por 1.000 palabras | ≤ 4 |
| Gerundios por 1.000 palabras | ≤ 6 |
| Palabras en cuarentena | ≤ 1 cada 4.000 |
| Enumeraciones triples por 1.000 | ≤ 1,5 |
| Adjetivos comodín (familia) | ≤ 1,5 por 1.000 |
| Falsos contrastes, plantilla fisiológica, muletillas IA | 0–2 por capítulo |

**Referencia real:** el capítulo 1 tal como está da 10,3 gerundios/1.000, 15,9 palabras en cuarentena por 4.000 (17 casos: *obsidiana* ×3, *quirúrgico/a* ×2, *atronador* ×2, *fulminante* ×2…), la familia *seco/seca/sequedad* 10 veces, 10 muletillas IA (*Y entonces* ×2, *una fracción de segundo* ×2, *Demasiado tarde*…), 3 falsos contrastes y 9 acotaciones enfáticas. Las métricas de ritmo (frase media 14,6; 7,5 % de frases largas) ya están bien: el problema es léxico, no de estructura.

## 2. Revisión manual en cinco pasadas (en este orden)
Corregir palabras de una escena que sobra es tiempo perdido. Por eso, de lo grande a lo pequeño:

1. **Estructura** — ¿sobra alguna escena? ¿hay bloques de trasfondo de más de 150 palabras en mitad de la tensión? ¿el capítulo empieza tarde y acaba con gancho? ¿se rompe la focalización (algo que Leo no puede percibir)?
2. **Escena** — ¿objetivo, conflicto, desenlace? ¿Leo decide algo? ¿hay respiro?
3. **Párrafo** — ¿párrafos de más de 120 palabras? ¿cada uno tiene una función? ¿la última frase de cada párrafo es fuerte o se arrastra?
4. **Frase** — los vicios del catálogo (`references/catalogo_vicios.md`).
5. **Palabra** — comodines, cuarentena, cultismos, repeticiones cercanas.

## 3. Reglas de corrección
- **Conserva lo que funciona.** Las imágenes concretas y propias del autor se quedan (p. ej. «La carpeta del expediente pesaba apenas ciento cincuenta gramos»). No reescribas por reescribir.
- **Cortar antes que sustituir.** La mayoría de adjetivos en cadena se arreglan quitando dos, no cambiándolos.
- **No sobrecorrijas hacia el estilo telegráfico.** Si el capítulo acaba con todas las frases de cinco palabras, has cambiado un vicio por otro. Busca variedad.
- **Una imagen fuerte por párrafo como máximo.**
- **No introduzcas vicios nuevos** al corregir (sustituir «quirúrgico» por «clínico» en todos los casos es el mismo vicio).

## 4. Entrega
1. Texto corregido.
2. Tabla breve de métricas antes/después.
3. Lista de **decisiones que requieren al autor** (cambios de estructura, cortes grandes, posibles dudas de canon). Los cortes de más de un párrafo se proponen, no se ejecutan, salvo que el autor lo haya pedido.

## 5. Mantener las listas
Si el autor detecta una muletilla nueva, añádela a las listas `CUARENTENA`, `MULETILLAS_IA` o `CULTISMOS` del script y a la lista negra de `contexto/estilo.md §III.1`. Las listas del script y de `estilo.md` deben coincidir.
