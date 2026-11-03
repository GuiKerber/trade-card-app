/* V5 — Diário de campo: caderno espiral de capa kraft, páginas quadriculadas por habitat */
const V5_HAB = [
  ['planta', 'Floresta', '<path d="M14 52 30 14l16 38zM30 52v10M44 54 56 26l12 28zM56 54v8"/>'],
  ['agua', 'Lago', '<path d="M6 40q8-6 16 0t16 0 16 0 16 0M10 52q8-6 16 0t16 0 16 0M58 38V14M58 20q6-6 10-2M64 38V22"/>'],
  ['fogo', 'Vulcão', '<path d="M6 58 26 22h18l20 36zM26 22q4 6 8 0t10 0M30 14q-4-6 2-10M40 12q4-6-2-10"/>'],
  ['eletrico', 'Tempestade', '<path d="M14 34a10 10 0 0 1 4-19 14 14 0 0 1 26-2 10 10 0 0 1 10 21zM34 34l-6 12h8l-4 12"/>'],
  ['sonho', 'Céu estrelado', '<path d="M44 10a16 16 0 1 0 14 24A13 13 0 0 1 44 10zM14 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM22 44l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z"/>'],
  ['fantasma', 'Casarão', '<path d="M10 58V30L34 10l24 20v28zM26 58V42h16v16M48 22V12h6v14M60 40q4-8 8 0v12l-2-2-2 2-2-2-2 2z"/>'],
];
const TAPES = ['#9fe3c4', '#ffb3c7', '#ffe45c', '#a9d4ff'];
function mountV5(stage, api) {
  stage.className = 'stage v5';
  stage.style.setProperty('--ix', '.15'); stage.style.setProperty('--iy', '-.3');
  const BW = 340, BH = 470, C = { x: 73, y: 96, s: .7 }, O = { x: 22, y: 22, s: 1 };
  const inkIcon = (t, s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#1f2a44" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" class="wob">${IC[t].replace(/fill="#fff"/g, 'fill="#1f2a44"')}</svg>`;
  const slot = (c, j) => {
    const r = ((c.n * 7) % 7 - 3) * 1.1;
    const tape = c.have ? `<i class="tape" style="--tp:${TAPES[j % 4]};left:-12px;top:-6px;--tr:-38deg"></i><i class="tape" style="--tp:${TAPES[(j + 2) % 4]};right:-12px;bottom:34px;--tr:-38deg"></i>` : '';
    const art = c.have ? cardHTML(c) : `<span class="ph v5-ph"><span class="ph-sil">${creatureSVG(c, 'url(#v5hatch)')}</span><b class="ph-q">???</b><em class="ph-num">#${pad(c.n)}</em></span>`;
    return `<button class="pk v5-slot" data-n="${c.n}" aria-label="${aria(c)}"><span class="anchor" style="--rot:${r}deg">${art}</span>${tape}${badges(c)}<span class="v5-cap">${c.have ? `✓ ${c.name}` : '???'}</span></button>`;
  };
  const found = cs => cs.filter(c => c.have).length;
  const pageHTML = i => {
    const [k, name, doodle] = V5_HAB[i], cs = DATA.filter(c => c.type === k);
    return `<div class="v5-page"><i class="v5-holes"></i>
      <div class="v5-head"><div><h3><span>${name}</span></h3><p class="v5-found" data-found="${i}">${found(cs)} de 4 encontradas</p></div><svg class="wob v5-doodle" viewBox="0 0 72 64" width="86" height="76" fill="none" stroke="#1f2a44" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${doodle}</svg></div>
      <div class="v5-grid">${cs.map(slot).join('')}</div>
      ${pageDone(cs) ? stampHTML('v5-stamp') : ''}<span class="v5-pno">${i + 1}</span></div>`;
  };
  const paw = (i, cur) => {
    const cs = DATA.filter(c => c.type === V5_HAB[i][0]), done = pageDone(cs);
    return `<button class="paw${i === cur ? ' on' : ''}${done ? ' done' : ''}" data-i="${i}" aria-label="${V5_HAB[i][1]}: ${found(cs)} de 4"><svg viewBox="0 0 32 32" width="34" height="34" class="wob"><ellipse cx="16" cy="21" rx="7" ry="6"/><circle cx="7.5" cy="13" r="2.8"/><circle cx="12.5" cy="8" r="2.8"/><circle cx="19.5" cy="8" r="2.8"/><circle cx="24.5" cy="13" r="2.8"/></svg></button>`;
  };
  stage.innerHTML = `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <filter id="v5wob"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>
      <pattern id="v5hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="5" stroke="#8a93a8" stroke-width="1.4"/></pattern>
    </defs></svg>
    <div class="book v5-book" id="book">
      <i class="v5-back"></i>
      <div class="v5-leaves flip-host" id="leaves"></div>
      <div class="v5-cover" id="cover" role="button" tabindex="0" aria-label="Abrir o diário">
        <div class="face v5-cf"><i class="grain"></i><i class="v5-fiber"></i>
          <div class="v5-label"><b>Diário de campo</b><span>da Lia</span></div>
          <span class="v5-ink" style="left:34px;top:226px;--r:-14deg">${inkIcon('planta', 58)}</span>
          <span class="v5-ink" style="left:132px;top:262px;--r:9deg">${inkIcon('agua', 46)}</span>
          <span class="v5-ink" style="left:44px;top:330px;--r:6deg">${inkIcon('fogo', 52)}</span>
          <div class="v5-seal"><b data-owned>${ownedCount()}</b><span>de 24<br>encontradas</span></div>
          <i class="v5-band"></i>
        </div>
        <div class="face v5-ci"><p>Se encontrar este diário,<br>devolva para a <b>Lia</b>!</p></div>
      </div>
      <div class="v5-spiral">${'<i></i>'.repeat(15)}</div>
    </div>
    <div class="hint v5-hint" id="hint" style="top:${C.y + BH * C.s + 18}px"><span class="hand">${ico('hand', 30, '#fff')}</span><span>Puxe a capa para cima</span></div>
    <div class="v5-trail" id="trail" style="top:${O.y + BH + 16}px"></div>`;
  const book = $('#book', stage), coverEl = $('#cover', stage), hint = $('#hint', stage), trail = $('#trail', stage), leavesEl = $('#leaves', stage);
  let ctl;
  const updTrail = cur => { trail.innerHTML = V5_HAB.map((h, i) => paw(i, cur)).join(''); };
  const fl = makeFlipper({ host: leavesEl, count: V5_HAB.length, render: pageHTML, back: '<div class="v5-pback"></div>', axis: 'X', enabled: () => ctl.st.open,
    onChange: i => { updTrail(i); api.setTitle(V5_HAB[i][1]); } });
  ctl = bookCtl({ book, cover: coverEl, C, O, axis: 'X', coverSpring: { damping: .72, stiffness: 220 },
    onP: p => { hint.style.opacity = clamp(1 - p * 2.5, 0, 1); trail.style.opacity = clamp(p * 1.6 - .6, 0, 1); trail.style.pointerEvents = p > .9 ? 'auto' : 'none'; },
    onOpenStart: () => { coverEl.classList.add('band-off'); buzz(10); },
    onOpened: () => api.setOpen(true, V5_HAB[fl.cur][1]),
    onCloseStart: () => api.setOpen(false),
    onClosed: () => coverEl.classList.remove('band-off') });
  updTrail(0);
  let cd = null;
  coverEl.addEventListener('pointerdown', e => { if (ctl.st.busy || ctl.st.open || e.button > 0) return; cd = { y: e.clientY, id: e.pointerId, moved: false, eff: book.getBoundingClientRect().height / BH, lastA: 0, lastT: performance.now(), v: 0 }; });
  coverEl.addEventListener('pointermove', e => {
    if (!cd) return; const dy = (e.clientY - cd.y) / cd.eff;
    if (!cd.moved) { if (Math.abs(dy) < 8) return; cd.moved = true; try { coverEl.setPointerCapture(cd.id); } catch (err) { /* ok */ } coverEl.classList.add('band-off'); }
    const a = clamp(dy / 380 * 180, -180, 0), now = performance.now(); cd.v = (a - cd.lastA) / Math.max(1, now - cd.lastT) * 1000; cd.lastA = a; cd.lastT = now; ctl.setA(a);
  });
  const cup = () => {
    if (!cd) return; const d = cd; cd = null;
    if (!d.moved) { ctl.open(); return; }
    if (ctl.st.a < -45 || d.v < -250) ctl.open(Math.min(0, d.v));
    else spring({ from: ctl.st.a, to: 0, ...M.fastSpatial, onUpdate: ctl.setA, onDone: () => coverEl.classList.remove('band-off') });
  };
  coverEl.addEventListener('pointerup', cup); coverEl.addEventListener('pointercancel', cup);
  coverEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctl.open(); } });
  trail.addEventListener('click', e => { const b = e.target.closest('.paw'); if (b) fl.jump(+b.dataset.i); });
  leavesEl.addEventListener('click', e => { if (fl.justDragged() || !ctl.st.open) return; const pk = e.target.closest('[data-n]'); if (pk) api.openDetail(+pk.dataset.n, $('.anchor', pk)); });

  return {
    close: ctl.close, isOpen: () => ctl.st.open, key: d => (d > 0 ? fl.next() : fl.prev()),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, leavesEl),
    replacePocket: n => { const c = byN(n), cs = DATA.filter(x => x.type === c.type), old = $(`[data-n="${n}"]`, leavesEl); old.outerHTML = slot(c, cs.indexOf(c)); return $(`[data-n="${n}"]`, leavesEl); },
    afterInsert: n => {
      const c = byN(n), i = V5_HAB.findIndex(h => h[0] === c.type), cs = DATA.filter(x => x.type === c.type);
      $(`[data-found="${i}"]`, leavesEl).textContent = `${found(cs)} de 4 encontradas`; updTrail(fl.cur);
      if (!pageDone(cs)) return false;
      const pg = $('.v5-page', fl.leaf(i)); if (!$('.stamp', pg)) pg.insertAdjacentHTML('beforeend', stampHTML('v5-stamp pop'));
      return true;
    },
  };
}
VARIANTS.v5 = { round: 2, num: '5', short: 'Diário', hash: 'diario', skin: 'v5', mount: mountV5, notes: {
  title: 'Diário de campo', tag: 'Caderno espiral kraft · uma página por habitat',
  concept: 'O álbum é o diário de uma exploradora. As cartas encontradas são coladas com fita washi em páginas quadriculadas, uma por habitat (Floresta, Lago, Vulcão…). As que faltam aparecem como rascunho a lápis, esperando ser encontradas. A capa abre para cima, como um caderno de verdade.',
  refs: 'Pokémon Legends: Arceus (Pokédex como caderno de papel que se completa com a pesquisa), Critterpedia de Animal Crossing (coleção por habitat, silhuetas e metas), Toca Boca (brinquedo, não jogo: todo toque responde) e o guia do Google para apps infantis.',
  try: ['Puxe a capa para cima, ou só toque nela: o elástico solta e a capa vira.', 'Arraste a página para cima para virar, ou toque nas pegadas embaixo.', 'Na Floresta tudo já foi encontrado. No <b>Céu estrelado</b>, guarde a #024 para completar.'],
  m3: ['Top app bar', 'Navigation bar', 'Indicador de páginas (pegadas)', 'Modal bottom sheet', 'Snackbar como bilhete'],
  pros: 'Muito lúdico e narrativo: colecionar vira explorar. O traço feito à mão aproxima do desenho da própria criança.',
  cons: 'Folhear para cima é menos comum que para o lado e precisa da dica na primeira vez. O estilo à mão exige ilustração consistente.' } };
