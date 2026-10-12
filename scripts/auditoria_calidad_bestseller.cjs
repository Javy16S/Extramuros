#!/usr/bin/env node
/**
 * auditoria_calidad_bestseller.cjs — Motor Algorítmico Determinista de Calidad Best-Seller
 * para la novela EXTRAMUROS.
 * 
 * Implementa de forma exacta las ecuaciones y directivas de la Skill de Calidad Literaria:
 * 1. Silabeo Fonético determinista RAE (diptongos, hiatos, triptongos, u muda velar, h intercalada).
 * 2. Perspicuidad de Francisco Szigriszt Pazos (IFSZ, factor 1.0 canónico) y Escala INFLESZ.
 * 3. Lecturabilidad de José Fernández-Huerta (1959).
 * 4. Burstiness oracional (longitud media y desviación típica poblacional sigma >= 9.5).
 * 5. Densidad de adverbios en -mente (límite <= 1.0 / 1.000 palabras).
 * 6. Densidad de gerundios (límite <= 5.5 / 1.000 palabras).
 * 7. Ecos léxicos en ventana de memoria de W = 100 palabras con lista exhaustiva de stopwords.
 * 8. Vector de Músculo y Agencia Verbal (Stanford / The Bestseller Code).
 * 9. Blindaje estricto de las 6 Leyes de Extramuros con Veto Fulminante por infracción de Ley 6 o Ley 4.
 * 10. Función matemática determinista de Puntuación Global (100 puntos).
 * 
 * Uso:
 *   node scripts/auditoria_calidad_bestseller.cjs capitulos/cap_02/cap_02.md
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. BANCOS DE DATOS Y LISTAS DE EXCLUSIÓN
// ============================================================================

// Función auxiliar de desacentuación para comparación ortográfica de stopwords
const normalizarSinTildes = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Stopwords funcionales exhaustivas en español (para control de ecos léxicos)
const STOPWORDS_ES_BASE = [
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'al', 'en', 'a', 'por', 'para', 'con', 'sin', 'sobre', 'tras', 'hacia', 'desde', 'entre', 'hasta', 'bajo', 'contra', 'segun', 'durante', 'mediante',
  'y', 'e', 'o', 'u', 'ni', 'pero', 'mas', 'sino', 'aunque', 'porque', 'pues', 'como', 'si', 'que', 'ya', 'tan', 'tanto', 'tanta', 'tantos', 'tantas',
  'no', 'se', 'le', 'les', 'lo', 'la', 'los', 'las', 'me', 'te', 'nos', 'os',
  'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros', 'vuestras',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas', 'esto', 'eso', 'aquello',
  'todo', 'toda', 'todos', 'todas', 'cada', 'otro', 'otra', 'otros', 'otras', 'mismo', 'misma', 'mismos', 'mismas',
  'yo', 'tu', 'el', 'ella', 'ello', 'usted', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'ustedes',
  'es', 'son', 'era', 'eran', 'fue', 'fueron', 'ha', 'han', 'habia', 'habian', 'hubo', 'sea', 'sean', 'ser', 'sido', 'siendo',
  'esta', 'estan', 'estaba', 'estaban', 'estuvo', 'estuvieron', 'estar', 'estado',
  'tiene', 'tienen', 'tenia', 'tenian', 'tuvo', 'tuvieron', 'tener', 'tenido',
  'hace', 'hacen', 'hacia', 'hacian', 'hizo', 'hicieron', 'hacer', 'hecho',
  'dice', 'dicen', 'decia', 'decian', 'dijo', 'dijeron', 'decir', 'dicho',
  'muy', 'mas', 'menos', 'algo', 'nada', 'poco', 'poca', 'pocos', 'pocas', 'mucho', 'mucha', 'muchos', 'muchas',
  'aqui', 'ahi', 'alli', 'alla', 'cerca', 'lejos', 'arriba', 'abajo', 'delante', 'detras', 'dentro', 'fuera', 'donde', 'adonde',
  'hoy', 'ayer', 'manana', 'ahora', 'antes', 'despues', 'luego', 'siempre', 'nunca', 'jamas', 'cuando', 'apenas', 'solo', 'aun',
  'uno', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'par', 'vez', 'veces',
  'hay', 'tengo', 'va', 'van', 'iba', 'iban', 'ido',
  'leo', 'caine', 'mason', 'elena', 'garrido', 'haimara'
];

const STOPWORDS_ES = new Set(STOPWORDS_ES_BASE.map(normalizarSinTildes));

// Exclusiones de falsos adverbios en -mente (sustantivos o adjetivos)
const EXCLUSIONES_MENTE = new Set([
  'mente', 'mentes', 'demente', 'dementes', 'clemente', 'clementes', 'vehemente', 'vehementes',
  'simiente', 'simientes', 'saliente', 'salientes', 'torrente', 'torrentes', 'fuente', 'fuentes',
  'puente', 'puentes', 'diente', 'dientes', 'frente', 'frentes', 'oriente', 'poniente'
]);

// Exclusiones de falsos gerundios
const EXCLUSIONES_GERUNDIOS = new Set([
  'mando', 'mandos', 'comando', 'comandos', 'blando', 'blanda', 'blandos', 'blandas',
  'bando', 'bandos', 'contrabando', 'cuando', 'segundo', 'segundos', 'mundo', 'mundos',
  'profundo', 'profunda', 'profundos', 'profundas', 'rotundo', 'rotunda', 'rotundos', 'rotundas',
  'fecundo', 'fecunda', 'hediondo', 'hedionda', 'oriundo', 'oriunda', 'vivienda', 'viviendas',
  'hacienda', 'haciendas', 'ofrenda', 'ofrendas', 'merienda', 'meriendas'
]);

// Lista Negra de la Ley 6 (Cero Metaconocimiento del Lore Global en foco diegético temprano)
const TERMINOS_LEY_6_METACONOCIMIENTO = [
  { termino: 'La Reserva', regex: /\b(?:la|en la|de la|hacia la)\s+reserva\b/i },
  { termino: 'El Velo de Desfase / El Velo', regex: /\b(?:el\s+)?velo\s+de\s+desfase\b|\bel\s+velo\b(?!\s+(?:de\s+la\s+novia|negro\s+de\s+humo))/i },
  { termino: 'Extramuros', regex: /\bextramuros\b/i },
  { termino: 'El Flujo', regex: /\b(?:el\s+)?flujo\b(?!\s+(?:de\s+aire|de\s+sangre|sangu[ií]neo|constante\s+de\s+agua))/i },
  { termino: 'Caudal (término de poder)', regex: /\b(?:el\s+)?caudal\b(?!\s+(?:del\s+r[ií]o|de\s+agua))/i },
  { termino: 'Quietud (término de poder de Mason)', regex: /\b(?:la\s+)?quietud\b(?!\s+(?:de\s+la\s+noche|del\s+bosque))/i },
  { termino: 'Pozo Muerto', regex: /\bpozo\s+muerto\b/i },
  { termino: 'Concordato', regex: /\bconcordato\b/i },
  { termino: 'Vanguardias (organización exterior)', regex: /\b(?:las\s+)?vanguardias\b/i },
  { termino: 'Clasificación de Bestias (Clase D/C/B/A/S/Omega)', regex: /\bclase\s+[dcbas]\b|\bclase\s+omega\b|\bamenaza\s+omega\b/i }
];

// Lista de términos prohibidos de la Ley 4 (Jerga de videojuegos / informática)
const TERMINOS_LEY_4_VIDEOJUEGOS = [
  { termino: 'NPC', regex: /\bnpc\b/i },
  { termino: 'Glitch', regex: /\bglitch(?:es)?\b/i },
  { termino: 'Renderizado / Render', regex: /\brender(?:izado|izar|ing)?\b/i },
  { termino: 'Píxel', regex: /\bp[ií]xel(?:es)?\b/i },
  { termino: 'Framerate / FPS', regex: /\b(?:framerate|fps)\b/i },
  { termino: 'Spawn / Respawn', regex: /\b(?:re)?spawn(?:ear|eó|eo)?\b/i },
  { termino: 'Hitbox', regex: /\bhitbox\b/i }
];

// Verbos de acción física directa y alta agencia (Stanford / The Bestseller Code)
const PATRONES_VERBOS_ACCION = [
  /\b(?:quebr[oó]|quebrar|quebraba|quiebra|ced[eió]|ceder|ced[ií]a|cedieron|cruj[eió]|crujir|cruj[ií]an)\b/i,
  /\b(?:arrastr[oó]|arrastrar|arrastraba|trab[oó]|trabar|trababa|calz[oó]|calzar|calzaba)\b/i,
  /\b(?:desliz[oó]|deslizar|deslizaba|tritur[oó]|triturar|trituraba|vade[oó]|vadear|vadeaba)\b/i,
  /\b(?:clav[oó]|clavar|clavaba|apret[oó]|apretar|apretaba|mord[eió]|morder|mord[ií]a)\b/i,
  /\b(?:golpe[oó]|golpear|golpeaba|salt[oó]|saltar|saltaba|corr[eió]|correr|corr[ií]a)\b/i,
  /\b(?:cay[oó]|caer|ca[ií]a|ahog[oó]|ahogar|ahogaba|escup[eió]|escupir|escup[ií]a)\b/i,
  /\b(?:rasp[oó]|raspar|raspaba|rasg[oó]|rasgar|rasgaba|empuj[oó]|empujar|empujaba)\b/i,
  /\b(?:carg[oó]|cargar|cargaba|dobl[oó]|doblar|doblaba|astill[oó]|astillar|astillaba)\b/i,
  /\b(?:derrap[oó]|derrapar|derrapaba|fren[oó]|frenar|frenaba|colaps[oó]|colapsar)\b/i,
  /\b(?:sacud[eió]|sacudir|sacud[ií]a|hend[eió]|hendir|hend[ií]a|tens[oó]|tensar|tensaba)\b/i,
  /\b(?:desgarr[oó]|desgarrar|desgarraba|avanz[oó]|avanzar|avanzaba|retroced[eió]|retroceder)\b/i,
  /\b(?:trep[oó]|trepar|trepaba|descend[eió]|descender|descend[ií]a|encaj[oó]|encajar|encajaba)\b/i,
  /\b(?:afianz[oó]|afianzar|afianzaba|solt[oó]|soltar|soltaba|prend[eió]|prender|prend[ií]a)\b/i,
  /\b(?:sujet[oó]|sujetar|sujetaba|tir[oó]|tirar|tiraba|arranc[oó]|arrancar|arrancaba)\b/i,
  /\b(?:revent[oó]|reventar|reventaba|cruz[oó]|cruzar|cruzaba|bloque[oó]|bloquear|bloqueaba)\b/i,
  /\b(?:esprint[oó]|esprintar|incorpor[oó]|incorporar|incorporaba|palp[oó]|palpar|palpaba)\b/i
];

// Verbos estativos, contemplativos o pasivos (Stanford: baja agencia / retención débil)
const PATRONES_VERBOS_ESTATIVOS = [
  /\b(?:parec[eió]|parecer|parec[ií]a|parec[ií]an|semej[oó]|semejar|semejaba)\b/i,
  /\b(?:permanec[eió]|permanecer|permanec[ií]a|permanec[ií]an)\b/i,
  /\b(?:qued[oó]|quedar|quedaba|quedaban|se\s+qued[oó]|se\s+quedaba)\b/i,
  /\b(?:sent[ií]a|sent[ií]an|sentirse|se\s+sent[ií]a|not[oó]|notar|notaba|notaban)\b/i,
  /\b(?:pens[oó]|pensar|pensaba|pensaban|reflexion[oó]|reflexionar|reflexionaba)\b/i,
  /\b(?:esper[oó]|esperar|esperaba|esperaban|dud[oó]|dudar|dudaba|dudaban)\b/i,
  /\b(?:contempl[oó]|contemplar|contemplaba|contemplaban)\b/i,
  /\b(?:hallaba|hallaban|hallarse|encontraba|encontraban|encontrarse)\b/i
];

// ============================================================================
// 2. MOTOR FONÉTICO DE SILABEO RAE (DETERMINISTA)
// ============================================================================

/**
 * Cuenta las sílabas fonéticas de una palabra española según la Ortografía RAE.
 * @param {string} palabraOriginal 
 * @returns {number}
 */
