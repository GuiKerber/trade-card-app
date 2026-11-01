/* V6 — Caixa pixel: livro de pixel que flutua sobre um bloco de grama; dentro, caixas de inventário */
const PX = {}, PXS = {};
function pixelize(svg, w = 36, h = 29) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const x = cv.getContext('2d'); x.drawImage(img, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) { for (let k = 0; k < 3; k++) d.data[i + k] = Math.round(d.data[i + k] / 40) * 40; d.data[i + 3] = d.data[i + 3] < 120 ? 0 : 255; }
      x.putImageData(d, 0, 0); res(cv.toDataURL());
    };
    img.onerror = () => res('');
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" '))}`;
  });
}
const PIX_STAR = ['....#....', '...###...', '#########', '.#######.', '..#####..', '..##.##..', '.##...##.'];
function pixSVG(rows, fill, size) {
  const w = rows[0].length, h = rows.length; let r = '';
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
  return `<svg viewBox="0 0 ${w} ${h}" width="${size}" height="${size * h / w}" shape-rendering="crispEdges" fill="${fill}" class="pxsvg" aria-hidden="true">${r}</svg>`;
}
let AC = null, SOUND = true;
function blip(f = 660, d = .07, type = 'square', delay = 0) {
  if (!SOUND) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(.045, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
  } catch (e) { /* sem áudio */ }
}

