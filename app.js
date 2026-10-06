'use strict';

/* ═══════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function fmt(s) {
    const m  = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function syncRange(el) {
    const p = el.value + '%';
    el.style.background =
        `linear-gradient(90deg, #FF2D78 ${p}, rgba(255,255,255,.12) ${p})`;
}

// Expose globals used by inline onclick attributes
window.toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
};

window.showToast = showToast; // make globally callable (e.g. from profile avatar btn)


/* ═══════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════ */
const TOAST_ICONS = {
    success:  'fa-check-circle',
    download: 'fa-download',
    info:     'fa-info-circle',
    warning:  'fa-exclamation-triangle',
};

function showToast(msg, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const el        = document.createElement('div');
    el.className    = `toast toast-${type}`;
    el.innerHTML    = `
        <i class="fas ${TOAST_ICONS[type] || TOAST_ICONS.info} t-icon"></i>
        <span>${msg}</span>
        <button class="toast-close" aria-label="Fechar"><i class="fas fa-times"></i></button>`;

    container.appendChild(el);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => el.classList.add('show'));

    el.querySelector('.toast-close').addEventListener('click', () => dismissToast(el));
    setTimeout(() => dismissToast(el), duration);
}

function dismissToast(el) {
    if (!el.parentElement) return;
    el.classList.remove('show');
    el.classList.add('hide');
    setTimeout(() => el.remove(), 400);
}


/* ═══════════════════════════════════════════════════════
   PACKS DATA
═══════════════════════════════════════════════════════ */
const PACKS_DATA = {
    'pack-1': {
        model: 'Sofia Melo', initial: 'S',
        gradient: 'linear-gradient(135deg,#c0185a,#6d1580)',
        title: 'Verão 2026', count: 15, size: '2.4 GB',
        tags: ['Fotos', 'Vídeos'],
        files: [
            { name: 'Ensaio Praia — Manhã.zip',  type: 'zip',   size: '890 MB' },
            { name: 'Pool Session.mp4',           type: 'video', size: '720 MB' },
            { name: 'Studio Íntimo vol.1.zip',    type: 'zip',   size: '540 MB' },
            { name: 'Making Of BTS.mp4',          type: 'video', size: '250 MB' },
        ],
    },
    'pack-2': {
        model: 'Sofia Melo', initial: 'S',
        gradient: 'linear-gradient(135deg,#8c1a2e,#3a0a20)',
        title: 'Noite Especial', count: 10, size: '1.8 GB',
        tags: ['Fotos', 'PDF'],
        files: [
            { name: 'Ensaio Noturno.zip',         type: 'zip',   size: '980 MB' },
            { name: 'Look Book Noite.pdf',        type: 'pdf',   size: '45 MB'  },
            { name: 'Extras — Bônus.zip',         type: 'zip',   size: '780 MB' },
        ],
    },
    'pack-3': {
        model: 'Luna Ferreira', initial: 'L',
        gradient: 'linear-gradient(135deg,#3c1270,#1e0640)',
        title: 'Studio Vol.1', count: 12, size: '3.1 GB',
        tags: ['Vídeos', 'Fotos'],
        files: [
            { name: 'Sessão Studio Completa.zip', type: 'zip',   size: '1.4 GB' },
            { name: 'Vídeo Premium — 4K.mp4',    type: 'video', size: '1.2 GB' },
            { name: 'Behind The Scenes.mp4',     type: 'video', size: '500 MB' },
        ],
    },
    'pack-4': {
        model: 'Valentina Cruz', initial: 'V',
        gradient: 'linear-gradient(135deg,#1a3a60,#0d1e40)',
        title: 'Dark Elegance', count: 8, size: '1.2 GB',
        tags: ['Fotos', 'PDF'],
        files: [
            { name: 'Dark Collection.zip',        type: 'zip',   size: '850 MB' },
            { name: 'Look Book — Dark.pdf',       type: 'pdf',   size: '28 MB'  },
            { name: 'Extras — Polaroids.zip',     type: 'zip',   size: '322 MB' },
        ],
    },
    'pack-5': {
        model: 'Valentina Cruz', initial: 'V',
        gradient: 'linear-gradient(135deg,#5a4000,#2a1e00)',
        title: 'Gold Edition', count: 14, size: '2.8 GB',
        tags: ['Vídeos', 'Fotos'],
        files: [
            { name: 'Gold Photoshoot.zip',        type: 'zip',   size: '1.1 GB' },
            { name: 'Vídeo Gold — Exclusivo.mp4', type: 'video', size: '1.3 GB' },
            { name: 'Digital Wallpapers.zip',     type: 'zip',   size: '400 MB' },
        ],
    },
    'pack-6': {
        model: 'Isabella Rocha', initial: 'I',
        gradient: 'linear-gradient(135deg,#1e5a3a,#0a2e1e)',
        title: 'Premium Collection', count: 18, size: '4.2 GB',
        tags: ['Fotos', 'Vídeos', 'PDF'],
        files: [
            { name: 'Vol.1 — Natureza.zip',       type: 'zip',   size: '1.8 GB' },
            { name: 'Vídeo Exclusivo HD.mp4',     type: 'video', size: '1.6 GB' },
            { name: 'Vol.2 — Studio.zip',         type: 'zip',   size: '650 MB' },
            { name: 'Guia de Poses.pdf',          type: 'pdf',   size: '18 MB'  },
            { name: 'Extras Pack.zip',            type: 'zip',   size: '152 MB' },
        ],
    },
};

