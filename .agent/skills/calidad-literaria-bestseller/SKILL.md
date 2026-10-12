---
name: calidad-literaria-bestseller
description: Auditoría y elevación de calidad literaria a estándar best-seller para EXTRAMUROS. Aplica los principios cuantitativos de The Bestseller Code (Stanford), fórmulas de legibilidad en español (Flesch-Szigriszt / INFLESZ, Fernández-Huerta), teoría de micro-tensión de Donald Maass, control de ecos léxicos en ventana deslizante y cumplimiento estricto de las 6 Leyes Inmutables del canon.
version: 1.1.0
license: MIT
compatibility: Antigravity, Claude Code, Cursor, OpenClaw. Incluye motor algorítmico determinista en Node.js (scripts/auditoria_calidad_bestseller.cjs).
---

# 📚 Calidad Literaria Best-Seller — Extramuros

Esta skill proporciona el marco de auditoría, edición y redacción de más alto rendimiento literario para la novela *Extramuros*. Su metodología descarta consejos abstractos o impresiones subjetivas, operando sobre cuatro pilares analíticos y empíricos:
1. **La estilometría computacional de *The Bestseller Code* (Stanford University - Archer & Jockers)**: vectores de alta agencia verbal, supresión de adjetivación cosmética y eliminación de adverbios modales.
2. **Las fórmulas matemáticas de perspicuidad y legibilidad en español**: Índice de Flesch-Szigriszt (IFSZ canónico con factor 1.0) y escala INFLESZ, complementadas por la Lecturabilidad de Fernández-Huerta.
3. **La dramaturgia de micro-tensión de Donald Maass y Shawn Coyne**: resistencia y fricción en cada párrafo de 50-100 palabras.
4. **Las 6 Leyes Inmutables de la Directiva Prime de *Extramuros***: continuidad biológica, escala masiva, coste fisiológico del Flujo, grounded thriller, caracterización áspera y cero metaconocimiento (Ley 6).

---

## I. LAS CINCO LEYES NARRATIVAS DE CALIDAD BEST-SELLER

### LEY 1: EL MÚSCULO NARRATIVO (DOMINANCIA DE VERBO SOBRE ADJETIVO Y CONTROL DE GERUNDIOS)
* **Principio de Stanford (Archer & Jockers):** Los thrillers comerciales de mayor tracción y retención de lectores avanzan impulsados por **verbos de acción directa y alta agencia**, reduciendo al mínimo los adjetivos puramente decorativos.
* **Prohibición de la Adjetivación Doble de Catálogo:**
  * ❌ *«Avanzó por el sendero pedregoso y oscuro con una respiración agitada y dolorosa.»*
  * ✔ *«Tropezó en el pedregal. El aire le raspó la tráquea; clavó la bota contra la laja y no se detuvo.»*
* **Matriz de Agencia del Protagonista (Idiolecto de Leo Vanes):**
  Leo es un administrativo civil, no un soldado de élite. Sin embargo, su mente analítica y su cuerpo deben manifestar **agencia continua**: calcular distancias, buscar apoyos de palanca, evaluar pesos, sentir la inercia y decidir la siguiente zancada.
  * ❌ *Verbos Estativos / Contemplativos:* permanecer, parecer, notar pasivamente, pensar en el vacío, esperar sin moverse, sentirse abrumado.
  * ✔ *Verbos de Agencia Tangible:* trabar, palpar, afianzar, ceder, fracturar, calcular, deslizar, triturar, arrastrar, encajar.
* **Erradicación del Gerundio Ilícito y Diluyente:**
  * El gerundio de posterioridad (*«tropezó, cayendo al suelo»*) o el encadenamiento de gerundios de simultaneidad imposible (*«corría saltando y sintiendo»*) debilita la fuerza motriz del verbo, convirtiendo la acción en un arrastre subordinado.
  * **Regla Estricta:** Sustituir gerundios por puntos y seguido con verbo en pretérito perfecto simple o por coordinación limpia con *y/pero*.
  * **Umbral Máximo:** **$\le 5.5$ gerundios por cada 1.000 palabras**.

