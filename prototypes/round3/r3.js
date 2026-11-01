/* Rodada 3 — três combinações de álbum + interface, todas com cartas reais da coleção 151 */
const R3_PAGES = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [25, 26, 35, 39, 52, 54, 92, 93, 94], [129, 133, 143, 150, 151, 166, 168, 170, 199]];
const BOLT = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M13.6 2.5 4.8 13.6h6.1l-1.2 7.9 8.9-11.3h-6.1l1.1-7.7z" fill="currentColor"/></svg>';

const R3_BALL = `<svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true"><path d="M19 100A81 81 0 0 1 181 100H134A35 35 0 0 0 66 100Z" fill="#ff4670" opacity=".16"/><g fill="#fff" opacity=".85" transform="translate(0 1.8)"><path fill-rule="evenodd" d="M12 100a88 88 0 1 0 176 0a88 88 0 1 0-176 0ZM19 100a81 81 0 1 0 162 0a81 81 0 1 0-162 0Z"/><rect x="15" y="94" width="53" height="12"/><rect x="132" y="94" width="53" height="12"/><path fill-rule="evenodd" d="M65 100a35 35 0 1 0 70 0a35 35 0 1 0-70 0ZM74 100a26 26 0 1 0 52 0a26 26 0 1 0-52 0Z"/></g><g fill="#17141f" opacity=".2"><path fill-rule="evenodd" d="M12 100a88 88 0 1 0 176 0a88 88 0 1 0-176 0ZM19 100a81 81 0 1 0 162 0a81 81 0 1 0-162 0Z"/><rect x="15" y="94" width="53" height="12"/><rect x="132" y="94" width="53" height="12"/><path fill-rule="evenodd" d="M65 100a35 35 0 1 0 70 0a35 35 0 1 0-70 0ZM74 100a26 26 0 1 0 52 0a26 26 0 1 0-52 0Z"/></g><circle cx="100" cy="100" r="19" fill="#fff" opacity=".5"/><circle cx="100" cy="100" r="19" fill="none" stroke="#17141f" stroke-opacity=".18" stroke-width="2"/><path d="M88 94a14 14 0 0 1 18-7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/></svg>`;
const R3_COVERS = {
  // Opção 1: fichário amarelo com blocos de cor, tudo chapado
  flat: () => `
    <div class="face r3a-cf">
      <i class="r3a-blk" style="--c:#4DA2FF;left:-96px;top:-84px"></i>
      <i class="r3a-blk" style="--c:#FB4903;left:214px;top:-104px"></i>
      <i class="r3a-blk" style="--c:#55DB9C;left:-110px;top:300px"></i>
      <i class="r3a-blk" style="--c:#5C4ADE;left:226px;top:318px"></i>
      <span class="r3a-badge">${BOLT}</span>
      <i class="r3a-stitch"></i>
      <span class="r3a-name">da Lia</span>
      <span class="cstk r3a-stk" style="left:44px;top:206px;--r:-12deg">${sticker('sonho', 46, '#E9CCFF')}</span>
      <div class="r3a-prog"><b data-owned>${ownedCount()}</b><span>de ${total()}</span></div>
      <i class="v1-strap r3a-strap"></i>
    </div>
    <div class="face r3a-ci"><div class="v1-plate"><small>Este álbum é da</small><b>Lia</b></div></div>`,
  // Opção 2: o mesmo fichário inflável da variação 1
  vinil: () => `
    <div class="face v1-cf"><i class="grain"></i><i class="stitch"></i>
      <div class="v1-title"><span>MEU</span><span>ÁLBUM</span></div>
      <div class="v1-name">da Lia</div>
      <span class="cstk" style="left:226px;top:18px;--r:16deg">${sticker('planta', 62, '#55DB9C')}</span>
      <span class="cstk" style="left:222px;top:196px;--r:-10deg">${sticker('eletrico', 56, '#FFD731')}</span>
      <span class="cstk" style="left:30px;top:262px;--r:-14deg">${sticker('fogo', 70, '#FB4903')}</span>
      <span class="cstk" style="left:126px;top:288px;--r:7deg">${sticker('fantasma', 60, '#5C4ADE')}</span>
      <span class="cstk" style="left:74px;top:370px;--r:12deg">${sticker('agua', 50, '#DCEEFF')}</span>
      <span class="cstk" style="left:238px;top:280px;--r:-6deg">${sticker('sonho', 44, '#E9CCFF')}</span>
      <div class="v1-prog"><b data-owned>${ownedCount()}</b><span>de ${total()}</span></div>
      <i class="v1-strap"></i>
    </div>
    <div class="face v1-ci"><i class="grain"></i><i class="stitch"></i><div class="v1-plate"><small>Este álbum é da</small><b>Lia</b></div></div>`,
  // Opção 4: o fichário inflável em vinil holográfico (PVC iridescente)
  vinilholo: () => `
    <div class="face v1-cf"><i class="r3d-sheen"></i><i class="grain"></i><i class="stitch"></i>
      <div class="v1-title"><span>MEU</span><span>ÁLBUM</span></div>
      <div class="v1-name">da Lia</div>
      <span class="cstk" style="left:226px;top:18px;--r:16deg">${sticker('planta', 62, 'url(#r3dVivid)')}</span>
      <span class="cstk" style="left:222px;top:196px;--r:-10deg">${sticker('eletrico', 56, 'url(#r3dVivid)')}</span>
      <span class="cstk" style="left:30px;top:262px;--r:-14deg">${sticker('fogo', 70, 'url(#r3dVivid)')}</span>
      <span class="cstk" style="left:126px;top:288px;--r:7deg">${sticker('sonho', 56, 'url(#r3dVivid)')}</span>
      <div class="v1-prog"><b data-owned>${ownedCount()}</b><span>de ${total()}</span></div>
      <i class="v1-strap"></i>
    </div>
    <div class="face v1-ci"><i class="grain"></i><i class="stitch"></i><div class="v1-plate"><small>Este álbum é da</small><b>Lia</b></div></div>`,
  // Opção 3: fichário em foil holográfico com emblema em baixo-relevo
  holo: () => `
    <div class="face r3c-cf">
      <i class="r3c-foil"></i><i class="r3c-lines"></i><i class="r3c-glitter"></i><i class="r3c-glare"></i>
      <i class="r3c-stitch"></i>
      <div class="r3c-ball">${R3_BALL}</div>
      <div class="r3c-word">MEU ÁLBUM</div>
      <span class="r3c-stk" style="left:234px;top:330px;--r:12deg">${sticker('eletrico', 54, '#FFD731')}<i class="r3c-stk-foil"></i></span>
      <span class="r3c-stk" style="left:46px;top:336px;--r:-10deg">${sticker('sonho', 46, '#E9CCFF')}<i class="r3c-stk-foil"></i></span>
      <div class="r3c-prog"><b data-owned>${ownedCount()}</b> de ${total()}</div>
    </div>
    <div class="face r3c-ci"><div class="v1-plate"><small>Este álbum é da</small><b>Lia</b></div></div>`,
};