/* ═══════════════════════════════════════════════════════
   SPA ROUTER
═══════════════════════════════════════════════════════ */
const PAGE_TITLES = {
    dashboard: 'Dashboard',
    audios:    'Biblioteca de Áudios',
    videos:    'Vídeos',
    galeria:   'Galeria de Fotos',
    materials: 'Materiais e Scripts',
    packs:     'Packs de Modelos',
    support:   'Suporte',
    profile:   'Meu Perfil',
};

const Router = {
    current: 'dashboard',

    init() {
        $$('.nav-item[data-view]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                this.navigate(link.dataset.view);
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 768) window.toggleSidebar();
            });
        });
    },

    navigate(viewId) {
        if (this.current === viewId) return;

        // Pause any active audio
        if (activePlayer) activePlayer.pause();

        // Swap visible view
        $$('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById('view-' + viewId);
        if (!target) return;
        target.classList.add('active');

        // Update nav highlight
        $$('.nav-item').forEach(n => n.classList.remove('active'));
        const navEl = $(`[data-view="${viewId}"]`);
        if (navEl) navEl.classList.add('active');

        // Update header title
        const titleEl = document.getElementById('header-page-title');
        if (titleEl) titleEl.textContent = PAGE_TITLES[viewId] || 'Hotfy';

        this.current = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
};


/* ═══════════════════════════════════════════════════════
   AUDIO PLAYER — HTML5 real com streaming do Drive
═══════════════════════════════════════════════════════ */
let activePlayer     = null;
const PlayerRegistry = {};

class AudioPlayer {
    constructor(cardEl) {
        this.card    = cardEl;
        this.id      = cardEl.id;
        this.playing = false;

        this.rangeEl   = cardEl.querySelector('.range');
        this.playBtn   = cardEl.querySelector('.play-btn');
        this.timeCurEl = cardEl.querySelector('.time-cur');
        this.timeDurEl = cardEl.querySelector('.time-dur');

        // HTML5 Audio com URL do Drive (data-src) ou simulado se não houver
        const src = cardEl.dataset.src;
        if (src) {
            this.audio    = new Audio();
            this.audio.preload = 'none'; // só carrega quando o usuário clicar

            this.audio.addEventListener('loadedmetadata', () => {
                if (this.timeDurEl) this.timeDurEl.textContent = fmt(this.audio.duration);
            });
            this.audio.addEventListener('timeupdate', () => this._updateUI());
            this.audio.addEventListener('ended', () => {
                this.pause();
                showToast('Áudio concluído! ✔', 'success');
            });
            this.audio.addEventListener('error', () => {
                // Proxy falhou (ex: não está rodando) — mostra instrução
                const name = this.card.querySelector('p.text-sm.font-medium')?.textContent || 'Áudio';
                showToast('Proxy offline. Rode: python proxy.py', 'warning');
                console.warn('Proxy offline. Inicie hotfy/proxy.py para streaming de áudio.');
                this.pause();
            });
        } else {
            // fallback simulado para cards sem src
            this.audio  = null;
            this.dur    = parseInt(cardEl.dataset.duration, 10) || 0;
            this.cur    = parseInt(cardEl.dataset.start,    10) || 0;
            this._timer = null;
        }

        if (this.playBtn) {
            this.playBtn.addEventListener('click', e => {
                e.stopPropagation();
                this.toggle();
            });
        }

        if (this.rangeEl) {
            this.rangeEl.addEventListener('input', () => {
                if (this.audio) {
                    this.audio.currentTime = (+this.rangeEl.value / 100) * (this.audio.duration || 0);
                } else {
                    this.cur = Math.round((+this.rangeEl.value / 100) * this.dur);
                    this._updateUI();
                }
            });
        }

        if (!this.audio) this._updateUI();
        PlayerRegistry[this.id] = this;
    }

    toggle() { this.playing ? this.pause() : this.play(); }

    play() {
        if (activePlayer && activePlayer !== this) activePlayer.pause();
        activePlayer = this;
        this.playing = true;
        this.card.classList.add('is-playing');
        this._syncIcon();

        if (this.audio) {
            // lazy: só define o src na primeira vez que o usuário clicar em play
            if (!this.audio.src && this.card.dataset.src) {
                this.audio.src = this.card.dataset.src;
            }
            this.audio.play().catch(() => showToast('Erro ao reproduzir áudio.', 'warning'));
        } else {
            this._timer = setInterval(() => {
                this.cur++;
                if (this.cur >= this.dur) { this.cur = this.dur; this._updateUI(); this.pause(); showToast('Áudio concluído! ✔', 'success'); return; }
                this._updateUI();
            }, 1000);
        }
    }

    pause() {
        this.playing = false;
        if (this.audio) this.audio.pause();
        else { clearInterval(this._timer); this._timer = null; }
        this.card.classList.remove('is-playing');
        this._syncIcon();
        if (activePlayer === this) activePlayer = null;
    }

    _syncIcon() {
        const icon = this.playBtn?.querySelector('i');
        if (icon) icon.className = this.playing ? 'fas fa-pause' : 'fas fa-play';
    }

    _updateUI() {
        let pct = 0;
        if (this.audio) {
            const dur = this.audio.duration || 0;
            pct = dur > 0 ? (this.audio.currentTime / dur) * 100 : 0;
            if (this.timeCurEl) this.timeCurEl.textContent = fmt(this.audio.currentTime);
        } else {
            pct = this.dur > 0 ? (this.cur / this.dur) * 100 : 0;
            if (this.timeCurEl) this.timeCurEl.textContent = fmt(this.cur);
        }
        if (this.rangeEl) { this.rangeEl.value = pct; syncRange(this.rangeEl); }
    }
}

function initPlayers() {
    $$('.audio-card[id]').forEach(card => {
        if (!PlayerRegistry[card.id]) new AudioPlayer(card);
    });
    const continueBtn = document.getElementById('player-0');
    if (continueBtn && !PlayerRegistry['player-0']) {
        const parentCard = continueBtn.closest('.continue-card');
        if (parentCard) {
            parentCard.id               = 'player-0';
            parentCard.dataset.duration = continueBtn.dataset.duration;
            parentCard.dataset.start    = continueBtn.dataset.start;
            new AudioPlayer(parentCard);
        }
    }
}


/* ═══════════════════════════════════════════════════════
   CONTENT LOADER — carrega content.json do Drive
═══════════════════════════════════════════════════════ */
const WAVE_HTML = `<span style="height:30%"></span><span style="height:60%"></span><span style="height:80%"></span><span style="height:50%"></span><span style="height:90%"></span><span style="height:40%"></span><span style="height:70%"></span><span style="height:55%"></span><span style="height:85%"></span><span style="height:45%"></span><span style="height:65%"></span><span style="height:35%"></span><span style="height:75%"></span><span style="height:50%"></span><span style="height:80%"></span>`;

const GRADIENTS = [
    'linear-gradient(135deg,#c0185a,#6d1580)',
    'linear-gradient(135deg,#3c1270,#1e0640)',
    'linear-gradient(135deg,#8c1a2e,#3a0a20)',
    'linear-gradient(135deg,#1a3a60,#0d1e40)',
    'linear-gradient(135deg,#1e5a3a,#0a2e1e)',
    'linear-gradient(135deg,#5a4000,#2a1e00)',
];

async function loadContent() {
    try {
        const res = await fetch('content.json');
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

function buildAudioCard(item, index) {
    const pid     = `player-drive-${index}`;
    const grad    = GRADIENTS[index % GRADIENTS.length];
    const name    = item.name.replace(/\.[^.]+$/, '').replace(/^\d+[\s_]+/, '').replace(/_/g, ' ');
    const audioSrc = `http://localhost:8765/stream?id=${item.id}`;
    return `
    <div class="audio-card-wrap">
      <div class="card audio-card p-5" id="${pid}" data-src="${audioSrc}" data-file-id="${item.id}" data-category="guia">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background:${grad}">
            <i class="fas fa-microphone text-white card-icon"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1"><span class="tag">Áudio</span></div>
            <p class="text-sm font-medium truncate" title="${name}">${name}</p>
            <p class="text-xs mt-0.5" style="color:rgba(255,255,255,.38)">${item.size_mb} MB</p>
          </div>
        </div>
        <div class="wave-static mb-3.5">${WAVE_HTML}</div>
        <div class="mb-3">
          <input type="range" class="range" value="0" min="0" max="100">
          <div class="flex justify-between text-xs mt-1" style="color:rgba(255,255,255,.38)">
            <span class="time-cur">00:00</span><span class="time-dur">--:--</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-volume-up text-xs" style="color:rgba(255,255,255,.45)"></i>
            <input type="range" class="vol-range" value="80" min="0" max="100">
          </div>
          <button class="play-btn"><i class="fas fa-play"></i></button>
          <div class="flex items-center gap-2">
            <a href="http://localhost:8765/download?id=${item.id}&name=${encodeURIComponent(item.name)}" target="_blank"
               class="audio-dl-btn text-sm" title="Baixar como MP3"
               style="color:rgba(255,255,255,.4)"
               onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='rgba(255,255,255,.4)'">
              <i class="fas fa-download"></i>
            </a>
            <a href="${item.view_url}" target="_blank" class="text-sm" title="Abrir no Drive"
               style="color:rgba(255,255,255,.4)"
               onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='rgba(255,255,255,.4)'">
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </div>`;
}

function buildVideoCard(item, index) {
    const name    = item.name.replace(/\.[^.]+$/, '').replace(/^\d+[\s_]+/, '').replace(/_/g, ' ');
    const grad    = GRADIENTS[index % GRADIENTS.length];
    const thumbSrc = `http://localhost:8765/thumb?id=${item.id}`;
    return `
    <div class="video-card-wrap">
      <div class="card group cursor-pointer" data-file-id="${item.id}" data-title="${name}" onclick="openVideoModal(this)">
        <div class="relative overflow-hidden" style="height:160px;background:${grad}">
          <img src="${thumbSrc}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-60" loading="lazy"
               onerror="this.style.display='none'">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-14 h-14 rounded-full flex items-center justify-center" style="background:rgba(255,45,120,.35);backdrop-filter:blur(8px)">
              <i class="fas fa-play text-white text-xl ml-1"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-3" style="background:linear-gradient(to top,rgba(0,0,0,.7),transparent)">
            <p class="text-xs font-medium text-white truncate">${name}</p>
          </div>
          <span class="absolute top-3 right-3 text-xs rounded-full px-2.5 py-0.5" style="background:rgba(0,0,0,.55);color:rgba(255,255,255,.8)">${item.size_mb} MB</span>
        </div>
        <div class="p-3 flex items-center justify-between">
          <span class="tag">Vídeo</span>
          <div class="flex items-center gap-3" onclick="event.stopPropagation()">
            <a href="https://drive.google.com/uc?export=download&id=${item.id}" target="_blank"
               class="text-xs" title="Baixar vídeo" style="color:rgba(255,255,255,.4)"
               onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='rgba(255,255,255,.4)'">
              <i class="fas fa-download"></i>
            </a>
            <a href="${item.view_url}" target="_blank" class="text-xs" style="color:rgba(255,255,255,.4)"
               onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='rgba(255,255,255,.4)'">
              <i class="fas fa-external-link-alt"></i> Drive
            </a>
          </div>
        </div>
      </div>
    </div>`;
}

function buildPhotoCard(item) {
    const name     = item.name.replace(/\.[^.]+$/, '').replace(/^\d+[\s_]+/, '').replace(/_/g, ' ');
    const thumbSrc = `http://localhost:8765/thumb?id=${item.id}`;
    const fullSrc  = `http://localhost:8765/stream?id=${item.id}`;
    const dlUrl = `https://drive.google.com/uc?export=download&id=${item.id}`;
    return `
    <div class="photo-card-wrap" style="position:relative">
      <div class="relative group cursor-pointer rounded-2xl overflow-hidden" style="aspect-ratio:1"
           data-full="${fullSrc}" data-name="${name.replace(/"/g,'&quot;')}" data-view="${item.view_url}"
           onclick="openPhotoModal(this)">
        <img src="${thumbSrc}" alt="${name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
             onerror="this.src='${fullSrc}'">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
             style="background:linear-gradient(to top,rgba(0,0,0,.7),transparent)">
          <p class="text-xs text-white truncate">${name}</p>
        </div>
      </div>
      <a href="${dlUrl}" target="_blank" title="Baixar foto"
         onclick="event.stopPropagation()"
         style="position:absolute;top:8px;right:8px;z-index:2;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);font-size:11px;text-decoration:none;transition:background .2s,color .2s"
         onmouseover="this.style.background='var(--pink)';this.style.color='#fff'"
         onmouseout="this.style.background='rgba(0,0,0,.55)';this.style.color='rgba(255,255,255,.7)'">
        <i class="fas fa-download"></i>
      </a>
    </div>`;
}

function buildDocCard(item) {
    const name = item.name.replace(/_/g, ' ');
    const ext  = item.name.split('.').pop()?.toUpperCase() || 'DOC';
    return `
    <div class="dl-card">
      <div class="flex items-start gap-3 mb-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.28)">
          <i class="dl-icon fas fa-file-pdf text-2xl" style="color:#ef4444"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-xs" style="color:rgba(255,255,255,.38)">${ext} · ${item.size_mb} MB</span>
          </div>
          <p class="text-sm font-medium leading-snug dl-title">${name}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <a href="${item.view_url}" target="_blank" class="btn-pink dl-btn flex-1 flex items-center justify-center gap-2 text-xs" style="padding:9px 12px">
          <i class="fas fa-eye"></i> Visualizar
        </a>
        <a href="${item.stream_url}" target="_blank" class="glass w-10 h-10 rounded-xl flex items-center justify-center transition-colors text-sm" style="color:rgba(255,255,255,.45)"
           onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,.45)'">
          <i class="fas fa-download"></i>
        </a>
      </div>
    </div>`;
}

function populateContent(content) {
    const setText  = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    const setGrid  = (id, html, fallback) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = html || `<p class="text-sm col-span-4" style="color:rgba(255,255,255,.35)">${fallback}</p>`;
    };

    // ── Áudios ──────────────────────────────────────────────
    try {
        const items = content.audios || [];
        if (items.length) {
            setGrid('audio-grid-dynamic', items.map((a, i) => buildAudioCard(a, i)).join(''), '');
            setText('audio-count-label', `${items.length} áudios disponíveis`);
        }
    } catch (e) { console.error('[populateContent] áudios:', e); }

    // ── Vídeos ──────────────────────────────────────────────
    try {
        const items = (content.videos || []).filter(v =>
            v.size_mb > 0.001 && (v.mime || '').startsWith('video/')
        );
        console.log('[vídeos] filtrados:', items.length, 'de', (content.videos || []).length);
        if (items.length) {
            setGrid('video-grid-dynamic', items.map((v, i) => buildVideoCard(v, i)).join(''), '');
            setText('video-count-label', `${items.length} vídeos disponíveis`);
        } else {
            setGrid('video-grid-dynamic', '', 'Nenhum vídeo encontrado.');
            setText('video-count-label', '0 vídeos');
        }
    } catch (e) {
        console.error('[populateContent] vídeos:', e);
        setGrid('video-grid-dynamic', '', 'Erro ao carregar vídeos.');
        setText('video-count-label', 'Erro');
    }

    // ── Fotos ────────────────────────────────────────────────
    try {
        const items = (content.fotos || []).filter(f =>
            f.size_mb > 0.001 && (f.mime || '').startsWith('image/')
        );
        if (items.length) {
            setGrid('photo-grid-dynamic', items.map(f => buildPhotoCard(f)).join(''), '');
            setText('photo-count-label', `${items.length} fotos disponíveis`);
        } else {
            setGrid('photo-grid-dynamic', '', 'Nenhuma foto encontrada.');
        }
    } catch (e) {
        console.error('[populateContent] fotos:', e);
        setGrid('photo-grid-dynamic', '', 'Erro ao carregar fotos.');
    }

    // ── Documentos ───────────────────────────────────────────
    try {
        const items = content.documentos || [];
        if (items.length) setGrid('doc-grid-dynamic', items.map(d => buildDocCard(d)).join(''), '');
    } catch (e) { console.error('[populateContent] documentos:', e); }
}

// Modal de áudio Drive (fallback quando streaming direto é bloqueado pelo CORS)
function openDriveAudioModal(embedUrl, title) {
    const modal = document.getElementById('drive-audio-modal');
    if (!modal) return;
    document.getElementById('drive-audio-modal-title').textContent = title;
    document.getElementById('drive-audio-modal-iframe').src = embedUrl;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

window.closeDriveAudioModal = function() {
    const modal = document.getElementById('drive-audio-modal');
    modal.classList.remove('open');
    document.getElementById('drive-audio-modal-iframe').src = '';
    document.body.style.overflow = '';
};

// Modal de vídeo (usa <video> via proxy — Drive iframe é bloqueado por CSP)
window.openVideoModal = function(cardEl) {
    const fileId = cardEl.dataset.fileId;
    const title  = cardEl.dataset.title;
    const modal  = document.getElementById('video-modal');
    document.getElementById('video-modal-title').textContent = title;
    const vid = document.getElementById('video-modal-video');
    document.getElementById('video-modal-spinner').style.display = 'flex';
    vid.src = `http://localhost:8765/stream?id=${fileId}`;
    vid.load();
    vid.play().catch(() => {});
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('open');
    const vid = document.getElementById('video-modal-video');
    vid.pause();
    vid.src = '';
    document.body.style.overflow = '';
};

// Modal de foto
window.openPhotoModal = function(cardEl) {
    const src     = cardEl.dataset.full;
    const name    = cardEl.dataset.name;
    const viewUrl = cardEl.dataset.view;
    const modal   = document.getElementById('photo-modal');
    const img     = document.getElementById('photo-modal-img');

    // mostra spinner enquanto carrega
    img.style.opacity = '0';
    document.getElementById('photo-modal-spinner').style.display = 'block';

    img.onload = () => {
        document.getElementById('photo-modal-spinner').style.display = 'none';
        img.style.opacity = '1';
    };
    img.onerror = () => {
        document.getElementById('photo-modal-spinner').style.display = 'none';
        img.style.opacity = '1';
    };

    img.src = src;
    document.getElementById('photo-modal-title').textContent = name;
    document.getElementById('photo-modal-link').href = viewUrl;
    document.getElementById('photo-modal-dl').href = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closePhotoModal = function() {
    document.getElementById('photo-modal').classList.remove('open');
    document.getElementById('photo-modal-img').src = '';
    document.body.style.overflow = '';
};

/* ═══════════════════════════════════════════════════════
   AUDIO FILTER TABS
═══════════════════════════════════════════════════════ */
function initAudioFilters() {
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset all tabs
            $$('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.style.color       = 'rgba(255,255,255,.45)';
                b.style.borderColor = 'var(--border)';
            });
            btn.classList.add('active');
            btn.style.color       = 'var(--pink)';
            btn.style.borderColor = 'rgba(255,45,120,.45)';

            const filter = btn.dataset.filter;
            $$('.audio-card-wrap').forEach(wrap => {
                const card    = wrap.querySelector('.audio-card');
                const matches = filter === 'all' || card?.dataset.category === filter;
                wrap.style.display = matches ? '' : 'none';
            });
        });
    });
}


