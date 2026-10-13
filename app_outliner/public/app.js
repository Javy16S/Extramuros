/**
 * Lógica Frontend - Extramuros Outliner
 * Gestión de vistas (Corcho, Escaleta, Lector), Binder/Sidebar, Filtros e Inspector
 */

let state = {
  chapters: [],
  selectedChapterId: 'all', // 'all' o 'cap_01', etc.
  currentView: 'corkboard', // 'corkboard', 'timeline', 'manuscript'
  selectedCard: null,
  activeCharFilter: null,
  searchQuery: ''
};

// Cargar datos desde la API local
async function loadData() {
  try {
    const res = await fetch('/api/chapters');
    if (!res.ok) throw new Error('Error al conectar con la API local');
    state.chapters = await res.json();
    renderAll();
  } catch (err) {
    console.error('Error cargando capítulos:', err);
  }
}

function renderAll() {
  updateMetrics();
  renderSidebar();
  renderCharacterPills();
  renderCurrentView();
}

// 1. Métricas Globales
function updateMetrics() {
  const totalChapters = state.chapters.length;
  let totalScenes = 0;
  let totalWords = 0;

  state.chapters.forEach(c => {
    totalScenes += c.scenes.length;
    totalWords += c.totalWords;
  });

  document.getElementById('metric-chapters').textContent = totalChapters;
  document.getElementById('metric-scenes').textContent = totalScenes;
  document.getElementById('metric-words').textContent = totalWords.toLocaleString();
}

// 2. Sidebar / Binder
function renderSidebar() {
  const nav = document.getElementById('chapters-nav');
  nav.innerHTML = '';

  // Elemento "Todos los Capítulos"
  const allItem = document.createElement('div');
  allItem.className = `nav-item ${state.selectedChapterId === 'all' ? 'active' : ''}`;
  allItem.innerHTML = `
    <span>📚 Manuscrito Completo</span>
    <span class="nav-item-badge">${state.chapters.length} caps</span>
  `;
  allItem.onclick = () => selectChapter('all');
  nav.appendChild(allItem);

  // Lista de capítulos individuales
  state.chapters.forEach(cap => {
    const item = document.createElement('div');
    item.className = `nav-item ${state.selectedChapterId === cap.id ? 'active' : ''}`;
    
    // Simplificar título corto
    const shortTitle = cap.title.split(':')[1] ? cap.title.split(':')[1].trim() : cap.title;
    const capNum = cap.id.replace('cap_', 'C.');

    item.innerHTML = `
      <span><strong>${capNum}</strong>: ${shortTitle}</span>
      <span class="nav-item-badge">${cap.scenes.length} esc</span>
    `;
    item.onclick = () => selectChapter(cap.id);
    nav.appendChild(item);
  });
}

// 3. Píldoras de Personajes
function renderCharacterPills() {
  const container = document.getElementById('character-pills');
  container.innerHTML = '';

  const charsSet = new Set();
  state.chapters.forEach(c => {
    c.personajes.forEach(p => {
      // Limpiar nombres como "Leo Vanes (24 años)" -> "Leo Vanes"
      const clean = p.name.replace(/\(.*?\)/, '').trim();
      if (clean) charsSet.add(clean);
    });
  });

  charsSet.forEach(charName => {
    const pill = document.createElement('span');
    pill.className = `char-pill ${state.activeCharFilter === charName ? 'active' : ''}`;
    pill.textContent = charName;
    pill.onclick = () => {
      state.activeCharFilter = state.activeCharFilter === charName ? null : charName;
      renderCharacterPills();
      renderCurrentView();
    };
    container.appendChild(pill);
  });
}

// Seleccionar capítulo
function selectChapter(capId) {
  state.selectedChapterId = capId;
  renderSidebar();

  const heading = document.getElementById('current-chapter-heading');
  const tag = document.getElementById('current-chapter-tag');

  if (capId === 'all') {
    tag.textContent = 'MANUSCRITO COMPLETO';
    heading.textContent = 'Todos los Capítulos y Escenas';
  } else {
    const cap = state.chapters.find(c => c.id === capId);
    tag.textContent = cap.id.toUpperCase();
    heading.textContent = cap.title;
  }

  renderCurrentView();
}