---

### LEY 2: LA MICRO-TENSIÓN CONTINUA (EL TEST DE DONALD MAASS)
* **La Regla del Párrafo Vivo:** La macro-amenaza (la fiera que acecha en la espesura o el misterio de la cabaña) no sostiene la atención por sí sola si la prosa se adormece. Cada párrafo de 50 a 100 palabras debe contener al menos uno de los **cuatro vectores de fricción activa**:
  1. **Fricción Mecánica:** La bota que resbala en el lodo, la articulación rota que no tolera el apoyo, la correa que corta la carne, la madera que se astilla al hacer palanca.
  2. **Fricción Biológica / Sensorial:** El olor a azufre que detona náuseas secas, la pérdida de sensibilidad en las yemas por compresión, la saliva espesa por sed aguda.
  3. **Fricción Cognitiva:** La disonancia entre la experiencia civil previa de Leo (sellos, folios, aranceles aduaneros) y la realidad biológica aplastante del entorno.
  4. **Fricción Temporal:** La necesidad de actuar antes de que un estímulo concluya (el vapor que se disipa, la pisada pesada que se aproxima, el calor que quema la ropa).
* **Prohibición del "Throat-Clearing" (Aclaramiento de Garganta):** Las escenas no arrancan con descripciones meteorológicas estáticas ni divagaciones panorámicas. Arrancan *in media res*: con una contracción muscular, un impacto motriz, una fractura física o una interrupción abrupta.

---

### LEY 3: LA PERSPICUIDAD Y FLUIDEZ EN ESPAÑOL (RANGO INFLESZ Y FERNÁNDEZ-HUERTA)
* El ritmo del texto debe someterse al **Índice de Flesch-Szigriszt (IFSZ)** calibrado para la estructura silábica del español contemporáneo:
  $$\text{IFSZ} = 206.835 - 62.3 \times \left(\frac{S}{P}\right) - \left(\frac{P}{F}\right)$$
  *(donde $S$ es el total de sílabas fonéticas RAE, $P$ el total de palabras y $F$ el total de frases).*
* **Índice Secundario de Contraste (Fernández-Huerta, 1959):**
  $$L = 206.84 - 60 \times \left(\frac{S}{P}\right) - 1.02 \times \left(\frac{P}{F}\right)$$
* **Rangos Objetivo para *Extramuros*:**
  * **$\text{IFSZ} \in [62.0, 74.0]$** (Rango de legibilidad "Bastante fácil / Normal-ágil" en la escala INFLESZ de Barrio Cantalejo).
  * **$L \in [60.0, 75.0]$** (Escala Fernández-Huerta: estilo estándar a ágil de alta comprensibilidad).
* **Mecánica del Ritmo y Burstiness:**
  * **Longitud Media de Frase:** Entre **13 y 17 palabras** por oración.
  * **Arquitectura de la Cadencia:** Alternar frases estacadas de choque (2 a 6 palabras) con periodos dinámicos (8 a 20 palabras) y secuencias complejas de inmersión geológica y espacial (25 a 45 palabras).
  * **Desviación Típica de Longitud ($\sigma$):** $\sigma \ge 9.5$ palabras (garantiza burstiness orgánico no monótono).

---

### LEY 4: ERRADICACIÓN DE ECOS LÉXICOS Y ADVERBIOS EN *-MENTE*
* **Detección Unívoca de Ecos en Ventana de Memoria ($W = 100$ palabras):**
  * Ninguna palabra semántica (excluyendo la lista de stopwords gramaticales de la lengua española), sea monosílaba, bisílaba o polisílaba (*foso, lodo, tiro, muro, laja, turba, pezuña, costra, gravilla, chasquido, tizne*), puede reaparecer a una distancia $d < 100$ palabras, a menos que constituya una anáfora retórica explícita.
  * **Umbral de Aceptación:**
    - Fragmentos cortos ($< 1.000$ palabras): **$0$ ecos detectados**.
    - Capítulos o textos extensos ($P \ge 1.000$ palabras): **Densidad $\le 1.0$ eco por cada 1.000 palabras**.