/* ═══════════════════════════════════════════════════════
   MATERIAL SEARCH
═══════════════════════════════════════════════════════ */
function initMaterialSearch() {
    const searchEl = document.getElementById('material-search');
    const emptyEl  = document.getElementById('materials-empty');
    const labelEl  = document.getElementById('search-query-label');
    if (!searchEl) return;

    searchEl.addEventListener('input', () => {
        const q       = searchEl.value.toLowerCase().trim();
        let visible   = 0;

        $$('.dl-card').forEach(card => {
            const title   = card.querySelector('.dl-title')?.textContent.toLowerCase() || '';
            const matches = title.includes(q);
            card.style.display = matches ? '' : 'none';
            if (matches) visible++;
        });

        // Toggle empty state
        if (emptyEl) {
            emptyEl.classList.toggle('hidden', visible > 0 || q === '');
            if (labelEl) labelEl.textContent = q;
        }
    });
}


/* ═══════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════ */
function initFAQ() {
    $$('.faq-item').forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const body    = item.querySelector('.faq-body');
        const icon    = item.querySelector('.faq-icon');
        if (!trigger || !body) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all open items first
            $$('.faq-item.open').forEach(open => {
                open.classList.remove('open');
                open.querySelector('.faq-body').style.maxHeight = '0';
                open.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            });

            // Open the clicked one if it was closed
            if (!isOpen) {
                item.classList.add('open');
                body.style.maxHeight     = body.scrollHeight + 'px';
                icon.style.transform     = 'rotate(45deg)';
            }
        });
    });
}


