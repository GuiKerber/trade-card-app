/* App: tela Android, barra superior, navegação, carta ampliada, sheet, celebração, notas */
VARIANTS.v1 = { round: 1, num: '1', short: 'Fichário', hash: 'fichario', mount: mountV1, notes: {
  title: 'Fichário inflável', tag: 'Vinil azul acolchoado · folhas de 9 bolsos em argolas',
  concept: 'A capa é uma almofada de vinil azul, cheia de ar, como as fitas infladas da referência. Dentro, folhas pretas de 9 bolsos iguais às de um fichário de verdade.',
  try: ['Arraste a capa para a esquerda, ou só toque nela.', 'Vire as folhas arrastando ou pelas setas.', 'Toque no bolso vazio <b>#004</b> e guarde a carta: a primeira folha fica completa.', 'Toque na carta holográfica <b>#006</b> e passe o dedo por cima dela.'],
  m3: ['Top app bar pequena', 'Navigation bar', 'Assist chip', 'Icon button 56dp', 'Modal bottom sheet', 'Snackbar'],
  pros: 'Mostra muitas cartas de uma vez e parece um fichário real.',
  cons: 'As cartas ficam pequenas na folha. O nome só fica legível quando a criança toca na carta.' } };
VARIANTS.v2 = { round: 1, num: '2', short: 'Abas', hash: 'abas', mount: mountV2, notes: {
  title: 'Livro de abas', tag: 'Capa dura com janela · uma página de papel por tipo',
  concept: 'Livro de capa dura amarela com uma janela recortada mostrando a criatura favorita. Cada aba colorida é um tipo. As páginas são de papel impresso: o espaço vazio mostra o contorno e o nome da carta que falta, como num álbum de figurinhas.',
  try: ['Toque direto numa aba para abrir o álbum já naquele tipo.', 'Toque na pontinha dobrada da página, ou arraste para virar.', 'Na aba <b>Sonho</b>, guarde a #024 para completar a página.'],
  m3: ['Navigation bar', 'Abas no objeto (papel de Tabs)', 'Modal bottom sheet', 'Snackbar'],
  pros: 'Cartas maiores (4 por página) e organização por cor que a criança entende sem ler.',
  cons: 'Exige tipos fixos: uma coleção com muitos tipos precisaria de outra navegação.' } };
VARIANTS.v3 = { round: 1, num: '3', short: 'Zíper', hash: 'ziper', mount: mountV3, notes: {
  title: 'Zíper', tag: 'Fichário de tecido acolchoado · carrossel de folhas',
  concept: 'Fichário de tecido violeta fechado por zíper. Abrir vira brincadeira: arrastar o puxador amarelo em volta do álbum. Dentro, folhas coloridas de 4 bolsos laterais deslizam para o lado.',
  try: ['Arraste o puxador amarelo em volta do álbum, ou só toque nele.', 'Deslize as folhas para o lado. As bolinhas mostram quanto falta em cada folha.', 'Na folha 1, guarde a <b>#004</b>: a carta entra pelo lado do bolso.'],
  m3: ['Carousel com espiada', 'Navigation bar', 'Progresso circular', 'Modal bottom sheet', 'Snackbar'],
  pros: 'A abertura mais divertida, e o progresso de cada folha fica sempre à vista.',
  cons: 'Abrir o zíper todo dia pode cansar. Depois da primeira vez, um toque no puxador já abre.' } };