// Renderizar la vista activa
function renderCurrentView() {
  if (state.currentView === 'corkboard') {
    renderCorkboard();
  } else if (state.currentView === 'timeline') {
    renderTimeline();
  } else if (state.currentView === 'manuscript') {
    renderManuscript();
  }
}

// --- VISTA 1: CORCHO (INDEX CARDS) ---
function renderCorkboard() {
  const grid = document.getElementById('corkboard-grid');
  grid.innerHTML = '';

  const visibleChapters = state.selectedChapterId === 'all' 
    ? state.chapters 
    : state.chapters.filter(c => c.id === state.selectedChapterId);

  visibleChapters.forEach(cap => {
    cap.scenes.forEach(scene => {
      // Filtros de búsqueda o personajes
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const match = scene.title.toLowerCase().includes(q) || 
                      scene.content.toLowerCase().includes(q) ||
                      scene.synopsis.toLowerCase().includes(q);
        if (!match) return;
      }

      if (state.activeCharFilter) {
        const hasChar = cap.personajes.some(p => p.name.includes(state.activeCharFilter));
        if (!hasChar) return;
      }

      const card = document.createElement('div');
      card.className = `index-card ${state.selectedCard === scene ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="card-pin"></div>
        <div class="card-header">
          <span class="card-number">${cap.id.toUpperCase()} • E.${scene.number}</span>
          <span class="card-title" title="${scene.title}">${scene.title}</span>
        </div>
        <div class="card-body">
          <p class="card-synopsis">${scene.synopsis || 'Sin descripción disponible.'}</p>
        </div>
        <div class="card-footer">
          <span class="card-words">📝 ${scene.words.toLocaleString()} palabras</span>
          <span>⏱ ~${Math.ceil(scene.words / 220)} min</span>
        </div>
      `;
      card.onclick = () => openInspector(scene, cap);
      grid.appendChild(card);
    });
  });

  if (grid.children.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 60px 0;">No se encontraron tarjetas con los filtros seleccionados.</div>`;
  }
}