function mountBinder(stage, api, o) {
  stage.className = `stage v1 ${o.cls}`;
  stage.style.setProperty('--ix', '0'); stage.style.setProperty('--iy', '-.42');
  const C = { x: 46.5, y: 100, s: .8 }, O = { x: 10, y: 52, s: 1 }, NP = R3_PAGES.length;
  const ringSVG = t => `<svg class="ring" style="top:${t}%" viewBox="0 0 44 24"><path d="M5 19C5 4 39 4 39 19" fill="none" stroke="#4b5363" stroke-width="7" stroke-linecap="round"/><path d="M5 19C5 4 39 4 39 19" fill="none" stroke="url(#metal)" stroke-width="4.6" stroke-linecap="round"/></svg>`;
  const pocket = c => `<button class="pk pk1" data-n="${c.n}" aria-label="${aria(c)}"><span class="anchor" style="${jitStyle(c)}">${c.have ? cardHTML(c) : ph(c)}</span><i class="sleeve"></i>${badges(c)}</button>`;
  stage.innerHTML = `
    <div class="book v1-book" id="book">
      <div class="v1-back"><i class="grain"></i></div>
      <div class="v1-spine"></div>
      <div class="v1-leaves flip-host" id="leaves"></div>
      <div class="v1-rings">${[18, 50, 82].map(ringSVG).join('')}</div>
      <div class="v1-cover" id="cover" role="button" tabindex="0" aria-label="Abrir o álbum">${R3_COVERS[o.cover]()}</div>
    </div>
    <div class="hint" id="hint" style="top:${C.y + 452 * C.s + 18}px"><span class="hand">${ico('hand', 30, '#fff')}</span><span>Toque ou arraste a capa</span></div>
    <div class="ctrls" id="ctrls" style="top:${O.y + 452 + 14}px">
      <button class="rbtn" data-go="-1" aria-label="Folha anterior">${ico('chevL', 28)}</button>
      <div class="pagepill">Folha <b id="pgN">1</b> de ${NP}</div>
      <button class="rbtn" data-go="1" aria-label="Próxima folha">${ico('chevR', 28)}</button>
    </div>`;
  const book = $('#book', stage), coverEl = $('#cover', stage), hint = $('#hint', stage), ctrls = $('#ctrls', stage), leavesEl = $('#leaves', stage), rings = $('.v1-rings', stage);
  const leafHTML = i => {
    const cs = R3_PAGES[i].map(byN);
    return `<div class="v1-leaf"><i class="grain"></i>${[18, 50, 82].map(t => `<i class="hole" style="top:${t}%"></i>`).join('')}<div class="v1-grid">${cs.map(pocket).join('')}</div>${pageDone(cs) ? stampHTML('v1-stamp') : ''}</div>`;
  };
  let ctl;
  const updCtrls = () => { $('[data-go="-1"]', ctrls).disabled = fl.cur === 0; $('[data-go="1"]', ctrls).disabled = fl.cur === NP - 1; };
  const fl = makeFlipper({ host: leavesEl, count: NP, render: leafHTML, back: '<div class="v1-lb"></div>', enabled: () => ctl.st.open,
    onChange: i => { $('#pgN', stage).textContent = i + 1; api.setTitle(`Folha ${i + 1} de ${NP}`); updCtrls(); } });
  ctl = bookCtl({ book, cover: coverEl, C, O,
    onP: p => { rings.style.opacity = clamp(p * 3 - 1, 0, 1); hint.style.opacity = clamp(1 - p * 2.5, 0, 1); ctrls.style.opacity = clamp(p * 1.6 - .6, 0, 1); ctrls.style.pointerEvents = p > .9 ? 'auto' : 'none'; },
    onOpenStart: () => { coverEl.classList.add('strap-off'); buzz(10); },
    onOpened: () => api.setOpen(true, `Folha ${fl.cur + 1} de ${NP}`),
    onCloseStart: () => api.setOpen(false),
    onClosed: () => coverEl.classList.remove('strap-off') });
  updCtrls();

  // Brilho que acompanha o dedo (usado pelo foil holográfico e pelas cartas holo)
  const glow = stage.closest('.screen') || stage;
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    glow.style.setProperty('--hx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    glow.style.setProperty('--hy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
  });
  let cd = null;
  coverEl.addEventListener('pointerdown', e => { if (ctl.st.busy || ctl.st.open || e.button > 0) return; cd = { x: e.clientX, id: e.pointerId, moved: false, lastA: 0, lastT: performance.now(), v: 0, eff: book.getBoundingClientRect().width / 364 }; });
  coverEl.addEventListener('pointermove', e => {
    if (!cd) return; const dx = (e.clientX - cd.x) / cd.eff;
    if (!cd.moved) { if (Math.abs(dx) < 8) return; cd.moved = true; try { coverEl.setPointerCapture(cd.id); } catch (err) { /* ok */ } coverEl.classList.add('strap-off'); }
    const a = clamp(dx / 300 * 180, -180, 0), now = performance.now(); cd.v = (a - cd.lastA) / Math.max(1, now - cd.lastT) * 1000; cd.lastA = a; cd.lastT = now; ctl.setA(a);
  });
  const cup = () => {
    if (!cd) return; const d = cd; cd = null;
    if (!d.moved) { ctl.open(); return; }
    if (ctl.st.a < -45 || d.v < -250) ctl.open(Math.min(0, d.v));
    else spring({ from: ctl.st.a, to: 0, ...M.fastSpatial, onUpdate: ctl.setA, onDone: () => coverEl.classList.remove('strap-off') });
  };
  coverEl.addEventListener('pointerup', cup); coverEl.addEventListener('pointercancel', cup);
  coverEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctl.open(); } });
  ctrls.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) (+b.dataset.go > 0 ? fl.next() : fl.prev()); });
  leavesEl.addEventListener('click', e => { if (fl.justDragged() || !ctl.st.open) return; const pk = e.target.closest('[data-n]'); if (pk) api.openDetail(+pk.dataset.n, $('.anchor', pk)); });

  return {
    close: ctl.close, isOpen: () => ctl.st.open, key: d => (d > 0 ? fl.next() : fl.prev()),
    anchorFor: n => $(`[data-n="${n}"] .anchor`, leavesEl),
    replacePocket: n => { const old = $(`[data-n="${n}"]`, leavesEl); old.outerHTML = pocket(byN(n)); return $(`[data-n="${n}"]`, leavesEl); },
    afterInsert: n => {
      const i = R3_PAGES.findIndex(p => p.includes(n)), cs = R3_PAGES[i].map(byN);
      if (!pageDone(cs)) return false;
      const leaf = $('.v1-leaf', fl.leaf(i)); if (!$('.stamp', leaf)) leaf.insertAdjacentHTML('beforeend', stampHTML('v1-stamp pop'));
      return true;
    },
  };
}

