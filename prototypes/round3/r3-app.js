/* App da rodada 3: tela Android, carta ampliada, anúncio no formato de marketplace, celebração */
(() => {
  const screen = $('#screen'), device = $('#device'), slot = $('#slot');
  const S = { v: 'r3a', ctrl: null, open: false, title: '', D: null, snackT: 0, lang: 'PT', nb: 'padrao' };
  const NAVBARS = {
    padrao: { label: 'Padrão', title: 'Barra padrão do Material 3', text: 'Barra fixa embaixo, com ícone e rótulo em cada destino e uma pílula no item ativo. É o que a criança já viu em outros apps.', pros: 'Previsível e fácil de implementar com o componente do Material.', cons: 'Neutra: não conversa com o álbum.' },
    pilula: { label: 'Pílula', title: 'Pílula flutuante', text: 'A barra se solta das bordas e flutua sobre o fundo, como a navegação flexível do Material 3 Expressive. O item ativo vira uma pílula com o rótulo ao lado do ícone.', pros: 'Leve, moderna e deixa o fundo respirar em volta do álbum.', cons: 'Com 3 rótulos fica justa em telas de 360dp; com 4 destinos não cabe.' },
    centro: { label: 'Centro', title: 'Álbum no centro', text: 'O destino principal vira um mini fichário que salta para fora da barra, entre Amigos e Trocas. A criança encontra o álbum de qualquer tela.', pros: 'Deixa claro que o álbum é o coração do app e já é um ícone de marca pronto.', cons: 'Foge do padrão do Material, então os estados de foco e toque precisam de cuidado.' },
    abas: { label: 'Abas', title: 'Abas de fichário', text: 'Cada destino é uma aba colorida de divisória, saindo de um trilho escuro. A aba ativa sobe, como quando a gente puxa uma divisória.', pros: 'Continua a metáfora do álbum e a cor de cada aba ajuda quem ainda não lê.', cons: 'Ocupa mais altura, e as cores precisam combinar com cada capa.' },
    adesivo: { label: 'Adesivos', title: 'Adesivos', text: 'Sem barra: três adesivos recortados flutuam no pé da tela. O ativo cresce e fica reto. Os adesivos podem trocar conforme a criança desbloqueia ou compra pacotes.', pros: 'É a opção mais lúdica e abre espaço para vender adesivos depois.', cons: 'Sem fundo, o contraste depende do que estiver atrás; precisa de teste com o álbum aberto.' },
  };
  const W = 384, H = 820;

  /* ---------- Tela ---------- */
  const NAV = [['album', 'Álbum'], ['friends', 'Amigos'], ['trade', 'Trocas']];
  function buildScreen(v) {
    const V = VARIANTS[v];
    screen.className = `screen skin-${V.skin || 'r1'} nb-${S.nb}`;
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
    $('#sheet', screen).addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b || !S.D) return; const a = b.dataset.act;
      if (a === 'pick') { $('#sheet', screen).innerHTML = pickerHTML(S.D.c); buzz(6); return; }
      if (a.startsWith('lang:')) { S.lang = a.slice(5); $$('.pick-lang button', screen).forEach(x => x.setAttribute('aria-checked', String(x.dataset.act === a))); buzz(4); return; }
      closeDetail(a);
    });
  }
  function renderAppbar() {
    const ab = $('#appbar', screen); if (!ab) return;
    screen.style.setProperty('--own', ownedCount() / total());
    const chip = `<div class="count" id="count" aria-label="${ownedCount()} de ${total()} cartas">${ico('cards', 22)}<b>${ownedCount()}</b>/${total()}</div>`;
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
    if (owned) {
      const dup = c.have - 1;
      const text = dup > 0 ? `Você tem <b>${c.have}</b>. Sobra${dup > 1 ? 'm' : ''} <b>${dup} repetida${dup > 1 ? 's' : ''}</b> pra trocar.`
        : c.isNew ? '<b>Nova!</b> Acabou de entrar no álbum.' : 'Você tem <b>1</b> guardada aqui.';
      return `<div class="sh-handle"></div>${listingHTML(c, true)}<p class="sh-text">${text}</p><div class="sh-actions"><button class="btn btn-filled" data-act="back">Guardar de volta</button></div>`;
    }
    return `<div class="sh-handle"></div>${listingHTML(c, false)}<p class="sh-text"><b>Ainda falta essa!</b> Quando ganhar, guarde aqui.</p><div class="sh-actions"><button class="btn btn-filled" data-act="pick">${ico('plus', 24)} Ganhei! Guardar no álbum</button><button class="btn btn-text" data-act="back">Agora não</button></div>`;
  }
  function pickerHTML(c) {
    const conds = [['NM', 'Novinha', 'Sem marcas'], ['LP', 'Pouco usada', 'Pontinhas brancas'], ['MP', 'Usada', 'Riscos ou dobras']];
    return `<div class="sh-handle"></div><p class="ls-set">${c.name} · ${numStr(c)}</p><h2 class="sh-title" id="shTitle">Como ela está?</h2>
      <div class="pick-lang" role="radiogroup" aria-label="Idioma da carta">${['PT', 'EN', 'JP'].map(l => `<button role="radio" aria-checked="${l === S.lang}" data-act="lang:${l}">${l}</button>`).join('')}</div>
      <div class="pick-cond">${conds.map(([k, t, d]) => `<button class="pick" data-act="ins:${k}"><b>${t}</b><span>${d}</span><em>${k}</em></button>`).join('')}</div>`;
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
    if (mode.startsWith('ins:')) {
      $('.zoom-flip', D.z).classList.remove('is-back'); buzz(12);
      setTimeout(() => {
        const r = rectIn(D.anchor), st = getComputedStyle($('#stage', screen));
        const ix = parseFloat(st.getPropertyValue('--ix')) || 0, iy = parseFloat(st.getPropertyValue('--iy')) || 0;
        flyTo(D, { x: r.x + ix * r.w, y: r.y + iy * r.h, w: r.w, r: D.rot }, M.defaultSpatial, () => {
          D.z.remove(); S.D = null;
          D.c.have = 1; D.c.isNew = true; D.c.cond = mode.slice(4); D.c.lang = S.lang; D.c.variant = FOIL[D.c.r] || 'Normal'; D.c.holo = D.c.variant !== 'Normal';
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
    toast(done ? `Folha completa! ${c.name} foi pro álbum.` : `${c.name} foi pro álbum! Agora são ${ownedCount()} de ${total()}.`);
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
    seg.innerHTML = [3].map(r => `<div class="seg-wrap"><span class="seg-label">Rodada 3 · álbum e interface combinados, com cartas reais</span><div class="seg" role="tablist" aria-label="Variações da rodada ${r}">${Object.entries(VARIANTS).filter(([, V]) => V.round === r).map(([k, V]) => `<button role="tab" data-v="${k}" aria-selected="${k === S.v}"><b>${V.num}</b>${V.short}</button>`).join('')}</div></div>`).join('');
    seg.insertAdjacentHTML('beforeend', `<div class="seg-wrap"><span class="seg-label">Barra de navegação</span><div class="seg" role="tablist" aria-label="Barra de navegação">${Object.entries(NAVBARS).map(([k, n], i) => `<button role="tab" data-nb="${k}" aria-selected="${k === S.nb}"><b>${i + 1}</b>${n.label}</button>`).join('')}</div></div>`);
  }
  function navCard() {
    const b = NAVBARS[S.nb];
    return `<div class="ncard"><div class="n-top"><span class="n-num">${Object.keys(NAVBARS).indexOf(S.nb) + 1}</span><div><h2>${b.title}</h2><p class="n-tag">Barra de navegação · Álbum, Amigos e Trocas</p></div></div><p>${b.text}</p><div class="n-pc"><div><h3>A favor</h3><p>${b.pros}</p></div><div><h3>Cuidado</h3><p>${b.cons}</p></div></div></div>`;
  }
  function renderNotes() {
    const n = VARIANTS[S.v].notes;
    $('#notes').innerHTML = `<div class="ncard"><div class="n-top"><span class="n-num">${VARIANTS[S.v].num}</span><div><h2>${n.title}</h2><p class="n-tag">${n.tag}</p></div></div>
      <p>${n.concept}</p>
      ${n.refs ? `<h3>Referências</h3><p class="n-refs">${n.refs}</p>` : ''}
      <h3>Experimente</h3><ol>${n.try.map(x => `<li>${x}</li>`).join('')}</ol>
      <h3>Componentes Material 3</h3><div class="n-chips">${n.m3.map(x => `<span>${x}</span>`).join('')}</div>
      <div class="n-pc"><div><h3>A favor</h3><p>${n.pros}</p></div><div><h3>Cuidado</h3><p>${n.cons}</p></div></div></div>
      ${navCard()}`;
  }
  function mount(v) {
    if (!VARIANTS[v]) v = 'r3a';
    S.v = v; S.open = false; S.D = null;
    buildScreen(v); renderAppbar();
    S.ctrl = VARIANTS[v].mount($('#stage', screen), api);
    renderTabs(); renderNotes();
  }
  const fromHash = () => { const h = location.hash.slice(1); return Object.keys(VARIANTS).find(k => VARIANTS[k].hash === h); };
  window.addEventListener('hashchange', () => { const v = fromHash(); if (v && v !== S.v) mount(v); });
  document.addEventListener('click', e => {
    const nb = e.target.closest('#segs [data-nb]');
    if (nb) { S.nb = nb.dataset.nb; Object.keys(NAVBARS).forEach(k => screen.classList.toggle(`nb-${k}`, k === S.nb)); renderTabs(); renderNotes(); buzz(6); return; }
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
  const start = data => mount(fromHash() || (data && data.v) || 'r3a');
  if (window.claude?.hot) { window.claude.hot.snapshot?.(() => ({ v: S.v })); window.claude.hot.ready ? window.claude.hot.ready(start) : start(window.claude.hot.data ?? {}); }
  else start({});
})();
