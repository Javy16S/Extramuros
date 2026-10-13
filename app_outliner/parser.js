/**
 * Parser Robusto y Polimórfico de Capítulos y Escenas para Extramuros Outliner
 * Lee la estructura canónica del repositorio:
 *  - capitulos/cap_XX/cap_XX.md
 *  - capitulos/cap_XX/informacion_capitulo/{resumen.md, sucesos.md, personajes.md, tramas.md}
 */

const fs = require('fs');
const path = require('path');

function getProjectRoot() {
  return path.resolve(__dirname, '..');
}

function normalizeNewlines(str) {
  return (str || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function parseMarkdownScenes(content) {
  const norm = normalizeNewlines(content);
  // Dividir por separadores canónicos de escena: *** o ---
  const rawChunks = norm.split(/\n\s*(?:\*\*\*|---)\s*\n/);
  
  return rawChunks.map((chunk, index) => {
    const lines = chunk.trim().split('\n').filter(l => l.trim().length > 0);
    const titleMatch = lines[0] && lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : null;
    
    let title = titleMatch || `Escena ${index + 1}`;
    let bodyLines = titleMatch ? lines.slice(1) : lines;
    
    // Extraer primer párrafo de texto real (sin cabeceras)
    const firstParagraph = bodyLines.find(l => !l.startsWith('#') && l.trim().length > 10) || '';
    const synopsis = firstParagraph.replace(/[*_#]/g, '').trim().slice(0, 240) + (firstParagraph.length > 240 ? '...' : '');
    
    const words = chunk.trim().split(/\s+/).filter(Boolean).length;
    
    return {
      id: `scene-${index + 1}`,
      number: index + 1,
      title,
      words,
      synopsis,
      content: chunk.trim()
    };
  });
}

function parseSucesos(rawText) {
  if (!rawText) return [];
  const lines = normalizeNewlines(rawText).split('\n');
  const sucesos = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Coincide "1. **Titulo** algo" o "1. **Titulo:** algo"
    const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:?\s*(.*)$/);
    if (match) {
      if (current) sucesos.push(current);
      current = {
        number: parseInt(match[1], 10),
        title: match[2].replace(/:$/, '').trim(),
        description: match[3] ? match[3].trim() : '',
        bullets: []
      };
    } else if (current && line.startsWith('-')) {
      current.bullets.push(line.replace(/^-\s*/, '').trim());
    } else if (current && !line.startsWith('#')) {
      if (!current.description) {
        current.description = line;
      } else {
        current.description += ' ' + line;
      }
    }
  }
  if (current) sucesos.push(current);
  return sucesos;
}

function parsePersonajes(rawText) {
  if (!rawText) return [];
  const lines = normalizeNewlines(rawText).split('\n');
  const chars = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Caso 1: Estilo viñeta simple (* **Nombre:** Descripción)
    const bulletMatch = line.match(/^\*\s+\*\*(.+?)\*\*:?\s*(.*)$/);
    if (bulletMatch) {
      if (current) chars.push(current);
      current = null;
      chars.push({
        name: bulletMatch[1].replace(/:$/, '').trim(),
        role: bulletMatch[2] ? bulletMatch[2].trim() : '',
        details: []
      });
      continue;
    }

    // Caso 2: Estilo encabezado (### 1. Nombre o ### Nombre)
    const headerMatch = line.match(/^###\s*(?:\d+\.\s*)?(.+)$/);
    if (headerMatch) {
      if (current) chars.push(current);
      current = {
        name: headerMatch[1].replace(/[*_#]/g, '').trim(),
        role: '',
        details: []
      };
      continue;
    }

    if (current) {
      if (line.startsWith('-')) {
        current.details.push(line.replace(/^-\s*/, '').trim());
      } else if (!current.role && !line.startsWith('#')) {
        current.role = line;
      }
    }
  }

  if (current) chars.push(current);
  return chars;
}

function parseTramas(rawText) {
  if (!rawText) return [];
  const lines = normalizeNewlines(rawText).split('\n');
  const tramas = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Caso 1: Viñeta simple (* **Trama:** Detalle)
    const bulletMatch = line.match(/^\*\s+\*\*(.+?)\*\*:?\s*(.*)$/);
    if (bulletMatch) {
      if (current) tramas.push(current);
      current = null;
      tramas.push({
        trama: bulletMatch[1].replace(/:$/, '').trim(),
        detail: bulletMatch[2] ? bulletMatch[2].trim() : '',
        bullets: []
      });
      continue;
    }

    // Caso 2: Encabezado (### 1. Trama: Nombre)
    const headerMatch = line.match(/^###\s*(?:\d+\.\s*)?(.+)$/);
    if (headerMatch) {
      if (current) tramas.push(current);
      current = {
        trama: headerMatch[1].replace(/[*_#]/g, '').trim(),
        detail: '',
        bullets: []
      };
      continue;
    }

    if (current) {
      if (line.startsWith('-')) {
        current.bullets.push(line.replace(/^-\s*/, '').trim());
      } else if (!current.detail && !line.startsWith('#')) {
        current.detail = line;
      }
    }
  }

  if (current) tramas.push(current);
  return tramas;
}

function getChaptersData() {
  const root = getProjectRoot();
  const capDir = path.join(root, 'capitulos');
  if (!fs.existsSync(capDir)) return [];

  const folders = fs.readdirSync(capDir).filter(f => f.startsWith('cap_')).sort();

  const chapters = folders.map(folder => {
    const capFolder = path.join(capDir, folder);
    const mdFile = path.join(capFolder, `${folder}.md`);
    const infoDir = path.join(capFolder, 'informacion_capitulo');

    let content = '';
    if (fs.existsSync(mdFile)) {
      content = fs.readFileSync(mdFile, 'utf8');
    }

    let resumen = '';
    const resFile = path.join(infoDir, 'resumen.md');
    if (fs.existsSync(resFile)) {
      resumen = fs.readFileSync(resFile, 'utf8').replace(/^#.*?\n/, '').trim();
    }

    let sucesosRaw = '';
    const sucFile = path.join(infoDir, 'sucesos.md');
    if (fs.existsSync(sucFile)) {
      sucesosRaw = fs.readFileSync(sucFile, 'utf8');
    }
    const sucesos = parseSucesos(sucesosRaw);

    let persRaw = '';
    const persFile = path.join(infoDir, 'personajes.md');
    if (fs.existsSync(persFile)) {
      persRaw = fs.readFileSync(persFile, 'utf8');
    }
    const personajes = parsePersonajes(persRaw);

    let tramRaw = '';
    const tramFile = path.join(infoDir, 'tramas.md');
    if (fs.existsSync(tramFile)) {
      tramRaw = fs.readFileSync(tramFile, 'utf8');
    }
    const tramas = parseTramas(tramRaw);

    const scenes = parseMarkdownScenes(content);
    const totalWords = content.trim().split(/\s+/).filter(Boolean).length;

    // Extraer título limpio de H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    const title = h1Match ? h1Match[1].trim() : folder.toUpperCase();

    return {
      id: folder,
      title,
      totalWords,
      resumen,
      sucesos,
      personajes,
      tramas,
      scenes,
      fullMarkdown: content
    };
  });

  return chapters;
}

module.exports = {
  getChaptersData,
  parseMarkdownScenes,
  parseSucesos,
  parsePersonajes,
  parseTramas,
  normalizeNewlines
};
