---
name: extramuros-canon
description: Guardián del canon de la novela EXTRAMUROS. Úsala SIEMPRE antes de redactar, revisar o planificar cualquier capítulo, escena o diálogo de Extramuros, y cuando haya dudas sobre qué sabe Leo en un punto de la trama, cómo funciona el Flujo, la C.L.A.S.E., Caine, Mason, Elena/Haimara, Makusi, Nina, los Segadores, el Gobierno en las Sombras, la geografía de las islas o la cronología.
---

# Guardián del canon — EXTRAMUROS

Esta skill no escribe prosa. Su trabajo es que **nada de lo que se escriba contradiga el mundo, la cronología o lo que el narrador puede saber**. Las demás skills de redacción dependen de ella.

## 1. Fuentes de verdad y jerarquía

Los documentos canónicos viven en `contexto/` en la raíz del proyecto. Cuando dos documentos se contradicen, prevalece el de mayor rango:

| Rango | Documento | Gobierna |
|---|---|---|
| 1 | `contexto/final_libro_1.md` | Último cuarto del libro y desenlace (declara expresamente que prevalece). |
| 2 | `contexto/sistema_poder.md` | Física y biología del Flujo, C.L.A.S.E., costes, Caine, Mason. |
| 3 | `contexto/estilo.md` | Voz, léxico, diálogos, transiciones. |
| 4 | `contexto/roadmap_detallado.md` → `contexto/roadmap.md` | Sucesos obligatorios por nodo. |
| 5 | `contexto/biblia_mundo.md`, `contexto/atlas_cartografico.md`, `contexto/tecnologia_y_transporte.md` | Geografía, facciones, tecnología. |
| 6 | `contexto/personajes.md`, `contexto/perfiles_profundos.md` | Psicología, físico, idiolecto. |
| — | `contexto/roadmap_extendido.md` | **No vigente. No usar.** |

Archivos vivos que esta skill mantiene (créalos si no existen):
- `contexto/registro_conocimiento.md` — qué sabe Leo (y por tanto el lector) al final de cada capítulo. Plantilla en `references/registro_conocimiento_plantilla.md`.
- `contexto/continuidad.md` — heridas, objetos, ropa, hora, clima, ubicación y estado físico al cierre de cada capítulo.

## 2. Protocolo de carga (antes de escribir)

1. Identifica el **nodo** del roadmap que se va a escribir (p. ej. «Nodo 2.3: La Caída del Titán»).
2. Lee completos: el nodo en `roadmap_detallado.md`, `estilo.md`, y la última entrada de `registro_conocimiento.md` y `continuidad.md`.
3. Lee **solo las secciones relevantes** del resto: si hay uso de poder → `sistema_poder.md`; si hay vehículos → `tecnologia_y_transporte.md`; si aparece un personaje → su ficha en `perfiles_profundos.md`.
4. Redacta para ti (no para el lector) un **bloque de restricciones** de 5–10 líneas: términos permitidos/prohibidos en este punto, estado físico heredado, capacidades de Leo hoy, qué no puede revelarse todavía.

## 3. Ley 6 — Focalización estricta (lo más fácil de romper)

El narrador está pegado a Leo. **Ni el narrador ni el texto pueden nombrar algo que Leo no haya aprendido dentro de la historia.** Antes de que se lo nombren:

| Concepto canónico | Cómo se dice antes de nombrarlo |
|---|---|
| Archipiélago / La Reserva | «la ciudad», «el distrito», «casa», «el mundo» |
| Extramuros | «la selva», «el bosque», «fuera», «este sitio» |
| Flujo, Caudal, Quietud | Efectos corporales: tiempo que se estira, calor, hambre, temblor, nitidez |
| Clase / UC / C.L.A.S.E. | No existe para Leo; como mucho, «lo que fuera que hacían esos hombres» |
| Segadores | «las dos figuras», «el de la costilla» |
| Omega | «la piedra», «la pulsera» |
| Cuerpo de Contención | «los soldados», «los de pupilas negras» |