/* ═══════════════════════════════════════════════════════
   SUPPORT FORM
═══════════════════════════════════════════════════════ */
function initSupportForm() {
    const form = document.getElementById('support-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        // Loading state
        btn.disabled     = true;
        btn.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Enviando…';
        setTimeout(() => {
            btn.disabled  = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
            form.reset();
            showToast('Mensagem enviada! Retornaremos em até 24h 💌', 'success', 5000);
        }, 1200);
    });
}


/* ═══════════════════════════════════════════════════════
   PROFILE — PASSWORD TOGGLE & NOTIFICATIONS
═══════════════════════════════════════════════════════ */
function initProfile() {
    // Toggle password section
    const toggleBtn      = document.getElementById('toggle-password');
    const passwordSect   = document.getElementById('password-section');

    if (toggleBtn && passwordSect) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = !!passwordSect.style.maxHeight && passwordSect.style.maxHeight !== '0px';
            if (isOpen) {
                passwordSect.style.maxHeight = '0px';
                toggleBtn.textContent        = 'Alterar Senha';
            } else {
                passwordSect.style.maxHeight = passwordSect.scrollHeight + 'px';
                toggleBtn.textContent        = 'Cancelar';
            }
        });
    }

    // Save new password
    const saveBtn = document.getElementById('save-password');
    if (saveBtn) {
        saveBtn.addEventListener('click', e => {
            e.preventDefault();
            const newPass  = document.getElementById('new-password')?.value     || '';
            const confPass = document.getElementById('confirm-password')?.value || '';

            if (!newPass || !confPass) {
                showToast('Preencha todos os campos de senha.', 'warning'); return;
            }
            if (newPass.length < 8) {
                showToast('A senha deve ter no mínimo 8 caracteres.', 'warning'); return;
            }
            if (newPass !== confPass) {
                showToast('As senhas não coincidem.', 'warning'); return;
            }

            // Simulate save
            saveBtn.disabled     = true;
            saveBtn.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Salvando…';
            setTimeout(() => {
                saveBtn.disabled  = false;
                saveBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Salvar Nova Senha';
                showToast('Senha alterada com sucesso! 🔐', 'success');
                // Close the section
                if (passwordSect) passwordSect.style.maxHeight = '0px';
                if (toggleBtn)    toggleBtn.textContent         = 'Alterar Senha';
                // Clear fields
                ['current-password','new-password','confirm-password'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
            }, 900);
        });
    }

    // Notification toggles
    $$('.notif-toggle').forEach(toggle => {
        toggle.addEventListener('change', () => {
            const label = toggle.dataset.label || 'Preferência';
            const state = toggle.checked ? 'ativada ✔' : 'desativada';
            showToast(`${label} ${state}`, 'info', 2200);
        });
    });
}


