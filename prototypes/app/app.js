/* App v1 — Álbum (direção escolhida), Amigos, Trocas e Loja, num Android de 384dp */
(() => {
  const screen = $('#screen'), device = $('#device'), slot = $('#slot');
  const W = 384, H = 820;
  const DEVICE = document.body.classList.contains('device-mode');
  const S = { tab: 'album', prev: 'album', ctrl: null, open: false, title: '', D: null, G: null, snackT: 0, lang: 'PT', nb: 'centro' };
  const NAV = [['album', 'album', 'Álbum'], ['trade', 'trade', 'Trocas'], ['friends', 'friends', 'Amigos'], ['game', 'trofeu', 'Conquistas']];
  const NAVBARS = { centro: 'Centro (escolhida)', padrao: 'Padrão', pilula: 'Pílula', abas: 'Abas', adesivo: 'Adesivos' };
  const TAB_NOTES = {
    album: { t: 'Álbum', p: 'A criança decide a ordem: segura uma carta e arrasta para outro bolso, inclusive em outra folha (é só levar a carta até a borda). Bolso livre serve para guardar carta nova. O álbum é infinito, sempre com uma folha nova no fim.', try: ['Abra o álbum, segure a Charmander e solte no bolso da Bulbasaur: elas trocam de lugar.', 'Segure uma carta e leve até a borda direita para carregar para a próxima folha.', 'Toque num bolso livre e guarde a Venusaur ex.', 'Toque no Pikachu e use <b>Pôr pra troca</b>.'] },
    trade: { t: 'Trocas', p: 'Três abas: <b>Ofertas</b> mostra o que os amigos puseram pra troca (as que faltam no seu álbum vêm primeiro), <b>Procurar</b> busca uma carta pelo nome ou número, e <b>Pedidos</b> guarda os pedidos novos, as trocas combinadas e as enviadas.', try: ['Em Ofertas, toque na Venusaur ex de Theo, escolha uma carta sua, o lugar e o dia.', 'Em Pedidos, aceite o pedido de Bia e depois toque em <b>Já trocamos</b>: a Gengar entra no seu álbum.', 'Em Procurar, digite “char” ou “199”.'] },
    friends: { t: 'Amigos', p: 'O seu código (e o QR Code) e a lista de amigos. Amigos só entram pessoalmente e com aprovação de um adulto. Não tem chat.', try: ['Toque em <b>Adicionar amigo</b> e digite NUVEM-357.', 'Abra um amigo para ver as cartas que ele pôs pra troca.'] },
    game: { t: 'Conquistas', p: '<b>Ranking</b> de trocas só entre amigos, <b>Insígnias</b> a cada marco de trocas (10 Pedra, 25 Água, 50 Raio...) e a <b>Loja</b> com capas holográficas, capas com arte de Pokémon e adesivos. Itens pagos pedem um adulto antes.', try: ['Em Trocas › Pedidos, toque em <b>Já trocamos</b> na troca com Theo: é a 10ª troca e a insígnia Pedra aparece.', 'Em Insígnias, toque na Água para ver quanto falta.', 'Na Loja, prove a capa Pikachu (pede um adulto).'] },
    account: { t: 'Sua conta', p: 'O avatar no topo abre a conta: apelido, cor, código de amigo, email e a área dos pais. Sair leva de volta para a tela de entrada.', try: ['Toque em <b>Sair da conta</b> e entre de novo com email ou Google.', 'Crie uma conta nova escolhendo uma idade abaixo de 13 anos para ver a parte do adulto.'] },
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
    sheetDrag($('#sheet', screen));
  }
  function renderNav() {
    const cur = S.tab === 'account' ? S.prev : S.tab;
    $$('.nav-item', screen).forEach(b => { const on = b.dataset.tab === cur; b.classList.toggle('active', on); b.toggleAttribute('aria-current', on); });
    const n = REQS.filter(r => r.status === 'new').length, bd = $('#nbadge', screen);
    bd.textContent = n; bd.hidden = !n;
  }
  function renderAppbar() {
    const ab = $('#appbar', screen); if (!ab) return;
    const back = label => `<button class="icon-btn" id="abBack" aria-label="${label}">${ico('back', 24)}</button>`;
    const me = `<button class="me-btn" id="abMe" aria-label="Sua conta">${avatar(ME, 40)}</button>`;
    let lead = '', title = { album: `Oi, ${ME.name}!`, trade: 'Trocas', friends: 'Amigos', game: 'Conquistas' }[S.tab], end = me;
    if (S.tab === 'account') { lead = back('Voltar'); title = 'Sua conta'; end = ''; }
    else if (S.tab === 'album' && S.open) { lead = back('Fechar o álbum'); title = S.title; }
    ab.innerHTML = `${lead}<div class="ab-title">${title}</div>${end}`;
    const b = $('#abBack', ab); if (b) b.addEventListener('click', () => { if (S.D || S.G) return; S.tab === 'account' ? go(S.prev) : S.ctrl.close(); });
    const s = $('#abMe', ab); if (s) s.addEventListener('click', () => go('account'));
  }
  function go(tab) {
    if (S.D) return; if (S.G) closeSheet();
    if (tab === 'account' && S.tab !== 'account') S.prev = S.tab;
    if (tab !== S.tab) buzz(6);
    S.tab = tab; S.open = false; mountTab();
  }
  function mountTab() {
    const stage = $('#stage', screen);
    const fresh = stage.cloneNode(false); stage.replaceWith(fresh); fresh.removeAttribute('style');
    if (S.tab === 'album') { S.ctrl = mountAlbum(fresh, api); applySkin(fresh); }
    else S.ctrl = { trade: mountTrades, friends: mountFriends, game: mountGame, account: mountAccount }[S.tab](fresh, api);
    renderAppbar(); renderNav(); if (!DEVICE) renderNotes();
  }
  const api = {
    setOpen(open, title = '') { S.open = open; S.title = title; renderAppbar(); },
    setTitle(t) { S.title = t; const el = $('.ab-title', screen); if (S.open && el) el.textContent = t; },
    openDetail, rectIn, confetti, toast, openSheet, closeSheet, sheetIs: g => S.G === g, tradeShow,
    refresh: () => { if (S.tab !== 'album') mountTab(); else renderNav(); },
    remount: () => mountTab(), go: t => go(t), screen: () => screen,
    rebuild: () => { if (S.G) closeSheet(); S.tab = 'album'; S.open = false; buildScreen(); mountTab(); },
    counter: () => { renderAppbar(); renderNav(); },
  };
  function rectIn(el) {
    const r = el.getBoundingClientRect(), s = screen.getBoundingClientRect(), k = s.width / W;
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  }

  /* ---------- Sheet genérico ---------- */
  // Arrastar o painel para baixo fecha (com mola e velocidade); soltar antes faz ele voltar
  let sheetDragged = false;
  function sheetDrag(sh) {
    let d = null;
    const sc = () => $('#scrim', screen);
    sh.addEventListener('pointerdown', e => {
      if (!S.G) return;
      const head = e.target.closest('.sh-handle, .sh-title, .ps-top, .ls-set, .fs-head');
      if (!head && (sh.scrollTop > 0 || e.target.closest('input, .ps-mine, .chips'))) return;
      d = { y0: e.clientY, id: e.pointerId, dy: 0, on: false, lastY: e.clientY, lastT: performance.now(), v: 0, k: screen.getBoundingClientRect().height / screen.offsetHeight };
    });
    sh.addEventListener('pointermove', e => {
      if (!d) return; const dy = (e.clientY - d.y0) / d.k;
      if (!d.on) { if (Math.abs(dy) < 8) return; if (dy < 0) { d = null; return; } d.on = true; sheetAnim && sheetAnim.stop(); sc().style.transition = 'none'; try { sh.setPointerCapture(d.id); } catch (err) { /* ok */ } }
      const now = performance.now(); d.v = (e.clientY - d.lastY) / d.k / Math.max(1, now - d.lastT) * 1000; d.lastY = e.clientY; d.lastT = now;
      d.dy = Math.max(0, dy); sh.style.transform = `translateY(${d.dy}px)`; sc().style.opacity = String(clamp(1 - d.dy / sh.offsetHeight, 0, 1));
    });
    const up = () => {
      if (!d) return; const x = d; d = null; if (!x.on) return;
      sheetDragged = true; setTimeout(() => { sheetDragged = false; }, 60);
      const h = sh.offsetHeight, f = x.dy / h; sc().style.transition = ''; sc().style.opacity = '';
      const anim = (to, cfg) => { sheetAnim = spring({ from: f, to, velocity: x.v / h, ...cfg, onUpdate: v => { sh.style.transform = `translateY(${v * 100}%)`; } }); };
      if (x.dy > h * .28 || x.v > 650) { S.G = null; sc().classList.remove('on'); anim(1.05, M.defaultSpatial); buzz(8); } else anim(0, M.fastSpatial);
    };
    sh.addEventListener('pointerup', up); sh.addEventListener('pointercancel', up);
  }

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
    if (!S.G || sheetDragged) return;
    if (S.G.raw && S.G.raw(e)) return;
    const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    S.G.handler(b.dataset.act, S.G, b);
  }

  /* ---------- Carta em foco: sem painel por cima; os detalhes ficam no verso ---------- */
  const placeZoom = (z, x, y, w, rot) => { z.style.left = `${x}px`; z.style.top = `${y}px`; z.style.width = `${w}px`; z.style.transform = `rotate(${rot}deg)`; };
  function focusLayout() {
    const Hs = screen.offsetHeight, top = DEVICE ? 20 : 48, avail = Hs - top - 168 - (DEVICE ? 12 : 24);
    const w = Math.min(268, avail * 63 / 88), h = w * 88 / 63;
    return { x: (W - w) / 2, y: top + (avail - h) / 2, w, h };
  }
  function qtyText(c) {
    const dup = c.have - 1;
    if (c.trade) return `Está na sua lista de troca. ${dup > 0 ? `Você tem ${c.have}.` : 'É a sua única: se trocar, o bolso fica vazio.'}`;
    return dup > 0 ? `Você tem <b>${c.have}</b>. Dá pra pôr <b>${dup}</b> pra troca e continuar com uma.` : c.isNew ? '<b>Nova!</b> Acabou de entrar no álbum.' : 'Você tem <b>1</b> guardada aqui.';
  }
  const cardBack = c => `<div class="cback">${listingHTML(c, true).replace('id="shTitle"', '')}<p class="cb-qty">${qtyText(c)}</p></div>`;
  const focusUI = c => `<p class="fu-name"><b>${c.name}</b> <span>· ${numStr(c)}</span></p><p class="fu-hint">Toque na carta para ver os detalhes · arraste para baixo para fechar</p>
    <div class="fu-acts">${c.trade ? `<button class="btn btn-tonal" data-act="trade-off">${ico('trade', 22)} Tirar da troca</button>` : `<button class="btn btn-tonal" data-act="trade-on">${ico('trade', 22)} Pôr pra troca</button>`}<button class="btn btn-filled" data-act="back">Guardar</button></div>`;
  function openDetail(n, anchor) {
    if (S.D || S.G || !anchor) return;
    const c = byN(n), from = rectIn(anchor), L = focusLayout();
    const rot = parseFloat(getComputedStyle(anchor).getPropertyValue('--rot')) || 0;
    const z = document.createElement('div'); z.className = 'zoom';
    z.innerHTML = `<div class="zoom-tilt"><div class="zoom-flip"><div class="zf front">${cardHTML(c)}</div><div class="zf back">${cardBack(c)}</div></div></div>`;
    const ui = document.createElement('div'); ui.className = 'focus-ui'; ui.style.top = `${L.y + L.h + 16}px`; ui.innerHTML = focusUI(c);
    screen.append(z, ui); anchor.classList.add('lifted');
    const sc = $('#scrim', screen); sc.classList.add('on', 'focus');
    const D = S.D = { n, c, anchor, rot, z, ui, cur: { x: from.x, y: from.y, w: from.w, r: rot } };
    placeZoom(z, from.x, from.y, from.w, rot);
    D.anim = spring({ from: 0, to: 1, ...M.fastSpatial, onUpdate: t => { D.cur = { x: lerp(from.x, L.x, t), y: lerp(from.y, L.y, t), w: lerp(from.w, L.w, t), r: lerp(rot, 0, t) }; placeZoom(z, D.cur.x, D.cur.y, D.cur.w, D.cur.r); } });
    requestAnimationFrame(() => ui.classList.add('on')); buzz(8);
    const tilt = $('.zoom-tilt', z), flip = $('.zoom-flip', z);
    ui.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b || D.closing) return; const a = b.dataset.act;
      if (a === 'back') { closeDetail('back'); return; }
      c.trade = a === 'trade-on' ? 1 : 0; D.dirty = true; ui.innerHTML = focusUI(c); $('.zf.back', z).innerHTML = cardBack(c); buzz(10);
      toast(c.trade ? `${c.name} está na sua lista de troca.` : `${c.name} saiu da lista de troca.`);
    });
    // Arrastar a carta para baixo fecha; se soltar antes, ela volta com mola
    let dg = null, dragged = false;
    z.addEventListener('pointerdown', e => { if (D.closing) return; dg = { x0: e.clientX, y0: e.clientY, id: e.pointerId, dy: 0, on: false, lastY: e.clientY, lastT: performance.now(), v: 0, k: screen.getBoundingClientRect().height / screen.offsetHeight }; });
    z.addEventListener('pointermove', e => {
      if (!dg) {
        const r = z.getBoundingClientRect(), px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
        tilt.style.transform = `rotateY(${(px - .5) * 26}deg) rotateX(${(.5 - py) * 22}deg)`; ['--hx', '--gx'].forEach(k => z.style.setProperty(k, `${px * 100}%`)); ['--hy', '--gy'].forEach(k => z.style.setProperty(k, `${py * 100}%`));
        return;
      }
      const dy = (e.clientY - dg.y0) / dg.k, dx = (e.clientX - dg.x0) / dg.k;
      if (!dg.on) { if (Math.hypot(dx, dy) < 8) return; if (Math.abs(dx) > Math.abs(dy) || dy < 0) { dg = null; return; } dg.on = true; dragged = true; D.anim && D.anim.stop(); tilt.style.transform = ''; sc.style.transition = 'none'; try { z.setPointerCapture(dg.id); } catch (err) { /* ok */ } }
      const now = performance.now(); dg.v = (e.clientY - dg.lastY) / dg.k / Math.max(1, now - dg.lastT) * 1000; dg.lastY = e.clientY; dg.lastT = now;
      dg.dy = Math.max(0, dy); z.style.translate = `0 ${dg.dy}px`; ui.style.opacity = String(clamp(1 - dg.dy / 120, 0, 1)); sc.style.opacity = String(clamp(1 - dg.dy / 360, .2, 1));
    });
    const up = () => {
      if (!dg) return; const g = dg; dg = null; setTimeout(() => { dragged = false; }, 60); if (!g.on) return;
      sc.style.transition = '';
      if (g.dy > 100 || g.v > 650) { D.cur.y += g.dy; z.style.translate = ''; placeZoom(z, D.cur.x, D.cur.y, D.cur.w, D.cur.r); sc.style.opacity = ''; closeDetail('back'); }
      else { spring({ from: g.dy, to: 0, velocity: g.v, ...M.fastSpatial, onUpdate: v => { z.style.translate = `0 ${v}px`; } }); ui.style.opacity = ''; sc.style.opacity = ''; }
    };
    z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up);
    z.addEventListener('pointerleave', () => { if (!dg) tilt.style.transform = ''; });
    z.addEventListener('click', () => { if (!dragged && !D.closing) { flip.classList.toggle('is-back'); buzz(6); } });
  }
  function flyTo(D, to, cfg, done) { const f = { ...D.cur }; D.anim && D.anim.stop(); D.anim = spring({ from: 0, to: 1, ...cfg, onUpdate: t => placeZoom(D.z, lerp(f.x, to.x, t), lerp(f.y, to.y, t), lerp(f.w, to.w, t), lerp(f.r, to.r, t)), onDone: done }); }
  function closeDetail(mode, after) {
    const D = S.D; if (!D || D.closing) return; D.closing = true;
    const sc = $('#scrim', screen); sc.classList.remove('on'); setTimeout(() => sc.classList.remove('focus'), 300);
    D.ui.classList.remove('on'); setTimeout(() => D.ui.remove(), 300);
    $('.zoom-tilt', D.z).style.transform = ''; $('.zoom-flip', D.z).classList.remove('is-back');
    const r = rectIn(D.anchor);
    flyTo(D, { x: r.x, y: r.y, w: r.w, r: D.rot }, M.defaultSpatial, () => { D.z.remove(); D.anchor.classList.remove('lifted'); S.D = null; if (D.dirty) S.ctrl.replacePocket(D.n); after && after(); });
  }
  function celebrate(c, pk) {
    buzz(25); const r = rectIn(pk); confetti(r.x + r.w / 2, r.y + r.h / 3, 20);
    $$('[data-owned]', screen).forEach(el => { el.textContent = ownedCount(); });
    toast(S.ctrl.afterInsert(c.n) ? `Folha completa! ${c.name} foi pro álbum.` : `${c.name} foi pro álbum!`);
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
  /* ---------- Troca feita: tela cheia com as duas cartas se cruzando no meio ---------- */
  function tradeShow({ give, get, f, badge, next }, done) {
    const ov = document.createElement('div');
    ov.className = 'tx'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', `Troca feita. ${get.name} foi pro seu álbum.`);
    ov.innerHTML = `<i class="tx-bg"></i><i class="tx-rays"></i>
      <span class="tx-tag tx-tag-top">${avatar(f, 26)}${f.name} dá</span><span class="tx-tag tx-tag-bot">${avatar(ME, 26)}Você dá</span>
      <div class="tx-card tx-give">${cardHTML(give)}</div><div class="tx-card tx-get">${cardHTML(get)}<i class="tx-shine"></i></div><i class="tx-flash"></i>
      <div class="tx-end"><h2>Troca feita!</h2><p><b>${get.name}</b> foi pro seu álbum.</p>
        ${badge ? `<div class="tx-badge">${badgeSVG(badge, 58)}<span><small>Nova insígnia!</small><b>${badge.name}</b></span></div>`
          : next ? `<p class="tx-prog">+1 troca · ${next.need - ME.trades === 1 ? 'falta 1' : `faltam ${next.need - ME.trades}`} para a insígnia ${next.name}</p>` : ''}
        <button class="btn btn-filled tx-ok">Legal!</button></div>`;
    screen.appendChild(ov); S.T = ov;
    const H = screen.offsetHeight, D = Math.round(Math.min(200, H * .24)), cardH = 150 * 88 / 63 * .85;
    $('.tx-tag-top', ov).style.top = `${Math.round(H / 2 - D - cardH / 2 - 44)}px`;
    $('.tx-tag-bot', ov).style.top = `${Math.round(H / 2 + D + cardH / 2 + 12)}px`;
    let closed = false;
    const close = () => {
      if (closed) return; closed = true; S.T = null;
      const fade = ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
      fade.onfinish = () => ov.parentNode && ov.parentNode.removeChild(ov);
      if (done) done();
    };
    $('.tx-ok', ov).addEventListener('click', close);
    ov.addEventListener('click', e => { if (ov.classList.contains('end') && !e.target.closest('.tx-ok')) close(); });
    S.txClose = close;
    const T = 2700, out = 'cubic-bezier(.2, .8, .2, 1)';
    const at = (sel, kf, opt = {}) => $(sel, ov).animate(kf, { duration: T, fill: 'both', ...opt });
    const tf = (x, y, sc, r) => `translate(${x}px, ${y}px) scale(${sc}) rotate(${r}deg)`;
    if (RM) {
      at('.tx-bg', [{ opacity: 1 }, { opacity: 1 }], { duration: 1 }); $('.tx-give', ov).style.display = 'none';
      at('.tx-get', [{ transform: tf(0, -40, 1.25, 0) }, { transform: tf(0, -40, 1.25, 0) }], { duration: 1 });
      ov.classList.add('end'); return;
    }
    at('.tx-bg', [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    at('.tx-rays', [{ opacity: 0, transform: 'rotate(0deg) scale(.7)' }, { opacity: .5, offset: .5 }, { opacity: .75, transform: 'rotate(70deg) scale(1.15)' }], { duration: 4200, easing: 'ease-out' });
    at('.tx-give', [
      { transform: tf(0, D + 90, .7, -6), opacity: 0, easing: out }, { transform: tf(0, D, .85, -4), opacity: 1, offset: .15 },
      { transform: tf(0, D, .85, -4), offset: .3, easing: 'cubic-bezier(.5, 0, .7, .4)' }, { transform: tf(-84, 0, 1, -14), offset: .47, easing: 'cubic-bezier(.3, .6, .4, 1)' },
      { transform: tf(0, -D, .85, -4), offset: .62 }, { transform: tf(0, -D, .85, -4), offset: .72, easing: 'cubic-bezier(.5, 0, .9, .5)' },
      { transform: tf(0, -H * .78, .6, 6), opacity: 0, offset: .88 }, { transform: tf(0, -H * .78, .6, 6), opacity: 0 }]);
    at('.tx-get', [
      { transform: tf(0, -D - 90, .7, 6), opacity: 0, easing: out }, { transform: tf(0, -D, .85, 4), opacity: 1, offset: .15 },
      { transform: tf(0, -D, .85, 4), offset: .3, easing: 'cubic-bezier(.5, 0, .7, .4)' }, { transform: tf(84, 0, 1, 14), offset: .47, easing: 'cubic-bezier(.3, .6, .4, 1)' },
      { transform: tf(0, D, .85, 4), offset: .62 }, { transform: tf(0, D, .85, 4), offset: .72, easing: 'cubic-bezier(.3, 1.35, .5, 1)' },
      { transform: tf(0, -40, 1.3, 0), offset: .9 }, { transform: tf(0, -40, 1.25, 0) }]);
    at('.tx-flash', [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(4)', offset: .35 }, { opacity: 0, transform: 'scale(9)' }], { duration: 650, delay: T * .47 - 180, easing: 'ease-out' });
    $$('.tx-tag', ov).forEach(t => t.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none', offset: .3 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: T * .38, delay: T * .1, fill: 'both' }));
    at('.tx-shine', [{ backgroundPosition: '160% 0', opacity: 1 }, { backgroundPosition: '-60% 0', opacity: 1 }], { duration: 900, delay: T * .9, easing: 'ease-in-out' });
    setTimeout(() => { if (!closed) buzz(18); }, T * .47);
    setTimeout(() => { if (closed) return; ov.classList.add('end'); buzz(30); confetti(screen.offsetWidth / 2, H / 2 - 40, 28); }, T * .88);
  }
  function toast(msg) { const sn = $('#snack', screen); if (!sn) return; sn.innerHTML = msg; sn.classList.add('show'); clearTimeout(S.snackT); S.snackT = setTimeout(() => sn.classList.remove('show'), 3600); }

  /* ---------- Página de apresentação ---------- */
  function renderTabs() {
    $('#segs').innerHTML = `<div class="seg-wrap"><span class="seg-label">Barra de navegação</span><div class="seg" role="tablist" aria-label="Barra de navegação">${Object.entries(NAVBARS).map(([k, l], i) => `<button role="tab" data-nb="${k}" aria-selected="${k === S.nb}"><b>${i + 1}</b>${l}</button>`).join('')}</div></div>`;
  }
  function renderNotes() {
    const n = TAB_NOTES[S.tab];
    $('#notes').innerHTML = `<div class="ncard"><div class="n-top"><span class="n-num">${ico({ album: 'album', trade: 'trade', friends: 'friends', game: 'trofeu', account: 'friends' }[S.tab], 26)}</span><div><h2>${n.t}</h2><p class="n-tag">Tela atual do protótipo</p></div></div><p>${n.p}</p><h3>Experimente</h3><ol>${n.try.map(x => `<li>${x}</li>`).join('')}</ol></div>`;
  }
  document.addEventListener('click', e => {
    const nb = e.target.closest('#segs [data-nb]'); if (!nb) return;
    S.nb = nb.dataset.nb; Object.keys(NAVBARS).forEach(k => screen.classList.toggle(`nb-${k}`, k === S.nb)); renderTabs(); buzz(6);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (S.T) { S.txClose(); return; } if (S.D) closeDetail('back'); else if (S.G) closeSheet(); return; }
    if (S.D || S.G || !S.ctrl || !S.ctrl.isOpen()) return;
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') S.ctrl.key(1); if (e.key === 'ArrowLeft') S.ctrl.key(-1);
  });
  if (!DEVICE) $('#reset').addEventListener('click', () => { resetData(); resetTrade(); resetSocial(); resetStore(); resetAlbum(); Object.assign(TRADES_UI, { tab: 'ofertas', q: '', miss: false }); STORE_UI.sel = -1; GAME_UI.tab = 'ranking'; S.tab = 'album'; buildScreen(); mountTab(); authBoot(api); });
  let baseH = 0;
  function fit() {
    if (DEVICE) {
      // Tela cheia: a largura define a escala e a altura acompanha o aparelho (e o teclado)
      const s = innerWidth / W, h = Math.round(innerHeight / s);
      baseH = Math.max(baseH, innerHeight);
      const kb = baseH - innerHeight > 150;
      screen.classList.toggle('kb', kb);
      device.style.transform = `scale(${s})`; device.style.height = `${h}px`; screen.style.height = `${h}px`;
      slot.style.width = `${innerWidth}px`; slot.style.height = `${innerHeight}px`;
      screen.style.setProperty('--stage-dy', `${Math.max(0, Math.round((h - 64 - (kb ? 0 : 80) - 628) / 2))}px`);
      return;
    }
    const narrow = innerWidth < 560; document.body.classList.toggle('narrow', narrow);
    const dw = narrow ? W : 408, dh = narrow ? H : 844, availW = narrow ? innerWidth - 16 : Math.min(innerWidth - 48, 520), availH = narrow ? 1e4 : innerHeight - 32;
    const s = Math.max(.55, Math.min(1, availW / dw, availH / dh));
    device.style.transform = `scale(${s})`; slot.style.width = `${dw * s}px`; slot.style.height = `${dh * s}px`;
  }
  window.addEventListener('resize', fit);
  // Botão voltar do Android (chamado pelo app nativo)
  window.appBack = () => {
    if (window.authBack && window.authBack()) return true;
    if (S.T) { S.txClose(); return true; }
    if (S.D) { closeDetail('back'); return true; }
    if (S.G) { closeSheet(); return true; }
    if (S.tab === 'account') { go(S.prev); return true; }
    if (S.tab === 'album' && S.open) { S.ctrl.close(); return true; }
    if (S.tab !== 'album') { go('album'); return true; }
    return false;
  };
  fit(); buildScreen(); if (!DEVICE) renderTabs(); mountTab(); authBoot(api);
})();