Reglas complementarias:
- El narrador **puede saber menos** que el lector intuye, nunca más.
- Ningún personaje secundario aparece en escena sin que Leo esté presente (Makusi y Nina no existen para el lector hasta la cabina del Bastión).
- La información que Leo recibe tiene **fuente diegética**: alguien la dice, la ve, la deduce con datos. Registra la fuente en `registro_conocimiento.md`.
- Para comprobarlo de forma automática, pasa al script de `revision-anti-ia` la lista de términos aún prohibidos con `--prohibidos`.

## 4. Reglas duras del sistema de poder (verificación rápida)

Antes de aprobar cualquier escena con Flujo, comprueba cada punto. El detalle completo está en `references/checklist_poder.md`.

1. **No hay auras.** El Flujo común no se ve; se ven señales fisiológicas (pupilas, respiración, tensión muscular) y efectos físicos.
2. **Todo uso cobra factura**: hambre, temblor, calor, deshidratación, calambres. Proporcional a la intensidad.
3. **La Clase no cambia por un pico.** Una descarga excepcional es «pico de sobrecarga», no ascenso.
4. **Alcance, intensidad y coste se intercambian** en efectos proyectados. Nada mantiene intensidad máxima lejos y gratis.
5. **Caine**: una sola habilidad (Regeneración de Caudal). Ataque ≈ Clase A. Regenerar a otros exige contacto y gasta sus reservas; si suelta, depende del Flujo del otro. No revive muertos. No es teletransporte. Llega exhausto.
6. **Mason**: Pozo Muerto invisible; más radio = menos intensidad; 200 m es el límite sostenido.
7. **Fauna**: adaptaciones por especie; **no** tiene Clase humana. Si se usa escala D–S para bestias, es ecológica e independiente.
8. **Vehículos**: los mandos exigen Caudal; un civil no mueve un pedal. Fuerzas G reales.
9. **Leo**: potencial B–A en el futuro; en el Libro 1 su control es de principiante. Sus logros deben costarle más que a nadie.

## 5. Huecos de canon abiertos — NO inventar sin preguntar

Estos puntos los propios documentos declaran pendientes. Si una escena los necesita, **detente y pide decisión al autor**, ofreciendo 2–3 opciones razonadas:

- Mecanismo exacto por el que Caine recibe la noticia de la llegada de Leo.
- Por qué Caine está en el nodo de salida del final y qué margen de decisión conserva.
- Mecanismo de la barrera meteorológica y del aislamiento atmosférico.
- Identidad y características del Clase S enemigo del clímax.
- Identidad del enclave de salida del final (distinto de Puerto Raíz).
- Quién nombra por primera vez a Leo «Flujo», «Extramuros» y la C.L.A.S.E., y en qué capítulo.

## 6. Incoherencias ya detectadas en el corpus

Ver `references/incoherencias_detectadas.md`. Antes de usar un dato afectado, aplica la resolución propuesta o consulta al autor.

## 7. Cierre de cada capítulo (obligatorio)

Al terminar un capítulo, añade una entrada a:
- `contexto/registro_conocimiento.md`: términos y hechos nuevos que Leo conoce + fuente.
- `contexto/continuidad.md`: estado físico, heridas, objetos, ubicación, hora, personajes presentes, promesas narrativas abiertas (preguntas que el lector se lleva).

Formato de salida de la verificación cuando te pidan «revisa el canon»:

```
VEREDICTO: Conforme / Con incidencias
INCIDENCIAS:
- [Ley 6] L23 «Extramuros» — Leo aún no conoce el término (lo aprende en Nodo X). Sustituir por «la selva».
- [Poder] L88 Leo sostiene Caudal 10 min sin coste — contradice sistema_poder §III.4. Añadir factura física.
- [Continuidad] Muñeca derecha rota en cap. 1; aquí la usa sin dolor.
DUDAS PARA EL AUTOR: …
```
