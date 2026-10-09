#!/usr/bin/env python3
"""
analizar_prosa.py — Detector de vicios de redacción automática para EXTRAMUROS.

Uso:
    python analizar_prosa.py capitulos/cap01.md
    python analizar_prosa.py capitulos/cap01.md --prohibidos "Extramuros,Flujo,Clase S,Caudal"
    python analizar_prosa.py capitulos/cap01.md --json > informe.json

Mide ritmo (longitud de frases y párrafos), densidad de símiles, falsos contrastes,
cadenas de gerundios, acotaciones enfáticas, palabras en cuarentena, cultismos,
muletillas típicas de IA, repeticiones cercanas y términos vetados por la Ley 6.
No corrige nada: señala. La decisión final es del editor.
"""
import argparse
import json
import re
import statistics
import sys
from collections import Counter, defaultdict

# --------------------------------------------------------------------------- #
# LISTAS (sincronizadas con contexto/estilo.md; ampliables)
# --------------------------------------------------------------------------- #
CUARENTENA = [
    "ciclópeo", "ciclópea", "ciclópeos", "ciclópeas", "catedralicio", "catedralicia",
    "visceral", "viscerales", "atávico", "atávica", "descomunal", "descomunales",
    "milimétrico", "milimétrica", "desorbitado", "desorbitada", "de plomo", "al rojo vivo",
    "heló la sangre", "nudo ardiente", "masa de pesadilla", "abismal", "demencial",
    "que desafiaba",
    # añadidas tras el análisis del capítulo 1
    "quirúrgico", "quirúrgica", "quirúrgicos", "aséptico", "aséptica", "obsidiana",
    "insondable", "insondables", "implacable", "inquebrantable", "atronador", "atronadora",
    "fulminante", "glacial", "pétrea", "marmórea", "trémula", "incandescente",
]
CULTISMOS = [
    "légamo", "esfacelo", "glauca", "glauco", "resolana", "diaforesis", "isquemia",
    "fascias", "orográfico", "orográfica", "estólido", "coruscante",
    # registro demasiado alto para lector juvenil
    "cetrino", "cetrina", "parsimonia", "pátina", "reverberó", "reverberaba", "hendían",
    "hendía", "acechante", "insondable", "ominoso", "ominosa", "inefable", "umbrío",
    "umbría", "lóbrego", "lóbrega", "exangüe", "tenebroso",
]
TAGS_ENFATICOS = [
    "masculló", "articuló", "profirió", "bramó", "sentenció", "espetó", "siseó", "gruñó",
    "dictaminó", "zanjó", "graznó", "balbuceó", "farfulló", "rugió", "inquirió",
    "aseveró", "musitó", "susurró", "replicó", "terció", "puntualizó", "sentenció",
]
MULETILLAS_IA = [
    r"\by entonces\b", r"\bdemasiado tarde\b", r"\bpor primera vez\b", r"\balgo cambió\b",
    r"\buna fracción de segundo\b", r"\ben ese (instante|segundo|momento)\b",
    r"\bcontuvo (el aliento|la respiración)\b", r"\bsin previo aviso\b",
    r"\btragó saliva\b", r"\bapretó la mandíbula\b", r"\bun escalofrío\b",
    r"\bel corazón le (martilleaba|golpeaba|latía)\b", r"\bel tiempo pareció\b",
    r"\bel mundo (se detuvo|pareció|perdió)\b", r"\bcon una precisión\b",
    r"\bel silencio (era|se volvió|cayó)\b", r"\bcomo si (el mundo|el tiempo)\b",
    r"\bun silencio (sepulcral|absoluto|espeso)\b", r"\bse le heló\b",
    r"\bno pudo evitar\b", r"\bsin saber (muy bien|por qué)\b", r"\ben cuestión de segundos\b",
    r"\bcada fibra de su ser\b", r"\bpor alguna razón\b", r"\bera como si\b",
    r"\bdejó escapar\b", r"\buna mezcla de\b", r"\bpor un momento\b",
]
PLANTILLA_FISIO = re.compile(
    r"\bsinti[óo] (que|cómo|como)\b[^.]{0,80}\ble (recorr[ií]a|sub[ií]a|baj[ií]a|atravesaba|invad[ií]a|tre[pb]aba)",
    re.IGNORECASE,
)
FALSO_CONTRASTE = [
    # "No era X; era Y" / "No X, sino Y" / "no se extinguió; cambió"
    re.compile(r"\bno (era|fue|es|había|hubo|se \w+|\w+ó|\w+aba|\w+ía)\b[^.;:]{0,90}[;:]\s*\w+", re.IGNORECASE),
    re.compile(r"\bno (era|fue|es|eran|fueron)\b[^.]{0,90}\bsino\b", re.IGNORECASE),
    re.compile(r"\bno (mostraba|mostraban|tenía|tenían|parecía|parecían)\b[^.;]{0,90}[;:]", re.IGNORECASE),
]
GERUNDIO_EXCLUIR = {
    "cuando", "mando", "comando", "blando", "nefando", "fernando", "orlando", "bando",
    "contrabando", "segundo", "mundo", "profundo", "rotundo", "fecundo", "jocundo",
    "rayando",  # se deja contar abajo si es verbo; aquí por seguridad
}
GERUNDIO = re.compile(r"\b(\w+(?:ando|iendo|yendo))\b", re.IGNORECASE)
SIMIL = re.compile(r"\bcomo (si|un|una|el|la|los|las|unos|unas|quien|cuando|al|cuando|quien)\b", re.IGNORECASE)
TRICOLON = re.compile(r"\b\w{4,}, \w{4,} y \w{4,}\b")
DIJO = re.compile(r"\b(dijo|dije|dice|preguntó|respondió|contestó)\b", re.IGNORECASE)
ABRE_NEGACION = re.compile(r"^\s*(nada|nadie|no|ninguno|ninguna|jamás|nunca)\b", re.IGNORECASE)

