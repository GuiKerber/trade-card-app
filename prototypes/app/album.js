/* Álbum da v1: a criança decide a ordem (segura e arrasta), bolsos livres e folhas infinitas */
let ALBUM = [];
function ensureBlank() {
  while (ALBUM.length % 9) ALBUM.push(0);
  if (!ALBUM.length || ALBUM.slice(-9).some(Boolean)) ALBUM.push(...Array(9).fill(0));
}
function resetAlbum() {
  ALBUM = [1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 35, 39, 52, 54, 92, 93, 94, 129, 133, 143, 150, 151, 166, 168, 170, 199].map(n => (byN(n).have ? n : 0));
  ensureBlank();
}
resetAlbum();
function albumPlace(n) { if (ALBUM.includes(n)) return; let i = ALBUM.indexOf(0); if (i < 0) { ALBUM.push(...Array(9).fill(0)); i = ALBUM.indexOf(0); } ALBUM[i] = n; }
function albumRemove(n) { const i = ALBUM.indexOf(n); if (i >= 0) ALBUM[i] = 0; }

/* Folha: guardar uma carta num bolso livre, buscando em todas as coleções */
function addCardSheet(api, onDone) {
  let pick = null, lang = 'PT';
  const rowAdd = c => `<div class="rrow">${thumb(c, 'sm')}<div class="rinfo"><b>${c.name}</b><span>${setOf(c).name} · ${numStr(c)}${c.have ? ` · você tem ${c.have}` : ''}</span></div><button class="btn-s" data-act="pick:${c.id}">Guardar</button></div>`;
  const wish = [...WISH].map(cardById).filter(c => c && !c.have);
  const listHTML = () => `<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Guardar uma carta</h2>
    <p class="sh-text">Procure em todas as coleções. A carta vai para o bolso que você tocou.</p>
    ${searchBox('aq', 'Nome ou número da carta')}<p class="pg-hint">Ex.: Pikachu, 025, 006/165</p>
    <div class="rlist" id="alist">${wish.length ? `<h3 class="ps-h">Da sua lista de desejos</h3>${wish.map(rowAdd).join('')}` : ''}</div>`;
  const condHTML = c => `<div class="sh-handle"></div><p class="ls-set">${c.name} · ${setOf(c).name} · ${numStr(c)}</p><h2 class="sh-title" id="shTitle">Como ela está?</h2>
    <div class="pick-lang" role="radiogroup" aria-label="Idioma da carta">${['PT', 'EN', 'JP'].map(l => `<button role="radio" aria-checked="${l === lang}" data-act="lang:${l}">${l}</button>`).join('')}</div>
    <div class="pick-cond">${[['NM', 'Novinha', 'Sem marcas'], ['LP', 'Pouco usada', 'Pontinhas brancas'], ['MP', 'Usada', 'Riscos ou dobras']].map(([k, t, d]) => `<button class="pick" data-act="cond:${k}"><b>${t}</b><span>${d}</span><em>${k}</em></button>`).join('')}</div>`;
  let sheet = null;
  const choose = id => {
    const c = ensureCard(id); if (!c) return;
    if (ALBUM.includes(c.n)) { api.closeSheet(); onDone(c.n, null, null, true); return; }
    pick = c.n; sheet.set(condHTML(c));
  };
  sheet = api.openSheet(listHTML(), (act, sh) => {
    const i = act.indexOf(':'), k = act.slice(0, i), v = act.slice(i + 1);
    if (k === 'pick') { choose(v); return; }
    if (k === 'lang') { lang = v; $$('.pick-lang button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.act === act))); buzz(4); return; }
    if (k === 'cond') { api.closeSheet(); onDone(pick, v, lang); }
  });
  const inp = $('#aq');
  if (inp) attachSuggest(inp, { onPick: choose, onAll: (q, r) => { $('#alist').innerHTML = `<h3 class="ps-h">${r.total.toLocaleString('pt-BR')} cartas com “${q.trim()}”</h3>${r.all.slice(0, 40).map(e => rowAdd(cardById(entryId(e)))).join('')}`; } });
}

function mountAlbum(stage, api) {
  ensureBlank();
  stage.className = 'stage v1 r3c';
  stage.style.setProperty('--ix', '0'); stage.style.setProperty('--iy', '-.42');
  const C = { x: 46.5, y: 100, s: .8 }, O = { x: 10, y: 52, s: 1 }, NP = ALBUM.length / 9;
  const ringSVG = t => `<svg class="ring" style="top:${t}%" viewBox="0 0 44 24"><path d="M5 19C5 4 39 4 39 19" fill="none" stroke="#4b5363" stroke-width="7" stroke-linecap="round"/><path d="M5 19C5 4 39 4 39 19" fill="none" stroke="url(#metal)" stroke-width="4.6" stroke-linecap="round"/></svg>`;
  const pocket = (n, slot) => {
    const c = n ? byN(n) : null;
    return c ? `<button class="pk pk1" data-slot="${slot}" data-n="${c.n}" aria-label="${aria(c)}. Segure para mudar de lugar."><span class="anchor" style="${jitStyle(c)}">${cardHTML(c)}</span><i class="sleeve"></i>${badges(c)}</button>`
      : `<button class="pk pk1 free" data-slot="${slot}" aria-label="Bolso livre. Toque para guardar uma carta."><i class="sleeve"></i><span class="free-plus">${ico('plus', 22)}</span></button>`;
  };
  const page = i => ALBUM.slice(i * 9, i * 9 + 9);
  const meta = i => { const ns = page(i); return !ns.some(Boolean) ? '<p class="leaf-new">Folha nova<span>Toque num bolso para guardar uma carta</span></p>' : ns.every(Boolean) ? stampHTML('v1-stamp') : ''; };
  const leafHTML = i => `<div class="v1-leaf"><i class="grain"></i>${[18, 50, 82].map(t => `<i class="hole" style="top:${t}%"></i>`).join('')}<div class="v1-grid">${page(i).map((n, j) => pocket(n, i * 9 + j)).join('')}</div><span class="leaf-meta">${meta(i)}</span></div>`;
  stage.innerHTML = `
    <div class="book v1-book" id="book">
      <div class="v1-back"><i class="grain"></i></div>
      <div class="v1-spine"></div>
      <div class="v1-leaves flip-host" id="leaves"></div>
      <div class="v1-rings">${[18, 50, 82].map(ringSVG).join('')}</div>
      <div class="v1-cover" id="cover" role="button" tabindex="0" aria-label="Abrir o álbum">${R3_COVERS.holo()}</div>
    </div>
    <div class="hint" id="hint" style="top:${C.y + 452 * C.s + 18}px"><span class="hand">${ico('hand', 30, '#fff')}</span><span>Toque ou arraste a capa</span></div>
    <div class="ctrls" id="ctrls" style="top:${O.y + 452 + 14}px">
      <button class="rbtn" data-go="-1" aria-label="Folha anterior">${ico('chevL', 28)}</button>
      <div class="pagepill">Folha <b id="pgN">1</b></div>
      <button class="rbtn" data-go="1" aria-label="Próxima folha">${ico('chevR', 28)}</button>
    </div>`;
  const book = $('#book', stage), coverEl = $('#cover', stage), hint = $('#hint', stage), ctrls = $('#ctrls', stage), leavesEl = $('#leaves', stage), rings = $('.v1-rings', stage);
  const screenEl = stage.closest('.screen');
  let ctl, tipShown = false, dropped = false;
  const updCtrls = () => { $('[data-go="-1"]', ctrls).disabled = fl.cur === 0; $('[data-go="1"]', ctrls).disabled = fl.cur === NP - 1; };
  const fl = makeFlipper({ host: leavesEl, count: NP, render: leafHTML, back: '<div class="v1-lb"></div>', enabled: () => ctl.st.open && !cd2,
    onChange: i => { $('#pgN', stage).textContent = i + 1; api.setTitle(`Folha ${i + 1}`); updCtrls(); } });
  ctl = bookCtl({ book, cover: coverEl, C, O,
    onP: p => { rings.style.opacity = clamp(p * 3 - 1, 0, 1); hint.style.opacity = clamp(1 - p * 2.5, 0, 1); ctrls.style.opacity = clamp(p * 1.6 - .6, 0, 1); ctrls.style.pointerEvents = p > .9 ? 'auto' : 'none'; },
    onOpenStart: () => buzz(10),
    onOpened: () => { api.setOpen(true, `Folha ${fl.cur + 1}`); if (!tipShown && !mountAlbum.tip) { tipShown = mountAlbum.tip = true; setTimeout(() => api.toast('Dica: segure uma carta e arraste para mudar de lugar.'), 500); } },
    onCloseStart: () => api.setOpen(false) });
  updCtrls();

  // Brilho holográfico que acompanha o dedo
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    screenEl.style.setProperty('--hx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    screenEl.style.setProperty('--hy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
  });
  // Abrir arrastando a capa
  let cd = null;
  coverEl.addEventListener('pointerdown', e => { if (ctl.st.busy || ctl.st.open || e.button > 0) return; cd = { x: e.clientX, id: e.pointerId, moved: false, lastA: 0, lastT: performance.now(), v: 0, eff: book.getBoundingClientRect().width / 364 }; });
  coverEl.addEventListener('pointermove', e => {
    if (!cd) return; const dx = (e.clientX - cd.x) / cd.eff;
    if (!cd.moved) { if (Math.abs(dx) < 8) return; cd.moved = true; try { coverEl.setPointerCapture(cd.id); } catch (err) { /* ok */ } }
    const a = clamp(dx / 300 * 180, -180, 0), now = performance.now(); cd.v = (a - cd.lastA) / Math.max(1, now - cd.lastT) * 1000; cd.lastA = a; cd.lastT = now; ctl.setA(a);
  });
  const cup = () => { if (!cd) return; const d = cd; cd = null; if (!d.moved) { ctl.open(); return; } if (ctl.st.a < -45 || d.v < -250) ctl.open(Math.min(0, d.v)); else spring({ from: ctl.st.a, to: 0, ...M.fastSpatial, onUpdate: ctl.setA }); };
  coverEl.addEventListener('pointerup', cup); coverEl.addEventListener('pointercancel', cup);
  coverEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctl.open(); } });
  ctrls.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) (+b.dataset.go > 0 ? fl.next() : fl.prev()); });

  const slotEl = s => $(`[data-slot="${s}"]`, leavesEl);
  const refreshMeta = p => { const m = $('.leaf-meta', fl.leaf(p)); if (m) m.innerHTML = meta(p); };
  const refreshSlot = (s, ins = 0) => {
    const el = slotEl(s); if (!el) return null;
    el.outerHTML = pocket(ALBUM[s], s); const nel = slotEl(s), a = $('.anchor', nel);
    if (a && ins) { a.style.setProperty('--ins', ins); spring({ from: ins, to: 0, ...M.fastSpatial, onUpdate: v => a.style.setProperty('--ins', v) }); }
    refreshMeta(Math.floor(s / 9)); return nel;
  };
  const insert = (slot, n, cond, lang) => {
    const c = byN(n); Object.assign(c, { have: 1, isNew: true, cond, lang, variant: FOIL[c.r] || 'Normal' }); c.holo = c.variant !== 'Normal';
    ALBUM[slot] = n; const el = refreshSlot(slot, 1);
    const r = api.rectIn(el); api.confetti(r.x + r.w / 2, r.y + r.h / 3, 20); buzz(25);
    api.toast(page(Math.floor(slot / 9)).every(Boolean) ? `Folha completa! ${c.name} foi pro álbum.` : `${c.name} foi pro álbum!`);
    const st = $('.leaf-meta .stamp', fl.leaf(Math.floor(slot / 9))); if (st) st.classList.add('pop');
  };

  // Segurar e arrastar uma carta para outro bolso (vale entre folhas: leve a carta até a borda)
  let cd2 = null;
  const k = () => screenEl.getBoundingClientRect().width / 384;
  const startDrag = s => {
    s.active = true; cd2 = s; buzz(18);
    const anchor = $('.anchor', s.pk), r = api.rectIn(anchor), c = byN(+s.pk.dataset.n);
    s.ghost = document.createElement('div'); s.ghost.className = 'drag-card moving'; s.ghost.innerHTML = cardHTML(c);
    Object.assign(s.ghost.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px` });
    screenEl.appendChild(s.ghost); anchor.classList.add('lifted'); s.pk.classList.add('lifting');
    const sr = screenEl.getBoundingClientRect(); s.offX = (s.x0 - sr.left) / k() - r.x; s.offY = (s.y0 - sr.top) / k() - r.y;
    try { leavesEl.setPointerCapture(s.id); } catch (err) { /* ok */ }
  };
  const moveDrag = e => {
    const s = cd2, sr = screenEl.getBoundingClientRect();
    s.ghost.style.left = `${(e.clientX - sr.left) / k() - s.offX}px`; s.ghost.style.top = `${(e.clientY - sr.top) / k() - s.offY}px`;
    const hit = document.elementFromPoint(e.clientX, e.clientY), t = hit && hit.closest('.pk1[data-slot]');
    const tgt = t && leavesEl.contains(t) ? t : null;
    if (tgt !== s.target) { s.target && s.target.classList.remove('drop-on'); tgt && tgt.classList.add('drop-on'); s.target = tgt; if (tgt) buzz(4); }
    const lr = leavesEl.getBoundingClientRect(), edge = e.clientX < lr.left + 26 * k() ? -1 : e.clientX > lr.right - 26 * k() ? 1 : 0;
    if (edge !== s.edge) { clearTimeout(s.edgeT); s.edge = edge; if (edge) s.edgeT = setTimeout(function flip() { edge > 0 ? fl.next() : fl.prev(); s.edgeT = setTimeout(flip, 900); }, 550); }
  };
  const dropDrag = () => {
    const s = cd2; cd2 = null; clearTimeout(s.edgeT); s.target && s.target.classList.remove('drop-on');
    const from = s.slot, to = s.target ? +s.target.dataset.slot : -1, g = s.ghost;
    g.classList.remove('moving');
    if (to >= 0 && to !== from) {
      [ALBUM[from], ALBUM[to]] = [ALBUM[to], ALBUM[from]];
      const r = api.rectIn(s.target); Object.assign(g.style, { left: `${r.x + r.w * .04}px`, top: `${r.y + r.h * .06}px`, width: `${r.w * .92}px` }); g.classList.add('landing');
      setTimeout(() => { g.remove(); refreshSlot(to); refreshSlot(from, ALBUM[from] ? .25 : 0); }, 200); buzz(22);
    } else {
      const a = $('.anchor', s.pk), r = api.rectIn(a); Object.assign(g.style, { left: `${r.x}px`, top: `${r.y}px` }); g.classList.add('landing');
      setTimeout(() => { g.remove(); a.classList.remove('lifted'); s.pk.classList.remove('lifting'); }, 200);
    }
    dropped = true; setTimeout(() => { dropped = false; }, 120);
  };
  leavesEl.addEventListener('pointerdown', e => {
    const pk = e.target.closest('.pk1[data-n]'); if (!pk || !ctl.st.open || fl.justDragged()) return;
    const s = { pk, slot: +pk.dataset.slot, x0: e.clientX, y0: e.clientY, id: e.pointerId, active: false, edge: 0 };
    s.timer = setTimeout(() => startDrag(s), 380); cd2 = null; leavesEl._pending = s;
  }, true);
  leavesEl.addEventListener('pointermove', e => {
    const p = leavesEl._pending;
    if (cd2) { e.stopPropagation(); moveDrag(e); return; }
    if (p && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > 8) { clearTimeout(p.timer); leavesEl._pending = null; }
  }, true);
  const up = () => { const p = leavesEl._pending; if (p) clearTimeout(p.timer); leavesEl._pending = null; if (cd2) dropDrag(); };
  leavesEl.addEventListener('pointerup', up, true); leavesEl.addEventListener('pointercancel', up, true);
  leavesEl.addEventListener('contextmenu', e => e.preventDefault());
  leavesEl.addEventListener('click', e => {
    if (fl.justDragged() || dropped || !ctl.st.open) return;
    const pk = e.target.closest('[data-slot]'); if (!pk) return;
    if (pk.dataset.n) api.openDetail(+pk.dataset.n, $('.anchor', pk));
    else {
      const slot = +pk.dataset.slot;
      addCardSheet(api, (n, cond, lang, dup) => {
        if (!dup) { insert(slot, n, cond, lang); return; }
        const c = byN(n); c.have += 1; refreshSlot(ALBUM.indexOf(n)); buzz(12);
        api.toast(`${c.name} já estava no álbum. Agora você tem ${c.have}!`);
      });
    }
  });

  return {
    close: ctl.close, isOpen: () => ctl.st.open, key: d => (d > 0 ? fl.next() : fl.prev()),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, leavesEl),
    replacePocket: n => refreshSlot(ALBUM.indexOf(n)),
    afterInsert: n => page(Math.floor(ALBUM.indexOf(n) / 9)).every(Boolean),
  };
}