function mountV6(stage, api) {
  stage.className = 'stage v6';
  stage.style.setProperty('--ix', '0'); stage.style.setProperty('--iy', '-.5');
  const PAGES = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 23, 24, 0, 0, 0]];
  const WALL = ['campo', 'mar', 'caverna'];
  const st = { open: false, busy: false, cur: 0 };
  const stars = c => '★'.repeat(c.r === 'r' ? 3 : c.r === 'u' ? 2 : 1);
  const card = c => { const t = TYPES[c.type]; return `<div class="pcard" style="--tc:${t.c}"><div class="pc-in"><div class="pc-top"><span>${c.name}</span><b>${c.hp}</b></div><div class="pc-art"><img src="${PX[c.n]}" alt="">${c.holo ? '<i class="pc-holo"></i>' : ''}</div><div class="pc-bot"><span>#${pad(c.n)}</span><span>${stars(c)}</span></div></div></div>`; };
  const back = mystery => `<div class="pback"><i></i>${mystery ? '<b>?</b>' : pixSVG(PIX_STAR, '#ffcf3f', 80)}</div>`;
  const slot = c => !c ? '<div class="v6-slot" aria-hidden="true"></div>'
    : `<button class="pk v6-slot" data-n="${c.n}" aria-label="${aria(c)}"><span class="anchor">${c.have ? card(c) : `<span class="ph v6-ph"><img src="${PXS[c.n]}" alt=""><b class="ph-q">?</b><em class="ph-num">#${pad(c.n)}</em></span>`}</span>${badges(c)}</button>`;
  const boxHTML = i => { const cs = PAGES[i].map(n => (n ? byN(n) : null)); return `<div class="v6-box wall-${WALL[i]}" data-page="${i}"><div class="v6-grid">${cs.map(slot).join('')}</div>${pageDone(cs) ? stampHTML('v6-stamp') : ''}</div>`; };
  const ctrl = { card, back, close: () => {}, isOpen: () => false, key: () => {}, anchorFor: () => null, replacePocket: () => null, afterInsert: () => false };
  stage.innerHTML = '<p class="v6-loading">Carregando…</p>';

  Promise.all(DATA.flatMap(c => [pixelize(creatureSVG(c)).then(u => { PX[c.n] = u; }), pixelize(creatureSVG(c, '#2b2b2b')).then(u => { PXS[c.n] = u; })])).then(() => {
    if (!stage.isConnected) return;
    stage.innerHTML = `
      <i class="v6-cloud" style="left:30px;top:40px"></i><i class="v6-cloud" style="left:250px;top:96px;transform:scale(.7)"></i>
      <i class="v6-ground"></i>
      <button class="v6-sound" id="snd" aria-pressed="true" aria-label="Som ligado">${pixSVG(['...#...', '..##..#', '####.#.', '####.#.', '..##..#', '...#...'], '#1b1b1b', 24)}</button>
      <div class="v6-closed" id="closed">
        <i class="v6-spark" style="left:52px;top:110px"></i><i class="v6-spark" style="left:318px;top:170px;animation-delay:.4s"></i><i class="v6-spark" style="left:84px;top:330px;animation-delay:.8s"></i>
        <div class="v6-bob"><div class="v6-book" id="bookbtn" role="button" tabindex="0" aria-label="Abrir o álbum">
          <i class="v6-edge"></i>
          <div class="v6-cover" id="cover">${pixSVG(PIX_STAR, '#ffcf3f', 90)}<b>ÁLBUM</b><span><b data-owned>${ownedCount()}</b>/24</span></div>
        </div></div>
        <div class="v6-block"><i></i></div>
      </div>
      <div class="hint v6-hint" id="hint">Toque no livro</div>
      <div class="v6-panel" id="panel">
        <div class="v6-phead"><button class="px-btn" data-go="-1" aria-label="Caixa anterior">◀</button><b id="boxname">CAIXA 1</b><button class="px-btn" data-go="1" aria-label="Próxima caixa">▶</button></div>
        <div class="v6-win" id="win"><div class="v6-boxes" id="boxes">${PAGES.map((p, i) => boxHTML(i)).join('')}</div></div>
      </div>`;
    const closed = $('#closed', stage), coverEl = $('#cover', stage), panel = $('#panel', stage), boxes = $('#boxes', stage), hint = $('#hint', stage), bookBtn = $('#bookbtn', stage), win = $('#win', stage);
    const frame = t => {
      const q = Math.round(t * 6) / 6;
      coverEl.style.transform = `scaleX(${Math.max(0, 1 - q * 2)})`;
      closed.style.opacity = q < .5 ? 1 : 0; hint.style.opacity = q < .5 ? 1 : 0;
      panel.style.opacity = q < .5 ? 0 : 1; panel.style.transform = `scale(${q < .5 ? .6 : lerp(.6, 1, (q - .5) * 2)})`;
      panel.style.pointerEvents = q > .9 ? 'auto' : 'none';
    };
    const open = () => { if (st.busy || st.open) return; st.busy = true; blip(523); blip(659, .07, 'square', .08); blip(784, .12, 'square', .16); buzz(10);
      tween(0, 1, 520, frame, () => { st.open = true; st.busy = false; api.setOpen(true, `Caixa ${st.cur + 1} de 3`); }, t => t); };
    const close = () => { if (st.busy || !st.open) return; st.busy = true; api.setOpen(false); blip(392, .1);
      tween(1, 0, 420, frame, () => { st.open = false; st.busy = false; }, t => t); };
    const go = dir => {
      const n = st.cur + dir; if (n < 0 || n >= PAGES.length) { blip(160, .12, 'sawtooth'); return; }
      st.cur = n; boxes.style.transform = `translateX(${-n * 100}%)`; $('#boxname', stage).textContent = `CAIXA ${n + 1}`;
      api.setTitle(`Caixa ${n + 1} de 3`); blip(880, .05); buzz(6);
    };
    bookBtn.addEventListener('click', open);
    bookBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    $('.v6-phead', stage).addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); });
    $('#snd', stage).addEventListener('click', e => { SOUND = !SOUND; const b = e.currentTarget; b.setAttribute('aria-pressed', SOUND); b.setAttribute('aria-label', SOUND ? 'Som ligado' : 'Som desligado'); b.classList.toggle('off', !SOUND); blip(988, .05); });
    let sd = null, dragged = false;
    win.addEventListener('pointerdown', e => { if (st.open) sd = { x: e.clientX, y: e.clientY }; });
    win.addEventListener('pointermove', e => { if (!sd) return; const dx = e.clientX - sd.x; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - sd.y)) { go(dx < 0 ? 1 : -1); sd = null; dragged = true; setTimeout(() => { dragged = false; }, 80); } });
    win.addEventListener('pointerup', () => { sd = null; });
    win.addEventListener('click', e => { if (dragged || !st.open) return; const pk = e.target.closest('[data-n]'); if (pk) { blip(740, .05); api.openDetail(+pk.dataset.n, $('.anchor', pk)); } });
    frame(0);
    Object.assign(ctrl, {
      close, isOpen: () => st.open, key: d => go(d),
      anchorFor: n => $(`[data-n="${n}"] .anchor`, boxes),
      replacePocket: n => { const old = $(`[data-n="${n}"]`, boxes); old.outerHTML = slot(byN(n)); return $(`[data-n="${n}"]`, boxes); },
      afterInsert: n => {
        [523, 659, 784, 1046].forEach((f, i) => blip(f, .09, 'square', i * .07));
        const i = PAGES.findIndex(p => p.includes(n)), cs = PAGES[i].filter(Boolean).map(byN);
        if (!pageDone(cs)) return false;
        const bx = $(`[data-page="${i}"]`, boxes); if (!$('.stamp', bx)) bx.insertAdjacentHTML('beforeend', stampHTML('v6-stamp pop'));
        return true;
      },
    });
  });
  return ctrl;
}
VARIANTS.v6 = { round: 2, num: '6', short: 'Pixel', hash: 'pixel', skin: 'v6', mount: mountV6, notes: {
  title: 'Caixa pixel', tag: 'Livro de pixel flutuante · caixas de inventário',
  concept: 'Um mundo de blocos que as crianças já conhecem dos jogos. O álbum é um livro de pixel flutuando sobre um bloco de grama. Ao abrir, vira uma janela de inventário com caixas de 9 espaços e papel de parede (campo, mar, caverna). As cartas são pixeladas e cada ação faz um som de 8 bits.',
  refs: 'Minecraft (inventário, hotbar como navegação, número de pilha no canto do item, tooltip escuro), as caixas de armazenamento dos jogos clássicos de monstrinhos de bolso e a fonte Pixelify Sans, legível em tamanho grande.',
  try: ['Toque no livro: ele abre em quadros, como num jogo antigo.', 'Use ◀ ▶ ou arraste para trocar de caixa.', 'Guarde a <b>#004</b> para ouvir a fanfarra e completar a Caixa 1.', 'O botão de som fica no canto, para os pais poderem desligar.'],
  m3: ['Top app bar', 'Navigation bar como hotbar', 'Botões de ícone', 'Modal bottom sheet', 'Snackbar como tooltip'],
  pros: 'Linguagem que as crianças de 7 a 12 anos reconhecem na hora. Som e animação em quadros dão muita resposta a cada toque.',
  cons: 'As cartas pixeladas perdem detalhe da arte original, então a carta ampliada precisaria mostrar a arte real. O pixel pode parecer infantil demais para os mais velhos.' } };