STOP = set("""
a al algo alguien ante antes aquel aquella aquello aquí así aun aunque bajo bien cada como
con contra cual cuando de del desde donde dos el ella ellas ello ellos en entre era eran es
esa ese eso esta este esto estaba estaban fue fueron ha había habían hacia hasta la las le
les lo los más me mi mientras muy nada ni no nos o otra otro para pero poco por porque que
qué se sea ser si sí sin sobre su sus también tan tanto te tenía todo toda todos todas tras
tu un una uno unos unas y ya yo él sólo solo sus sus cuyo cuya donde había hubiera sido
estar estado puede podía pudo hacer hizo cada vez veces leo elena caine garrido mason
""".split())


def cargar(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def lineas_con(texto, patron, flags=re.IGNORECASE):
    hits = []
    for i, linea in enumerate(texto.splitlines(), 1):
        for m in re.finditer(patron, linea, flags):
            hits.append((i, m.group(0), linea.strip()))
    return hits


def frases(texto):
    limpio = re.sub(r"[#*_>]", " ", texto)
    limpio = re.sub(r"\s+", " ", limpio)
    partes = re.split(r"(?<=[.!?…])\s+(?=[¿¡—«A-ZÁÉÍÓÚÑ])", limpio)
    return [p.strip() for p in partes if len(p.split()) > 0]


def parrafos(texto):
    ps = [p.strip() for p in re.split(r"\n\s*\n", texto)]
    return [p for p in ps if p and not p.startswith("#") and p not in ("***", "---", "* * *")]


def analizar(texto, prohibidos):
    palabras = re.findall(r"\b[\wáéíóúñü]+\b", texto.lower())
    n = len(palabras) or 1
    fr = frases(texto)
    largos = [len(f.split()) for f in fr]
    ps = parrafos(texto)
    plen = [len(p.split()) for p in ps]
    dialogos = [p for p in ps if p.startswith("—") or p.startswith("-")]

    r = {"metricas": {}, "hallazgos": defaultdict(list)}
    m = r["metricas"]
    m["palabras"] = n
    m["frases"] = len(fr)
    m["media_palabras_frase"] = round(statistics.mean(largos), 1) if largos else 0
    m["desviacion_frase"] = round(statistics.pstdev(largos), 1) if len(largos) > 1 else 0
    m["pct_frases_mas_30"] = round(100 * sum(l > 30 for l in largos) / max(len(largos), 1), 1)
    m["pct_frases_menos_8"] = round(100 * sum(l < 8 for l in largos) / max(len(largos), 1), 1)
    m["parrafos"] = len(ps)
    m["media_palabras_parrafo"] = round(statistics.mean(plen), 1) if plen else 0
    m["parrafos_mas_120"] = sum(l > 120 for l in plen)
    m["pct_parrafos_dialogo"] = round(100 * len(dialogos) / max(len(ps), 1), 1)

    # Símiles
    similes = lineas_con(texto, SIMIL.pattern)
    m["similes_por_1000"] = round(1000 * len(similes) / n, 1)
    r["hallazgos"]["similes"] = similes

    # Falsos contrastes
    for pat in FALSO_CONTRASTE:
        r["hallazgos"]["falso_contraste"] += lineas_con(texto, pat.pattern)
    # dedupe por línea
    vistos = set()
    fc = []
    for h in r["hallazgos"]["falso_contraste"]:
        if h[0] not in vistos:
            vistos.add(h[0])
            fc.append(h)
    r["hallazgos"]["falso_contraste"] = fc

    # Plantilla fisiológica
    r["hallazgos"]["plantilla_fisiologica"] = lineas_con(texto, PLANTILLA_FISIO.pattern)

    # Gerundios: frases con 2+ gerundios
    for i, linea in enumerate(texto.splitlines(), 1):
        for f in re.split(r"(?<=[.!?])\s+", linea):
            gs = [g for g in GERUNDIO.findall(f) if g.lower() not in GERUNDIO_EXCLUIR]
            if len(gs) >= 2:
                r["hallazgos"]["cadena_gerundios"].append((i, ", ".join(gs), f.strip()[:160]))
    m["gerundios_por_1000"] = round(
        1000 * len([g for g in GERUNDIO.findall(texto) if g.lower() not in GERUNDIO_EXCLUIR]) / n, 1
    )

    # Acotaciones
    for t in TAGS_ENFATICOS:
        r["hallazgos"]["acotacion_enfatica"] += lineas_con(texto, r"\b" + t + r"\b")
    m["acotaciones_enfaticas"] = len(r["hallazgos"]["acotacion_enfatica"])
    m["acotaciones_neutras"] = len(DIJO.findall(texto))

    # Cuarentena y cultismos
    for w in CUARENTENA:
        hits = lineas_con(texto, r"\b" + re.escape(w) + r"\b")
        r["hallazgos"]["cuarentena"] += hits
    m["cuarentena_por_4000"] = round(4000 * len(r["hallazgos"]["cuarentena"]) / n, 1)
    for w in CULTISMOS:
        r["hallazgos"]["cultismo_registro_alto"] += lineas_con(texto, r"\b" + re.escape(w) + r"\b")

    # Muletillas IA
    for pat in MULETILLAS_IA:
        r["hallazgos"]["muletilla_ia"] += lineas_con(texto, pat)

    # Tricolones (enumeraciones de tres adjetivos/sustantivos)
    r["hallazgos"]["tricolon"] = lineas_con(texto, TRICOLON.pattern, 0)
    m["tricolones_por_1000"] = round(1000 * len(r["hallazgos"]["tricolon"]) / n, 1)

    # Aperturas con negación (inicio de texto o tras separador ***)
    bloques = re.split(r"\n\s*(?:\*\*\*|---|\* \* \*|#.*)\s*\n", "\n" + texto)
    for b in bloques:
        b = b.strip()
        if b and ABRE_NEGACION.match(b):
            r["hallazgos"]["apertura_negativa"].append((0, b.split("\n")[0][:80], ""))

    # Ley 6: términos prohibidos según el punto de la trama
    for term in prohibidos:
        term = term.strip()
        if term:
            r["hallazgos"]["ley6_metaconocimiento"] += lineas_con(texto, r"\b" + re.escape(term) + r"\b", 0)

    # Repeticiones: palabras de contenido (>=5 letras) repetidas en ventanas de 250 palabras
    ventana = 250
    reps = Counter()
    for start in range(0, len(palabras), ventana // 2):
        trozo = [w for w in palabras[start:start + ventana] if len(w) >= 5 and w not in STOP]
        for w, c in Counter(trozo).items():
            if c >= 3:
                reps[w] = max(reps[w], c)
    r["repeticiones_cercanas"] = reps.most_common(25)
    # Adjetivos comodín: familias que la IA repite para "sonar" física
    familias = {
        "seco": r"\b(seco|seca|secos|secas|sequedad)\b",
        "sordo": r"\b(sordo|sorda|sordos|sordas)\b",
        "metálico": r"\b(metálico|metálica|metálicos|metálicas)\b",
        "frío": r"\b(frío|fría|fríos|frías|frialdad)\b",
        "denso": r"\b(denso|densa|densos|densas|densidad)\b",
        "crujido/chasquido": r"\b(crujido|crujidos|chasquido|chasquidos|crujió)\b",
        "brutal/violento": r"\b(brutal|brutales|violencia|violento|violenta)\b",
        "absoluto": r"\b(absoluto|absoluta|absolutamente)\b",
    }
    m["comodines_por_1000"] = {}
    for k, pat in familias.items():
        c = len(re.findall(pat, texto, re.IGNORECASE))
        if c:
            m["comodines_por_1000"][k] = f"{c} ({round(1000 * c / n, 1)}/1000)"
    total = Counter(w for w in palabras if len(w) >= 6 and w not in STOP)
    r["palabras_mas_usadas"] = total.most_common(30)
    return r


def informe_md(r, ruta):
    m = r["metricas"]
    h = r["hallazgos"]
    out = [f"# Informe de prosa — {ruta}\n"]
    out.append("## Métricas de ritmo\n")
    obj = {
        "media_palabras_frase": "objetivo juvenil: 11–17 (acción: 6–12)",
        "pct_frases_mas_30": "objetivo: < 8 %",
        "media_palabras_parrafo": "objetivo: 25–60",
        "parrafos_mas_120": "objetivo: 0–1 por capítulo",
        "similes_por_1000": "objetivo: ≤ 4",
        "gerundios_por_1000": "objetivo: ≤ 6",
        "tricolones_por_1000": "objetivo: ≤ 1,5",
        "cuarentena_por_4000": "objetivo: ≤ 1",
        "pct_parrafos_dialogo": "objetivo juvenil: 25–45 % en escenas con varios personajes",
        "comodines_por_1000": "objetivo: ninguna familia > 1,5/1000",
    }
    for k, v in m.items():
        if isinstance(v, dict):
            v = ", ".join(f"{a} {b}" for a, b in v.items()) or "ninguno"
        out.append(f"- **{k}**: {v}" + (f"  _({obj[k]})_" if k in obj else ""))
    out.append("")
    nombres = {
        "falso_contraste": "Falsos contrastes (Ley antimuletillas 1)",
        "apertura_negativa": "Aperturas de escena con negación (Ley 2)",
        "plantilla_fisiologica": "Plantilla de reacción fisiológica (Ley 3)",
        "cadena_gerundios": "Cadenas de gerundios (Ley 4)",
        "cuarentena": "Palabras en cuarentena",
        "cultismo_registro_alto": "Cultismos / registro demasiado alto para juvenil",
        "acotacion_enfatica": "Acotaciones enfáticas (preferir 'dijo' o micro-acción)",
        "muletilla_ia": "Muletillas típicas de texto generado",
        "tricolon": "Enumeraciones triples (posible acumulación de adjetivos)",
        "similes": "Símiles ('como...')",
        "ley6_metaconocimiento": "LEY 6 — términos que el lector aún no debe conocer",
    }
    for clave, titulo in nombres.items():
        lista = h.get(clave, [])
        out.append(f"## {titulo}: {len(lista)}\n")
        limite = 40 if clave != "similes" else 15
        for ln, frag, ctx in lista[:limite]:
            ctx_corto = (ctx[:140] + "…") if len(ctx) > 140 else ctx
            out.append(f"- L{ln}: **{frag}** — {ctx_corto}")
        if len(lista) > limite:
            out.append(f"- … y {len(lista) - limite} más")
        out.append("")
    out.append("## Repeticiones cercanas (≥3 veces en 250 palabras)\n")
    out.append(", ".join(f"{w} ×{c}" for w, c in r["repeticiones_cercanas"]) or "Ninguna")
    out.append("\n## Palabras de contenido más frecuentes\n")
    out.append(", ".join(f"{w} ×{c}" for w, c in r["palabras_mas_usadas"]))
    return "\n".join(out)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("archivo")
    ap.add_argument("--prohibidos", default="", help="Términos vetados por Ley 6, separados por comas")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    texto = cargar(a.archivo)
    r = analizar(texto, a.prohibidos.split(",") if a.prohibidos else [])
    if a.json:
        r["hallazgos"] = {k: v for k, v in r["hallazgos"].items()}
        json.dump(r, sys.stdout, ensure_ascii=False, indent=2)
    else:
        print(informe_md(r, a.archivo))


if __name__ == "__main__":
    main()
