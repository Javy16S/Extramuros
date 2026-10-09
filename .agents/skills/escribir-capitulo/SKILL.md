---
name: escribir-capitulo
description: Flujo de trabajo completo para redactar un capítulo nuevo (o reescribir uno) de la novela EXTRAMUROS a partir de un nodo del roadmap - ficha de capítulo, escaleta de escenas, redacción por escenas, autorrevisión y actualización de continuidad. Úsala cuando el autor pida "escribe el capítulo X", "redacta el nodo 2.3", "continúa la historia", "reescribe este capítulo" o "planifica el siguiente capítulo".
---

# Redactar un capítulo de EXTRAMUROS

Proceso profesional en seis fases. **No te saltes fases ni las fusiones**: la calidad viene de separar planificar, escribir y revisar. El autor dirige la estructura; tú ejecutas la prosa.

Skills que esta orquesta: `extramuros-canon` (siempre), `voz-thriller-juvenil` (siempre), `accion-y-poder` (si hay combate, persecución o Flujo), `mundo-y-criaturas` (si hay escenario nuevo o fauna), `dialogo-y-vinculos` (si hay dos o más personajes hablando), `revision-anti-ia` (siempre, al final).

---

## Fase 0 — Carga de contexto
Ejecuta el protocolo de carga de `extramuros-canon` (§2). Sin el bloque de restricciones no se escribe una línea.

## Fase 1 — Ficha de capítulo (mostrar al autor)
Rellena `references/ficha_capitulo.md` y **preséntala al autor antes de redactar** salvo que te haya dicho que vayas directo. La ficha responde, como mínimo:

1. **Nodo y sucesos obligatorios** que cubre (copiados del roadmap).
2. **Objetivo concreto de Leo** en el capítulo (verbo físico: llegar, encontrar, esconderse, convencer…).
3. **Oposición**: qué o quién lo impide y por qué.
4. **Valor que cambia** de inicio a fin (seguridad → peligro, esperanza → desesperanza, ignorancia → conocimiento…). Si nada cambia, el capítulo sobra o debe fusionarse.
5. **Giro o revelación** (máximo uno grande por capítulo).
6. **Modalidad de apertura** (A, B o C de `estilo.md §V`) y primera imagen.
7. **Gancho de cierre** (tipo, ver `references/ganchos.md`).
8. **Herencia física** del capítulo anterior y **factura** que dejará al siguiente.
9. **Conocimiento nuevo** de Leo + fuente diegética.
10. **Momento emocional** (dónde respira el lector; dónde duele).

## Fase 2 — Escaleta de escenas
Divide el capítulo en 2–4 escenas. Para cada una usa el par **escena/secuela** (`references/estructura_escena.md`):
- Escena: *objetivo → conflicto → desenlace* (casi siempre «no, y además…» o «sí, pero…»).
- Secuela: *reacción → dilema → decisión* (corta en thriller; puede ser un solo párrafo).

Extensión orientativa (formato juvenil / new adult):
- Capítulo: **2.200–3.800 palabras** (los capítulos cortos son una seña del mercado juvenil actual; el cap. 1 tiene ~4.300, en el límite alto).
- Escena: 700–1.500 palabras.
- Una tarea de redacción = **una escena**. No generes un capítulo entero de una sola vez: la calidad cae en la segunda mitad.

## Fase 3 — Redacción por escenas
Para cada escena:
1. Relee la última página escrita (continuidad de tono y posición física).
2. Escribe aplicando `voz-thriller-juvenil` y, según la escena, `accion-y-poder`, `mundo-y-criaturas` o `dialogo-y-vinculos`.
3. Respeta las reglas de oro de la escena:
   - Entra tarde, sal pronto: empieza cuando el conflicto ya se mueve y corta en cuanto se resuelve.
   - Un sentido no visual en cada página (olor, tacto, temperatura, sonido, sabor).
   - Leo **decide** algo en cada escena, aunque sea mal. Un protagonista que solo reacciona aburre al lector juvenil.
   - La información llega cuando Leo la necesita, nunca antes (ver `mundo-y-criaturas`).
   - Nada de flashbacks de más de 150 palabras en mitad de una escena de tensión. Si el pasado es imprescindible, fragmentado en destellos de 1–3 frases.
4. Guarda la escena en `capitulos/capXX_borrador.md` (o la ruta que use el autor).

## Fase 4 — Autorrevisión
1. Ejecuta el analizador:
   `python .agents/skills/revision-anti-ia/scripts/analizar_prosa.py capitulos/capXX_borrador.md --prohibidos "<términos que Leo aún no conoce>"`
2. Corrige según `revision-anti-ia` (pasadas en orden: estructura → escena → párrafo → frase → palabra).
3. Pasa la verificación de canon de `extramuros-canon` (§4 y §7).
4. Lee el gancho final en voz alta (mentalmente): ¿un lector de 17 años pasaría la página a la 1 de la madrugada?

## Fase 5 — Entrega
Entrega al autor:
- El capítulo limpio.
- Un **parte de revisión** de máximo 10 líneas: decisiones tomadas, dudas de canon, métricas clave del analizador antes/después.
- Nada de resúmenes del contenido: el autor lo leerá.

## Fase 6 — Cierre de continuidad
Actualiza `contexto/registro_conocimiento.md` y `contexto/continuidad.md` (formato en `extramuros-canon`).

---

## Si te piden REESCRIBIR un capítulo existente
1. Lee el original completo y pásale el analizador (guarda las métricas).
2. Identifica qué **funciona y se conserva** (imágenes concretas, diálogos con voz, giros). Nunca reescribas por reescribir.
3. Reestructura primero (orden de escenas, flashbacks, ritmo), luego la línea.
4. Entrega con las métricas antes/después.

## Errores que invalidan un capítulo
- Rompe la Ley 6 (nombra lo que Leo no sabe).
- Usa el poder sin factura.
- Empieza resumiendo el capítulo anterior.
- Leo no toma ninguna decisión.
- Termina con todo resuelto y sin pregunta abierta.
- Introduce una solución (persona, objeto, habilidad) que no estaba preparada.
