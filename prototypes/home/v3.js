/* V3 — Zíper: fichário de tecido acolchoado, abrir arrastando o puxador */
const ZIP_D = 'M44 10H330A24 24 0 0 1 354 34V406A24 24 0 0 1 330 430H44';
function zipSVG(id, p, withPull) {
  const o = (p * 1000).toFixed(1);
  return `<svg class="zip" viewBox="0 0 364 440" aria-hidden="true">
    <defs>
      <mask id="${id}o" maskUnits="userSpaceOnUse" x="-20" y="-20" width="404" height="480"><path class="mo" d="${ZIP_D}" pathLength="1000" fill="none" stroke="#fff" stroke-width="40" stroke-dasharray="${o} 1000"/></mask>
      <mask id="${id}c" maskUnits="userSpaceOnUse" x="-20" y="-20" width="404" height="480"><path class="mc" d="${ZIP_D}" pathLength="1000" fill="none" stroke="#fff" stroke-width="40" stroke-dasharray="0 ${o} 1000"/></mask>
    </defs>
    <path d="${ZIP_D}" fill="none" stroke="#2a1a7a" stroke-width="18" stroke-linecap="round"/>
    <g mask="url(#${id}c)"><path d="${ZIP_D}" pathLength="1000" fill="none" stroke="#e3e7ef" stroke-width="9" stroke-dasharray="2.6 2.2"/></g>
    <g mask="url(#${id}o)"><path d="${ZIP_D}" pathLength="1000" fill="none" stroke="#e3e7ef" stroke-width="16" stroke-dasharray="2.6 2.2"/><path d="${ZIP_D}" fill="none" stroke="#150e38" stroke-width="7"/></g>
    ${withPull ? `<path class="zs" d="${ZIP_D}" fill="none" stroke="none"/>
    <g class="pull"><rect x="-38" y="-10" width="30" height="20" rx="9" fill="#FFD731" stroke="#000" stroke-width="2.2"/><rect x="-31" y="-3.5" width="12" height="7" rx="3.5" fill="#2a1a7a" stroke="#000" stroke-width="1.5"/><rect x="-10" y="-7.5" width="18" height="15" rx="4.5" fill="#c3cad6" stroke="#000" stroke-width="2"/><path d="M-6 -3.5h10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>` : ''}
  </svg>`;
}

function mountV3(stage, api) {
  stage.className = 'stage v3';
  stage.style.setProperty('--ix', '.5'); stage.style.setProperty('--iy', '0');
  const PAGES = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]];
  const PC = ['#E9CCFF', '#DCEEFF', '#D3F7E5', '#FFF4C2', '#FFDCCB', '#E3DEFF'];
  const C = { x: 50, y: 108, s: .78 }, O = { x: 10, y: 57, s: 1 }, STEP = 298;
  let cur = 0;
  const pocket = c => `<button class="pk pk3" data-n="${c.n}" aria-label="${aria(c)}"><span class="anchor" style="${jitStyle(c)}">${c.have ? cardHTML(c) : ph(c, 'rgba(0,0,0,.09)')}</span><i class="sleeve"></i><i class="notch"></i>${badges(c)}</button>`;
  const pageHTML = (p, i) => { const cs = p.map(byN); return `<div class="pg3" style="--pc:${PC[i]}" data-page="${i}"><i class="grain"></i>${cs.map(pocket).join('')}${pageDone(cs) ? stampHTML('v3-stamp') : ''}</div>`; };
  const C2 = 2 * Math.PI * 16;
  const bub = i => {
    const cs = PAGES[i].map(byN), h = cs.filter(c => c.have).length, f = h / cs.length;
    return `<button class="bub${i === cur ? ' on' : ''}" data-i="${i}" aria-label="Folha ${i + 1}: ${h} de ${cs.length} cartas"><svg viewBox="0 0 40 40"><circle class="trk" cx="20" cy="20" r="16"/><circle class="prg" cx="20" cy="20" r="16" stroke-dasharray="${(f * C2).toFixed(1)} ${C2.toFixed(1)}" transform="rotate(-90 20 20)"/></svg><b>${i + 1}</b>${f === 1 ? `<span class="bstar">${sticker('sonho', 22, '#55DB9C')}</span>` : ''}</button>`;
  };
  stage.innerHTML = `
    <div class="book v3-book" id="book">
      <div class="v3-frame"><i class="grain"></i>${zipSVG('zf', 1, false)}<div class="v3-car" id="car">${PAGES.map(pageHTML).join('')}<i class="car-end"></i></div></div>
      <div class="v3-cover" id="cover">
        <div class="face v3-cf" id="cf"><i class="grain"></i>
          <div class="v3-patch">${sticker('sonho', 46, '#FFD731')}<b>MEU<br>ÁLBUM</b></div>
          <span class="v3-mini" style="left:240px;top:250px;--mc:#FFD731;--rim:#d9ad00;--r:10deg">${typeIcon('eletrico', 34, '#fff')}</span>
          <span class="v3-mini" style="left:66px;top:266px;--mc:#55DB9C;--rim:#2fae72;--r:-8deg">${typeIcon('planta', 34, '#fff')}</span>
          <span class="v3-tag"><b data-owned>${ownedCount()}</b> de 24 cartas</span>
          ${zipSVG('zc', 0, true)}
          <button class="v3-hit" id="hit" aria-label="Abrir o zíper do álbum"></button>
        </div>
        <div class="face v3-ci"><i class="grain"></i><div class="v3-plate"><small>Este álbum é da</small><b>Lia</b></div></div>
      </div>
    </div>
    <div class="hint" id="hint" style="top:${C.y + 440 * C.s + 18}px"><span class="hand">${ico('hand', 30, '#fff')}</span><span>Arraste o zíper amarelo</span></div>
    <div class="v3-bubs" id="bubs" style="top:${O.y + 440 + 14}px">${PAGES.map((p, i) => bub(i)).join('')}</div>`;
  const book = $('#book', stage), coverEl = $('#cover', stage), cf = $('#cf', stage), hint = $('#hint', stage), bubs = $('#bubs', stage), car = $('#car', stage), hit = $('#hit', stage);
  const pull = $('.pull', cf), mo = $('.mo', cf), mc = $('.mc', cf), zs = $('.zs', cf);
  const N = 400, L = zs.getTotalLength(), SM = [];
  for (let k = 0; k < N; k++) { const pt = zs.getPointAtLength(k / (N - 1) * L); SM.push([pt.x, pt.y]); }
  let zp = 0, zd = null, zipBusy = false;
  const setZ = p => {
    zp = clamp(p, 0, 1); const o = (zp * 1000).toFixed(1);
    mo.setAttribute('stroke-dasharray', `${o} 1000`); mc.setAttribute('stroke-dasharray', `0 ${o} 1000`);
    const k = Math.round(zp * (N - 1)), [x, y] = SM[k], a = SM[Math.min(N - 1, k + 2)], b = SM[Math.max(0, k - 2)];
    pull.setAttribute('transform', `translate(${x} ${y}) rotate(${Math.atan2(a[1] - b[1], a[0] - b[0]) * 180 / Math.PI}) scale(1.5)`);
    hit.style.left = `${x - 32}px`; hit.style.top = `${y - 32}px`;
  };
  setZ(0);
  const updBubs = () => { bubs.innerHTML = PAGES.map((p, i) => bub(i)).join(''); };
  const ctl = bookCtl({ book, cover: coverEl, C, O, coverSpring: { damping: .62, stiffness: 230 },
    onP: p => { hint.style.opacity = clamp(1 - p * 2.5, 0, 1); bubs.style.opacity = clamp(p * 1.6 - .6, 0, 1); bubs.style.pointerEvents = p > .9 ? 'auto' : 'none'; },
    onOpenStart: () => buzz(20),
    onOpened: () => { api.setOpen(true, `Folha ${cur + 1} de 6`); const r = api.rectIn(car); api.confetti(r.x + r.w / 2, r.y + r.h / 2, 22); },
    onCloseStart: () => api.setOpen(false),
    onClosed: () => { zipBusy = true; tween(1, 0, 650, setZ, () => { zipBusy = false; }); } });
  const finishZip = () => { zipBusy = true; tween(zp, 1, (1 - zp) * 900 + 150, setZ, () => { zipBusy = false; ctl.open(); }); };
  hit.addEventListener('pointerdown', e => {
    if (ctl.st.busy || ctl.st.open || zipBusy) return;
    e.preventDefault(); try { hit.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    zd = { x: e.clientX, y: e.clientY, moved: false }; buzz(6);
  });
  hit.addEventListener('pointermove', e => {
    if (!zd) return;
    if (!zd.moved && Math.hypot(e.clientX - zd.x, e.clientY - zd.y) < 6) return;
    zd.moved = true;
    const r = cf.getBoundingClientRect(), eff = r.width / 364, lx = (e.clientX - r.left) / eff, ly = (e.clientY - r.top) / eff;
    const k0 = Math.round(zp * (N - 1)); let best = k0, bd = 1e9;
    for (let k = Math.max(0, k0 - 60); k <= Math.min(N - 1, k0 + 60); k++) { const d = (SM[k][0] - lx) ** 2 + (SM[k][1] - ly) ** 2; if (d < bd) { bd = d; best = k; } }
    const np = best / (N - 1); if (Math.floor(np * 24) !== Math.floor(zp * 24)) buzz(3);
    setZ(np); hint.style.opacity = clamp(1 - zp * 3, 0, 1);
    if (zp > .985) { zd = null; finishZip(); }
  });
  hit.addEventListener('pointerup', () => { if (!zd) return; const d = zd; zd = null; if (!d.moved || zp > .6) finishZip(); });
  hit.addEventListener('pointercancel', () => { zd = null; });
  hit.addEventListener('click', e => { if (e.detail === 0 && !ctl.st.open && !zipBusy) finishZip(); });

  // Carrossel de folhas
  let md = null, dragged = false;
  const go = i => { cur = clamp(i, 0, PAGES.length - 1); car.scrollTo({ left: cur * STEP, behavior: RM ? 'auto' : 'smooth' }); };
  car.addEventListener('scroll', () => {
    const i = clamp(Math.round(car.scrollLeft / STEP), 0, PAGES.length - 1);
    if (i !== cur) { cur = i; updBubs(); api.setTitle(`Folha ${cur + 1} de 6`); buzz(5); }
  }, { passive: true });
  car.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || !ctl.st.open) return; md = { x: e.clientX, sl: car.scrollLeft, moved: false, id: e.pointerId, eff: car.getBoundingClientRect().width / car.offsetWidth }; });
  car.addEventListener('pointermove', e => {
    if (!md) return; const dx = (e.clientX - md.x) / md.eff;
    if (!md.moved) { if (Math.abs(dx) < 6) return; md.moved = true; dragged = true; car.style.scrollSnapType = 'none'; try { car.setPointerCapture(md.id); } catch (err) { /* ok */ } }
    car.scrollLeft = md.sl - dx; md.dx = dx;
  });
  const mup = () => { if (!md) return; const d = md; md = null; if (!d.moved) return; car.style.scrollSnapType = ''; go(Math.round(car.scrollLeft / STEP + (d.dx < 0 ? .3 : -.3))); setTimeout(() => { dragged = false; }, 60); };
  car.addEventListener('pointerup', mup); car.addEventListener('pointercancel', mup);
  car.addEventListener('click', e => { if (dragged || !ctl.st.open) return; const pk = e.target.closest('[data-n]'); if (pk) api.openDetail(+pk.dataset.n, $('.anchor', pk)); });
  bubs.addEventListener('click', e => { const b = e.target.closest('.bub'); if (b) go(+b.dataset.i); });

  return {
    close: ctl.close, isOpen: () => ctl.st.open, key: d => go(cur + d),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, car),
    replacePocket: n => { const old = $(`[data-n="${n}"]`, car); old.outerHTML = pocket(byN(n)); return $(`[data-n="${n}"]`, car); },
    afterInsert: n => {
      const i = PAGES.findIndex(p => p.includes(n)), cs = PAGES[i].map(byN); updBubs();
      if (!pageDone(cs)) return false;
      const pg = $(`[data-page="${i}"]`, car); if (!$('.stamp', pg)) pg.insertAdjacentHTML('beforeend', stampHTML('v3-stamp pop'));
      return true;
    },
  };
}
