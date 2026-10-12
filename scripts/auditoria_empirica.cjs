/**
 * auditoria_empirica.cjs — Analizador Matemático y Estilístico para EXTRAMUROS
 * 
 * Calcula métricas empíricas de perplejidad heurística, burstiness (varianza y desviación típica),
 * densidad de gerundios, símiles explícitos, colocaciones de IA y violación de leyes de canon.
 * 
 * Uso:
 *   node scripts/auditoria_empirica.cjs capitulos/cap_02/cap_02.md
 *   node scripts/auditoria_empirica.cjs capitulos/cap_02/cap_02.md --prohibidos "Extramuros,Flujo,Caudal,Quietud,Clase,Segadores"
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. DICCIONARIOS Y PATRONES
// ---------------------------------------------------------------------------

const PALABRAS_CUARENTENA = [
  'ciclópeo', 'ciclópea', 'ciclópeos', 'ciclópeas', 'catedralicio', 'catedralicia',
  'visceral', 'viscerales', 'atávico', 'atávica', 'descomunal', 'descomunales',
  'milimétrico', 'milimétrica', 'desorbitado', 'desorbitada', 'de plomo', 'al rojo vivo',
  'heló la sangre', 'nudo ardiente', 'masa de pesadilla', 'abismal', 'demencial',
  'que desafiaba', 'quirúrgico', 'quirúrgica', 'quirúrgicos', 'aséptico', 'aséptica',
  'obsidiana', 'insondable', 'insondables', 'implacable', 'inquebrantable', 'atronador',
  'fulminante', 'glacial', 'pétrea', 'marmórea', 'trémula', 'incandescente'
];

const CULTISMOS_FORENSES = [
  'légamo', 'esfacelo', 'glauca', 'glauco', 'resolana', 'diaforesis', 'isquemia',
  'fascias', 'orográfico', 'orográfica', 'estólido', 'coruscante', 'cetrino',
  'cetrina', 'parsimonia', 'pátina', 'reverberó', 'reverberaba', 'hendían', 'hendía',
  'acechante', 'ominoso', 'ominosa', 'inefable', 'umbrío', 'umbría', 'lóbrego',
  'exangüe', 'tenebroso', 'carpo', 'dermis', 'aporte calórico', 'tizne', 'tizna', 'tiznado'
];

const COLOCACIONES_IA = [
  /\by entonces\b/gi,
  /\bdemasiado tarde\b/gi,
  /\bpor primera vez\b/gi,
  /\balgo cambió\b/gi,
  /\buna fracción de segundo\b/gi,
  /\ben ese (instante|segundo|momento)\b/gi,
  /\bcontuvo (el aliento|la respiración)\b/gi,
  /\bsin previo aviso\b/gi,
  /\btragó saliva\b/gi,
  /\bapretó la mandíbula\b/gi,
  /\bun escalofrío\b/gi,
  /\bel corazón le (martilleaba|golpeaba|latía desbocado)\b/gi,
  /\bel tiempo pareció\b/gi,
  /\bel mundo (se detuvo|pareció detenerse)\b/gi,
  /\bcon una precisión\b/gi,
  /\bun silencio (sepulcral|absoluto|espeso)\b/gi,
  /\bse le heló la sangre\b/gi,
  /\bno pudo evitar\b/gi,
  /\bcada fibra de su ser\b/gi,
  /\bera como si\b/gi,
  /\buna mezcla de\b/gi,
  /\bpor un momento\b/gi,
  /\bmorderse el labio\b/gi,
  /\bolvidó respirar\b/gi,
  /\bacordó de respirar\b/gi,
  /\bcerteza (amarga|física|absoluta)\b/gi,
  /\bhambre (animal|voraz|atroz)\b/gi,
  /\bfogonazo blanco\b/gi,
  /\bcalor abrasador\b/gi
];

const FALSOS_CONTRASTES = [
  /\bno (era|fue|es|había|hubo|se \w+|\w+ó|\w+aba|\w+ía)\b[^.;:]{0,90}[;:]\s*\w+/gi,
  /\bno (era|fue|es|eran|fueron)\b[^.]{0,90}\bsino\b/gi,
  /\bno (mostraba|mostraban|tenía|tenían|parecía|parecían)\b[^.;]{0,90}[;:]/gi
];

const PATRON_SIMIL = /\bcomo (si|un|una|el|la|los|las|unos|unas|quien|cuando|al)\b|\bdel tamaño de\b|\bancho como\b|\bancho que\b/gi;

const PATRON_GERUNDIO = /\b(\w+(?:ando|iendo|yendo))\b/gi;
const EXCLUIR_GERUNDIOS = new Set([
  'cuando', 'mando', 'comando', 'blando', 'nefando', 'fernando', 'orlando', 'bando',
  'contrabando', 'segundo', 'mundo', 'profundo', 'rotundo', 'fecundo', 'jocundo'
]);

// Adjetivos calificadores frecuentes (control de adjetivitis refleja / epítetos)
const ADJETIVOS_CALIFICADORES_SET = new Set([
  'oscuro', 'oscura', 'oscuros', 'oscuras', 'negro', 'negra', 'negros', 'negras',
  'blanco', 'blanca', 'blancos', 'blancas', 'gris', 'grises', 'rojo', 'roja', 'rojos', 'rojas',
  'azul', 'azules', 'verde', 'verdes', 'seco', 'seca', 'secos', 'secas',
  'humedo', 'humeda', 'humedos', 'humedas', 'frio', 'fria', 'frios', 'frias',
  'tibio', 'tibia', 'tibios', 'tibias', 'caliente', 'calientes', 'calido', 'calida', 'calidos', 'calidas',
  'denso', 'densa', 'densos', 'densas', 'grueso', 'gruesa', 'gruesos', 'gruesas',
  'fino', 'fina', 'finos', 'finas', 'ancho', 'ancha', 'anchos', 'anchas',
  'estrecho', 'estrecha', 'estrechos', 'estrechas', 'largo', 'larga', 'largos', 'largas',
  'corto', 'corta', 'cortos', 'cortas', 'pesado', 'pesada', 'pesados', 'pesadas',
  'ligero', 'ligera', 'ligeros', 'ligeras', 'duro', 'dura', 'duros', 'duras',
  'blando', 'blanda', 'blandos', 'blandas', 'agrio', 'agria', 'agrios', 'agrias',
  'amargo', 'amarga', 'amargos', 'amargas', 'dulce', 'dulces', 'viejo', 'vieja', 'viejos', 'viejas',
  'nuevo', 'nueva', 'nuevos', 'nuevas', 'limpio', 'limpia', 'limpios', 'limpias',
  'sucio', 'sucia', 'sucios', 'sucias', 'puro', 'pura', 'puros', 'puras',
  'vivo', 'viva', 'vivos', 'vivas', 'muerto', 'muerta', 'muertos', 'muertas',
  'sordo', 'sorda', 'sordos', 'sordas', 'agudo', 'aguda', 'agudos', 'agudas',
  'ciego', 'ciega', 'ciegos', 'ciegas', 'rancio', 'rancia', 'rancios', 'rancias',
  'podrido', 'podrida', 'podridos', 'podridas', 'marchito', 'marchita', 'marchitos', 'marchitas',
  'empapado', 'empapada', 'empapados', 'empapadas', 'quemado', 'quemada', 'quemados', 'quemadas',
  'quebrado', 'quebrada', 'quebrados', 'quebradas', 'roto', 'rota', 'rotos', 'rotas',
  'astillado', 'astillada', 'astillados', 'astilladas', 'rajado', 'rajada', 'rajados', 'rajadas',
  'lacerado', 'lacerada', 'lacerados', 'laceradas', 'desbocado', 'desbocada', 'desbocados', 'desbocadas',
  'inerte', 'inertes', 'vegetal', 'vegetales', 'mineral', 'minerales', 'animal', 'animales',
  'fosil', 'fosiles', 'febril', 'febriles', 'volcanico', 'volcanica',
  'sibilante', 'sibilantes', 'constante', 'constantes', 'punzante', 'punzantes',
  'crujiente', 'crujientes', 'aspero', 'aspera', 'asperos', 'asperas',
  'rustico', 'rustica', 'rusticos', 'rusticas', 'menudo', 'menuda', 'menudos', 'menudas',
  'poblado', 'poblada', 'poblados', 'pobladas', 'cortante', 'cortantes', 'afilado', 'afilada', 'afilados', 'afiladas',
  'tenso', 'tensa', 'tensos', 'tensas', 'rigido', 'rigida', 'rigidos', 'rigidas',
  'viscoso', 'viscosa', 'viscosos', 'viscosas', 'lechoso', 'lechosa', 'lechosos', 'lechosas',
  'blanquecino', 'blanquecina', 'blanquecinos', 'blanquecinas',
  'cobrizo', 'cobriza', 'cobrizos', 'cobrizas', 'plomizo', 'plomiza', 'plomizos', 'plomizas',
  'amarillento', 'amarillenta', 'amarillentos', 'amarillentas', 'rojizo', 'rojiza', 'rojizos', 'rojizas',
  'salobre', 'salobres', 'astringente', 'astringentes', 'salvaje', 'salvajes',
  'colosal', 'colosales', 'gigante', 'gigantes', 'inutil', 'inutiles',
  'flaco', 'flaca', 'flacos', 'flacas', 'gordo', 'gorda', 'gordos', 'gordas',
  'precario', 'precaria', 'precarios', 'precarias', 'silencioso', 'silenciosa', 'silenciosos', 'silenciosas',
  'sigiloso', 'sigilosa', 'sigilosos', 'sigilosas', 'hermetico', 'hermetica', 'hermeticos', 'hermeticas',
  'adusto', 'adusta', 'adustos', 'adustas', 'milenario', 'milenaria', 'milenarios', 'milenarias'
].map(s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));

// ---------------------------------------------------------------------------
// 2. FUNCIONES DE CÁLCULO ESTADÍSTICO
// ---------------------------------------------------------------------------

function limpiarTexto(md) {
  // Quitar cabeceras markdown, bloques de código, etc.
  return md
    .replace(/^#+\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*+/g, '')
    .replace(/_+/g, '')
    .trim();
}

function segmentarOraciones(texto) {
  // Segmentar oraciones respetando puntos, signos de exclamación/interrogación
  // y diálogos en guiones
  const regex = /[^.!?\n]+[.!?]+(?:\s+|$)|[^\n]+$/g;
  const rawMatches = texto.match(regex) || [];
  
  return rawMatches
    .map(s => s.trim())
    .filter(s => s.length > 0 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(s));
}

function contarPalabras(texto) {
  const palabras = texto.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+/g);
  return palabras ? palabras.length : 0;
}

function calcularEstadisticasLongitud(oraciones) {
  const longitudes = oraciones.map(o => contarPalabras(o)).filter(l => l > 0);
  if (longitudes.length === 0) return { media: 0, stdDev: 0, min: 0, max: 0, cortas: 0, medias: 0, largas: 0 };

  const total = longitudes.reduce((acc, v) => acc + v, 0);
  const media = total / longitudes.length;

  const varianza = longitudes.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / longitudes.length;
  const stdDev = Math.sqrt(varianza);

  const cortas = longitudes.filter(l => l <= 8).length;
  const medias = longitudes.filter(l => l > 8 && l <= 25).length;
  const largas = longitudes.filter(l => l > 25).length;

  return {
    totalOraciones: longitudes.length,
    media: Math.round(media * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    min: Math.min(...longitudes),
    max: Math.max(...longitudes),
    cortasPct: Math.round((cortas / longitudes.length) * 100),
    mediasPct: Math.round((medias / longitudes.length) * 100),
    largasPct: Math.round((largas / longitudes.length) * 100)
  };
}

function analizarArchivo(rutaArchivo, terminosProhibidos = []) {
  const contenido = fs.readFileSync(rutaArchivo, 'utf8');
  const textoLimpio = limpiarTexto(contenido);
  const totalPalabras = contarPalabras(textoLimpio);
  const oraciones = segmentarOraciones(textoLimpio);
  const metricasRitmo = calcularEstadisticasLongitud(oraciones);

  // 1. Símiles
  const similes = (textoLimpio.match(PATRON_SIMIL) || []);
  const similesPorMil = totalPalabras > 0 ? (similes.length / totalPalabras) * 1000 : 0;

  // 2. Gerundios
  const todosGerundios = (textoLimpio.match(PATRON_GERUNDIO) || []);
  const gerundiosReales = todosGerundios.filter(g => !EXCLUIR_GERUNDIOS.has(g.toLowerCase()));
  const gerundiosPorMil = totalPalabras > 0 ? (gerundiosReales.length / totalPalabras) * 1000 : 0;

  // 3. Falsos contrastes
  let falsosContrastesHits = 0;
  for (const regex of FALSOS_CONTRASTES) {
    const hits = (textoLimpio.match(regex) || []);
    falsosContrastesHits += hits.length;
  }

  // 4. Colocaciones y clichés de IA
  const colocacionesHits = [];
  for (const regex of COLOCACIONES_IA) {
    const hits = (textoLimpio.match(regex) || []);
    for (const h of hits) {
      colocacionesHits.push(h);
    }
  }

  // 5. Palabras en cuarentena
  const cuarentenaHits = [];
  for (const pal of PALABRAS_CUARENTENA) {
    const re = new RegExp(`\\b${pal}\\b`, 'gi');
    const hits = (textoLimpio.match(re) || []);
    for (const h of hits) cuarentenaHits.push(h);
  }

  // 6. Cultismos forenses
  const cultismosHits = [];
  for (const pal of CULTISMOS_FORENSES) {
    const re = new RegExp(`\\b${pal}\\b`, 'gi');
    const hits = (textoLimpio.match(re) || []);
    for (const h of hits) cultismosHits.push(h);
  }

  // 7. Términos prohibidos de canon (Ley 6)
  const prohibidosHits = [];
  for (const pal of terminosProhibidos) {
    if (!pal.trim()) continue;
    const re = new RegExp(`\\b${pal.trim()}\\b`, 'gi');
    const hits = (textoLimpio.match(re) || []);
    for (const h of hits) prohibidosHits.push(h);
  }

  // 8. Adjetivos calificadores (Control de adjetivitis refleja / epítetos)
  const tokens = (textoLimpio.toLowerCase().match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]+/g) || []);
  let countAdjetivos = 0;
  const adjetivosHits = [];
  for (const t of tokens) {
    const tNorm = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (ADJETIVOS_CALIFICADORES_SET.has(tNorm)) {
      countAdjetivos++;
      adjetivosHits.push(t);
    }
  }
  const adjetivosPorMil = totalPalabras > 0 ? (countAdjetivos / totalPalabras) * 1000 : 0;

  // 9. Type-Token Ratio (Diversidad léxica)
  const vocabUnico = new Set(tokens);
  const ttr = tokens.length > 0 ? (vocabUnico.size / tokens.length) * 100 : 0;

  return {
    ruta: rutaArchivo,
    totalPalabras,
    oraciones: metricasRitmo,
    ttr: Math.round(ttr * 10) / 10,
    adjetivos: {
      total: countAdjetivos,
      porMil: Math.round(adjetivosPorMil * 10) / 10,
      ejemplos: adjetivosHits.slice(0, 10)
    },
    similes: {
      total: similes.length,
      porMil: Math.round(similesPorMil * 10) / 10,
      ejemplos: similes.slice(0, 5)
    },
    gerundios: {
      total: gerundiosReales.length,
      porMil: Math.round(gerundiosPorMil * 10) / 10,
      ejemplos: gerundiosReales.slice(0, 5)
    },
    falsosContrastes: falsosContrastesHits,
    colocacionesIA: {
      total: colocacionesHits.length,
      ejemplos: colocacionesHits
    },
    cuarentena: {
      total: cuarentenaHits.length,
      ejemplos: cuarentenaHits
    },
    cultismos: {
      total: cultismosHits.length,
      ejemplos: cultismosHits
    },
    prohibidosLey6: {
      total: prohibidosHits.length,
      ejemplos: prohibidosHits
    }
  };
}

// ---------------------------------------------------------------------------
// 3. GENERACIÓN DEL INFORME EN CONSOLA
// ---------------------------------------------------------------------------

function imprimirInforme(datos) {
  console.log('\n===============================================================');
  console.log('📊 AUDITORÍA EMPÍRICA Y MATEMÁTICA DE PROSA: EXTRAMUROS');
  console.log(`Archivo: ${path.basename(datos.ruta)} (${datos.totalPalabras} palabras)`);
  console.log('===============================================================\n');

  // RITMO Y BURSTINESS
  console.log('1. BURSTINESS Y RITMO SINTÁCTICO (Varianza de longitud):');
  console.log(`   - Total de oraciones:           ${datos.oraciones.totalOraciones}`);
  console.log(`   - Longitud media por frase:     ${datos.oraciones.media} palabras [Ideal humano: 12-18]`);
  console.log(`   - Desviación típica (Burstiness): σ = ${datos.oraciones.stdDev} [Objetivo humano: σ >= 9.5; IA típica: < 6.5]`);
  console.log(`   - Rango:                         Min ${datos.oraciones.min} palabras | Max ${datos.oraciones.max} palabras`);
  console.log(`   - Distribución:                  Cortas (<=8): ${datos.oraciones.cortasPct}% | Medias (9-25): ${datos.oraciones.mediasPct}% | Largas (>25): ${datos.oraciones.largasPct}%`);
  
  if (datos.oraciones.stdDev < 8.0) {
    console.log('   ⚠️ ALERTA BURSTINESS: La varianza métrica es baja. Prosa con compás plano, típica de IA.');
  } else if (datos.oraciones.stdDev >= 9.5) {
    console.log('   ✅ EXCELENTE BURSTINESS: Variación métrica humana y dinámica.');
  } else {
    console.log('   🟡 BURSTINESS MODERADA: Aceptable, pero con margen de alternancia rítmica.');
  }

  // DIVERSIDAD LÉXICA
  console.log(`\n2. DIVERSIDAD LÉXICA (Type-Token Ratio):`);
  console.log(`   - TTR: ${datos.ttr}% [Prosa rica: > 42% en textos < 2.000 palabras]`);

  // SÍMILES
  console.log(`\n3. DENSIDAD DE SÍMILES EXPLICÍCITOS ("como...", "del tamaño de..."):`);
  console.log(`   - Total detectados: ${datos.similes.total} (${datos.similes.porMil} por 1.000 palabras) [Objetivo: <= 3.5 / 1.000]`);
  if (datos.similes.total > 0) {
    console.log(`   - Ejemplos: ${datos.similes.ejemplos.join(', ')}`);
  }
  if (datos.similes.porMil > 4.5) {
    console.log('   ⚠️ ALERTA SÍMILES: Sobredosis de comparaciones de manual. Señal clara de prompt de IA.');
  } else {
    console.log('   ✅ DENSIDAD DE SÍMILES BAJO CONTROL.');
  }

  // GERUNDIOS
  console.log(`\n4. DENSIDAD DE GERUNDIOS (-ando, -iendo):`);
  console.log(`   - Total detectados: ${datos.gerundios.total} (${datos.gerundios.porMil} por 1.000 palabras) [Objetivo: <= 6.0 / 1.000]`);
  if (datos.gerundios.total > 0) {
    console.log(`   - Ejemplos: ${datos.gerundios.ejemplos.join(', ')}`);
  }
  if (datos.gerundios.porMil > 7.0) {
    console.log('   ⚠️ ALERTA GERUNDIOS: Abuso de acciones subordinadas que aplanan el ritmo.');
  } else {
    console.log('   ✅ GERUNDIOS EN RANGO ÓPTIMO.');
  }

  // FALSOS CONTRASTES Y CLICHÉS
  console.log(`\n5. VICIOS SINTÁCTICOS DE IA Y COLOCACIONES:`);
  console.log(`   - Falsos contrastes ("No era X; era Y"): ${datos.falsosContrastes} [Objetivo: 0]`);
  console.log(`   - Colocaciones / Clichés de IA detectados: ${datos.colocacionesIA.total} [Objetivo: <= 1]`);
  if (datos.colocacionesIA.total > 0) {
    console.log(`     Hits: ${datos.colocacionesIA.ejemplos.join(' | ')}`);
  }

  // CUARENTENA Y CULTISMOS
  console.log(`\n6. LÉXICO EN CUARENTENA Y CULTISMOS MÉDICOS:`);
  console.log(`   - Palabras en cuarentena: ${datos.cuarentena.total} [Objetivo: <= 1]`);
  if (datos.cuarentena.total > 0) console.log(`     Hits: ${datos.cuarentena.ejemplos.join(', ')}`);
  console.log(`   - Cultismos de autopsia / forenses: ${datos.cultismos.total} [Objetivo: 0]`);
  if (datos.cultismos.total > 0) console.log(`     Hits: ${datos.cultismos.ejemplos.join(', ')}`);

  // LEY 6
  console.log(`\n7. CUMPLIMIENTO LEY 6 (CERO METACONOCIMIENTO):`);
  console.log(`   - Términos prohibidos filtrados: ${datos.prohibidosLey6.total} [Objetivo: 0 estricto]`);
  if (datos.prohibidosLey6.total > 0) {
    console.log(`     ❌ VIOLACIÓN CANÓNICA: ${datos.prohibidosLey6.ejemplos.join(', ')}`);
  } else {
    console.log('     ✅ CERO METACONOCIMIENTO RESPETADO.');
  }

  // SOBRIEDAD ADJETIVAL
  console.log(`\n8. SOBRIEDAD ADJETIVAL (Control de modificación nominal compulsiva):`);
  console.log(`   - Adjetivos detectados:         ${datos.adjetivos.total} (${datos.adjetivos.porMil} por 1.000 palabras) [Objetivo humano: <= 22.0 / 1.000]`);
  if (datos.adjetivos.porMil > 22.0) {
    console.log(`   ⚠️ ALERTA ADJETIVITIS: Densidad excesiva (${datos.adjetivos.porMil}/1000). Sustantivos asfixiados por modificación refleja.`);
    console.log(`     Muestra: ${datos.adjetivos.ejemplos.join(', ')}...`);
  } else {
    console.log('   ✅ SOBRIEDAD ADJETIVAL ÓPTIMA: Los sustantivos y las acciones respiran con peso inmanente.');
  }

  console.log('\n===============================================================');
  const puntuacionSalud = calcularPuntuacionSalud(datos);
  console.log(`ÍNDICE DE SALUD EMPÍRICA PROSAICA: ${puntuacionSalud} / 100`);
  console.log('===============================================================\n');
}

function calcularPuntuacionSalud(datos) {
  let score = 100;
  // Penalizaciones objetivas
  if (datos.oraciones.stdDev < 8.0) score -= 15;
  else if (datos.oraciones.stdDev < 9.5) score -= 5;

  if (datos.similes.porMil > 4.0) score -= Math.round((datos.similes.porMil - 4.0) * 5);
  if (datos.gerundios.porMil > 6.0) score -= Math.round((datos.gerundios.porMil - 6.0) * 4);

  if (datos.adjetivos && datos.adjetivos.porMil > 22.0) {
    score -= Math.round((datos.adjetivos.porMil - 22.0) * 1.5);
  }

  score -= (datos.falsosContrastes * 8);
  score -= (datos.colocacionesIA.total * 6);
  score -= (datos.cuarentena.total * 4);
  score -= (datos.cultismos.total * 6);
  score -= (datos.prohibidosLey6.total * 25);

  return Math.max(0, Math.min(100, score));
}

// ---------------------------------------------------------------------------
// 4. EJECUCIÓN PRINCIPAL CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Uso: node scripts/auditoria_empirica.cjs <ruta_archivo.md> [--prohibidos "term1,term2"]');
  process.exit(1);
}

const rutaArchivo = args[0];
let prohibidos = ['Extramuros', 'Flujo', 'Caudal', 'Quietud', 'Clase', 'Segadores', 'Omega', 'Puerto Raíz', 'Bastión', 'Wayra', 'Contención'];

const idxProh = args.indexOf('--prohibidos');
if (idxProh !== -1 && args[idxProh + 1]) {
  prohibidos = args[idxProh + 1].split(',').map(s => s.trim());
}

if (!fs.existsSync(rutaArchivo)) {
  console.error(`Error: El archivo no existe: ${rutaArchivo}`);
  process.exit(1);
}

const resultado = analizarArchivo(rutaArchivo, prohibidos);
imprimirInforme(resultado);