* **Economía Radical de Adverbios en *-mente*:**
  * **Umbral Estricto:** **$\le 1.0$ adverbio en *-mente* por cada 1.000 palabras** (objetivo óptimo: 0 o máximo 1 por capítulo).
  * *Técnica de reemplazo:* Sustituir el adverbio modal por un verbo con peso motriz o una acción física concreta (*«avanzó lentamente»* $\rightarrow$ *«midió cada paso arrastrando la bota»*).

---

### LEY 5: BLINDAJE INTEGRAL DE LAS 6 LEYES INMUTABLES DE EXTRAMUROS
Todo pasaje debe verificar el cumplimiento ciego del canon:
1. **Ley 1 (Continuidad Fisiológica y Objetos):**
   * El estado corporal de Leo es inmutable. Si su muñeca derecha está quebrada, no puede cerrar el puño, sujetar una lanza ni cargar peso sobre ella. Los objetos en su poder deben coincidir exactamente con el inventario del capítulo anterior.
2. **Ley 2 (Escala Titánica y Proporción Orgánica):**
   * El ecosistema es masivo y prehistórico por hiperoxigenación. Prohibido tratar al protagonista como "humano encogido" y prohibidos los símiles con objetos de la civilización moderna (*"como un camión", "como un rascacielos"*).
3. **Ley 3 (Coste Fisiológico del Flujo):**
   * El Flujo no es magia etérea; es biología extrema y fricción celular. Cualquier despliegue de fuerza o velocidad conlleva desgaste biológico inmediato: hambre hipoglucémica feroz, temblor muscular, taquicardia y vaciado gástrico.