const R3_CONS = 'As fotos das cartas dependem de liberar o domínio de imagens. Enquanto isso, cada bolso mostra a moldura com nome e número reais.';
VARIANTS.r3a = { round: 3, num: '1', short: 'Chapado', hash: 'chapado', skin: 'r1', mount: (s, a) => mountBinder(s, a, { cls: 'r3a', cover: 'flat' }), notes: {
  title: 'Mesma interface, álbum chapado', tag: 'Fichário amarelo com elástico · cores sólidas e contorno preto',
  concept: 'A interface fica igual à da variação 1 e o álbum passa a falar a mesma língua: cores sólidas, contorno preto e volume dado por um degrau sólido, sem gradiente nem sombra borrada. A capa é uma versão mínima do fichário amarelo da sua referência, com blocos de cor e um selo de energia no centro, fechada por elástico como na variação 1.',
  refs: 'Fichários de 9 bolsos com blocos de cor (como o amarelo da sua imagem) e a estética de adesivo da variação 1.',
  try: ['Toque ou arraste a capa.', 'Toque numa carta para ver o anúncio completo: coleção e número, raridade, variante, condição e idioma.', 'Toque no bolso da <b>Venusaur ex</b> (003/165), diga como a carta está e veja a folha 1 completar.'],
  m3: ['Top app bar', 'Navigation bar', 'Assist chip', 'Modal bottom sheet com anúncio', 'Seleção de condição'],
  pros: 'Interface e álbum finalmente coerentes. É a opção mais barata de produzir e a mais legível.',
  cons: 'Perde o volume "fofinho" da capa inflável. ' + R3_CONS } };