function contarSilabasPalabra(palabraOriginal) {
  let p = palabraOriginal.toLowerCase().trim();
  p = p.replace(/[^a-záéíóúüñ]/g, '');
  if (!p) return 0;

  // Manejo de 'y' final precedida de vocal (rey, ley, buey, muy) -> cuenta como 'i'
  if (p.endsWith('y') && p.length > 1 && /[aeiouáéíóú]/.test(p[p.length - 2])) {
    p = p.slice(0, -1) + 'i';
  }

  // Manejo de la u muda en velares:
  // que, qui -> 'qu' es consonante única sin núcleo vocálico en la u
  p = p.replace(/qu([eiéí])/g, 'k$1');
  // gue, gui -> 'gu' es consonante única sin núcleo vocálico en la u (salvo güe, güi)
  p = p.replace(/gu([eiéí])/g, 'g$1');

  // En gua, guo -> la u es sonora y forma diptongo con a/o (se preserva como u)

  // Descomponer en grupos vocálicos (pueden tener 'h' intercalada)
  // Vocales abiertas: a, e, o, á, é, ó
  // Vocales cerradas átonas: i, u, ü
  // Vocales cerradas tónicas: í, ú
  const esAbierta = c => /[aeoáéó]/.test(c);
  const esCerradaAtona = c => /[iuü]/.test(c);
  const esCerradaTonica = c => /[íú]/.test(c);
  const esVocal = c => /[aeiouáéíóúü]/.test(c);

  let silabas = 0;
  let i = 0;
  const n = p.length;

  while (i < n) {
    if (esVocal(p[i])) {
      // Hemos encontrado el inicio de un bloque vocálico
      let bloque = [];
      let startIdx = i;
      while (i < n && (esVocal(p[i]) || (p[i] === 'h' && i + 1 < n && esVocal(p[i + 1])))) {
        if (esVocal(p[i])) {
          bloque.push({ char: p[i], pos: i });
        }
        i++;
      }

      // Analizar el bloque vocálico para determinar cuántos núcleos silábicos contiene
      let numNucleos = resolverNucleosVocalicos(bloque, p, esAbierta, esCerradaAtona, esCerradaTonica);
      silabas += numNucleos;
    } else {
      i++;
    }
  }

  return Math.max(1, silabas);
}