// --- VISTA 2: ESCALETA DE SUCESOS (TIMELINE / OUTLINE) ---
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  container.innerHTML = '';

  const visibleChapters = state.selectedChapterId === 'all' 
    ? state.chapters 
    : state.chapters.filter(c => c.id === state.selectedChapterId);

  visibleChapters.forEach(cap => {
    const group = document.createElement('div');
    group.className = 'timeline-chapter-group';

    const heading = document.createElement('div');
    heading.className = 'timeline-chapter-heading';
    heading.innerHTML = `<span>${cap.title}</span> <span style="font-size: 12px; color: var(--text-muted); font-weight: 400;">(${cap.totalWords.toLocaleString()} palabras)</span>`;
    group.appendChild(heading);

    if (cap.sucesos.length === 0) {
      const emptyNote = document.createElement('div');
      emptyNote.style.color = 'var(--text-dim)';
      emptyNote.style.fontSize = '13px';
      emptyNote.style.padding = '8px 0 16px';
      emptyNote.textContent = 'Sin sucesos estructurados para este capítulo.';
      group.appendChild(emptyNote);
    } else {
      cap.sucesos.forEach(suc => {
        // Filtro de búsqueda
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          const match = suc.title.toLowerCase().includes(q) || 
                        suc.description.toLowerCase().includes(q);
          if (!match) return;
        }

        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        let bulletsHtml = '';
        if (suc.bullets && suc.bullets.length > 0) {
          bulletsHtml = `<ul class="timeline-bullets">${suc.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
        }

        item.innerHTML = `
          <div class="timeline-marker">${suc.number}</div>
          <div class="timeline-card">
            <h4 class="timeline-item-title">${suc.title}</h4>
            <p class="timeline-item-desc">${suc.description}</p>
            ${bulletsHtml}
          </div>
        `;
        group.appendChild(item);
      });
    }

    container.appendChild(group);
  });
}

// --- VISTA 3: LECTOR DE MANUSCRITO ---
function renderManuscript() {
  const reader = document.getElementById('manuscript-reader');
  const tocList = document.getElementById('manuscript-toc-list');
  const persList = document.getElementById('manuscript-pers-list');
  const tramasList = document.getElementById('manuscript-tramas-list');

  tocList.innerHTML = '';
  persList.innerHTML = '';
  tramasList.innerHTML = '';

  const activeCap = state.selectedChapterId === 'all' 
    ? state.chapters[0] 
    : state.chapters.find(c => c.id === state.selectedChapterId);

  if (!activeCap) {
    reader.innerHTML = '<p>No hay capítulo seleccionado.</p>';
    return;
  }

  // Generar TOC
  activeCap.scenes.forEach(s => {
    const tocItem = document.createElement('div');
    tocItem.className = 'toc-item';
    tocItem.textContent = `${s.number}. ${s.title}`;
    tocItem.onclick = () => {
      const el = document.getElementById(`doc-${s.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    tocList.appendChild(tocItem);
  });

  // Generar Personajes
  if (activeCap.personajes.length > 0) {
    activeCap.personajes.forEach(p => {
      const tag = document.createElement('div');
      tag.className = 'mini-tag';
      tag.innerHTML = `<strong>${p.name}:</strong> ${p.role}`;
      persList.appendChild(tag);
    });
  } else {
    persList.innerHTML = '<span style="color:var(--text-dim); font-size:12px;">Sin registro</span>';
  }

  // Generar Tramas
  if (activeCap.tramas.length > 0) {
    activeCap.tramas.forEach(t => {
      const tag = document.createElement('div');
      tag.className = 'mini-tag';
      tag.innerHTML = `<strong>${t.trama}:</strong> ${t.detail || ''}`;
      tramasList.appendChild(tag);
    });
  } else {
    tramasList.innerHTML = '<span style="color:var(--text-dim); font-size:12px;">Sin registro</span>';
  }

  // Renderizar Texto con separadores
  let html = `<h1>${activeCap.title}</h1>`;
  activeCap.scenes.forEach((s, idx) => {
    if (idx > 0) {
      html += `<div class="scene-break">***</div>`;
    }
    html += `<div id="doc-${s.id}">`;
    const paragraphs = s.content.split(/\n\s*\n/).filter(p => !p.startsWith('#') && p.trim().length > 0);
    paragraphs.forEach(p => {
      html += `<p>${p.replace(/\n/g, ' ')}</p>`;
    });
    html += `</div>`;
  });

  reader.innerHTML = html;
}

// --- INSPECTOR LATERAL ---
function openInspector(scene, cap) {
  state.selectedCard = scene;
  const panel = document.getElementById('inspector-panel');
  panel.classList.remove('collapsed');

  document.getElementById('insp-title').textContent = scene.title;
  document.getElementById('insp-chapter').textContent = cap.title;
  document.getElementById('insp-words').textContent = scene.words.toLocaleString();
  document.getElementById('insp-reading-time').textContent = `~${Math.ceil(scene.words / 220)} min`;
  document.getElementById('insp-synopsis').textContent = scene.synopsis || 'Sin sinopsis disponible.';
  document.getElementById('insp-raw-text').textContent = scene.content;

  // Refrescar selección en tarjetas
  document.querySelectorAll('.index-card').forEach(el => el.classList.remove('selected'));
  renderCorkboard();
}

function closeInspector() {
  document.getElementById('inspector-panel').classList.add('collapsed');
  state.selectedCard = null;
  document.querySelectorAll('.index-card').forEach(el => el.classList.remove('selected'));
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  // Cambio de vista
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const viewId = btn.getAttribute('data-view');
      state.currentView = viewId;
      document.getElementById(`view-${viewId}`).classList.add('active');
      renderCurrentView();
    };
  });

  // Cerrar inspector
  document.getElementById('btn-close-inspector').onclick = closeInspector;

  // Botón refrescar
  document.getElementById('btn-refresh').onclick = loadData;

  // Botón ver todo
  document.getElementById('btn-toggle-all').onclick = () => selectChapter('all');

  // Input de búsqueda
  const searchInput = document.getElementById('filter-search');
  searchInput.oninput = (e) => {
    state.searchQuery = e.target.value.trim();
    renderCurrentView();
  };

  // Carga inicial
  loadData();
});