VARIANTS.r3b = { round: 3, num: '2', short: 'Vinil', hash: 'vinil', skin: 'r3b', mount: (s, a) => mountBinder(s, a, { cls: 'r3b', cover: 'vinil' }), notes: {
  title: 'Mesmo álbum, interface de vinil', tag: 'Capa inflável da variação 1 · interface com gradientes sutis',
  concept: 'O álbum inflável fica como está, e a interface ganha o mesmo material: botões, chips e barras com gradiente suave de cima para baixo, brilho no topo e degrau no tom da própria cor. A interface parece feita do mesmo vinil da capa.',
  refs: 'A capa inflável da variação 1 e os brinquedos de vinil e infláveis da referência Slush.',
  try: ['Repare nos botões e na barra de navegação: o gradiente é sutil, mas combina com a capa.', 'Abra uma carta e veja o anúncio no sheet.', 'Guarde a <b>Venusaur ex</b> e escolha a condição.'],
  m3: ['Top app bar', 'Navigation bar', 'Botões com gradiente', 'Modal bottom sheet com anúncio', 'Snackbar'],
  pros: 'Mantém a capa que você mais gostou e deixa tudo mais "fofinho".',
  cons: 'Gradiente pede mais cuidado no Android (estados, modo escuro). ' + R3_CONS } };