/* ═══════════════════════════════════════════════════════
   GLOBAL EVENT DELEGATION
═══════════════════════════════════════════════════════ */
function initGlobalHandlers() {
    document.addEventListener('click', e => {

        // Pack modal download button
        const modalDlBtn = e.target.closest('#modal-download-btn');
        if (modalDlBtn) {
            const title = modalDlBtn.dataset.title || 'Pack';
            showToast(`Iniciando download: <strong>${title}</strong>`, 'download', 4000);
            return;
        }

        // Pack card direct download button
        const packDlBtn = e.target.closest('.pack-dl-btn');
        if (packDlBtn) {
            const card  = packDlBtn.closest('.pack-card');
            const model = PACKS_DATA[card?.dataset.packId]?.model || '';
            const title = card?.dataset.title || 'Pack';
            showToast(`Iniciando download: <strong>${model} — ${title}</strong>`, 'download', 4000);
            return;
        }

        // Download material buttons
        const dlBtn = e.target.closest('.dl-btn');
        if (dlBtn) {
            const title = dlBtn.dataset.title
                || dlBtn.closest('.dl-card')?.querySelector('.dl-title')?.textContent
                || 'Material';
            showToast(`Iniciando download: <strong>${title}</strong>`, 'download');
            return;
        }

        // Audio download buttons
        if (e.target.closest('.audio-dl-btn')) {
            showToast('Iniciando download do áudio…', 'download');
            return;
        }

        // Mini play buttons on dashboard novidades cards
        const miniPlay = e.target.closest('.mini-play-btn');
        if (miniPlay) {
            const title = miniPlay.dataset.title || 'Áudio';
            const icon  = miniPlay.querySelector('i');
            const playing = icon?.classList.contains('fa-pause');
            if (playing) {
                icon.className = 'fas fa-play';
                icon.style.marginLeft = '2px';
            } else {
                if (icon) { icon.className = 'fas fa-pause'; icon.style.marginLeft = '0'; }
                showToast(`Reproduzindo: <strong>${title}</strong> 🎧`, 'info', 2500);
            }
            return;
        }

        // "Continuar Aprendendo" CTA
        if (e.target.closest('#cta-learn')) {
            Router.navigate('audios');
            return;
        }

        // "Ver Novidades" CTA
        if (e.target.closest('#cta-news')) {
            showToast('Você já está vendo as novidades! 🎉', 'success', 2500);
            return;
        }

        // Logout button
        if (e.target.closest('#btn-logout')) {
            showToast('Saindo da conta…', 'info', 2000);
            return;
        }
    });
}


