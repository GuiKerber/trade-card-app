/* V1 — Fichário inflável: capa de vinil azul, folhas de 9 bolsos em argolas */
function mountV1(stage, api) {
  stage.className = 'stage v1';
  stage.style.setProperty('--ix', '0'); stage.style.setProperty('--iy', '-.42');
  const PAGES = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 23, 24, 0, 0, 0]];
  const C = { x: 46.5, y: 100, s: .8 }, O = { x: 10, y: 52, s: 1 };
  const ringSVG = t => `<svg class="ring" style="top:${t}%" viewBox="0 0 44 24"><path d="M5 19C5 4 39 4 39 19" fill="none" stroke="#4b5363" stroke-width="7" stroke-linecap="round"/><path d="M5 19C5 4 39 4 39 19" fill="none" stroke="url(#metal)" stroke-width="4.6" stroke-linecap="round"/></svg>`;
  const pocket = c => !c
    ? '<div class="pk pk1 unused" aria-hidden="true"><i class="sleeve"></i></div>'
    : `<button class="pk pk1" data-n="${c.n}" aria-label="${aria(c)}"><span class="anchor" style="${jitStyle(c)}">${c.have ? cardHTML(c) : ph(c, 'rgba(255,255,255,.12)')}</span><i class="sleeve"></i>${badges(c)}</button>`;
  const cover = `
    <div class="face v1-cf"><i class="grain"></i><i class="stitch"></i>
      <div class="v1-title"><span>MEU</span><span>ÁLBUM</span></div>
      <div class="v1-name">da Lia</div>
      <span class="cstk" style="left:226px;top:18px;--r:16deg">${sticker('planta', 62, '#55DB9C')}</span>
      <span class="cstk" style="left:222px;top:196px;--r:-10deg">${sticker('eletrico', 56, '#FFD731')}</span>
      <span class="cstk" style="left:30px;top:262px;--r:-14deg">${sticker('fogo', 70, '#FB4903')}</span>
      <span class="cstk" style="left:126px;top:288px;--r:7deg">${sticker('fantasma', 60, '#5C4ADE')}</span>
      <span class="cstk" style="left:74px;top:370px;--r:12deg">${sticker('agua', 50, '#DCEEFF')}</span>
      <span class="cstk" style="left:238px;top:280px;--r:-6deg">${sticker('sonho', 44, '#E9CCFF')}</span>
      <div class="v1-prog"><b data-owned>${ownedCount()}</b><span>de 24</span></div>
      <i class="v1-strap"></i>
    </div>
    <div class="face v1-ci"><i class="grain"></i><i class="stitch"></i><div class="v1-plate"><small>Este álbum é da</small><b>Lia</b></div></div>`;
  stage.innerHTML = `
    <div class="book v1-book" id="book">
      <div class="v1-back"><i class="grain"></i></div>
      <div class="v1-spine"></div>
      <div class="v1-leaves flip-host" id="leaves"></div>
      <div class="v1-rings">${[18, 50, 82].map(ringSVG).join('')}</div>
      <div class="v1-cover" id="cover" role="button" tabindex="0" aria-label="Abrir o álbum">${cover}</div>
    </div>
    <div class="hint" id="hint" style="top:${C.y + 452 * C.s + 18}px"><span class="hand">${ico('hand', 30, '#fff')}</span><span>Toque ou arraste a capa</span></div>
    <div class="ctrls" id="ctrls" style="top:${O.y + 452 + 14}px">
      <button class="rbtn" data-go="-1" aria-label="Folha anterior">${ico('chevL', 28)}</button>
      <div class="pagepill">Folha <b id="pgN">1</b> de 3</div>
      <button class="rbtn" data-go="1" aria-label="Próxima folha">${ico('chevR', 28)}</button>
    </div>`;
  const book = $('#book', stage), coverEl = $('#cover', stage), hint = $('#hint', stage), ctrls = $('#ctrls', stage), leavesEl = $('#leaves', stage);
  const leafHTML = i => {
    const cs = PAGES[i].map(n => (n ? byN(n) : null));
    return `<div class="v1-leaf"><i class="grain"></i>${[18, 50, 82].map(t => `<i class="hole" style="top:${t}%"></i>`).join('')}<div class="v1-grid">${cs.map(pocket).join('')}</div>${pageDone(cs) ? stampHTML('v1-stamp') : ''}</div>`;
  };
  let ctl;
  const updCtrls = () => { $('[data-go="-1"]', ctrls).disabled = fl.cur === 0; $('[data-go="1"]', ctrls).disabled = fl.cur === PAGES.length - 1; };
  const fl = makeFlipper({ host: leavesEl, count: PAGES.length, render: leafHTML, back: '<div class="v1-lb"></div>', enabled: () => ctl.st.open,
    onChange: i => { $('#pgN', stage).textContent = i + 1; api.setTitle(`Folha ${i + 1} de 3`); updCtrls(); } });
  ctl = bookCtl({ book, cover: coverEl, C, O,
    onP: p => { hint.style.opacity = clamp(1 - p * 2.5, 0, 1); ctrls.style.opacity = clamp(p * 1.6 - .6, 0, 1); ctrls.style.pointerEvents = p > .9 ? 'auto' : 'none'; },
    onOpenStart: () => { coverEl.classList.add('strap-off'); buzz(10); },
    onOpened: () => api.setOpen(true, `Folha ${fl.cur + 1} de 3`),
    onCloseStart: () => api.setOpen(false),
    onClosed: () => coverEl.classList.remove('strap-off') });
  updCtrls();

  // Arrastar a capa para abrir
  let cd = null;
  coverEl.addEventListener('pointerdown', e => {
    if (ctl.st.busy || ctl.st.open || e.button > 0) return;
    cd = { x: e.clientX, id: e.pointerId, moved: false, lastA: 0, lastT: performance.now(), v: 0, eff: book.getBoundingClientRect().width / 364 };
  });
  coverEl.addEventListener('pointermove', e => {
    if (!cd) return;
    const dx = (e.clientX - cd.x) / cd.eff;
    if (!cd.moved) { if (Math.abs(dx) < 8) return; cd.moved = true; try { coverEl.setPointerCapture(cd.id); } catch (err) { /* ok */ } coverEl.classList.add('strap-off'); }
    const a = clamp(dx / 300 * 180, -180, 0), now = performance.now();
    cd.v = (a - cd.lastA) / Math.max(1, now - cd.lastT) * 1000; cd.lastA = a; cd.lastT = now; ctl.setA(a);
  });
  const cup = () => {
    if (!cd) return; const d = cd; cd = null;
    if (!d.moved) { ctl.open(); return; }
    if (ctl.st.a < -45 || d.v < -250) ctl.open(Math.min(0, d.v));
    else spring({ from: ctl.st.a, to: 0, ...M.fastSpatial, onUpdate: ctl.setA, onDone: () => coverEl.classList.remove('strap-off') });
  };
  coverEl.addEventListener('pointerup', cup);
  coverEl.addEventListener('pointercancel', cup);
  coverEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctl.open(); } });
  ctrls.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) (+b.dataset.go > 0 ? fl.next() : fl.prev()); });
  leavesEl.addEventListener('click', e => {
    if (fl.justDragged() || !ctl.st.open) return;
    const pk = e.target.closest('[data-n]'); if (pk) api.openDetail(+pk.dataset.n, $('.anchor', pk));
  });

  return {
    close: ctl.close, isOpen: () => ctl.st.open, key: d => (d > 0 ? fl.next() : fl.prev()),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, leavesEl),
    replacePocket: n => { const old = $(`[data-n="${n}"]`, leavesEl); old.outerHTML = pocket(byN(n)); return $(`[data-n="${n}"]`, leavesEl); },
    afterInsert: n => {
      const i = PAGES.findIndex(p => p.includes(n)), cs = PAGES[i].filter(Boolean).map(byN);
      if (!pageDone(cs)) return false;
      const leaf = $('.v1-leaf', fl.leaf(i)); if (!$('.stamp', leaf)) leaf.insertAdjacentHTML('beforeend', stampHTML('v1-stamp pop'));
      return true;
    },
  };
}
