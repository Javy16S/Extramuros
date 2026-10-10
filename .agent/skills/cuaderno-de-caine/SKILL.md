---
name: cuaderno-de-caine
description: Generación estandarizada y coherente de láminas del "Cuaderno de Caine" para EXTRAMUROS (bestiario, botánica titánica, reliquias y puntos geográficos en estilo de naturalista y explorador veterano: carboncillo tradicional, tinta sepia, papel de algodón envejecido y notas tácticas en español). Úsala siempre que el autor pida ilustrar o generar una bestia, criatura, animal, planta, reliquia o entrada del cuaderno o bestiario de Caine.
---

# 📓 Skill: El Cuaderno de Caine

Esta skill garantiza la **identidad visual propia y la coherencia absoluta** de todas las ilustraciones de campo pertenecientes al diario y bestiario de Caine («El Inmortal») en la novela *EXTRAMUROS*.

---

## 1. PRINCIPIO DIEGÉTICO FUNDAMENTAL

* **Quién dibuja:** Caine durante sus décadas de expedición activa en Extramuros antes de retirarse.
* **Propósito:** Registrar la anatomía, el comportamiento, la escala y los puntos débiles de la biosfera titánica para la supervivencia propia y la de quien herede sus notas (Leo).
* **Filosofía:** Cero artificios de videojuego o ciencia ficción digital. Dibujo de campo de naturalista del siglo XIX (Da Vinci, Audubon, exploradores polares y botánicos de la Royal Geographical Society) aplicado a una biología prehistórica y titánica.

---

## 2. LA REGLA DE ORO DE COMPOSICIÓN (GRID EN 5 ZONAS)

Toda lámina de criatura o sujeto debe estructurarse obligatoriamente en **formato 16:9** (cuaderno abierto a doble página):

1. **Sujeto Central:**
   * Ocupa el centro de la doble página en pose dinámica lateral o 3/4.
   * Trazo principal en carboncillo denso y tinta ferrogálica con volumen muscular, densidad ósea y peso corporal real.
2. **Inset Superior Izquierdo (Mecanismo Craneal):**
   * Estudio óseo o muscular de la cabeza, mandíbula, pico, ojos o sensores químicos.
3. **Inset Superior Derecho (Fisiología / Calor / Flujo):**
   * Detalle o corte transversal del órgano singular (espiráculos de purga térmica, canales vasculares, membranas).
4. **Inset Inferior Izquierdo (Tracción / Extremidad):**
   * Detalle de agarre: pezuñas triples, espolón de tracción, garras de escalada o huella en el fango.
5. **Inset Inferior Derecho (Escala Matemática Estricta):**
   * Silueta en sombra negra de un explorador humano (1,80 m con lanza de marcha) comparado directamente con la silueta de la criatura.
   * **Proporcionalidad estricta:**
     * Para bestias de 7–8 m: el humano mide < 1/4 de la longitud/envergadura (caben más de 4 humanos apilados).
     * Para entidades de 12–15 m: el humano mide < 1/6 a 1/7 de la altura total (la cabeza del humano llega a la espinilla/rodilla de la criatura; caben casi 7 humanos apilados).
     * Para titanes de 20+ m: el humano es minúsculo (< 1/11).
   * **Prohibido:** Que el humano aparente alcanzar la mitad, cintura o pecho de monstruos gigantes.
6. **Anotaciones Manuscritas (En Español):**
   * Letra cursiva inclinada y sobria de Caine con flechas señalando partes del animal (*«Placas de queratina mineral»*, *«Purga de calor»*, *«Pico aserrado»*).

---

## 3. ESPECIFICACIONES TÉCNICAS DEL MEDIO

* **Soporte:** Papel de trapo / algodón grueso color marfil o crema envejecido, con bordes deshilachados (*deckled edges*), pliegue central de encuadernación en cuero y manchas sutiles de polvo de carbón, grafito y agua seca.
* **Técnica:** Dibujo tradicional a mano con carboncillo, tinta sepia oscura (*hatching* y *cross-hatching*) y aguadas tenues de sombra tostada (*raw umber*).
* **Paleta:** Casi monocromática en gama tierra. Solo se permiten toques apagados de color biológico funcional si hay calor desprendido (vaho blanquecino, rescoldos de vapor) o pigmentación ocular.
* **Prohibición:** Cero elementos digitales, cero barras de vida, cero pines de colores, cero cintas adhesivas modernas, cero textos en inglés en el cuerpo de notas.

---

## 4. FLUJO DE TRABAJO PARA GENERAR UNA LÁMINA

Cuando el autor pida ilustrar una bestia o elemento del cuaderno:
1. **Extraer los datos canónicos:** Consultar `ficha_criatura.md` o el capítulo correspondiente para fijar tamaño exacto, coraza, modo de ataque, órganos térmicos y extremidades.
2. **Cargar la plantilla de prompt:** Usar la plantilla en `references/plantilla_prompt.md`.
3. **Rellenar los 4 insets y las 3 notas en español.**
4. **Ejecutar `generate_image`:**
   * `AspectRatio: '16:9'`
   * `ImageName: 'cuaderno_caine_[nombre_bestia]'`
5. **Registrar la lámina:** Añadir la nueva lámina a `references/indice_laminas.md`.
6. **Presentar al autor:** Mostrar la imagen integrada en el cuaderno y explicar los detalles anatómicos incluidos.
