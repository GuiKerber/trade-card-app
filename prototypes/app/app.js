/* App v1 — Álbum (direção escolhida), Amigos, Trocas e Loja, num Android de 384dp */
(() => {
  const screen = $('#screen'), device = $('#device'), slot = $('#slot');
  const W = 384, H = 820;
  const S = { tab: 'album', prev: 'album', ctrl: null, open: false, title: '', D: null, G: null, snackT: 0, lang: 'PT', nb: 'padrao' };
  const NAV = [['album', 'album', 'Álbum'], ['trade', 'trade', 'Trocas'], ['friends', 'friends', 'Amigos']];
  const NAVBARS = { padrao: 'Padrão', pilula: 'Pílula', centro: 'Centro', abas: 'Abas', adesivo: 'Adesivos' };
  const TAB_NOTES = {
    album: { t: 'Álbum', p: 'Toque numa carta e use <b>Pôr pra troca</b>. As cartas marcadas ganham o selo de setas no bolso e aparecem para os seus amigos.', try: ['Abra o álbum e toque no Pikachu (você tem 3).', 'Toque em <b>Pôr pra troca</b> ou <b>Tirar da troca</b>.', 'Toque em <b>Loja</b>, no canto de cima, e troque a capa.'] },
    trade: { t: 'Trocas', p: 'Três abas: <b>Ofertas</b> mostra o que os amigos puseram pra troca (as que faltam no seu álbum vêm primeiro), <b>Procurar</b> busca uma carta pelo nome ou número, e <b>Pedidos</b> guarda os pedidos novos, as trocas combinadas e as enviadas.', try: ['Em Ofertas, toque na Venusaur ex de Theo, escolha uma carta sua, o lugar e o dia.', 'Em Pedidos, aceite o pedido de Bia e depois toque em <b>Já trocamos</b>: a Gengar entra no seu álbum.', 'Em Procurar, digite “char” ou “199”.'] },
    friends: { t: 'Amigos', p: 'O seu código (e o QR Code) e a lista de amigos. Amigos só entram pessoalmente e com aprovação de um adulto. Não tem chat.', try: ['Toque em <b>Adicionar amigo</b> e digite NUVEM-357.', 'Abra um amigo para ver as cartas que ele pôs pra troca.'] },
    store: { t: 'Loja', p: '10 capas e 10 adesivos para colar na capa do álbum. Itens pagos pedem um adulto antes (porta de segurança para os pais). Nada é cobrado no protótipo.', try: ['Toque numa capa grátis (Aurora) para usar.', 'Em Adesivos, toque em Chama e arraste o adesivo na capa.', 'Toque numa capa paga para ver a pergunta para o adulto.'] },
  };

  /* ---------- Tela ---------- */
  function buildScreen() {
    screen.className = `screen skin-r3d nb-${S.nb}`;
    screen.innerHTML = `
      <div class="statusbar"><span>16:20</span><i class="cam"></i><span class="sb-icons">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 14h2v-3H1zM5 14h2V8H5zM9 14h2V5H9zM13 14h2V2h-2z" fill="currentColor"/></svg>
        <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true"><path d="M9 14.5 1.2 6.2a11 11 0 0 1 15.6 0z" fill="currentColor"/></svg>
        <svg width="24" height="14" viewBox="0 0 24 14" aria-hidden="true"><rect x=".8" y=".8" width="19.5" height="12.4" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="3" width="13" height="8" rx="1.8" fill="currentColor"/><rect x="21.5" y="4.5" width="2" height="5" rx="1" fill="currentColor"/></svg></span></div>
      <header class="appbar" id="appbar"></header>
      <section class="stage" id="stage"></section>
      <nav class="navbar" aria-label="Navegação principal">${NAV.map(([k, i, l]) => `<button class="nav-item" data-tab="${k}"><span class="nav-ind">${ico(i, 28)}${k === 'trade' ? '<i class="badge" id="nbadge"></i>' : ''}</span><span class="nav-lb">${l}</span></button>`).join('')}</nav>
      <div class="gesture"><i></i></div>
      <div class="scrim" id="scrim"></div>
      <div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="shTitle"></div>
      <div class="snack" id="snack" role="status"></div>`;
    $('.navbar', screen).addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); });
    $('#scrim', screen).addEventListener('click', () => (S.D ? closeDetail('back') : closeSheet()));
    $('#sheet', screen).addEventListener('click', onSheetClick);
  }
  function renderNav() {
    const cur = S.tab === 'store' ? S.prev : S.tab;
    $$('.nav-item', screen).forEach(b => { const on = b.dataset.tab === cur; b.classList.toggle('active', on); b.toggleAttribute('aria-current', on); });
    const n = REQS.filter(r => r.status === 'new').length, bd = $('#nbadge', screen);
    bd.textContent = n; bd.hidden = !n;
  }
  function renderAppbar() {
    const ab = $('#appbar', screen); if (!ab) return;
    screen.style.setProperty('--own', ownedCount() / total());
    const chip = `<div class="count" id="count" aria-label="${ownedCount()} de ${total()} cartas">${ico('cards', 22)}<b>${ownedCount()}</b>/${total()}</div>`;
    const back = label => `<button class="icon-btn" id="abBack" aria-label="${label}">${ico('back', 24)}</button>`;
    const store = `<button class="store-btn" id="abStore" aria-label="Abrir a loja">${ico('bag', 22)}<span>Loja</span></button>`;
    let lead = store, title = { album: 'Oi, Lia!', trade: 'Trocas', friends: 'Amigos' }[S.tab];
    if (S.tab === 'store') { lead = back('Voltar'); title = 'Loja'; }
    else if (S.tab === 'album' && S.open) { lead = back('Fechar o álbum'); title = S.title; }
    ab.innerHTML = `${lead}<div class="ab-title">${title}</div>${chip}`;
    const b = $('#abBack', ab); if (b) b.addEventListener('click', () => { if (S.D || S.G) return; S.tab === 'store' ? go(S.prev) : S.ctrl.close(); });
    const s = $('#abStore', ab); if (s) s.addEventListener('click', () => go('store'));
  }
  function go(tab) {
    if (S.D) return; if (S.G) closeSheet();
    if (tab === 'store' && S.tab !== 'store') S.prev = S.tab;
    if (tab !== S.tab) buzz(6);
    S.tab = tab; S.open = false; mountTab();
  }
  function mountTab() {
    const stage = $('#stage', screen);
    const fresh = stage.cloneNode(false); stage.replaceWith(fresh); fresh.removeAttribute('style');
    if (S.tab === 'album') { S.ctrl = mountBinder(fresh, api, { cls: 'r3c', cover: 'holo' }); applySkin(fresh); }
    else S.ctrl = { trade: mountTrades, friends: mountFriends, store: mountStore }[S.tab](fresh, api);
    renderAppbar(); renderNav(); renderNotes();
  }
  const api = {
    setOpen(open, title = '') { S.open = open; S.title = title; renderAppbar(); },
    setTitle(t) { S.title = t; const el = $('.ab-title', screen); if (S.open && el) el.textContent = t; },
    openDetail, rectIn, confetti, toast, openSheet, closeSheet,
    refresh: () => { if (S.tab !== 'album') mountTab(); else renderNav(); },
    counter: () => { renderAppbar(); renderNav(); },
  };
  function rectIn(el) {
    const r = el.getBoundingClientRect(), s = screen.getBoundingClientRect(), k = s.width / W;
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  }

  /* ---------- Sheet genérico ---------- */
  let sheetAnim = null;
  function showSheet(on) {
    const sh = $('#sheet', screen); $('#scrim', screen).classList.toggle('on', on);
    sheetAnim && sheetAnim.stop();
    const cur = parseFloat((sh.style.transform.match(/-?[\d.]+/) || ['105'])[0]) / 100;
    sheetAnim = spring({ from: on ? (isNaN(cur) ? 1.05 : cur) : 0, to: on ? 0 : 1.05, ...M.defaultSpatial, onUpdate: v => { sh.style.transform = `translateY(${v * 100}%)`; } });
  }
  function openSheet(html, handler, raw) {
    const sh = $('#sheet', screen); sh.innerHTML = html; sh.scrollTop = 0;
    const wasOpen = !!S.G;
    S.G = { handler, raw, set: h => { sh.innerHTML = h; } };
    if (!wasOpen) showSheet(true);
    buzz(6); return S.G;
  }
  function closeSheet() { if (!S.G) return; S.G = null; showSheet(false); }
  function onSheetClick(e) {
    if (S.D) return onDetailClick(e);
    if (!S.G) return;
    if (S.G.raw && S.G.raw(e)) return;
    const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    S.G.handler(b.dataset.act, S.G, b);
  }

  /* ---------- Carta ampliada + anúncio + pôr pra troca ---------- */
  const TW = 212, TO = { x: (W - TW) / 2, y: 104 };
  const placeZoom = (z, x, y, w, rot) => { z.style.left = `${x}px`; z.style.top = `${y}px`; z.style.width = `${w}px`; z.style.transform = `rotate(${rot}deg)`; };
  function sheetHTML(c, owned) {
    if (owned) {
      const dup = c.have - 1;
      const text = c.trade ? `Está na sua lista de troca. Seus amigos podem ver.${dup > 0 ? ` Você tem ${c.have}.` : ' É a sua única: se trocar, o bolso fica vazio.'}`
        : dup > 0 ? `Você tem <b>${c.have}</b>. Dá pra pôr <b>${dup}</b> pra troca e continuar com uma.` : c.isNew ? '<b>Nova!</b> Acabou de entrar no álbum.' : 'Você tem <b>1</b> guardada aqui.';
      const tr = c.trade ? `<button class="btn btn-tonal" data-act="trade-off">${ico('trade', 22)} Tirar da troca</button>` : `<button class="btn btn-tonal" data-act="trade-on">${ico('trade', 22)} Pôr pra troca</button>`;
      return `<div class="sh-handle"></div>${listingHTML(c, true)}<p class="sh-text">${text}</p><div class="sh-actions two">${tr}<button class="btn btn-filled" data-act="back">Guardar</button></div>`;
    }
    const who = offers().filter(o => o.c.n === c.n);
    const hint = who.length ? `<p class="sh-text">${who.map(o => o.f.name).join(' e ')} ${who.length > 1 ? 'puseram' : 'pôs'} essa pra troca.</p>` : '<p class="sh-text"><b>Ainda falta essa!</b> Quando ganhar, guarde aqui.</p>';
    const tradeBtn = who.length ? `<button class="btn btn-tonal" data-act="ask:${who[0].f.id}">${ico('trade', 22)} Pedir troca</button>` : '';
    return `<div class="sh-handle"></div>${listingHTML(c, false)}${hint}<div class="sh-actions">${tradeBtn}<button class="btn btn-filled" data-act="pick">${ico('plus', 24)} Ganhei! Guardar no álbum</button><button class="btn btn-text" data-act="back">Agora não</button></div>`;
  }
  function pickerHTML(c) {
    const conds = [['NM', 'Novinha', 'Sem marcas'], ['LP', 'Pouco usada', 'Pontinhas brancas'], ['MP', 'Usada', 'Riscos ou dobras']];
    return `<div class="sh-handle"></div><p class="ls-set">${c.name} · ${numStr(c)}</p><h2 class="sh-title" id="shTitle">Como ela está?</h2>
      <div class="pick-lang" role="radiogroup" aria-label="Idioma da carta">${['PT', 'EN', 'JP'].map(l => `<button role="radio" aria-checked="${l === S.lang}" data-act="lang:${l}">${l}</button>`).join('')}</div>
      <div class="pick-cond">${conds.map(([k, t, d]) => `<button class="pick" data-act="ins:${k}"><b>${t}</b><span>${d}</span><em>${k}</em></button>`).join('')}</div>`;
  }
  function onDetailClick(e) {
    const b = e.target.closest('[data-act]'); if (!b || !S.D) return; const a = b.dataset.act, D = S.D, sh = $('#sheet', screen);
    if (a === 'pick') { sh.innerHTML = pickerHTML(D.c); buzz(6); return; }
    if (a.startsWith('lang:')) { S.lang = a.slice(5); $$('.pick-lang button', screen).forEach(x => x.setAttribute('aria-checked', String(x.dataset.act === a))); buzz(4); return; }
    if (a === 'trade-on' || a === 'trade-off') {
      D.c.trade = a === 'trade-on' ? 1 : 0; D.dirty = true; sh.innerHTML = sheetHTML(D.c, true); buzz(10);
      toast(D.c.trade ? `${D.c.name} está na sua lista de troca.` : `${D.c.name} saiu da lista de troca.`); return;
    }
    if (a.startsWith('ask:')) { const fid = a.slice(4), n = D.n; closeDetail('back', () => proposeSheet(api, fid, n)); return; }
    closeDetail(a);
  }
  function openDetail(n, anchor) {
    if (S.D || S.G || !anchor) return;
    const c = byN(n), owned = c.have > 0, from = rectIn(anchor);
    const rot = parseFloat(getComputedStyle(anchor).getPropertyValue('--rot')) || 0;
    const z = document.createElement('div'); z.className = 'zoom';
    z.innerHTML = `<div class="zoom-tilt"><div class="zoom-flip${owned ? '' : ' is-back'}"><div class="zf front">${cardHTML(c)}</div><div class="zf back">${backHTML(!owned)}</div></div></div>`;
    screen.appendChild(z); if (owned) anchor.classList.add('lifted');
    const D = S.D = { n, c, owned, anchor, rot, z, cur: { x: from.x, y: from.y, w: from.w, r: rot } };
    placeZoom(z, from.x, from.y, from.w, rot);
    D.anim = spring({ from: 0, to: 1, ...M.fastSpatial, onUpdate: t => { D.cur = { x: lerp(from.x, TO.x, t), y: lerp(from.y, TO.y, t), w: lerp(from.w, TW, t), r: lerp(rot, 0, t) }; placeZoom(z, D.cur.x, D.cur.y, D.cur.w, D.cur.r); } });
    $('#sheet', screen).innerHTML = sheetHTML(c, owned); showSheet(true); buzz(8);
    const tilt = $('.zoom-tilt', z), flip = $('.zoom-flip', z);
    z.addEventListener('pointermove', e => { const r = z.getBoundingClientRect(), px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
      tilt.style.transform = `rotateY(${(px - .5) * 26}deg) rotateX(${(.5 - py) * 22}deg)`; ['--hx', '--gx'].forEach(k => z.style.setProperty(k, `${px * 100}%`)); ['--hy', '--gy'].forEach(k => z.style.setProperty(k, `${py * 100}%`)); });
    z.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
    z.addEventListener('click', () => { if (D.owned && !D.closing) { flip.classList.toggle('is-back'); buzz(6); } });
  }
  function flyTo(D, to, cfg, done) { const f = { ...D.cur }; D.anim && D.anim.stop(); D.anim = spring({ from: 0, to: 1, ...cfg, onUpdate: t => placeZoom(D.z, lerp(f.x, to.x, t), lerp(f.y, to.y, t), lerp(f.w, to.w, t), lerp(f.r, to.r, t)), onDone: done }); }
  function closeDetail(mode, after) {
    const D = S.D; if (!D || D.closing) return; D.closing = true; showSheet(false); $('.zoom-tilt', D.z).style.transform = '';
    if (mode.startsWith('ins:')) {
      $('.zoom-flip', D.z).classList.remove('is-back'); buzz(12);
      setTimeout(() => {
        const r = rectIn(D.anchor), st = getComputedStyle($('#stage', screen)), ix = parseFloat(st.getPropertyValue('--ix')) || 0, iy = parseFloat(st.getPropertyValue('--iy')) || 0;
        flyTo(D, { x: r.x + ix * r.w, y: r.y + iy * r.h, w: r.w, r: D.rot }, M.defaultSpatial, () => {
          D.z.remove(); S.D = null;
          Object.assign(D.c, { have: 1, isNew: true, cond: mode.slice(4), lang: S.lang, variant: FOIL[D.c.r] || 'Normal' }); D.c.holo = D.c.variant !== 'Normal';
          const pk = S.ctrl.replacePocket(D.n), a = $('.anchor', pk);
          if (a) { a.style.setProperty('--ins', 1); spring({ from: 1, to: 0, ...M.defaultSpatial, onUpdate: v => a.style.setProperty('--ins', v) }); }
          celebrate(D.c, pk);
        });
      }, RM ? 0 : 560);
    } else {
      const r = rectIn(D.anchor);
      flyTo(D, { x: r.x, y: r.y, w: r.w, r: D.rot }, M.defaultSpatial, () => { D.z.remove(); D.anchor.classList.remove('lifted'); S.D = null; if (D.dirty) S.ctrl.replacePocket(D.n); after && after(); });
    }
  }
  function celebrate(c, pk) {
    buzz(25); const r = rectIn(pk); confetti(r.x + r.w / 2, r.y + r.h / 3, 20);
    $$('[data-owned]', screen).forEach(el => { el.textContent = ownedCount(); });
    renderAppbar(); const cnt = $('#count', screen); cnt && cnt.classList.add('bump');
    toast(S.ctrl.afterInsert(c.n) ? `Folha completa! ${c.name} foi pro álbum.` : `${c.name} foi pro álbum! Agora são ${ownedCount()} de ${total()}.`);
  }
  function confetti(x, y, n = 18) {
    if (RM) return;
    const cols = ['#ffb3d9', '#d9b8ff', '#a9dcff', '#b4f5dc', '#fff0a8', '#5C4ADE'], parts = [];
    for (let i = 0; i < n; i++) {
      const el = document.createElement('i'), kind = i % 3, col = cols[i % 6];
      if (kind === 0) { el.className = 'conf'; el.innerHTML = `<svg viewBox="0 0 20 20" width="16" height="16">${starSVG(10, 10, 8.5, col, '#000')}</svg>`; } else { el.className = `conf ${kind === 1 ? 'dot' : 'sq'}`; el.style.background = col; }
      screen.appendChild(el); parts.push({ el, x, y, vx: (Math.random() - .5) * 520, vy: -200 - Math.random() * 420, r: Math.random() * 360, vr: (Math.random() - .5) * 720 });
    }
    let last = performance.now(); const t0 = last;
    const step = now => { const dt = Math.min(.033, (now - last) / 1000), age = (now - t0) / 1000; last = now;
      parts.forEach(p => { p.vy += 1300 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`; p.el.style.opacity = age > .8 ? Math.max(0, 1 - (age - .8) / .4) : 1; });
      if (age < 1.25) requestAnimationFrame(step); else parts.forEach(p => p.el.remove()); };
    requestAnimationFrame(step);
  }
  function toast(msg) { const sn = $('#snack', screen); if (!sn) return; sn.innerHTML = msg; sn.classList.add('show'); clearTimeout(S.snackT); S.snackT = setTimeout(() => sn.classList.remove('show'), 3600); }

  /* ---------- Página de apresentação ---------- */
  function renderTabs() {
    $('#segs').innerHTML = `<div class="seg-wrap"><span class="seg-label">Barra de navegação (ainda em aberto)</span><div class="seg" role="tablist" aria-label="Barra de navegação">${Object.entries(NAVBARS).map(([k, l], i) => `<button role="tab" data-nb="${k}" aria-selected="${k === S.nb}"><b>${i + 1}</b>${l}</button>`).join('')}</div></div>`;
  }
  function renderNotes() {
    const n = TAB_NOTES[S.tab];
    $('#notes').innerHTML = `<div class="ncard"><div class="n-top"><span class="n-num">${ico({ album: 'album', trade: 'trade', friends: 'friends', store: 'bag' }[S.tab], 26)}</span><div><h2>${n.t}</h2><p class="n-tag">Tela atual do protótipo</p></div></div><p>${n.p}</p><h3>Experimente</h3><ol>${n.try.map(x => `<li>${x}</li>`).join('')}</ol></div>`;
  }
  document.addEventListener('click', e => {
    const nb = e.target.closest('#segs [data-nb]'); if (!nb) return;
    S.nb = nb.dataset.nb; Object.keys(NAVBARS).forEach(k => screen.classList.toggle(`nb-${k}`, k === S.nb)); renderTabs(); buzz(6);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (S.D) closeDetail('back'); else if (S.G) closeSheet(); return; }
    if (S.D || S.G || !S.ctrl || !S.ctrl.isOpen()) return;
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') S.ctrl.key(1); if (e.key === 'ArrowLeft') S.ctrl.key(-1);
  });
  $('#reset').addEventListener('click', () => { resetData(); resetTrade(); resetSocial(); resetStore(); Object.assign(TRADES_UI, { tab: 'ofertas', q: '', miss: false }); STORE_UI.sel = -1; S.tab = 'album'; buildScreen(); mountTab(); });
  function fit() {
    const narrow = innerWidth < 560; document.body.classList.toggle('narrow', narrow);
    const dw = narrow ? W : 408, dh = narrow ? H : 844, availW = narrow ? innerWidth - 16 : Math.min(innerWidth - 48, 520), availH = narrow ? 1e4 : innerHeight - 32;
    const s = Math.max(.55, Math.min(1, availW / dw, availH / dh));
    device.style.transform = `scale(${s})`; slot.style.width = `${dw * s}px`; slot.style.height = `${dh * s}px`;
  }
  window.addEventListener('resize', fit);
  fit(); buildScreen(); renderTabs(); mountTab();
})();