/**
 * Resuelve cuántas sílabas genera un bloque contiguo de vocales (con o sin h intercalada)
 */
function resolverNucleosVocalicos(bloque, palabra, esAbierta, esCerradaAtona, esCerradaTonica) {
  if (bloque.length === 1) return 1;

  if (bloque.length === 2) {
    const v1 = bloque[0].char;
    const v2 = bloque[1].char;

    // HIATOS OBLIGATORIOS RAE:
    // 1. Dos vocales abiertas: teatro, caos, héroe, poema
    if (esAbierta(v1) && esAbierta(v2)) return 2;

    // 2. Dos vocales cerradas iguales: chiita, duunviro
    if (esCerradaAtona(v1) && esCerradaAtona(v2) && v1 === v2) return 2;

    // 3. Abierta + Cerrada tónica o Cerrada tónica + Abierta: caída, río, baúl, oído
    if ((esAbierta(v1) && esCerradaTonica(v2)) || (esCerradaTonica(v1) && esAbierta(v2))) return 2;

    // 4. Dos cerradas tónicas contiguas (caso anómalo extremo)
    if (esCerradaTonica(v1) && esCerradaTonica(v2)) return 2;

    // DIPTONGOS RAE:
    // Abierta + Cerrada átona, Cerrada átona + Abierta, o dos cerradas distintas átonas (ciudad, ruido, cielo, causa)
    return 1;
  }

  if (bloque.length === 3) {
    const v1 = bloque[0].char;
    const v2 = bloque[1].char;
    const v3 = bloque[2].char;

    // TRIPTONGO RAE: Cerrada átona + Abierta + Cerrada átona (buey -> buei, averiguáis)
    if (esCerradaAtona(v1) && esAbierta(v2) && esCerradaAtona(v3)) {
      return 1;
    }

    // Si la cerrada lleva tilde (ej: comíais, decíais -> com-í-ais = cerrada tónica + diptongo ais)
    if (esCerradaTonica(v1) && esAbierta(v2) && esCerradaAtona(v3)) {
      return 2;
    }

    // Desglose par por par recursivo
    let par1 = resolverNucleosVocalicos([bloque[0], bloque[1]], palabra, esAbierta, esCerradaAtona, esCerradaTonica);
    let par2 = resolverNucleosVocalicos([bloque[1], bloque[2]], palabra, esAbierta, esCerradaAtona, esCerradaTonica);
    return Math.max(2, (par1 + par2) - 1);
  }

  // Para 4 o más vocales concatenadas raras
  let count = 1;
  for (let j = 0; j < bloque.length - 1; j++) {
    let sub = resolverNucleosVocalicos([bloque[j], bloque[j + 1]], palabra, esAbierta, esCerradaAtona, esCerradaTonica);
    if (sub === 2) count++;
  }
  return count;
}

