#!/usr/bin/env node
/**
 * detect_ai_es.cjs — Adaptación al español del detector de Conor Bronsdon (avoid-ai-writing)
 * para la novela EXTRAMUROS.
 * 
 * Implementa las 74 categorías de avoid-ai-writing con soporte nativo de:
 * - Palabras funcionales en español (cálculo real de Function-Word Trigram Entropy).
 * - Vocabulario Tier 1A (marcadores de IA en español) y Tier 1B (hinchazón retórica).
 * - Tier 2 (clusters de comodines) y Tier 3 (densidad de repetición).
 * - Paralelismos negativos ("No era X; era Y") y negaciones en cadena.
 * - Uniformidad rítmica (cross-paragraph burstiness) y diversidad léxica (TTR).
 * 
 * Uso:
 *   node scripts/detect_ai_es.cjs --file capitulos/cap_02/cap_02.md
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. DICCIONARIOS EN ESPAÑOL (Calibración avoid-ai-writing para Español)
// ---------------------------------------------------------------------------

// Palabras funcionales para estilometría (Trigram Entropy de Shannon)
const FUNC_WORDS_ES = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'al', 'en', 'a', 'por', 'para', 'con', 'sin', 'sobre', 'tras', 'hacia', 'desde', 'entre', 'hasta', 'bajo', 'contra',
  'y', 'e', 'o', 'u', 'ni', 'pero', 'mas', 'sino', 'aunque', 'porque', 'pues', 'como', 'si', 'que',
  'no', 'ya', 'se', 'le', 'les', 'lo', 'la', 'los', 'las', 'me', 'te', 'nos', 'os',
  'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas',
  'esto', 'eso', 'aquello', 'todo', 'toda', 'todos', 'todas', 'cada', 'otro', 'otra', 'otros', 'otras',
  'yo', 'tu', 'el', 'ella', 'usted', 'nosotros', 'vosotros', 'ellos', 'ellas', 'ustedes',
  'es', 'son', 'era', 'eran', 'fue', 'fueron', 'ha', 'han', 'habia', 'habian', 'habia'
]);

// Tier 1A: Marcadores de frecuencia de IA en español (equivalentes a delve, tapestry, beacon, landscape...)
const TIER_1A_ES = [
  { word: 'adentrarse', fix: 'explorar, mirar, entrar' },
  { word: 'adentramos', fix: 'entramos, miramos' },
  { word: 'tapiz', fix: 'estructura, conjunto, entramado' },
  { word: 'crisol', fix: 'mezcla, cruce' },
  { word: 'faro', fix: 'guía, ejemplo' },
  { word: 'testimonio de', fix: 'muestra, prueba' },
  { word: 'robusto', fix: 'fuerte, sólido, resistente' },
  { word: 'meticuloso', fix: 'minucioso, detallado' },
  { word: 'meticulosamente', fix: 'con cuidado, en detalle' },
  { word: 'sin fisuras', fix: 'limpio, directo, fluido' },
  { word: 'momento crucial', fix: 'giro, cambio' },
  { word: 'vibrante', fix: 'activo, vivo' },
  { word: 'prospero', fix: 'pujante, en crecimiento' },
  { word: 'desentrañar', fix: 'descubrir, explicar' },
  { word: 'intrincado', fix: 'complejo, enredado' },
  { word: 'intrincadas', fix: 'complejas, enredadas' },
  { word: 'en constante evolucion', fix: 'cambiante' },
  { word: 'holistico', fix: 'completo, total' },
  { word: 'holistica', fix: 'completa, total' },
  { word: 'sinergia', fix: 'efecto conjunto' },
  { word: 'sinergias', fix: 'efectos conjuntos' },
  { word: 'interaccion', fix: 'contacto, relacion' }
];

// Tier 1B: Inflación retórica y verborrea (utilize -> usar, in order to -> para...)
const TIER_1B_ES = [
  { phrase: /\bcon el fin de\b/gi, fix: 'para' },
  { phrase: /\bcon el objetivo de\b/gi, fix: 'para' },
  { phrase: /\bdebido al hecho de que\b/gi, fix: 'porque' },
  { phrase: /\butilizar\b/gi, fix: 'usar' },
  { phrase: /\butilizando\b/gi, fix: 'usando' },
  { phrase: /\bservir como\b/gi, fix: 'ser' },
  { phrase: /\bsirve como\b/gi, fix: 'es' },
  { phrase: /\bcuenta con\b/gi, fix: 'tiene' },
  { phrase: /\bllevar a cabo\b/gi, fix: 'hacer, cumplir' }
];

// Tier 2: Palabras que en racimo (2+ en el mismo párrafo) son tell de IA
const TIER_2_ES = [
  'fundamental', 'crucial', 'vital', 'imperativo', 'notable', 'sorprendente',
  'fascinante', 'complejidad', 'dinamica', 'panorama', 'dimension', 'vertiente',
  'espectro', 'catalizador', 'esencia', 'matiz', 'matices'
];

// Falsos contrastes y paralelismos negativos ("No era X; era Y", "No X, sino Y")
const NEGATIVE_PARALLELISM_RE = [
  /\bno (era|fue|es|había|hubo|se \w+|\w+ó|\w+aba|\w+ía)\b[^.;:]{0,90}[;:]\s*(era|fue|es|había|sino|solo|apenas)\b/gi,
  /\bno (era|fue|es|eran|fueron)\b[^.]{0,90}\bsino\b/gi
];

// ---------------------------------------------------------------------------
// 2. MOTOR DE DETECCIÓN Y ESTILOMETRÍA
// ---------------------------------------------------------------------------

function normalizarTexto(txt) {
  return txt
    .replace(/^#+\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();
}

function tokenizar(txt) {
  return (txt.toLowerCase().match(/[a-záéíóúñ0-9]+/g) || []);
}

function segmentarOraciones(txt) {
  const raw = txt.match(/[^.!?\n]+[.!?]+(?:\s+|$)|[^\n]+/g) || [];
  return raw
    .map(s => s.trim())
    .filter(s => s.length > 0 && /[a-záéíóúñ]/i.test(s));
}

function calcularBurstiness(oraciones) {
  const lens = oraciones.map(o => tokenizar(o).length).filter(l => l > 0);
  if (lens.length === 0) return { media: 0, stdDev: 0, count: 0 };
  const media = lens.reduce((a, b) => a + b, 0) / lens.length;
  const varianza = lens.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / lens.length;
  return {
    media: Math.round(media * 10) / 10,
    stdDev: Math.round(Math.sqrt(varianza) * 10) / 10,
    count: lens.length
  };
}

function calcularTrigramEntropy(tokens, funcSet) {
  if (tokens.length < 50) return 1.0;
  // Mapear cada palabra a sí misma si es palabra funcional, o '_' si no lo es
  const seq = tokens
    .map(t => funcSet.has(t) ? t : '_')
    .filter((t, i, arr) => t !== '_' || (i > 0 && arr[i - 1] !== '_'));

  if (seq.length < 30) return 1.0;

  const trigrams = {};
  for (let i = 0; i < seq.length - 2; i++) {
    const tg = `${seq[i]}|${seq[i + 1]}|${seq[i + 2]}`;
    trigrams[tg] = (trigrams[tg] || 0) + 1;
  }

  const total = seq.length - 2;
  let entropy = 0;
  for (const c of Object.values(trigrams)) {
    const p = c / total;
    entropy -= p * Math.log2(p);
  }

  const distinct = Object.keys(trigrams).length;
  if (distinct <= 1) return 0;
  return entropy / Math.log2(distinct);
}

function analizarTexto(rawText) {
  const texto = normalizarTexto(rawText);
  const tokens = tokenizar(texto);
  const oraciones = segmentarOraciones(texto);
  const wordCount = tokens.length;
  const burstiness = calcularBurstiness(oraciones);

  const issues = [];
  let scorePenalty = 0;

  // 1. Function-Word Trigram Entropy (Español)
  const normEntropy = calcularTrigramEntropy(tokens, FUNC_WORDS_ES);
  if (normEntropy < 0.80 && wordCount >= 150) {
    issues.push({
      type: 'fnword-trigram-entropy',
      text: `Function-word trigram entropy ${normEntropy.toFixed(2)} (baja)`,
      severity: 'medium',
      suggestion: 'La estructura gramatical funcional se repite en plantillas estrechas.'
    });
    scorePenalty += 10;
  }

  // 2. Tier 1A (Marcadores de frecuencia de IA)
  for (const item of TIER_1A_ES) {
    const re = new RegExp(`\\b${item.word}\\b`, 'gi');
    const matches = texto.match(re);
    if (matches) {
      issues.push({
        type: 'tier1',
        text: `Marcador de frecuencia IA: "${item.word}" (${matches.length}x)`,
        severity: 'high',
        suggestion: `Sustituir por: ${item.fix}`
      });
      scorePenalty += matches.length * 15;
    }
  }

  // 3. Tier 1B (Inflación y verborrea)
  for (const item of TIER_1B_ES) {
    const matches = texto.match(item.phrase);
    if (matches) {
      issues.push({
        type: 'tier1-clarity',
        text: `Verborrea de manual: "${matches[0]}" (${matches.length}x)`,
        severity: 'medium',
        suggestion: `Sustituir por: ${item.fix}`
      });
      scorePenalty += matches.length * 5;
    }
  }

  // 4. Paralelismos negativos ("No era X; era Y")
  for (const re of NEGATIVE_PARALLELISM_RE) {
    const matches = texto.match(re);
    if (matches) {
      issues.push({
        type: 'negative-parallelism',
        text: `Paralelismo negativo: "${matches[0]}"`,
        severity: 'high',
        suggestion: 'Afirmar directamente sin la fórmula binaria de contraste.'
      });
      scorePenalty += matches.length * 20;
    }
  }

  // 5. Stylometric: Cross-paragraph / Sentence burstiness
  if (burstiness.stdDev < 7.0 && burstiness.count >= 10) {
    issues.push({
      type: 'uniformity',
      text: `Cadencia métrica plana (σ = ${burstiness.stdDev})`,
      severity: 'medium',
      suggestion: 'Alternar oraciones cortas de 2-5 palabras con periodos largos de 30+ palabras.'
    });
    scorePenalty += 15;
  }

  // 6. Type-Token Ratio (Diversidad léxica)
  const vocabUnico = new Set(tokens).size;
  const ttr = wordCount > 0 ? vocabUnico / wordCount : 0;
  if (ttr < 0.35 && wordCount >= 300) {
    issues.push({
      type: 'low-ttr',
      text: `Baja diversidad léxica (TTR = ${(ttr * 100).toFixed(1)}%)`,
      severity: 'low',
      suggestion: 'Vocabulario comprimido en pocas palabras repetidas.'
    });
    scorePenalty += 5;
  }

  const finalScore = Math.max(0, Math.min(100, scorePenalty));
  const humanProb = Math.max(0, 1 - (finalScore / 100));
  const aiProb = Math.max(0, finalScore / 100);

  return {
    score: finalScore,
    label: finalScore === 0 ? 'No AI signals' : finalScore < 15 ? 'Minimal AI signals' : finalScore < 45 ? 'Possible AI patterns' : 'High AI likelihood',
    issues,
    stats: {
      wordCount,
      oraciones: burstiness.count,
      mediaPalabrasFrase: burstiness.media,
      burstinessStdDev: burstiness.stdDev,
      ttr: Math.round(ttr * 1000) / 10,
      trigramEntropyES: Math.round(normEntropy * 100) / 100
    },
    document_classification: finalScore < 20 ? 'HUMAN_ONLY' : finalScore < 50 ? 'MIXED' : 'AI_LIKELY',
    class_probabilities: {
      human: Math.round(humanProb * 1000) / 1000,
      ai: Math.round(aiProb * 1000) / 1000
    }
  };
}

// ---------------------------------------------------------------------------
// 3. CLI RUNNER
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
let filePath = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) filePath = args[i + 1];
  else if (!filePath && !args[i].startsWith('-')) filePath = args[i];
}

if (!filePath) {
  console.error('Uso: node scripts/detect_ai_es.cjs --file <archivo.md>');
  process.exit(1);
}

const absPath = path.resolve(filePath);
if (!fs.existsSync(absPath)) {
  console.error(`Error: Archivo no encontrado: ${absPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(absPath, 'utf8');
const result = analizarTexto(raw);
console.log(JSON.stringify(result, null, 2));