(() => {
  const screen = $('#screen'), device = $('#device'), slot = $('#slot');
  const S = { v: 'v1', ctrl: null, open: false, title: '', D: null, snackT: 0 };
  const W = 384, H = 820;

  /* ---------- Tela ---------- */
  const NAV = [['album', 'Álbum'], ['friends', 'Amigos'], ['trade', 'Trocas']];
  function buildScreen(v) {
    const V = VARIANTS[v];
    screen.className = `screen skin-${V.skin || 'r1'}`;
    screen.innerHTML = `
      <div class="statusbar"><span>16:20</span><i class="cam"></i><span class="sb-icons">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 14h2v-3H1zM5 14h2V8H5zM9 14h2V5H9zM13 14h2V2h-2z" fill="currentColor"/></svg>
        <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true"><path d="M9 14.5 1.2 6.2a11 11 0 0 1 15.6 0z" fill="currentColor"/></svg>
        <svg width="24" height="14" viewBox="0 0 24 14" aria-hidden="true"><rect x=".8" y=".8" width="19.5" height="12.4" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="3" width="13" height="8" rx="1.8" fill="currentColor"/><rect x="21.5" y="4.5" width="2" height="5" rx="1" fill="currentColor"/></svg></span></div>
      <header class="appbar" id="appbar"></header>
      <section class="stage" id="stage"></section>
      <nav class="navbar" aria-label="Navegação principal">${NAV.map(([k, l], i) => `<button class="nav-item${i === 0 ? ' active' : ''}" ${i === 0 ? 'aria-current="page"' : `data-soon="${l}"`}><span class="nav-ind">${ico(k, 28)}${k === 'trade' ? '<i class="badge">2</i>' : ''}</span><span class="nav-lb">${l}</span></button>`).join('')}</nav>
      <div class="gesture"><i></i></div>
      <div class="scrim" id="scrim"></div>
      <div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="shTitle"></div>
      <div class="snack" id="snack" role="status"></div>`;
    $('.navbar', screen).addEventListener('click', e => {
      const b = e.target.closest('[data-soon]'); if (b) toast(`${b.dataset.soon} chega na próxima fase. Agora é só o álbum!`);
    });
    $('#scrim', screen).addEventListener('click', () => closeDetail('back'));
    $('#sheet', screen).addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) closeDetail(b.dataset.act); });
  }
  function renderAppbar() {
    const ab = $('#appbar', screen); if (!ab) return;
    screen.style.setProperty('--own', ownedCount() / 24);
    const chip = `<div class="count" id="count" aria-label="${ownedCount()} de 24 cartas">${ico('cards', 22)}<b>${ownedCount()}</b>/24</div>`;
    ab.innerHTML = S.open
      ? `<button class="icon-btn" id="abBack" aria-label="Fechar o álbum">${ico('back', 24)}</button><div class="ab-title">${S.title}</div>${chip}`
      : `<div class="avatar" aria-hidden="true">L</div><div class="ab-title">Oi, Lia!</div>${chip}`;
    const back = $('#abBack', ab); if (back) back.addEventListener('click', () => { if (!S.D) S.ctrl.close(); });
  }
  const api = {
    setOpen(open, title = '') { S.open = open; S.title = title; renderAppbar(); },
    setTitle(t) { S.title = t; const el = $('.ab-title', screen); if (S.open && el) el.textContent = t; },
    openDetail, rectIn, confetti, toast,
  };
  function rectIn(el) {
    const r = el.getBoundingClientRect(), s = screen.getBoundingClientRect(), k = s.width / W;
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  }

  /* ---------- Carta ampliada + sheet ---------- */
  const TW = 212, TH = TW * 88 / 63, TO = { x: (W - TW) / 2, y: 112 };
  function placeZoom(z, x, y, w, rot) { z.style.left = `${x}px`; z.style.top = `${y}px`; z.style.width = `${w}px`; z.style.transform = `rotate(${rot}deg)`; }
  function sheetHTML(c, owned) {
    const t = TYPES[c.type];
    const chips = `<div class="sh-chips"><span class="chip chip-type" style="--tc:${t.c};--on:${t.on}">${typeIcon(c.type, 18, t.on === '#fff' ? '#fff' : '#fff')}${t.label}</span><span class="chip">#${pad(c.n)}</span><span class="chip">${RAR[c.r]} ${RARL[c.r]}</span></div>`;
    if (owned) {
      const dup = c.have - 1;
      const text = dup > 0 ? `Você tem <b>${c.have}</b>. Sobra${dup > 1 ? 'm' : ''} <b>${dup} repetida${dup > 1 ? 's' : ''}</b> pra trocar com amigos.`
        : c.isNew ? '<b>Nova!</b> Chegou hoje no seu álbum.' : 'Você tem <b>1</b>. Ela está guardada aqui.';
      return `<div class="sh-handle"></div>${chips}<h2 class="sh-title" id="shTitle">${c.name}</h2><p class="sh-text">${text}</p><p class="sh-tip">Toque na carta para ver o verso.</p><div class="sh-actions"><button class="btn btn-filled" data-act="back">Guardar de volta</button></div>`;
    }
    return `<div class="sh-handle"></div>${chips}<h2 class="sh-title" id="shTitle">Ainda falta essa!</h2><p class="sh-text">Você ainda não tem a <b>#${pad(c.n)} ${c.name}</b>. Quando ganhar, guarde aqui.</p><div class="sh-actions"><button class="btn btn-filled" data-act="insert">${ico('plus', 24)} Ganhei! Guardar no álbum</button><button class="btn btn-text" data-act="back">Agora não</button></div>`;
  }
  let sheetAnim = null;
  function showSheet(on) {
    const sh = $('#sheet', screen), sc = $('#scrim', screen);
    sc.classList.toggle('on', on);
    sheetAnim && sheetAnim.stop();
    const from = on ? 1.05 : 0, to = on ? 0 : 1.05;
    sheetAnim = spring({ from, to, ...M.defaultSpatial, onUpdate: v => { sh.style.transform = `translateY(${v * 100}%)`; } });
  }
  function openDetail(n, anchor) {
    if (S.D || !anchor) return;
    const c = byN(n), owned = c.have > 0, from = rectIn(anchor);
    const rot = parseFloat(getComputedStyle(anchor).getPropertyValue('--rot')) || 0;
    const card = S.ctrl.card ? S.ctrl.card(c) : cardHTML(c), back = S.ctrl.back ? S.ctrl.back(!owned) : backHTML(!owned);
    const z = document.createElement('div');
    z.className = 'zoom';
    z.innerHTML = `<div class="zoom-tilt"><div class="zoom-flip${owned ? '' : ' is-back'}"><div class="zf front">${card}</div><div class="zf back">${back}</div></div></div>`;
    screen.appendChild(z);
    if (owned) anchor.classList.add('lifted');
    const D = S.D = { n, c, owned, anchor, rot, z, cur: { x: from.x, y: from.y, w: from.w, r: rot } };
    placeZoom(z, from.x, from.y, from.w, rot);
    D.anim = spring({ from: 0, to: 1, ...M.fastSpatial, onUpdate: t => {
      D.cur = { x: lerp(from.x, TO.x, t), y: lerp(from.y, TO.y, t), w: lerp(from.w, TW, t), r: lerp(rot, 0, t) };
      placeZoom(z, D.cur.x, D.cur.y, D.cur.w, D.cur.r);
    } });
    $('#sheet', screen).innerHTML = sheetHTML(c, owned);
    showSheet(true); buzz(8);
    const tilt = $('.zoom-tilt', z), flip = $('.zoom-flip', z);
    z.addEventListener('pointermove', e => {
      const r = z.getBoundingClientRect(), px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
      tilt.style.transform = `rotateY(${(px - .5) * 26}deg) rotateX(${(.5 - py) * 22}deg)`;
      z.style.setProperty('--hx', `${px * 100}%`); z.style.setProperty('--hy', `${py * 100}%`);
      z.style.setProperty('--gx', `${px * 100}%`); z.style.setProperty('--gy', `${py * 100}%`);
    });
    z.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
    z.addEventListener('click', () => { if (D.owned && !D.closing) { flip.classList.toggle('is-back'); buzz(6); } });
    setTimeout(() => { const b = $('#sheet .btn-filled', screen); b && b.focus({ preventScroll: true }); }, 50);
  }
  function flyTo(D, to, cfg, done) {
    const f = { ...D.cur };
    D.anim && D.anim.stop();
    D.anim = spring({ from: 0, to: 1, ...cfg, onUpdate: t => placeZoom(D.z, lerp(f.x, to.x, t), lerp(f.y, to.y, t), lerp(f.w, to.w, t), lerp(f.r, to.r, t)), onDone: done });
  }
  function closeDetail(mode) {
    const D = S.D; if (!D || D.closing) return;
    D.closing = true; showSheet(false);
    $('.zoom-tilt', D.z).style.transform = '';
    if (mode === 'insert') {
      $('.zoom-flip', D.z).classList.remove('is-back'); buzz(12);
      setTimeout(() => {
        const r = rectIn(D.anchor), st = getComputedStyle($('#stage', screen));
        const ix = parseFloat(st.getPropertyValue('--ix')) || 0, iy = parseFloat(st.getPropertyValue('--iy')) || 0;
        flyTo(D, { x: r.x + ix * r.w, y: r.y + iy * r.h, w: r.w, r: D.rot }, M.defaultSpatial, () => {
          D.z.remove(); S.D = null;
          D.c.have = 1; D.c.isNew = true;
          const pk = S.ctrl.replacePocket(D.n), a = $('.anchor', pk);
          if (a) { a.style.setProperty('--ins', 1); spring({ from: 1, to: 0, ...M.defaultSpatial, onUpdate: v => a.style.setProperty('--ins', v) }); }
          celebrate(D.c, pk);
        });
      }, RM ? 0 : 560);
    } else {
      const r = rectIn(D.anchor);
      flyTo(D, { x: r.x, y: r.y, w: r.w, r: D.rot }, M.defaultSpatial, () => { D.z.remove(); D.anchor.classList.remove('lifted'); S.D = null; });
    }
  }
  function celebrate(c, pk) {
    buzz(25);
    const r = rectIn(pk); confetti(r.x + r.w / 2, r.y + r.h / 3, 20);
    $$('[data-owned]', screen).forEach(el => { el.textContent = ownedCount(); });
    renderAppbar(); const cnt = $('#count', screen); cnt && cnt.classList.add('bump');
    const done = S.ctrl.afterInsert(c.n);
    toast(done ? `Folha completa! ${c.name} foi pro álbum.` : `${c.name} foi pro álbum! Agora são ${ownedCount()} de 24.`);
  }
  function confetti(x, y, n = 18) {
    if (RM) return;
    const cols = ['#FB4903', '#4DA2FF', '#55DB9C', '#FFD731', '#5C4ADE', '#E9CCFF'], parts = [];
    for (let i = 0; i < n; i++) {
      const el = document.createElement('i'), kind = i % 3, col = cols[i % 6];
      if (kind === 0) { el.className = 'conf'; el.innerHTML = `<svg viewBox="0 0 20 20" width="16" height="16">${starSVG(10, 10, 8.5, col, '#000')}</svg>`; }
      else { el.className = `conf ${kind === 1 ? 'dot' : 'sq'}`; el.style.background = col; }
      screen.appendChild(el);
      parts.push({ el, x, y, vx: (Math.random() - .5) * 520, vy: -200 - Math.random() * 420, r: Math.random() * 360, vr: (Math.random() - .5) * 720 });
    }
    let last = performance.now(); const t0 = last;
    const step = now => {
      const dt = Math.min(.033, (now - last) / 1000), age = (now - t0) / 1000; last = now;
      parts.forEach(p => { p.vy += 1300 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`; p.el.style.opacity = age > .8 ? Math.max(0, 1 - (age - .8) / .4) : 1; });
      if (age < 1.25) requestAnimationFrame(step); else parts.forEach(p => p.el.remove());
    };
    requestAnimationFrame(step);
  }
  function toast(msg) {
    const sn = $('#snack', screen); if (!sn) return;
    sn.innerHTML = msg; sn.classList.add('show');
    clearTimeout(S.snackT); S.snackT = setTimeout(() => sn.classList.remove('show'), 3400);
  }

  /* ---------- Variações, notas, ajuste de escala ---------- */
  function renderTabs() {
    const seg = $('#segs');
    seg.innerHTML = [1, 2].map(r => `<div class="seg-wrap"><span class="seg-label">Rodada ${r}${r === 2 ? ' · nova direção de arte' : ' · design system Slush'}</span><div class="seg" role="tablist" aria-label="Variações da rodada ${r}">${Object.entries(VARIANTS).filter(([, V]) => V.round === r).map(([k, V]) => `<button role="tab" data-v="${k}" aria-selected="${k === S.v}"><b>${V.num}</b>${V.short}</button>`).join('')}</div></div>`).join('');
  }
  function renderNotes() {
    const n = VARIANTS[S.v].notes;
    $('#notes').innerHTML = `<div class="ncard"><div class="n-top"><span class="n-num">${VARIANTS[S.v].num}</span><div><h2>${n.title}</h2><p class="n-tag">${n.tag}</p></div></div>
      <p>${n.concept}</p>
      ${n.refs ? `<h3>Referências</h3><p class="n-refs">${n.refs}</p>` : ''}
      <h3>Experimente</h3><ol>${n.try.map(x => `<li>${x}</li>`).join('')}</ol>
      <h3>Componentes Material 3</h3><div class="n-chips">${n.m3.map(x => `<span>${x}</span>`).join('')}</div>
      <div class="n-pc"><div><h3>A favor</h3><p>${n.pros}</p></div><div><h3>Cuidado</h3><p>${n.cons}</p></div></div></div>`;
  }
  function mount(v) {
    if (!VARIANTS[v]) v = 'v1';
    S.v = v; S.open = false; S.D = null;
    buildScreen(v); renderAppbar();
    S.ctrl = VARIANTS[v].mount($('#stage', screen), api);
    renderTabs(); renderNotes();
  }
  const fromHash = () => { const h = location.hash.slice(1); return Object.keys(VARIANTS).find(k => VARIANTS[k].hash === h); };
  window.addEventListener('hashchange', () => { const v = fromHash(); if (v && v !== S.v) mount(v); });
  document.addEventListener('click', e => {
    const b = e.target.closest('#segs [data-v]'); if (!b) return;
    const v = b.dataset.v; if (v === S.v) return;
    try { history.replaceState(null, '', `#${VARIANTS[v].hash}`); } catch (err) { /* ok */ }
    mount(v);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && S.D) { closeDetail('back'); return; }
    if (S.D || !S.ctrl || !S.ctrl.isOpen()) return;
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') S.ctrl.key(1);
    if (e.key === 'ArrowLeft') S.ctrl.key(-1);
  });
  $('#reset').addEventListener('click', () => { resetData(); mount(S.v); });
  function fit() {
    const narrow = innerWidth < 560; document.body.classList.toggle('narrow', narrow);
    const dw = narrow ? W : 408, dh = narrow ? H : 844;
    const availW = narrow ? innerWidth - 16 : Math.min(innerWidth - 48, 520), availH = narrow ? 1e4 : innerHeight - 32;
    const s = Math.max(.55, Math.min(1, availW / dw, availH / dh));
    device.style.transform = `scale(${s})`; slot.style.width = `${dw * s}px`; slot.style.height = `${dh * s}px`;
  }
  window.addEventListener('resize', fit);
  $('#headline').insertAdjacentHTML('beforeend', `<span class="h-stk" style="right:-6px;top:-22px;--r:14deg">${sticker('sonho', 58, '#FFD731')}</span><span class="h-stk" style="left:-18px;bottom:-30px;--r:-12deg">${sticker('fogo', 46, '#FB4903')}</span>`);
  fit();
  const start = data => mount(fromHash() || (data && data.v) || 'v1');
  if (window.claude?.hot) { window.claude.hot.snapshot?.(() => ({ v: S.v })); window.claude.hot.ready ? window.claude.hot.ready(start) : start(window.claude.hot.data ?? {}); }
  else start({});
})();