4. **Ley 4 (Grounded Thriller y Show, Don't Tell):**
   * Tono serio, áspero y visceral. Prohibición de términos de informática o videojuegos (*glitch, renderizado, NPC*). Cero abstracciones emocionales: el miedo se narra a través de los tendones, el sudor frío y el aire que quema la garganta.
5. **Ley 5 (Personajes y Presencias):**
   * *Mason:* Veterano letal, áspero y pragmático. Cero condescendencia. Su quietud física genera una pesadez densa en el prado.
   * *Elena:* Convocada exclusivamente mediante flashbacks sensoriales involuntarios (un perfume, un rumor metálico) en momentos límite.
   * *Segadores:* Amenaza clínica y aplastante; figuras que paralizan por su mera presencia.
6. **Ley 6 (Cero Metaconocimiento y Focalización Diegética Estricta):**
   * El narrador y el protagonista solo conocen lo que está presente en su marco sensorial inmediato.
   * **Lista Negra de Términos Prohibidos:** *La Reserva, El Velo de Desfase, Extramuros, El Flujo, Caudal, Quietud, Pozo Muerto, Concordato, Vanguardias, Bestias Clase D/C/B/A/S/Omega*.

---

## II. PROTOCOLO OPERATIVO DE AUDITORÍA Y ELEVACIÓN

Cuando esta skill se invoca sobre un texto existente o para redactar un pasaje nuevo, se sigue un procedimiento de cuatro fases:

```
[FASE 1: DIAGNÓSTICO ALGORÍTMICO]
       │
       ▼ (Ejecutar scripts/auditoria_calidad_bestseller.cjs)
[FASE 2: REFACTORIZACIÓN LÉXICA Y MICRO-TENSIÓN]
       │
       ▼ (Depurar ecos, erradicar gerundios/-mente, inyectar fricción Maass)
[FASE 3: CALIBRACIÓN MÉTRICA INFLESZ]
       │
       ▼ (Ajustar cadencia de frases y longitud media: IFSZ e/ 62 y 74)
[FASE 4: AUDITORÍA DE CANON Y LEY 6]
       │
       ▼ (Verificar cero metaconocimiento y heridas de Leo)
[VEREDICTO: CALIDAD BEST-SELLER APROBADA (Score >= 90)]
```

### 1. Ingesta y Diagnóstico
Ejecutar la herramienta algorítmica local:
```powershell
node scripts/auditoria_calidad_bestseller.cjs <ruta_al_archivo.md>
```
El informe devolverá métricas exactas: IFSZ, Fernández-Huerta, longitud media de frase, desviación típica ($\sigma$), densidad de adverbios en *-mente*, densidad de gerundios, ecos léxicos en ventana de 100 palabras, ratio de verbos de acción y violaciones de la Ley 6.

### 2. Tratamiento de Micro-Tensión y Músculo Verbal
* Identificar párrafos donde el protagonista sea un observador pasivo.
* Sustituir verbos estativos por verbos de tracción mecánica.
* Inyectar al menos un vector de resistencia física en cada bloque de 70-100 palabras.

### 3. Ajuste Silábico y Fonético
* Verificar que el promedio de sílabas por palabra ($S/P$) y la longitud de frase ($P/F$) sitúen al texto en la franja $[62.0, 74.0]$ de IFSZ y $[60.0, 75.0]$ de Fernández-Huerta.
* Trocear oraciones serpenteantes que superen las 35 palabras si no aportan textura atmosférica acumulativa.
* Insertar frases estacadas de 2 a 6 palabras tras momentos de choque o impacto motriz.

---

## III. RÚBRICA MATEMÁTICA DEL SCORE GLOBAL DE CALIDAD BEST-SELLER (100 PUNTOS)

Para erradicar cualquier ambigüedad en el motor algorítmico (`scripts/auditoria_calidad_bestseller.cjs`), la puntuación final de calidad se calcula deterministamente a partir de una base de **100 puntos**, sujeta a deducciones precisas y a una regla de veto fulminante:

| Dimensión | Puntos Máximos | Criterio Óptimo | Penalización por Desviación |
|---|:---:|---|---|
| **1. Perspicuidad IFSZ** | **20 pts** | $62.0 \le \text{IFSZ} \le 74.0$ | Deducción de $2.0\text{ pts}$ por cada unidad de IFSZ fuera del rango (mín. 0). |
| **2. Burstiness y Cadencia ($\sigma$)** | **15 pts** | $\sigma \ge 9.5$ | Deducción de $3.0\text{ pts}$ por cada punto de déficit respecto a $\sigma = 9.5$ (mín. 0). |
| **3. Adverbios en *-mente*** | **15 pts** | Densidad $\le 1.0$ por 1.000 pal. | Deducción de $5.0\text{ pts}$ por cada $0.5$ adverbios excedentes por 1.000 pal. (mín. 0). |
| **4. Densidad de Gerundios** | **15 pts** | Densidad $\le 5.5$ por 1.000 pal. | Deducción de $3.0\text{ pts}$ por cada $1.0$ gerundios excedentes por 1.000 pal. (mín. 0). |
| **5. Ecos Léxicos ($W=100$)** | **15 pts** | Densidad $\le 1.0$ eco / 1.000 pal. ($0$ en $<1.000$ pal.) | Deducción de $3.0\text{ pts}$ por cada eco excedente detectado (mín. 0). |
| **6. Músculo y Agencia Verbal** | **20 pts** | Ratio Verbos Dinámicos / Estativos $\ge 2.2$ | $1.8 \le \text{ratio} < 2.2$: 12 pts.<br>$\text{ratio} < 1.8$: 0 pts. |
| **VETO FATAL: Violación Ley 6** | **-100 pts** | Cero apariciones de términos prohibidos | **Puntaje fulminante: 0 / 100** si se detecta cualquier término de la lista negra. |

### Criterio de Aceptación Final:
* **Score $\ge 90 / 100$**: Aprobado con Calidad Best-Seller.
* **Score $< 90 / 100$ o Veto de Ley 6**: Rechazado, requiere refactorización según la Fase 2 y 3.