/* ═══════════════════════════════════════════════════════
   RIPPLE EFFECT — attaches to .btn-pink and .play-btn
═══════════════════════════════════════════════════════ */
function initRipple() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-pink, .play-btn');
        if (!btn) return;

        // The button must be positioned to contain the ripple
        const style = getComputedStyle(btn);
        if (style.position === 'static') btn.style.position = 'relative';

        const rect   = btn.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height) * 1.2;
        const x      = e.clientX - rect.left - size / 2;
        const y      = e.clientY - rect.top  - size / 2;

        const wave   = document.createElement('span');
        wave.className = 'ripple-wave';
        wave.style.cssText = `
            width:  ${size}px;
            height: ${size}px;
            left:   ${x}px;
            top:    ${y}px;
        `;

        btn.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove(), { once: true });
    });
}


/* ═══════════════════════════════════════════════════════
   PACKS — FILTERS + PREVIEW MODAL
═══════════════════════════════════════════════════════ */
function initPacks() {
    // Filter tabs
    $$('.pack-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.pack-filter-btn').forEach(b => {
                b.classList.remove('active');
                b.style.color       = 'rgba(255,255,255,.45)';
                b.style.borderColor = 'var(--border)';
            });
            btn.classList.add('active');
            btn.style.color       = 'var(--pink)';
            btn.style.borderColor = 'rgba(255,45,120,.45)';

            const filter = btn.dataset.model;
            $$('.pack-card-wrap').forEach(wrap => {
                const card    = wrap.querySelector('.pack-card');
                const matches = filter === 'all' || card?.dataset.model === filter;
                wrap.style.display = matches ? '' : 'none';
            });
        });
    });

    // Modal helpers
    const modal    = document.getElementById('pack-modal');
    const backdrop = document.getElementById('pack-modal-backdrop');
    const closeBtn = document.getElementById('pack-modal-close');

    const TYPE_META = {
        zip:   { icon: 'fa-file-archive', bg: 'rgba(234,179,8,.12)',  border: 'rgba(234,179,8,.3)',  color: '#eab308' },
        video: { icon: 'fa-film',         bg: 'rgba(239,68,68,.12)',   border: 'rgba(239,68,68,.3)',  color: '#ef4444' },
        pdf:   { icon: 'fa-file-pdf',     bg: 'rgba(239,68,68,.12)',   border: 'rgba(239,68,68,.3)',  color: '#ef4444' },
    };

    function openPackModal(packId) {
        const data = PACKS_DATA[packId];
        if (!data || !modal) return;

        document.getElementById('modal-pack-cover').style.background   = data.gradient;
        document.getElementById('modal-pack-initial').textContent      = data.initial;
        document.getElementById('modal-pack-initial').style.background = data.gradient;
        document.getElementById('modal-pack-model').textContent        = data.model;
        document.getElementById('modal-pack-title').textContent        = data.title;
        document.getElementById('modal-pack-meta').textContent         = `${data.count} arquivos · ${data.size}`;

        document.getElementById('modal-pack-tags').innerHTML =
            data.tags.map(t => `<span class="tag">${t}</span>`).join('');

        document.getElementById('modal-file-list').innerHTML =
            data.files.map(f => {
                const m = TYPE_META[f.type] || TYPE_META.zip;
                return `
                <div class="preview-file-row">
                    <div class="preview-file-icon" style="background:${m.bg};border:1px solid ${m.border}">
                        <i class="fas ${m.icon}" style="color:${m.color}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">${f.name}</p>
                        <p class="text-xs" style="color:rgba(255,255,255,.38)">${f.size}</p>
                    </div>
                </div>`;
            }).join('');

        const dlBtn = document.getElementById('modal-download-btn');
        if (dlBtn) {
            dlBtn.dataset.packId = packId;
            dlBtn.dataset.title  = `${data.model} — ${data.title}`;
        }

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closePackModal() {
        modal?.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (backdrop) backdrop.addEventListener('click', closePackModal);
    if (closeBtn) closeBtn.addEventListener('click', closePackModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) closePackModal();
    });

    // Preview button delegation
    document.addEventListener('click', e => {
        const btn = e.target.closest('.pack-preview-btn');
        if (!btn) return;
        const packId = btn.closest('.pack-card')?.dataset.packId;
        if (packId) openPackModal(packId);
    });
}