VARIANTS.r3c = { round: 3, num: '3', short: 'Holo', hash: 'holo', skin: 'r3c', mount: (s, a) => mountBinder(s, a, { cls: 'r3c', cover: 'holo' }), notes: {
  title: 'Holográfico', tag: 'Fichário em foil holográfico · interface perolada',
  concept: 'Uma combinação nova a partir do brilho das cartas raras. A capa é foil holográfico com textura de linhas e glitter, que muda de cor quando o dedo passa por cima. No centro há um emblema mínimo em baixo-relevo, inspirado nos fichários de Poké Ball. A interface é perolada, com o mesmo arco-íris só nos detalhes: indicador da navegação, aro do avatar, borda do sheet e adesivos holo.',
  refs: 'Fichários de Poké Ball (sua referência), o foil das cartas Rara Dupla e Ilustração Rara da coleção 151 e o brilho por inclinação do TCG Pocket.',
  try: ['Passe o dedo sobre a capa: o foil e os adesivos holo mudam de cor.', 'Abra e toque numa carta Rara Dupla (Charizard ex, 006/165).', 'Guarde a <b>Venusaur ex</b> e escolha a condição.'],
  m3: ['Top app bar', 'Navigation bar com indicador holo', 'Modal bottom sheet com anúncio', 'Snackbar'],
  pros: 'Destaca o que as crianças mais valorizam nas cartas: o brilho. Os adesivos holo são um produto natural para vender depois.',
  cons: 'O emblema de Poké Ball e o visual de marca precisam de licença. ' + R3_CONS } };
VARIANTS.r3d = { round: 3, num: '4', short: 'Vinil holo', hash: 'vinil-holo', skin: 'r3d', mount: (s, a) => mountBinder(s, a, { cls: 'r3d', cover: 'vinilholo' }), notes: {
  title: 'Vinil holográfico', tag: 'Capa inflável em PVC iridescente · interface de vinil com brilho holo',
  concept: 'O fichário inflável da variação 1 feito em vinil holográfico, o mesmo PVC iridescente de estojos e mochilas. Continua cheio de ar, com brilho no topo e sombra embaixo, mas a cor muda entre rosa, lilás, azul e menta quando o dedo passa. Os adesivos da capa também são holo. A interface usa o vinil fofinho da opção 2 com o arco-íris só onde há ação: indicador da navegação, botão principal e contador.',
  refs: 'A capa inflável da variação 1, estojos e mochilas de PVC holográfico, e o foil das cartas Rara Dupla e Ilustração Rara da coleção 151.',
  try: ['Passe o dedo sobre a capa e veja o vinil mudar de cor.', 'Troque a barra de navegação: na pílula e no centro, o holo aparece no item ativo.', 'Guarde a <b>Venusaur ex</b> e escolha a condição.'],
  m3: ['Top app bar', 'Navigation bar', 'Botão com gradiente', 'Modal bottom sheet com anúncio', 'Snackbar'],
  pros: 'Junta o que você mais gostou (a capa fofinha) com o brilho que as crianças associam às cartas raras.',
  cons: 'O efeito iridescente precisa de bom contraste no texto; mantive o título com contorno preto. ' + R3_CONS } };
