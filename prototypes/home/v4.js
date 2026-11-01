/* V4 — Vitrine: estojo rígido num pedestal giratório; dentro, bandejas que se empilham */
function mountV4(stage, api) {
  stage.className = 'stage v4';
  stage.style.setProperty('--ix', '0'); stage.style.setProperty('--iy', '-.3');
  const PAGES = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 23, 24, 0, 0, 0]];
  const BW = 352, BH = 470, C = { x: 83, y: 92, s: .62 }, O = { x: 16, y: 30, s: 1 };
  const fav = byN(6);
  const slot = c => !c ? '<div class="v4-slot empty" aria-hidden="true"></div>'
    : `<button class="pk v4-slot" data-n="${c.n}" aria-label="${aria(c)}"><span class="anchor">${c.have ? cardHTML(c) : ph(c, 'rgba(20,24,40,.10)')}</span>${badges(c)}</button>`;
  const trayHTML = i => { const cs = PAGES[i].map(n => (n ? byN(n) : null)); return `<div class="v4-tray" data-page="${i}"><div class="v4-grid">${cs.map(slot).join('')}</div><i class="v4-glass"></i>${pageDone(cs) ? stampHTML('v4-stamp') : ''}</div>`; };
  stage.innerHTML = `
    <i class="v4-spot"></i>
    <div class="v4-ped" id="ped"><i class="v4-ped-side"></i><i class="v4-ped-top"></i><i class="v4-ped-shadow"></i></div>
    <div class="book v4-book" id="book"><div class="v4-spin" id="spin">
      <div class="v4-trays" id="trays">${PAGES.map((p, i) => trayHTML(i)).join('')}</div>
      <i class="v4-side v4-right"></i><i class="v4-side v4-left"><b></b><b></b><b></b></i>
      <div class="v4-lid" id="lid" role="button" tabindex="0" aria-label="Abrir o álbum">
        <i class="v4-lid-sheen"></i>
        <div class="v4-window"><i class="v4-ring"></i><div class="v4-win-card">${cardHTML(fav)}</div><i class="v4-win-glass"></i></div>
        <div class="v4-word">MEU ÁLBUM</div>
        <div class="v4-meter"><i style="width:${ownedCount() / 24 * 100}%" data-meter></i></div>
        <div class="v4-count"><b data-owned>${ownedCount()}</b> de 24 cartas</div>
      </div>
    </div></div>
    <div class="hint v4-hint" id="hint" style="top:${C.y + BH * C.s + 74}px"><span class="hand">${ico('spin', 26)}</span><span>Gire o álbum ou toque para abrir</span></div>
    <div class="v4-pager" id="pager" style="top:${O.y + BH + 18}px"><button class="v4-arrow" data-go="-1" aria-label="Vitrine anterior">${ico('chevL', 22)}</button><span class="v4-dots" id="dots"></span><button class="v4-arrow" data-go="1" aria-label="Próxima vitrine">${ico('chevR', 22)}</button></div>`;
  const book = $('#book', stage), spin = $('#spin', stage), lid = $('#lid', stage), ped = $('#ped', stage), hint = $('#hint', stage), pager = $('#pager', stage), traysEl = $('#trays', stage);
  const trays = $$('.v4-tray', traysEl);
  const st = { p: 0, open: false, busy: false, sa: 0, cur: 0 };
  let pAnim = null, saAnim = null;

  // Estado aberto/fechado: a tampa de vidro sobe e o estojo cresce até a bandeja
  const setP = p => {
    st.p = p;
    book.style.transform = `translate(${lerp(C.x, O.x, p)}px,${lerp(C.y, O.y, p)}px) scale(${lerp(C.s, O.s, p)})`;
    lid.style.transform = `translateZ(22px) translateY(${-p * 118}%) rotateX(${p * 16}deg)`;
    lid.style.opacity = clamp(1.4 - p * 1.6, 0, 1);
    $$('.v4-side', spin).forEach(s => { s.style.opacity = clamp(1 - p * 3, 0, 1); });
    ped.style.opacity = clamp(1 - p * 2.2, 0, 1); ped.style.transform = `translateY(${p * 60}px)`;
    hint.style.opacity = clamp(1 - p * 3, 0, 1);
    traysEl.style.pointerEvents = p > .95 ? 'auto' : 'none';
    pager.style.opacity = clamp(p * 1.8 - .8, 0, 1); pager.style.pointerEvents = p > .9 ? 'auto' : 'none';
  };
  const setSA = (a, tilt = 0) => { st.sa = a; spin.style.transform = `rotateY(${a}deg) rotateX(${tilt}deg)`; ped.style.setProperty('--turn', `${a * 1.6}deg`); };
  const open = () => {
    if (st.busy || st.open) return; st.busy = true; buzz(12);
    saAnim && saAnim.stop(); setSA(0);
    pAnim = spring({ from: st.p, to: 1, ...M.slowSpatial, onUpdate: setP, onDone: () => { st.open = true; st.busy = false; lid.style.visibility = 'hidden'; api.setOpen(true, `Vitrine ${st.cur + 1} de 3`); } });
  };
  const close = () => {
    if (st.busy || !st.open) return; st.busy = true; api.setOpen(false); lid.style.visibility = 'visible'; setSA(0);
    pAnim = spring({ from: st.p, to: 0, ...M.defaultSpatial, onUpdate: setP, onDone: () => { st.open = false; st.busy = false; } });
  };

  // Girar no pedestal (fechado)
  let sd = null;
  lid.addEventListener('pointerdown', e => {
    if (st.busy || st.open || e.button > 0) return;
    saAnim && saAnim.stop();
    sd = { x: e.clientX, id: e.pointerId, a0: st.sa, moved: false, lastA: st.sa, lastT: performance.now(), v: 0 };
  });
  lid.addEventListener('pointermove', e => {
    if (!sd) return; const dx = e.clientX - sd.x;
    if (!sd.moved) { if (Math.abs(dx) < 8) return; sd.moved = true; try { lid.setPointerCapture(sd.id); } catch (err) { /* ok */ } }
    const a = sd.a0 + dx * .6, now = performance.now();
    sd.v = (a - sd.lastA) / Math.max(1, now - sd.lastT) * 1000; sd.lastA = a; sd.lastT = now;
    setSA(a); if (Math.floor(a / 20) !== Math.floor(sd.lastA / 20)) buzz(3);
  });
  const sup = () => {
    if (!sd) return; const d = sd; sd = null;
    if (!d.moved) { open(); return; }
    const target = Math.abs(d.v) > 500 ? Math.round((st.sa + Math.sign(d.v) * 300) / 360) * 360 : Math.round(st.sa / 360) * 360;
    saAnim = spring({ from: st.sa, to: target, velocity: d.v, ...M.defaultSpatial, onUpdate: a => setSA(a), onDone: () => setSA(0) });
  };
  lid.addEventListener('pointerup', sup); lid.addEventListener('pointercancel', sup);
  lid.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  // Bandejas empilhadas: arrastar joga a de cima para o lado
  const W = 440;
  const place = (extra = {}) => trays.forEach((t, i) => {
    const k = i - st.cur;
    let x = 0, r = 0, y = 0, s = 1, o = 1;
    if (k < 0) { x = -W; r = -14; o = 0; } else { y = k * 12; s = 1 - k * .05; o = k > 2 ? 0 : 1; }
    if (extra[i]) ({ x, r } = extra[i]);
    t.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
    t.style.opacity = extra[i] ? 1 : o; t.style.zIndex = 20 - Math.abs(k);
    t.style.visibility = k < 0 && !extra[i] ? 'hidden' : 'visible';
  });
  const dots = () => { $('#dots', stage).innerHTML = PAGES.map((p, i) => `<i class="${i === st.cur ? 'on' : ''}"></i>`).join('') + `<span>${st.cur + 1} de ${PAGES.length}</span>`; $('[data-go="-1"]', pager).disabled = st.cur === 0; $('[data-go="1"]', pager).disabled = st.cur === PAGES.length - 1; };
  const go = (dir, v = 0, from = 0) => {
    const nxt = st.cur + dir; if (nxt < 0 || nxt >= PAGES.length || st.busy) { place(); return; }
    st.busy = true; buzz(6);
    const i = dir > 0 ? st.cur : nxt, a = dir > 0 ? from : -W + from, b = dir > 0 ? -W : 0;
    spring({ from: a, to: b, velocity: v, ...M.defaultSpatial, onUpdate: x => place({ [i]: { x, r: x / W * 14 } }),
      onDone: () => { st.cur = nxt; st.busy = false; place(); dots(); api.setTitle(`Vitrine ${st.cur + 1} de 3`); } });
  };
  let td = null, dragged = false;
  traysEl.addEventListener('pointerdown', e => { if (!st.open || st.busy || e.button > 0) return; td = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, eff: traysEl.getBoundingClientRect().width / traysEl.offsetWidth / book.getBoundingClientRect().width * book.offsetWidth || 1, lastX: 0, lastT: performance.now(), v: 0 }; });
  traysEl.addEventListener('pointermove', e => {
    const r = traysEl.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    stage.style.setProperty('--hx', `${px * 100}%`); stage.style.setProperty('--hy', `${py * 100}%`);
    if (!td) { if (st.open && !st.busy) setSA((px - .5) * 8, (.5 - py) * 6); return; }
    const dx = (e.clientX - td.x) * (book.offsetWidth / book.getBoundingClientRect().width), dy = e.clientY - td.y;
    if (!td.moved) { if (Math.abs(dx) < 8) return; if (Math.abs(dy) > Math.abs(dx)) { td = null; return; } td.moved = true; dragged = true; try { traysEl.setPointerCapture(td.id); } catch (err) { /* ok */ } }
    const now = performance.now(); td.v = (dx - td.lastX) / Math.max(1, now - td.lastT) * 1000; td.lastX = dx; td.lastT = now; td.dx = dx;
    if (dx < 0 && st.cur < PAGES.length - 1) place({ [st.cur]: { x: dx, r: dx / W * 14 } });
    else if (dx > 0 && st.cur > 0) place({ [st.cur - 1]: { x: -W + dx, r: (-W + dx) / W * 14 } });
  });
  const tup = () => {
    if (!td) return; const d = td; td = null; setTimeout(() => { dragged = false; }, 60);
    if (!d.moved) return;
    if (d.dx < 0 && st.cur < PAGES.length - 1 && (d.dx < -90 || d.v < -450)) go(1, d.v, d.dx);
    else if (d.dx > 0 && st.cur > 0 && (d.dx > 90 || d.v > 450)) go(-1, d.v, d.dx);
    else spring({ from: d.dx, to: 0, ...M.fastSpatial, onUpdate: x => (d.dx < 0 ? place({ [st.cur]: { x, r: x / W * 14 } }) : st.cur > 0 ? place({ [st.cur - 1]: { x: -W + x, r: 0 } }) : place()), onDone: () => place() });
  };
  traysEl.addEventListener('pointerup', tup); traysEl.addEventListener('pointercancel', tup);
  traysEl.addEventListener('pointerleave', () => { if (st.open && !td && !st.busy) setSA(0); });
  traysEl.addEventListener('click', e => { if (dragged || !st.open) return; const pk = e.target.closest('[data-n]'); if (pk) api.openDetail(+pk.dataset.n, $('.anchor', pk)); });
  pager.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); });
  setP(0); setSA(0); place(); dots();

  return {
    close, isOpen: () => st.open, key: d => go(d),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, traysEl),
    replacePocket: n => { const old = $(`[data-n="${n}"]`, traysEl); old.outerHTML = slot(byN(n)); return $(`[data-n="${n}"]`, traysEl); },
    afterInsert: n => {
      $$('[data-meter]', stage).forEach(m => { m.style.width = `${ownedCount() / 24 * 100}%`; });
      const i = PAGES.findIndex(p => p.includes(n)), cs = PAGES[i].filter(Boolean).map(byN);
      if (!pageDone(cs)) return false;
      if (!$('.stamp', trays[i])) trays[i].insertAdjacentHTML('beforeend', stampHTML('v4-stamp pop'));
      return true;
    },
  };
}
VARIANTS.v4 = { round: 2, num: '4', short: 'Vitrine', hash: 'vitrine', skin: 'v4', mount: mountV4, notes: {
  title: 'Vitrine', tag: 'Estojo rígido no pedestal · bandejas com vidro',
  concept: 'O álbum vira um objeto de colecionador: um estojo grafite com uma janela redonda mostrando a carta favorita, girando num pedestal sob um foco de luz. Ao abrir, a tampa de vidro sobe e as cartas aparecem em bandejas que se empilham. Passar o dedo inclina a bandeja e faz o brilho holográfico andar.',
  refs: 'Pokémon TCG Pocket (inclinar o aparelho para ver a carta de vários ângulos, fichário e quadro de exposição), vitrines de loja de brinquedo e a interface de vidro dos apps de figurinhas de 2026.',
  try: ['Arraste o estojo para os lados para girar no pedestal. Um arraste rápido dá uma volta inteira.', 'Toque para abrir: a tampa de vidro sobe.', 'Passe o dedo sobre a bandeja para inclinar e ver o brilho da <b>#006</b>.', 'Arraste a bandeja para o lado para jogá-la e ver a próxima.'],
  m3: ['Top app bar flutuante', 'Navigation bar flutuante (flexível)', 'Indicador de página', 'Modal bottom sheet', 'Snackbar'],
  pros: 'Sensação premium de objeto colecionável, com o brilho das cartas como protagonista.',
  cons: 'Menos lúdico para os menores (6–7 anos). O giro precisa de uma dica clara na primeira vez.' } };