// ============================================================================
// 3. PROCESAMIENTO Y SEGMENTACIÓN DE TEXTO
// ============================================================================

function limpiarMarkdown(contenido) {
  return contenido
    .replace(/^---[\s\S]*?---/m, '') // Quitar Frontmatter YAML
    .replace(/^#+\s+.*$/gm, '')       // Quitar Encabezados Markdown
    .replace(/```[\s\S]*?```/g, '')   // Quitar bloques de código
    .replace(/`[^`]+`/g, '')          // Quitar código inline
    .replace(/!\[.*?\]\(.*?\)/g, '')  // Quitar imágenes
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Quitar enlaces, dejar texto
    .replace(/^>\s+/gm, '')           // Quitar marcas de cita
    .replace(/[*_~]{1,3}/g, '')       // Quitar negritas y cursivas
    .trim();
}

function segmentarFrases(texto) {
  // Manejo de diálogos: raya de diálogo como inicio de frase
  let t = texto.replace(/—\s*/g, ' — ');
  
  // Segmentación respetando puntos, signos de interrogación y admiración
  const oracionesRaw = t.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑa-záéíóúñ—])/g);
  
  const frases = [];
  for (let oracion of oracionesRaw) {
    let limpia = oracion.trim().replace(/^—\s*/, '');
    if (limpia.length > 0 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(limpia)) {
      frases.push(limpia);
    }
  }
  return frases;
}

function extraerPalabras(texto) {
  const tokens = texto.match(/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+/g) || [];
  return tokens;
}

// ============================================================================
// 4. ANÁLISIS DE MÉTRICAS Y AUDITORÍA LITERARIA
// ============================================================================

function auditarTexto(textoCrudo, rutaArchivo = 'texto') {
  const textoLimpio = limpiarMarkdown(textoCrudo);
  const frases = segmentarFrases(textoLimpio);
  const palabras = extraerPalabras(textoLimpio);
  
  const totalPalabras = palabras.length;
  const totalFrases = Math.max(1, frases.length);
  
  if (totalPalabras === 0) {
    throw new Error('El archivo no contiene texto procesable.');
  }

  // 1. Silabeo fonético RAE total
  let totalSilabas = 0;
  for (let p of palabras) {
    totalSilabas += contarSilabasPalabra(p);
  }

  const S_P = totalSilabas / totalPalabras;
  const P_F = totalPalabras / totalFrases;

  // 2. Francisco Szigriszt Pazos (IFSZ, factor 1.0 canónico)
  const ifsz = 206.835 - (62.3 * S_P) - P_F;
  
  // Escala INFLESZ (Barrio Cantalejo et al., 2008)
  let nivelInflesz = '';
  if (ifsz > 80) nivelInflesz = 'Muy fácil';
  else if (ifsz >= 65) nivelInflesz = 'Bastante fácil (Ideal Thriller/Juvenil)';
  else if (ifsz >= 55) nivelInflesz = 'Normal (Estándar Prensa/Narrativa)';
  else if (ifsz >= 40) nivelInflesz = 'Algo difícil';
  else nivelInflesz = 'Muy difícil';

  // 3. José Fernández-Huerta (1959)
  const lecturabilidadFH = 206.84 - (60.0 * S_P) - (1.02 * P_F);

  // 4. Burstiness (Longitud media de oraciones y Desviación Típica sigma)
  const longitudesFrases = frases.map(f => (extraerPalabras(f)).length);
  const mediaLongitud = P_F;
  const varianza = longitudesFrases.reduce((acc, len) => acc + Math.pow(len - mediaLongitud, 2), 0) / totalFrases;
  const sigma = Math.sqrt(varianza);

  // 5. Adverbios en -mente
  const adverbiosMente = [];
  for (let p of palabras) {
    let pMin = p.toLowerCase();
    if (pMin.endsWith('mente') && !EXCLUSIONES_MENTE.has(pMin) && pMin.length > 6) {
      adverbiosMente.push(p);
    }
  }
  const densidadMente = (adverbiosMente.length / totalPalabras) * 1000;

  // 6. Gerundios
  const gerundios = [];
  for (let p of palabras) {
    let pMin = p.toLowerCase();
    if (/(?:ando|iendo|yendo)$/.test(pMin) && !EXCLUSIONES_GERUNDIOS.has(pMin)) {
      gerundios.push(p);
    }
  }
  const densidadGerundios = (gerundios.length / totalPalabras) * 1000;

  // 7. Ecos Léxicos en Ventana Móvil (W = 100 palabras)
  const VENTANA_MEMORIA = 100;
  const ecosDetectados = [];
  const bufferReciente = []; // Array de { palabra, index }

  for (let i = 0; i < palabras.length; i++) {
    const palNorm = palabras[i].toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
    const palSinTilde = normalizarSinTildes(palNorm);
    if (!palNorm || STOPWORDS_ES.has(palSinTilde) || palNorm.length <= 2) {
      continue;
    }

    // Buscar en el buffer reciente la colisión más cercana
    const colision = bufferReciente.slice().reverse().find(item => item.palabra === palNorm && (i - item.index) < VENTANA_MEMORIA);
    if (colision) {
      ecosDetectados.push({
        palabra: palNorm,
        distancia: i - colision.index,
        posicion1: colision.index,
        posicion2: i
      });
    }

    // Mantener buffer dentro de VENTANA_MEMORIA
    bufferReciente.push({ palabra: palNorm, index: i });
    if (bufferReciente.length > VENTANA_MEMORIA * 2) {
      bufferReciente.shift();
    }
  }

  const densidadEcos = (ecosDetectados.length / totalPalabras) * 1000;
  const umbralEcosAdmitidos = totalPalabras < 1000 ? 0 : Math.floor(1.0 * (totalPalabras / 1000));
  const ecosExcedentes = Math.max(0, ecosDetectados.length - umbralEcosAdmitidos);

  // 8. Vector de Músculo y Agencia Verbal (Stanford)
  let countVerbosAccion = 0;
  let countVerbosEstativos = 0;

  for (let p of palabras) {
    if (PATRONES_VERBOS_ACCION.some(r => r.test(p))) {
      countVerbosAccion++;
    }
    if (PATRONES_VERBOS_ESTATIVOS.some(r => r.test(p))) {
      countVerbosEstativos++;
    }
  }

  const ratioAgencia = countVerbosAccion / Math.max(1, countVerbosEstativos);

  // 9. Comprobación de Leyes Inmutables de Extramuros (Veto Fulminante)
  const infraccionesLey6 = [];
  for (let item of TERMINOS_LEY_6_METACONOCIMIENTO) {
    const matches = textoLimpio.match(item.regex);
    if (matches) {
      infraccionesLey6.push({ termino: item.termino, coincidencias: matches.length });
    }
  }

  const infraccionesLey4 = [];
  for (let item of TERMINOS_LEY_4_VIDEOJUEGOS) {
    const matches = textoLimpio.match(item.regex);
    if (matches) {
      infraccionesLey4.push({ termino: item.termino, coincidencias: matches.length });
    }
  }

  // ==========================================================================
  // 5. CÁLCULO DETERMINISTA DEL SCORE GLOBAL (100 PUNTOS)
  // ==========================================================================
  let scoreGlobal = 100.0;
  const desglosePuntuacion = {};

  // Dimensión 1: Perspicuidad IFSZ (20 pts máx)
  let ptsIFSZ = 20.0;
  if (ifsz < 62.0) {
    const desv = 62.0 - ifsz;
    ptsIFSZ = Math.max(0, 20.0 - (desv * 2.0));
  } else if (ifsz > 74.0) {
    const desv = ifsz - 74.0;
    ptsIFSZ = Math.max(0, 20.0 - (desv * 2.0));
  }
  desglosePuntuacion.ifsz = { max: 20, obtenido: Number(ptsIFSZ.toFixed(1)) };

  // Dimensión 2: Burstiness y Cadencia sigma (15 pts máx)
  let ptsSigma = 15.0;
  if (sigma < 9.5) {
    const desv = 9.5 - sigma;
    ptsSigma = Math.max(0, 15.0 - (desv * 3.0));
  }
  desglosePuntuacion.sigma = { max: 15, obtenido: Number(ptsSigma.toFixed(1)) };

  // Dimensión 3: Adverbios en -mente (15 pts máx)
  let ptsMente = 15.0;
  if (densidadMente > 1.0) {
    const excedente = densidadMente - 1.0;
    ptsMente = Math.max(0, 15.0 - ((excedente / 0.5) * 5.0));
  }
  desglosePuntuacion.mente = { max: 15, obtenido: Number(ptsMente.toFixed(1)) };

  // Dimensión 4: Densidad de Gerundios (15 pts máx)
  let ptsGerundios = 15.0;
  if (densidadGerundios > 5.5) {
    const excedente = densidadGerundios - 5.5;
    ptsGerundios = Math.max(0, 15.0 - (excedente * 3.0));
  }
  desglosePuntuacion.gerundios = { max: 15, obtenido: Number(ptsGerundios.toFixed(1)) };

  // Dimensión 5: Ecos Léxicos en W=100 (15 pts máx)
  let ptsEcos = 15.0;
  if (ecosExcedentes > 0) {
    ptsEcos = Math.max(0, 15.0 - (ecosExcedentes * 3.0));
  }
  desglosePuntuacion.ecos = { max: 15, obtenido: Number(ptsEcos.toFixed(1)) };

  // Dimensión 6: Músculo y Agencia Verbal (20 pts máx)
  let ptsAgencia = 0.0;
  if (ratioAgencia >= 2.2) {
    ptsAgencia = 20.0;
  } else if (ratioAgencia >= 1.8) {
    ptsAgencia = 12.0;
  } else {
    ptsAgencia = 0.0;
  }
  desglosePuntuacion.agencia = { max: 20, obtenido: Number(ptsAgencia.toFixed(1)) };

  // Suma preliminar
  scoreGlobal = ptsIFSZ + ptsSigma + ptsMente + ptsGerundios + ptsEcos + ptsAgencia;

  // Regla de VETO FATAL (Ley 6 o Ley 4)
  const hayVetoLey6 = infraccionesLey6.length > 0;
  const hayVetoLey4 = infraccionesLey4.length > 0;
  const hayVeto = hayVetoLey6 || hayVetoLey4;

  if (hayVeto) {
    scoreGlobal = 0.0;
  }

  const veredictoAprobado = (scoreGlobal >= 90.0) && !hayVeto;

  return {
    archivo: rutaArchivo,
    totalPalabras,
    totalFrases,
    totalSilabas,
    S_P: Number(S_P.toFixed(2)),
    P_F: Number(P_F.toFixed(2)),
    ifsz: Number(ifsz.toFixed(2)),
    nivelInflesz,
    lecturabilidadFH: Number(lecturabilidadFH.toFixed(2)),
    sigma: Number(sigma.toFixed(2)),
    densidadMente: Number(densidadMente.toFixed(2)),
    totalMente: adverbiosMente.length,
    listaMente: adverbiosMente,
    densidadGerundios: Number(densidadGerundios.toFixed(2)),
    totalGerundios: gerundios.length,
    listaGerundios: gerundios,
    totalEcos: ecosDetectados.length,
    ecosExcedentes,
    densidadEcos: Number(densidadEcos.toFixed(2)),
    listaEcos: ecosDetectados.slice(0, 10), // Primeras 10 muestras
    verbosAccion: countVerbosAccion,
    verbosEstativos: countVerbosEstativos,
    ratioAgencia: Number(ratioAgencia.toFixed(2)),
    infraccionesLey6,
    infraccionesLey4,
    hayVeto,
    desglosePuntuacion,
    scoreGlobal: Number(scoreGlobal.toFixed(1)),
    veredictoAprobado
  };
}

// ============================================================================
// 5. INTERFAZ CLI Y REPORTE VISUAL
// ============================================================================

function formatearReporte(res) {
  const line = '═'.repeat(74);
  const subline = '─'.repeat(74);

  let out = '\n' + line + '\n';
  out += `  📊 INFORME DE AUDITORÍA: CALIDAD LITERARIA BEST-SELLER (EXTRAMUROS)\n`;
  out += line + '\n';
  out += `  Archivo auditado: ${res.archivo}\n`;
  out += `  Palabras: ${res.totalPalabras} | Frases: ${res.totalFrases} | Sílabas: ${res.totalSilabas}\n`;
  out += `  Promedio Sílabas/Palabra (S/P): ${res.S_P} | Palabras/Frase (P/F): ${res.P_F}\n`;
  out += subline + '\n';

  out += `  1. PERSPICUIDAD Y FLUIDEZ RITMICA:\n`;
  out += `     • Índice Flesch-Szigriszt (IFSZ): ${res.ifsz} [Meta: 62.0 - 74.0] ➔ ${res.nivelInflesz}\n`;
  out += `     • Lecturabilidad Fernández-Huerta: ${res.lecturabilidadFH} [Meta: 60.0 - 75.0]\n`;
  out += `     • Desviación Típica de Longitud (σ): ${res.sigma} [Meta: σ ≥ 9.5]\n`;
  out += `     • Puntos Perspicuidad: ${res.desglosePuntuacion.ifsz.obtenido}/20 | Burstiness: ${res.desglosePuntuacion.sigma.obtenido}/15\n`;
  out += subline + '\n';

  out += `  2. ECONOMÍA LÉXICA Y CONTROL SINTÁCTICO:\n`;
  out += `     • Adverbios en -mente: ${res.totalMente} (${res.densidadMente}/1.000 pal.) [Meta: ≤ 1.0] ➔ ${res.desglosePuntuacion.mente.obtenido}/15 pts\n`;
  if (res.totalMente > 0) {
    out += `       Muestras: [${res.listaMente.slice(0, 5).join(', ')}]\n`;
  }
  out += `     • Densidad de Gerundios: ${res.totalGerundios} (${res.densidadGerundios}/1.000 pal.) [Meta: ≤ 5.5] ➔ ${res.desglosePuntuacion.gerundios.obtenido}/15 pts\n`;
  if (res.totalGerundios > 0) {
    out += `       Muestras: [${res.listaGerundios.slice(0, 5).join(', ')}]\n`;
  }
  out += `     • Ecos Léxicos en Ventana (W=100): ${res.totalEcos} colisiones (${res.ecosExcedentes} excedentes) ➔ ${res.desglosePuntuacion.ecos.obtenido}/15 pts\n`;
  if (res.totalEcos > 0) {
    out += `       Colisiones críticas: ${res.listaEcos.slice(0, 3).map(e => `"${e.palabra}" (d=${e.distancia})`).join(', ')}\n`;
  }
  out += subline + '\n';

  out += `  3. MÚSCULO Y AGENCIA VERBAL (THE BESTSELLER CODE - STANFORD):\n`;
  out += `     • Verbos de Acción Directa: ${res.verbosAccion}\n`;
  out += `     • Verbos Estativos / Contemplativos: ${res.verbosEstativos}\n`;
  out += `     • Ratio de Agencia: ${res.ratioAgencia} [Meta: ≥ 2.2] ➔ ${res.desglosePuntuacion.agencia.obtenido}/20 pts\n`;
  out += subline + '\n';

  out += `  4. AUDITORÍA DE CANON Y LEYES INMUTABLES:\n`;
  if (res.infraccionesLey6.length > 0) {
    out += `     ❌ VETO FATAL - VIOLACIÓN LEY 6 (Metaconocimiento Prohibido):\n`;
    for (let inf of res.infraccionesLey6) {
      out += `        - Término prohibido: "${inf.termino}" (${inf.coincidencias} apariciones)\n`;
    }
  } else {
    out += `     ✔ LEY 6 (Cero Metaconocimiento): IMPECABLE (0 infracciones).\n`;
  }

  if (res.infraccionesLey4.length > 0) {
    out += `     ❌ VETO FATAL - VIOLACIÓN LEY 4 (Jerga Videojuegos/Informática):\n`;
    for (let inf of res.infraccionesLey4) {
      out += `        - Término prohibido: "${inf.termino}" (${inf.coincidencias} apariciones)\n`;
    }
  } else {
    out += `     ✔ LEY 4 (Grounded Thriller): IMPECABLE (0 términos de videojuego).\n`;
  }
  out += line + '\n';

  out += `  🏆 SCORE GLOBAL DE CALIDAD BEST-SELLER: ${res.scoreGlobal} / 100\n`;
  if (res.veredictoAprobado) {
    out += `  📢 VEREDICTO FINAL: ✅ APROBADO CON ESTÁNDAR BEST-SELLER (Score ≥ 90)\n`;
  } else {
    out += `  📢 VEREDICTO FINAL: ❌ RECHAZADO (Requiere elevación literaria según protocolo)\n`;
  }
  out += line + '\n';

  return out;
}

// ============================================================================
// 6. PUNTO DE ENTRADA CLI
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Uso:
  node scripts/auditoria_calidad_bestseller.cjs <ruta_archivo.md> [--json]

Opciones:
  --json    Devuelve los resultados directamente en formato JSON estructurado.
    `);
    process.exit(0);
  }

  const esJson = args.includes('--json');
  const rutaArchivo = args.find(a => !a.startsWith('--'));

  if (!rutaArchivo) {
    console.error('Error: Debe especificar un archivo para auditar.');
    process.exit(1);
  }

  const rutaAbsoluta = path.resolve(process.cwd(), rutaArchivo);
  if (!fs.existsSync(rutaAbsoluta)) {
    console.error(`Error: El archivo "${rutaAbsoluta}" no existe.`);
    process.exit(1);
  }

  const contenido = fs.readFileSync(rutaAbsoluta, 'utf-8');
  const resultados = auditarTexto(contenido, rutaArchivo);

  if (esJson) {
    console.log(JSON.stringify(resultados, null, 2));
  } else {
    console.log(formatearReporte(resultados));
  }

  process.exit(resultados.veredictoAprobado ? 0 : 2);
}

if (require.main === module) {
  main();
}

module.exports = { auditarTexto, contarSilabasPalabra };
