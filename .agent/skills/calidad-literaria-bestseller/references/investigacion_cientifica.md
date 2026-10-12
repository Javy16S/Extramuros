# 🔬 DOSSIER CIENTÍFICO Y EDITORIAL: INVESTIGACIÓN EMPÍRICA DE CALIDAD BEST-SELLER (REVISIÓN CANÓNICA 2.0)

**Fecha:** 12 de Octubre, 2026  
**Proyecto:** *EXTRAMUROS*  
**Estado:** Documento corregido tras auditoría adversarial para el desarrollo de la Skill de Calidad Literaria.

---

## 1. INVESTIGACIÓN DE ESTILOMETRÍA COMPUTACIONAL: *THE BESTSELLER CODE* (STANFORD)

### 1.1. Origen y Metodología Real del Estudio
La investigación desarrollada por la Dra. Jodie Archer (exeditora senior de Penguin Books) y el Dr. Matthew L. Jockers (profesor de humanidades digitales y codirector del Stanford Literary Lab) en Stanford se plasmó en la obra *The Bestseller Code: Anatomy of the Blockbuster Novel* (St. Martin's Press, 2016).

* **Corpus Curado del Clasificador:** El clasificador supervisado (*bestseller-ometer*) no se entrenó sobre la base macro general de 20.000 títulos de literatura histórica de Stanford, sino sobre un corpus contemporáneo específicamente calibrado de **5.000 novelas** publicadas entre 1985 y 2015, de las cuales 513 fueron superventas consolidadas en las listas oficiales de ficción de *The New York Times*.
* **Variables Computadas:** El modelo analizó **148 características estilométricas, temáticas y sintácticas** mediante técnicas de minería de texto (LDA para modelado de tópicos, análisis sintáctico de dependencias y frecuencias de partes de la oración o POS).

### 1.2. Hallazgos Verificados sobre Estilo y Acción
1. **Balance de Partes de la Oración (POS):**
   * *La falacia de la cifra única:* Archer y Jockers **no establecen una ratio estática inventada** de «2.2 a 3.1 verbos por adjetivo». Lo que demuestran empíricamente mediante análisis multivariante es un vector de dominancia:
     - En los best-sellers de ficción comercial contemporánea (Dan Brown, Michael Crichton, Stephen King, John Grisham), la proporción de **verbos dinámicos frente a sustantivos y adjetivos es significativamente mayor** que en la ficción no comercial o en novelas de bajo rendimiento.
     - Los best-sellers reducen drásticamente los adjetivos puramente decorativos en favor de construcciones predicativas directas.
     - En el eje adverbial, los best-sellers muestran una fuerte aversión a los adverbios modales en *-ly* (equivalentes al español *-mente*), concentrando la fuerza descriptiva en la elección de un verbo más preciso.
2. **Agencia del Protagonista (Action Verbs vs. Stative Verbs):**
   * El clasificador identificó que los protagonistas de novelas de éxito realizan acciones orientadas a objetivos mediante verbos de alta agencia (*want, need, grab, run, take, break*), mientras que las novelas con problemas de retención presentan personajes atrapados en verbos estativos y contemplativos (*seem, feel, ponder, wait, remain*).
3. **Diálogo y Simplicidad de Etiquetas:**
   * Los diálogos en los best-sellers se caracterizan por acotaciones funcionales neutras (el verbo *said* en inglés o *dijo/preguntó* en español), evitando etiquetas enfáticas forzadas (*snapped, spat, hissed*).
4. **Modelado Temático (LDA):**
   * Las novelas de alta tracción concentran su volumen temático en **2 o 3 tópicos primarios** que absorben cerca del 30% del espacio textual, en lugar de dispersarse en multitud de subtramas difusas.

---

## 2. FÓRMULAS MATEMÁTICAS EXACTAS DE LEGIBILIDAD EN ESPAÑOL

### 2.1. Fórmula Canónica de Flesch-Szigriszt (IFSZ, 1993)
Desarrollada por Francisco Szigriszt Pazos en su tesis doctoral (*Sistemas predictivos de legibilidad del mensaje escrito: fórmula de perspicuidad*, Universidad Complutense de Madrid, 1992/1993):

$$\text{IFSZ} = 206.835 - 62.3 \times \left(\frac{S}{P}\right) - \left(\frac{P}{F}\right)$$

*Donde:*
* $S$: Número total de sílabas del texto.
* $P$: Número total de palabras.
* $F$: Número total de frases u oraciones.
* $\frac{S}{P}$: Promedio de sílabas por palabra.
* $\frac{P}{F}$: Longitud media de la frase (palabras por frase).

> **Corrección matemática rigurosa:** Queda erradicado el coeficiente $1.015$ (exclusivo de la fórmula de Flesch en inglés). La adaptación canónica y homologada de Szigriszt Pazos en español utiliza exactamente el coeficiente **$1.0$** para el término de longitud de frase ($\frac{P}{F}$).

#### Escala INFLESZ (Inés Barrio Cantalejo et al., 2008):
Validada clínicamente y editorialmente sobre corpus en castellano:
* **$> 80$:** Muy fácil (educación primaria, textos sencillos).
* **$65 - 80$:** Bastante fácil (novela juvenil, thriller ágil, ritmo vertiginoso de alta retención).
* **$55 - 65$:** Normal (prensa general, narrativa comercial estándar).
* **$40 - 55$:** Algo difícil (prosa ensayística o académica moderada).
* **$< 40$:** Muy difícil (manuales técnicos y jurídicos).

**Objetivo canónico para *Extramuros*:** **$\text{IFSZ} \in [62.0, 74.0]$**. Proporciona una lectura hipnótica sin empobrecer el idiolecto.

### 2.2. Fórmula Canónica de Fernández-Huerta (1959)
Desarrollada por José Fernández Huerta (*Medidas sencillas de lecturabilidad*, Revista Consigna, Madrid, 1959):

$$\text{Lecturabilidad} (L) = 206.84 - 0.60 \times P_{100} - 1.02 \times F_{100}$$

*Donde:*
* $P_{100} = \frac{S}{P} \times 100$ (número total de sílabas en una muestra normalizada de 100 palabras).
* $F_{100}$: En la formulación original tabulada de Fernández Huerta, $F_{100}$ representaba el promedio de palabras por frase en la muestra estándar (equivalente a $\frac{P}{F}$). En implementaciones de software se unifica operativamente a la longitud media de frase:
$$L = 206.84 - 60 \times \left(\frac{S}{P}\right) - 1.02 \times \left(\frac{P}{F}\right)$$

---

## 3. ALGORITMO FONÉTICO EXACTO DE SILABEO EN ESPAÑOL (NORMAS RAE)

Para el cálculo determinista y sin fallos de $S$ en código JavaScript, se implementan las reglas de la *Ortografía de la lengua española* (RAE y ASALE, 2010):

### 3.1. Taxonomía de Fonemas Vocálicos
1. **Vocales abiertas (fuertes):** $V_A = \{a, e, o, á, é, ó\}$.
2. **Vocales cerradas átonas (débiles):** $V_C = \{i, u, ü\}$.
3. **Vocales cerradas tónicas (con tilde):** $V_{Ct} = \{í, ú\}$.
4. **Grafema 'y':** Al final de palabra tras vocal (*rey, ley, muy*) opera como vocal cerrada $i$.

### 3.2. Reglas Fonotácticas Silábicas
1. **Hiatos (división silábica obligatoria):**
   * Dos vocales abiertas consecutivas: $V_A + V_A$ (*te-a-tro, ca-os, hé-ro-e*).
   * Dos vocales cerradas iguales: $V_C + V_C$ donde $V_1 = V_2$ (*chi-i-ta, ti-i-to, du-um-vi-ro*).
   * Vocal abierta + vocal cerrada tónica (o viceversa): $V_A + V_{Ct}$ o $V_{Ct} + V_A$ (*ca-í-da, rí-o, ba-úl, o-í-do*).
2. **Diptongos (núcleo silábico indivisible):**
   * Vocal abierta + vocal cerrada átona (o viceversa): $V_A + V_C$ o $V_C + V_A$ (*cau-sa, cie-lo, ai-re, fue-go*).
   * Dos vocales cerradas distintas átonas: $V_C + V_C$ distintas (*ciu-dad, rui-do*).
3. **Triptongos (tres vocales en una sílaba):**
   * $V_C + V_A + V_C$ átonas (*a-ve-ri-güéis, buey*).
4. **Reglas de Consonantes Velares y 'H':**
   * La letra $h$ muda intercalada no impide la formación de diptongo ni de hiato (*ahu-mar* es diptongo; *bú-ho* es hiato por tilde en la cerrada).
   * En las secuencias *que, qui*, la $u$ es muda y no computa como núcleo vocálico.
   * En las secuencias *gue, gui*, la $u$ es muda a menos que lleve diéresis (*ci-güe-ña*).
   * En las secuencias *gua, guo*, la $u$ es **plenamente sonora** y forma diptongo creciente con la vocal abierta (*a-gua, a-ve-ri-guo*).

---

## 4. DRAMATURGIA Y MICRO-TENSIÓN: DONALD MAASS Y SHAWN COYNE

### 4.1. Fundamentación Teórica de la Micro-Tensión (Donald Maass)
En *Writing the Breakout Novel* (2001) y *The Fire in Fiction* (2009), Maass define la micro-tensión como una propiedad emergente de la prosa a nivel microscópico:
* **Fricción en cada párrafo:** En lugar de depender exclusivamente de la macro-trama (el monstruo que persigue), la micro-tensión se produce por la fricción sensorial inmediata: el zapato que aprieta, el olor a ceniza que provoca arcadas, el instrumento que se atasca o la resistencia del barro.
* **El "Read-Out-of-Order Test":** Todo bloque de texto de una escena de thriller debe contener un vector de incomodidad, contradicción o resistencia activa, impidiendo que el lector caiga en el tedio cognitivo.

### 4.2. Detección Algorítmica de Ecos Léxicos (Ventana Deslizante)
Para erradicar la patología de la repetición involuntaria sin excluir palabras semánticas cortas:
* **Mecanismo:** Ventana deslizante de **120 palabras**.
* **Filtro de exclusión:** Se utiliza una lista exhaustiva de *stopwords* funcionales en español (artículos, preposiciones, conjunciones, pronombres, verbos auxiliares).
* **Regla:** Cualquier palabra semántica que no sea stopword (incluidas palabras de 3 o 4 letras como *foso, lodo, tiro, muro, piel, zarza*) que se repita a una distancia inferior a 80 palabras emite una alerta de eco léxico.

---

## 5. LA TOTALIDAD DE LAS 6 LEYES INMUTABLES DE *EXTRAMUROS*

El sistema de validación debe contrastar el texto contra las **SEIS Leyes Inmutables de la Directiva Prime**, sin omitir ninguna:

1. **Ley 1: Ley de Continuidad (Lectura Obligatoria y Verdad del Archivo):**
   * Coherencia física estricta del protagonista: estado exacto de las heridas heredadas (la muñeca derecha fracturada en el Cap 1 no puede sostener tracción ni cargar peso). Inventario de objetos estricto (linterna de latón, atestado arrugado, barrita y frutos secos).
2. **Ley 2: Ley de Escala (Biología Titánica y Precisión Visual):**
   * Ecosistema prehistórico hiperoxigenado. La escala es geográfica y biológica. Prohibición estricta de tratar al protagonista como un "humano encogido" y prohibición de símiles con objetos de civilización contemporánea (*"como dos camiones"*).
3. **Ley 3: Ley de Poder (El Coste del Flujo):**
   * El Flujo es biología extrema, no magia libre de fricción. Todo uso de fuerza sobrehumana o aceleración metabólica exige un coste físico inmediato y proporcional: taquicardia extrema, calambres digestivos feroces y vaciado hipoglucémico (*inanición*).
4. **Ley 4: Ley de Estilo (Grounded Thriller):**
   * Tono visceral, serio y atmosférico. Vocabulario informático o de videojuego terminantemente prohibido (*glitch, renderizado, NPC*). Primacía absoluta de *Show, Don't Tell* a través de sentidos táctiles, térmicos y mecánicos.
5. **Ley 5: Ley de Personajes:**
   * *Mason («El Maestro»):* Autoridad peligrosa y pragmática, desprovista de ternura o pedagogía amable. Su campo de Quietud impone desaceleración física en el prado.
   * *Elena:* Convocada mediante flashbacks sensoriales (olores, sonidos de la ciudad) en picos de estrés.
   * *Segadores:* Entidad de terror absoluto, presencia quirúrgica y amenazante.
6. **Ley 6: Ley de Conocimiento y Focalización Estricta (Cero Metaconocimiento):**
   * Narración puramente diegética limitada a lo que Leo experimenta en ese segundo. Prohibición absoluta de términos de lore global (*La Reserva, Extramuros, El Flujo, Caudal, Quietud, Pozo Muerto, Concordato, Vanguardias, Clases D/C/B/A/S/Omega*).
