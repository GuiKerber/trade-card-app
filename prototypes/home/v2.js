/* V2 — Livro de abas: capa dura com janela, uma página de papel por tipo */
function mountV2(stage, api) {
  stage.className = 'stage v2';
  stage.style.setProperty('--ix', '0'); stage.style.setProperty('--iy', '-.3');
  const TY = Object.keys(TYPES);
  const C = { x: 70, y: 84, s: .68 }, O = { x: 12, y: 30, s: 1 };
  const slot = c => {
    const t = TYPES[c.type];
    return `<button class="pk sl2" data-n="${c.n}" aria-label="${aria(c)}"><span class="sl2-frame"><span class="anchor" style="${jitStyle(c, 1.6)}">${c.have ? cardHTML(c) : ph(c, t.deco)}</span>${c.have ? ['tl', 'tr', 'bl', 'br'].map(p => `<i class="pc ${p}"><i></i></i>`).join('') : ''}${badges(c)}</span><span class="sl2-cap">#${pad(c.n)} ${c.name}</span></button>`;
  };
  const prog = cs => pageDone(cs) ? stampHTML('') : `<span class="dots" aria-label="${cs.filter(c => c.have).length} de ${cs.length}">${cs.map(c => `<i class="${c.have ? 'on' : ''}"></i>`).join('')}</span>`;
  const curl = (dir, label) => `<button class="curl curl-${dir > 0 ? 'next' : 'prev'}" data-curl="${dir}" aria-label="${label}"><i class="hole2"></i><i class="flapw"><i class="flap"></i></i>${ico(dir > 0 ? 'chevR' : 'chevL', 20)}</button>`;
  const pageHTML = i => {
    const k = TY[i], t = TYPES[k], cs = DATA.filter(c => c.type === k);
    return `<div class="pg2" style="--tc:${t.c};--tl:${t.light}"><i class="grain"></i>
      <svg class="pg2-water" viewBox="0 0 24 24" width="210" height="210" fill="${t.deco}" aria-hidden="true">${IC[k]}</svg>
      <div class="pg2-head"><span>${sticker(k, 50, t.c)}</span><div class="pg2-ht"><h3>${t.label}</h3><span class="pg2-prog">${prog(cs)}</span></div></div>
      <div class="pg2-grid">${cs.map(slot).join('')}</div>
      <span class="pg2-no">${i + 1}</span>
      ${i > 0 ? curl(-1, 'Página anterior') : ''}${i < TY.length - 1 ? curl(1, 'Próxima página') : ''}
    </div>`;
  };
  const fav = byN(6);
  stage.innerHTML = `
    <div class="book v2-book" id="book">
      <i class="v2-board"></i><i class="v2-bind"></i>
      <div class="v2-tabs" id="tabs">${TY.map((k, i) => `<button class="tab2" data-i="${i}" style="--tc:${TYPES[k].c};--on:${TYPES[k].on}" aria-label="Abrir em ${TYPES[k].label}">${typeIcon(k, 24, '#fff')}<span>${TYPES[k].label}</span></button>`).join('')}</div>
      <div class="v2-leaves flip-host" id="leaves"></div>
      <div class="v2-cover" id="cover" role="button" tabindex="0" aria-label="Abrir o álbum">
        <div class="face v2-cf"><i class="linen"></i><i class="grain"></i><i class="v2-cloth"></i><i class="v2-corner tr"></i><i class="v2-corner br"></i>
          <div class="v2-title">MEU<br>ÁLBUM</div>
          <div class="v2-window"><div class="v2-win-in">${creatureSVG(fav)}<i class="holo"></i></div></div>
          <div class="v2-fav"><span>Minha favorita: ${fav.name}</span></div>
          <div class="v2-sub"><b data-owned>${ownedCount()}</b> de 24 cartas</div>
        </div>
        <div class="face v2-ci"><div class="v2-plate"><small>Este álbum é da</small><b>Lia</b></div></div>
      </div>
    </div>
    <div class="hint" id="hint" style="top:${C.y + 568 * C.s + 16}px"><span class="hand">${ico('hand', 30, '#fff')}</span><span>Toque na capa ou numa aba</span></div>`;
  const book = $('#book', stage), coverEl = $('#cover', stage), hint = $('#hint', stage), tabs = $('#tabs', stage), leavesEl = $('#leaves', stage);
  let ctl, pending = null;
  const setTab = i => $$('.tab2', tabs).forEach((t, j) => t.classList.toggle('on', i === j));
  const fl = makeFlipper({ host: leavesEl, count: TY.length, render: pageHTML, back: '<div class="v2-lb"></div>', enabled: () => ctl.st.open,
    onChange: i => { setTab(i); api.setTitle(TYPES[TY[i]].label); } });
  ctl = bookCtl({ book, cover: coverEl, C, O,
    onP: p => { hint.style.opacity = clamp(1 - p * 2.5, 0, 1); },
    onOpenStart: () => buzz(10),
    onOpened: () => {
      setTab(fl.cur); api.setOpen(true, TYPES[TY[fl.cur]].label);
      if (pending != null) { const t = pending; pending = null; setTimeout(() => fl.jump(t), 80); }
    },
    onCloseStart: () => { api.setOpen(false); setTab(-1); } });
  coverEl.addEventListener('click', () => ctl.open());
  coverEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctl.open(); } });
  tabs.addEventListener('click', e => {
    const t = e.target.closest('.tab2'); if (!t) return;
    const i = +t.dataset.i; buzz(6);
    if (!ctl.st.open) { pending = i; ctl.open(); } else fl.jump(i);
  });
  leavesEl.addEventListener('click', e => {
    if (fl.justDragged() || !ctl.st.open) return;
    const c = e.target.closest('[data-curl]'); if (c) { +c.dataset.curl > 0 ? fl.next() : fl.prev(); return; }
    const pk = e.target.closest('[data-n]'); if (pk) api.openDetail(+pk.dataset.n, $('.anchor', pk));
  });

  return {
    close: ctl.close, isOpen: () => ctl.st.open, key: d => (d > 0 ? fl.next() : fl.prev()),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, leavesEl),
    replacePocket: n => { const old = $(`[data-n="${n}"]`, leavesEl); old.outerHTML = slot(byN(n)); return $(`[data-n="${n}"]`, leavesEl); },
    afterInsert: n => {
      const k = byN(n).type, i = TY.indexOf(k), cs = DATA.filter(c => c.type === k);
      const el = $('.pg2-prog', fl.leaf(i)); el.innerHTML = prog(cs);
      if (!pageDone(cs)) return false;
      $('.stamp', el).classList.add('pop'); return true;
    },
  };
}