/* ═══════════════════════════════════════════════════════
   COLLAPSIBLE SIDEBAR
═══════════════════════════════════════════════════════ */
function initSidebarCollapse() {
    const sidebar   = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (!sidebar || !toggleBtn) return;

    // Restore persisted state before first paint
    if (localStorage.getItem('hotfy-sidebar') === 'collapsed') {
        sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('hotfy-sidebar', isCollapsed ? 'collapsed' : 'expanded');
    });
}

/* ═══════════════════════════════════════════════════════
   INIT — runs when DOM is ready
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // Fechar modais com Escape
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (document.getElementById('video-modal')?.classList.contains('open')) closeVideoModal();
        else if (document.getElementById('photo-modal')?.classList.contains('open')) closePhotoModal();
        else if (document.getElementById('pack-modal')?.classList.contains('open')) closePack?.();
    });

    // Inicia navegação e UI imediatamente
    Router.init();
    initPlayers();
    initAudioFilters();
    initPacks();
    initMaterialSearch();
    initFAQ();
    initSupportForm();
    initProfile();
    initGlobalHandlers();
    initRipple();
    initSidebarCollapse();

    // Initialise all range fills
    $$('.range, .vol-range').forEach(r => {
        syncRange(r);
        r.addEventListener('input', () => syncRange(r));
    });

    // Global search — jumps to the matching section
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            const q = globalSearch.value.toLowerCase().trim();
            if (!q) return;
            // Rough heuristic: if query looks like audio, go to audios view
            if (['pack','packs','modelo','modelos','foto','video'].some(kw => q.includes(kw))) {
                Router.navigate('packs');
            } else if (['áudio','audio','voz','roteiro','script','técnica'].some(kw => q.includes(kw))) {
                Router.navigate('audios');
            } else if (['material','pdf','download','template','planilha'].some(kw => q.includes(kw))) {
                Router.navigate('materials');
                const matSearch = document.getElementById('material-search');
                if (matSearch) { matSearch.value = globalSearch.value; matSearch.dispatchEvent(new Event('input')); }
            }
            globalSearch.value = '';
        });
    }

    console.log('%c🦋 Hotfy SPA carregada com sucesso!', 'color:#FF2D78;font-weight:bold;font-size:14px');

    // Carrega conteúdo do Drive em background (não bloqueia a UI)
    loadContent().then(content => {
        if (!content) return;
        populateContent(content);
        // Reinicia players para pegar os cards dinâmicos de áudio
        initPlayers();
        $$('.range, .vol-range').forEach(r => { syncRange(r); r.addEventListener('input', () => syncRange(r)); });
    }).catch(err => console.warn('content.json não carregado:', err));
});
