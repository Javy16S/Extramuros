# 📓 Guía de Estilo Oficial: «El Cuaderno de Caine»

Este documento establece el estándar visual, compositivo y narrativo para todas las ilustraciones de bestias, flora, reliquias y puntos geográficos pertenecientes al **Cuaderno de Caine** en *EXTRAMUROS*.

---

## I. CONCEPTO Y JUSTIFICACIÓN DIEGÉTICA

* **Autor dentro de la historia:** Caine («El Inmortal»), veterano de Clase S y superviviente de la Amenaza Ø.
* **Naturaleza del objeto:** Un cuaderno de tapas de cuero gastado con hojas de papel grueso de algodón o lino prensado. Caine lo utilizó durante sus expediciones en Extramuros para registrar anatomías, puntos débiles tácticos y rutas de escape antes de retirarse a la ciudad.
* **Tono narrativo:** Riguroso, pragmático y visceral. Caine no dibuja monstruos fantásticos: documenta la biología extrema de un ecosistema titánico para sobrevivir y enseñarle a quien lea sus notas cómo no morir en el intento.

---

## II. LA CUADRÍCULA COMPOSITIVA (EL «GRID» DE CAINE)

Toda lámina del cuaderno debe presentarse en **formato panorámico (Aspect Ratio 16:9)** simulando un **cuaderno abierto a doble página**:

```
+-----------------------------------------------------------------------------------+
|  [PÁGINA IZQUIERDA]                                        [PÁGINA DERECHA]       |
|                                                                                   |
|  +--------------------+                                    +-------------------+  |
|  | Inset 1:           |      ILUSTRACIÓN CENTRAL:          | Inset 2:          |  |
|  | Cabeza / Cráneo /  |      Cuerpo completo de la bestia  | Órgano singular / |  |
|  | Mandíbula / Sensor |      en postura dinámica lateral   | Espiráculo / Piel |  |
|  +--------------------+      o 3/4. Sombreado a            +-------------------+  |
|                              carboncillo y tinta.                                 |
|  Anotaciones tácticas                                      Anotaciones biológicas |
|  en español manuscrito                                     con flechas y cotas   |
|                                                                                   |
|  +--------------------+                                    +-------------------+  |
|  | Inset 3:           |                                    | Inset 4:          |  |
|  | Extremidad / Garra |                                    | Escala Silueta:   |  |
|  | Pezuña / Huella    |                                    | Humano vs Bestia  |  |
|  +--------------------+                                    +-------------------+  |
+-----------------------------------------------------------------------------------+
```

### 1. Elemento Central
* La criatura o sujeto ocupa el centro de la doble página, dibujada con perspectiva biomecánica sólida.
* Énfasis en la musculatura estriada, el peso corporal pegado al suelo y las texturas minerales (queratina volcánica, placas córneas, tendones gruesos).

### 2. Cuatro Recuadros de Detalle Anatómico (Insets Obligatorios)
1. **Detalle Craneal / Mordida:** Cráneo, pico óseo, articulación de mandíbulas o receptores sensoriales.
2. **Mecanismo Fisiológico / Térmico:** Corte o vista en detalle del órgano singular (espiráculos de purga, glándulas de calor, circulación de Flujo).
3. **Punto de Tracción / Huella:** Detalle de pezuña triple, espolón de anclaje, garra o almohadilla.
4. **Comparativa de Escala (Escala Matemática Estricta):** Silueta en sombra negra de un explorador humano (1,80 m con lanza/equipo de viaje) colocada junto a la silueta de la bestia/entidad.
   * **Proporcionalidad obligatoria:**
     * Para bestias de 7–8 m: el humano mide < 1/4 de la longitud total (caben más de 4 humanos apilados).
     * Para entidades de 12–15 m: el humano mide < 1/6 a 1/7 de la altura total (la cabeza del humano llega únicamente a la espinilla/rodilla de la criatura; caben casi 7 humanos apilados).
     * Para titanes de 20+ m: el humano es minúsculo, menor a 1/11 de la altura total.
   * **Prohibición:** Prohibido que el humano aparente alcanzar la mitad, cintura o pecho de criaturas de 8 m o superiores.

---

## III. TÉCNICA GRÁFICA Y PALETA CROMÁTICA

* **Medio tradicional puro:** Simulación de dibujo manual con carboncillo negro, tinta sepia/ferrogálica y polvo de grafito difuminado.
* **Fondo del soporte:** Papel pergamino o papel de trapo color crema/marfil envejecido, con bordes deshilachados (*deckled edges*), manchas sutiles de agua seca, humedad vegetal y polvo de carbón en los pliegues centrales.
* **Prohibición de elementos digitales:** Cero barras de vida, cero fuentes tipográficas computarizadas, cero marcos de videojuegos, cero cinta adhesiva moderna o clips de plástico.
* **Paleta de color:** Casi monocromática en tonos tierra (negro carbón, sepia, sombra tostada, blanco tiza). Solo se permiten toques apagados de color biológico funcional si la criatura tiene una emanación de calor (humo gris/ocre o vaho blanquecino) o un matiz de Flujo latente (ámbar o jade apagado).

---

## IV. REGLAS DE ANOTACIONES Y CALIGRAFÍA

* **Idioma exclusivo:** Español.
* **Caligrafía:** Letra cursiva inclinada y firme, como la de un militar o artesano veterano de finales del siglo XIX / principios del XX.
* **Contenido de las notas (La voz de Caine):**
  * Frases breves, imperativas y descriptivas.
  * Flechas trazadas a mano que apuntan a puntos clave:
    * *«Placas de queratina mineral — Inmunes a impacto frontal»*
    * *«Espiráculos laterales — Purga de calor»*
    * *«Pico córneo aserrado»*
    * *«Atacar flancos tras el bufido»*

---

## V. FÓRMULA DEL PROMPT MAESTRO (PLANTILLA REUTILIZABLE)

Para generar cualquier nueva página del cuaderno en el futuro, se utilizará estrictamente la siguiente plantilla de prompt en inglés:

```text
Caine's field journal entry from Extramuros: an authentic hand-drawn naturalist and survival notebook page. The image shows an open double-page leather-bound explorer journal made of thick, aged, textured cream cotton rag paper with worn deckled edges, charcoal smudges, graphite dust, and faint dried water stains. Entirely illustrated in traditional charcoal drawing, dark sepia ink hatching, and subtle raw umber washes.

The main central drawing is a masterfully detailed anatomical field study of [NOMBRE_Y_DESCRIPCION_DE_LA_BESTIA]: [POSTURA, CORAZA, BIOMECÁNICA].

Surrounding the creature are authentic handwritten field notes in Spanish in Caine's weathered cursive handwriting, with technical callout arrows: '[NOTA_1]', '[NOTA_2]', '[NOTA_3]'.

Four detailed inset drawings:
- Upper left: [DETALLE_CRANEO_O_MANDIBULA]
- Upper right: [DETALLE_ORGANO_TERMICO_O_SINGULAR]
- Lower left: [DETALLE_PEZUÑA_O_HUELLA]
- Lower right: clean scale silhouette comparing a 1.8m explorer with walking spear against the [TAMAÑO_BESTIA] beast.

Dark, gritty, visceral naturalist art, Da Vinci codex and naturalist field journal aesthetic, no digital UI, pure traditional illustration.
```
