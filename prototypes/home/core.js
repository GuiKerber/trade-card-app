/* Núcleo compartilhado: utilidades, molas M3, dados, ícones, criaturas e cartas */
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad = n => String(n).padStart(3, '0');
const buzz = (ms = 8) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* sem vibração */ } };

/* Molas do Material 3 Expressive (MotionScheme.expressive) */
const M = {
  fastSpatial: { damping: .6, stiffness: 800 },
  defaultSpatial: { damping: .8, stiffness: 380 },
  slowSpatial: { damping: .8, stiffness: 200 },
  fastEffects: { damping: 1, stiffness: 3800 },
  riffle: { damping: .9, stiffness: 1400 },
};

function spring({ from, to, velocity = 0, damping, stiffness, onUpdate, onDone }) {
  if (RM || (from === to && !velocity)) { onUpdate && onUpdate(to); onDone && onDone(); return { stop() {} }; }
  let x = from, v = velocity, last = performance.now(), raf, dead = false;
  const c = 2 * damping * Math.sqrt(stiffness), range = Math.max(Math.abs(to - from), 1e-3);
  const step = now => {
    if (dead) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const n = Math.max(1, Math.ceil(dt / .004)), h = dt / n;
    for (let i = 0; i < n; i++) { const a = -stiffness * (x - to) - c * v; v += a * h; x += v * h; }
    if (Math.abs(x - to) < range * .002 && Math.abs(v) < range * .02) { onUpdate && onUpdate(to); onDone && onDone(); return; }
    onUpdate && onUpdate(x); raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return { stop() { dead = true; cancelAnimationFrame(raf); } };
}

function tween(from, to, ms, onUpdate, onDone, ease = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)) {
  if (RM) { onUpdate(to); onDone && onDone(); return; }
  const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / ms); onUpdate(lerp(from, to, ease(k))); k < 1 ? requestAnimationFrame(step) : (onDone && onDone()); };
  requestAnimationFrame(step);
}

/* Registro das variações (cada arquivo vN.js se registra aqui) */
const VARIANTS = {};

/* ---------- Dados: 24 criaturas originais, 6 tipos ---------- */
const TYPES = {
  fogo:     { label: 'Fogo',     c: '#FB4903', light: '#FFE3D6', deco: '#FFC9B0', body: '#FF6A2B', belly: '#FFC6A6', on: '#000' },
  agua:     { label: 'Água',     c: '#4DA2FF', light: '#DCEEFF', deco: '#B5D9FF', body: '#4DA2FF', belly: '#D2E8FF', on: '#000' },
  planta:   { label: 'Planta',   c: '#55DB9C', light: '#DDF8EA', deco: '#B2EDCE', body: '#55DB9C', belly: '#D4F7E5', on: '#000' },
  eletrico: { label: 'Elétrico', c: '#FFD731', light: '#FFF6CF', deco: '#FFE98C', body: '#FFD731', belly: '#FFF2B8', on: '#000' },
  fantasma: { label: 'Fantasma', c: '#5C4ADE', light: '#E4DFFF', deco: '#C8BFFF', body: '#7A69F0', belly: '#A89CFF', on: '#fff' },
  sonho:    { label: 'Sonho',    c: '#E9CCFF', light: '#F7EEFF', deco: '#EAD2FF', body: '#E2B6FF', belly: '#FAEEFF', on: '#000' },
};
const RAR = { c: '●', u: '◆', r: '★' };
const RARL = { c: 'Comum', u: 'Incomum', r: 'Rara' };
// n, nome, tipo, PV, raridade, corpo, olhos, golpe, dano, frase
const RAW = [
  [1, 'Brasinha', 'fogo', 50, 'c', 0, 0, 'Bafinho quente', 20, 'Dorme enroladinho perto da lareira.'],
  [2, 'Gotinha', 'agua', 40, 'c', 1, 0, 'Respingo', 10, 'Adora pular em poças de chuva.'],
  [3, 'Brotinho', 'planta', 50, 'c', 1, 1, 'Folha giratória', 20, 'Cresce um pouquinho a cada dia de sol.'],
  [4, 'Faísca', 'eletrico', 60, 'u', 0, 2, 'Pisca-pisca', 30, 'Brilha quando está feliz.'],
  [5, 'Sombrinha', 'fantasma', 50, 'c', 3, 0, 'Susto fofo', 20, 'Some quando alguém acende a luz.'],
  [6, 'Estrelúcia', 'sonho', 70, 'r', 1, 2, 'Pó de estrela', 40, 'Só aparece em noites sem nuvens.'],
  [7, 'Chamuço', 'fogo', 70, 'u', 2, 1, 'Pulo de brasa', 30, 'Esquenta as mãos dos amigos no inverno.'],
  [8, 'Borbulha', 'agua', 60, 'c', 2, 0, 'Bolha gigante', 20, 'Faz bolhas do tamanho de uma melancia.'],
  [9, 'Folhudo', 'planta', 80, 'u', 2, 0, 'Abraço de folhas', 30, 'Usa as folhas como guarda-chuva.'],
  [10, 'Choquinho', 'eletrico', 50, 'c', 1, 0, 'Zap', 20, 'Deixa o cabelo de todo mundo em pé.'],
  [11, 'Buuzinho', 'fantasma', 60, 'u', 3, 1, 'Buuu!', 30, 'Tem medo de fantasmas maiores que ele.'],
  [12, 'Sonequinha', 'sonho', 60, 'c', 2, 1, 'Canção de ninar', 20, 'Boceja e todo mundo boceja junto.'],
  [13, 'Labareda', 'fogo', 90, 'r', 1, 2, 'Rodopio de fogo', 50, 'Dança sempre que a música é animada.'],
  [14, 'Marolinha', 'agua', 70, 'u', 0, 1, 'Onda pequena', 30, 'Surfa em qualquer gotinha.'],
  [15, 'Musguinho', 'planta', 60, 'r', 0, 2, 'Tapete verde', 40, 'Fica macio depois da chuva.'],
  [16, 'Raiolito', 'eletrico', 70, 'u', 2, 2, 'Raio dobrado', 40, 'Corre mais rápido que um trovão.'],
  [17, 'Nevoeiro', 'fantasma', 80, 'r', 3, 2, 'Névoa mágica', 50, 'Aparece nas manhãs mais frias.'],
  [18, 'Nuvenzinha', 'sonho', 50, 'c', 0, 0, 'Garoa doce', 20, 'Flutua bem pertinho do teto.'],
  [19, 'Vulcãozinho', 'fogo', 110, 'r', 2, 0, 'Erupção', 60, 'Ronca igualzinho a um vulcão.'],
  [20, 'Polvito', 'agua', 80, 'u', 2, 2, 'Oito abraços', 30, 'Tem um abraço para cada amigo.'],
  [21, 'Cactolino', 'planta', 90, 'r', 1, 0, 'Espetadinha', 40, 'Espinhoso por fora, fofo por dentro.'],
  [22, 'Voltão', 'eletrico', 120, 'r', 2, 1, 'Megachoque', 70, 'Carrega tudo com um abraço.'],
  [23, 'Fantasmito', 'fantasma', 70, 'u', 3, 0, 'Atravessa-parede', 30, 'Brinca de esconde-esconde sozinho.'],
  [24, 'Cometinha', 'sonho', 100, 'r', 0, 2, 'Rastro brilhante', 60, 'Passa voando uma vez por ano.'],
];
const HAVE0 = { 1: 2, 7: 3, 9: 2, 13: 2, 4: 0, 11: 0, 14: 0, 16: 0, 20: 0, 22: 0, 23: 0, 24: 0 };
const HOLO = [6, 15, 21];
let DATA = [];
function resetData() {
  DATA = RAW.map(([n, name, type, hp, r, b, e, move, dmg, desc]) => ({
    n, name, type, hp, r, b: type === 'fantasma' ? 3 : b, e, move, dmg, desc,
    have: HAVE0[n] ?? 1, holo: HOLO.includes(n), isNew: n === 17,
  }));
}
resetData();
const byN = n => DATA.find(c => c.n === n);
const ownedCount = () => DATA.filter(c => c.have > 0).length;
const pageDone = cs => cs.filter(Boolean).every(c => c.have > 0);
const jit = c => ({ rot: (((c.n * 37) % 13) - 6) / 10, dx: (((c.n * 17) % 5) - 2) * .5 });
const jitStyle = (c, k = 1) => `--rot:${(jit(c).rot * k).toFixed(2)}deg;--dx:${jit(c).dx}px`;
const aria = c => c.have > 0
  ? `#${pad(c.n)} ${c.name}, ${TYPES[c.type].label}${c.have > 1 ? `, você tem ${c.have}` : ''}`
  : `#${pad(c.n)} ${c.name}, falta essa`;

/* ---------- Ícones ---------- */
const IC = {
  fogo: '<path d="M12 2.6c.6 3.2 4.9 5.3 4.9 10.2a4.9 4.9 0 0 1-9.8 0c0-2.3 1.2-3.8 2.4-4.9.1 1.9.9 3 2 3.3-.6-3.3-.3-6 .5-8.6z"/>',
  agua: '<path d="M12 2.8C9.2 7.1 6.2 10.3 6.2 14.2a5.8 5.8 0 0 0 11.6 0c0-3.9-3-7.1-5.8-11.4z"/>',
  planta: '<path d="M5 19.5C4.6 11 10 4.6 19.6 4.4c.3 9.4-5.7 15.4-14.6 15.1z"/><path d="M5.2 19.3 13.5 11" fill="none"/>',
  eletrico: '<path d="M13.6 2.5 4.8 13.6h6.1l-1.2 7.9 8.9-11.3h-6.1l1.1-7.7z"/>',
  fantasma: '<path d="M5.5 20.5V11a6.5 6.5 0 0 1 13 0v9.5l-2.2-1.6-2.1 1.6-2.2-1.6-2.1 1.6-2.2-1.6z"/><circle cx="9.6" cy="11" r="1.4" fill="#fff" stroke="none"/><circle cx="14.4" cy="11" r="1.4" fill="#fff" stroke="none"/>',
  sonho: '<path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
};
const typeIcon = (t, size = 24, fill) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fill || TYPES[t].c}" stroke="#000" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${IC[t]}</svg>`;
const sticker = (t, size, fill) =>
  `<svg viewBox="-3 -3 30 30" width="${size}" height="${size}" aria-hidden="true"><g stroke-linejoin="round" stroke-linecap="round"><g fill="#000" stroke="#000" stroke-width="7">${IC[t]}</g><g fill="#fff" stroke="#fff" stroke-width="4.6">${IC[t]}</g><g fill="${fill}" stroke="#000" stroke-width="1.6">${IC[t]}</g></g></svg>`;

const UI = {
  back: '<path d="M14.5 5.5 8 12l6.5 6.5"/><path d="M8.5 12H20"/>',
  chevL: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  chevR: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  album: '<path d="M5 5.2A2.2 2.2 0 0 1 7.2 3H19v15H7.2A2.2 2.2 0 0 0 5 20.2z"/><path d="M5 20.2A2 2 0 0 0 7 22h12v-4"/><path d="M9 7.5h6"/>',
  friends: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.5-3.6 3-5.6 6.2-5.6s5.7 2 6.2 5.6z"/><circle cx="17" cy="8.6" r="2.7"/><path d="M16.2 14.4c2.8-.2 4.6 1.6 5 4.6h-3.4"/>',
  trade: '<path d="M4 8.5h14.5"/><path d="M15 4.5l4 4-4 4"/><path d="M20 15.5H5.5"/><path d="M9 11.5l-4 4 4 4"/>',
  cards: '<rect x="3.2" y="5.6" width="10.5" height="14.5" rx="2" transform="rotate(-10 8.4 12.8)"/><rect x="9.6" y="4" width="10.5" height="14.5" rx="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  hand: '<path d="M9.5 11.5V4.8a1.6 1.6 0 0 1 3.2 0v5.7"/><path d="M12.7 9.6a1.6 1.6 0 0 1 3.2 0v1.6"/><path d="M15.9 10.4a1.6 1.6 0 0 1 3.2 0v4.2c0 4-2.6 6.9-6.3 6.9h-.6c-2 0-3.5-.9-4.6-2.4l-3-4.2a1.7 1.7 0 0 1 2.6-2.2l1.5 1.6V11.5"/>',
  spin: '<path d="M4 12a8 8 0 0 1 14-5.3"/><path d="M18.5 3v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3"/><path d="M5.5 21v-4h4"/>',
};
const ico = (name, size = 24, fill = 'none') =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${fill}" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UI[name]}</svg>`;

/* ---------- Criaturas (SVG original, estilo adesivo) ---------- */
const BODY = [
  'M50 24C68 24 80 36 80 51C80 65 67 73 50 73C33 73 20 65 20 51C20 36 32 24 50 24Z',
  'M50 17C63 17 70 29 72 43C75 61 66 73 50 73C34 73 25 61 28 43C30 29 37 17 50 17Z',
  'M50 31C71 29 85 40 84 55C83 69 67 73 50 73C33 73 17 69 16 55C15 40 29 33 50 31Z',
  'M50 19C67 19 77 32 77 48V70L70.5 65L64 71L57 65L50 71L43 65L36 71L29.5 65L23 70V48C23 32 33 19 50 19Z',
];
function starPts(cx, cy, r) {
  let p = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `; }
  return p;
}
const starSVG = (cx, cy, r, fill, stroke) => `<polygon points="${starPts(cx, cy, r)}" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>`;
const sparkle = (x, y, r) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="#FFD731" stroke="#000" stroke-width="1.2"/>`;
const DECO = {
  fogo: t => `<circle cx="16" cy="14" r="14" fill="${t.deco}"/><circle cx="90" cy="66" r="18" fill="${t.deco}"/>`,
  agua: t => `<path d="M0 60q6-5 12.5 0t12.5 0 12.5 0 12.5 0 12.5 0 12.5 0 12.5 0 12.5 0V80H0z" fill="${t.deco}"/><circle cx="14" cy="18" r="4" fill="${t.deco}"/><circle cx="24" cy="10" r="2.5" fill="${t.deco}"/>`,
  planta: t => `<path d="M0 64Q22 50 50 62T100 58V80H0z" fill="${t.deco}"/><circle cx="84" cy="16" r="9" fill="${t.deco}"/>`,
  eletrico: t => `<path d="M0 0H30L18 80H0z" fill="${t.deco}" opacity=".7"/><path d="M70 0H100V80H84z" fill="${t.deco}" opacity=".7"/>`,
  fantasma: t => `<circle cx="82" cy="16" r="10" fill="${t.deco}"/><circle cx="86" cy="13" r="8.5" fill="${t.light}"/><circle cx="14" cy="12" r="1.5" fill="${t.deco}"/><circle cx="26" cy="20" r="1.2" fill="${t.deco}"/>`,
  sonho: t => `<path d="M-10 82A60 60 0 0 1 110 82" fill="none" stroke="${t.deco}" stroke-width="10"/><circle cx="12" cy="12" r="2" fill="${t.deco}"/><circle cx="90" cy="20" r="2.5" fill="${t.deco}"/>`,
};

function creatureSVG(c, sil) {
  const t = TYPES[c.type], b = c.b;
  const top = [24, 17, 31, 19][b], ey = [46, 40, 50, 42][b], ex = [11, 10, 13, 10][b];
  const S = sil ? 'none' : '#000', F = k => sil || k, ink = c.type === 'fantasma' ? '#fff' : '#000';
  let bg = '', back = '', front = '';
  if (!sil) bg = `<rect width="100" height="80" fill="${t.light}"/>${DECO[c.type](t)}<ellipse cx="50" cy="75.5" rx="26" ry="3.6" fill="rgba(0,0,0,.14)"/>`;
  switch (c.type) {
    case 'fogo': back = `<path d="M50 ${top - 15}c4 6 9 9 7 16-1 5-13 5-14 0-1-4 1-7 3-9 0 3 1 4 2 4-1-4 0-8 2-11z" fill="${F('#FFD731')}" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>`; break;
    case 'agua': back = `<path d="M43 ${top + 5}C44 ${top - 8} 53 ${top - 14} 63 ${top - 12}C57 ${top - 6} 57 ${top} 59 ${top + 5}Z" fill="${F('#BFE0FF')}" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>`;
      if (!sil) front = '<circle cx="82" cy="22" r="3.4" fill="#fff" stroke="#000" stroke-width="1.6"/><circle cx="88" cy="13" r="2.1" fill="#fff" stroke="#000" stroke-width="1.4"/>'; break;
    case 'planta': back = `<path d="M50 ${top + 3}V${top - 6}" stroke="${sil || '#000'}" stroke-width="2.4" stroke-linecap="round"/><path d="M50 ${top - 6}C44 ${top - 17} 33 ${top - 13} 36 ${top - 6}C40 ${top - 1} 46 ${top - 3} 50 ${top - 6}Z" fill="${F('#1FA463')}" stroke="${S}" stroke-width="2" stroke-linejoin="round"/><path d="M50 ${top - 6}C56 ${top - 19} 70 ${top - 15} 65 ${top - 6}C61 ${top} 54 ${top - 2} 50 ${top - 6}Z" fill="${F('#2FBF7A')}" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>`; break;
    case 'eletrico': back = `<path d="M50 ${top + 3}V${top - 5}" stroke="${sil || '#000'}" stroke-width="2.4" stroke-linecap="round"/><path d="M53 ${top - 19}L44 ${top - 7}h6l-2 7 9-11h-6l2-8z" fill="${F('#fff')}" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>`; break;
    case 'fantasma': if (!sil) front = '<circle cx="18" cy="24" r="3.2" fill="#E9CCFF" stroke="#000" stroke-width="1.5"/><circle cx="84" cy="34" r="2.3" fill="#E9CCFF" stroke="#000" stroke-width="1.4"/>'; break;
    case 'sonho': back = `<path d="M50 ${top + 3}C50 ${top - 4} 55 ${top - 7} 58 ${top - 10}" fill="none" stroke="${sil || '#000'}" stroke-width="2.2" stroke-linecap="round"/>${starSVG(60, top - 13, 6.5, F('#FFD731'), S)}`;
      if (!sil) front = sparkle(20, 24, 5) + sparkle(83, 30, 4); break;
  }
  const feet = b === 3 ? '' : `<ellipse cx="39" cy="73" rx="6.5" ry="3.6" fill="${F(t.body)}" stroke="${S}" stroke-width="2.2"/><ellipse cx="61" cy="73" rx="6.5" ry="3.6" fill="${F(t.body)}" stroke="${S}" stroke-width="2.2"/>`;
  const body = `<path d="${BODY[b]}" fill="${F(t.body)}" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>`;
  let face = '';
  if (!sil) {
    const eye = x => c.e === 0
      ? `<ellipse cx="${x}" cy="${ey}" rx="5.4" ry="6.4" fill="#fff" stroke="#000" stroke-width="2"/><circle cx="${x + .8}" cy="${ey + 1}" r="3.2" fill="#000"/><circle cx="${x + 2}" cy="${ey - 1.2}" r="1.2" fill="#fff"/>`
      : c.e === 1
        ? `<path d="M${x - 4.6} ${ey + 1.5}Q${x} ${ey - 4.5} ${x + 4.6} ${ey + 1.5}" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`
        : `<ellipse cx="${x}" cy="${ey}" rx="4.6" ry="5.8" fill="#000"/><circle cx="${x + 1.6}" cy="${ey - 2}" r="1.8" fill="#fff"/><circle cx="${x - 1.5}" cy="${ey + 2.2}" r=".9" fill="#fff"/>`;
    const mouth = c.e === 1
      ? `<path d="M45.5 ${ey + 8}Q50 ${ey + 14} 54.5 ${ey + 8}Z" fill="#7a1f3d" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
      : `<path d="M46 ${ey + 9}Q50 ${ey + 12.5} 54 ${ey + 9}" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`;
    face = `<ellipse cx="50" cy="${Math.min(ey + 18, 64)}" rx="${b === 2 ? 17 : 12}" ry="8" fill="${t.belly}"/>${eye(50 - ex)}${eye(50 + ex)}<ellipse cx="${50 - ex - 4}" cy="${ey + 8}" rx="3.6" ry="2.3" fill="#FF7FA8" opacity=".8"/><ellipse cx="${50 + ex + 4}" cy="${ey + 8}" rx="3.6" ry="2.3" fill="#FF7FA8" opacity=".8"/>${mouth}`;
  }
  return `<svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}${back}${feet}${body}${face}${front}</svg>`;
}

/* ---------- Carta, verso, bolso vazio, adesivos ---------- */
function cardHTML(c) {
  const t = TYPES[c.type];
  return `<div class="tcard" style="--tc:${t.c};--tl:${t.light}"><div class="tc-in">
    <div class="tc-head"><span class="tc-name">${c.name}</span><span class="tc-hp"><small>PV</small>${c.hp}</span></div>
    <div class="tc-art">${creatureSVG(c)}${c.holo ? '<i class="holo"></i>' : ''}</div>
    <div class="tc-move"><span class="tc-energy">${typeIcon(c.type, '100%', '#fff')}</span><span>${c.move}</span><b>${c.dmg}</b></div>
    <p class="tc-desc">${c.desc}</p>
    <div class="tc-foot"><span>#${pad(c.n)}</span><span>${RAR[c.r]}</span></div>
  </div><i class="tc-glare"></i></div>`;
}
const backHTML = mystery => `<div class="tback"><i class="tb-rings"></i><span class="tb-star">${sticker('sonho', '100%', '#FFD731')}</span>${mystery ? '<b class="tb-q">?</b>' : '<b class="tb-word">MEU<br>ÁLBUM</b>'}</div>`;
const ph = (c, sil) => `<span class="ph"><span class="ph-sil">${creatureSVG(c, sil)}</span><b class="ph-q">?</b><em class="ph-num">#${pad(c.n)}</em></span>`;
const badges = c => `${c.have > 1 ? `<span class="dup">×${c.have}</span>` : ''}${c.isNew && c.have ? '<span class="newb">NOVA</span>' : ''}`;
const stampHTML = cls => `<span class="stamp ${cls || ''}">${sticker('sonho', 22, '#FFD731')}Completei!</span>`;

/* ---------- Folhear: folhas que giram na lombada ---------- */
function makeFlipper({ host, count, render, back, enabled, onChange, axis = 'Y' }) {
  const rot = a => axis === 'Y' ? `rotateY(${a}deg)` : `rotateX(${-a}deg)`;
  host.innerHTML = Array.from({ length: count }, (_, i) =>
    `<div class="leaf leaf-${axis}" data-i="${i}" style="z-index:${count - i}"><div class="leaf-face leaf-front">${render(i)}<i class="leaf-shade"></i><i class="leaf-light"></i></div><div class="leaf-face leaf-back leaf-back-${axis}">${back}</div></div>`).join('');
  const leaves = [...host.children];
  let cur = 0, anim = null, drag = null, busy = false, dragged = false;
  const vis = () => leaves.forEach((l, i) => {
    l.style.transform = rot(i < cur ? -180 : 0);
    l.style.visibility = i === cur || i === cur + 1 ? 'visible' : 'hidden';
    l.querySelector('.leaf-shade').style.opacity = 0; l.querySelector('.leaf-light').style.opacity = 0;
  });
  const setA = (i, a) => {
    const l = leaves[i]; l.style.visibility = 'visible'; l.style.transform = rot(a);
    const k = Math.sin(Math.abs(a) * Math.PI / 180);
    l.querySelector('.leaf-light').style.opacity = (k * .35).toFixed(3);
    const under = leaves[i + 1];
    if (under) { under.style.visibility = 'visible'; under.querySelector('.leaf-shade').style.opacity = ((1 - Math.abs(a) / 180) * .5 * Math.min(1, Math.abs(a) / 20)).toFixed(3); }
  };
  const animate = (i, from, to, v, cfg, done) => {
    anim && anim.stop(); busy = true;
    anim = spring({ from, to, velocity: v, ...cfg, onUpdate: a => setA(i, a), onDone: () => { busy = false; done && done(); } });
  };
  const next = (v = 0, from = 0, cfg = M.defaultSpatial, cb) => {
    if (cur >= count - 1) { cb && cb(); return; }
    buzz(6); animate(cur, from, -180, v, cfg, () => { cur++; vis(); onChange(cur); cb && cb(); });
  };
  const prev = (v = 0, from = -180, cfg = M.defaultSpatial, cb) => {
    if (cur <= 0) { cb && cb(); return; }
    buzz(6); animate(cur - 1, from, 0, v, cfg, () => { cur--; vis(); onChange(cur); cb && cb(); });
  };
  const jump = t => {
    if (busy || t === cur) return;
    const step = () => { if (cur === t) return; (t > cur ? next : prev)(0, undefined, M.riffle, step); };
    step();
  };
  host.addEventListener('pointerdown', e => {
    if (busy || !enabled() || e.button > 0) return;
    drag = { x0: e.clientX, y0: e.clientY, id: e.pointerId, mode: null, a: 0, lastA: 0, lastT: performance.now(), v: 0, eff: host.getBoundingClientRect().width / host.offsetWidth };
  });
  host.addEventListener('pointermove', e => {
    if (!drag) return;
    const raw = axis === 'Y' ? e.clientX - drag.x0 : e.clientY - drag.y0;
    const cross = axis === 'Y' ? e.clientY - drag.y0 : e.clientX - drag.x0;
    const d = raw / drag.eff;
    if (!drag.mode) {
      if (Math.abs(d) < 8) return;
      if (Math.abs(cross / drag.eff) > Math.abs(d)) { drag = null; return; }
      drag.mode = d < 0 ? (cur < count - 1 ? 'next' : 'none') : (cur > 0 ? 'prev' : 'none');
      drag.lastA = drag.mode === 'prev' ? -180 : 0;
      try { host.setPointerCapture(drag.id); } catch (err) { /* ok */ }
      dragged = true;
    }
    if (drag.mode === 'none') return;
    const L = axis === 'Y' ? host.offsetWidth : host.offsetHeight;
    const a = drag.mode === 'next' ? clamp(d / L * 180, -180, 0) : clamp(-180 + d / L * 180, -180, 0);
    const now = performance.now(); drag.v = (a - drag.lastA) / Math.max(1, now - drag.lastT) * 1000; drag.lastA = a; drag.lastT = now; drag.a = a;
    setA(drag.mode === 'next' ? cur : cur - 1, a);
  });
  const end = () => {
    if (!drag) return;
    const d = drag; drag = null;
    if (d.mode === 'next') { (d.a < -70 || d.v < -350) ? next(d.v, d.a) : animate(cur, d.a, 0, d.v, M.defaultSpatial, vis); }
    else if (d.mode === 'prev') { (d.a > -110 || d.v > 350) ? prev(d.v, d.a) : animate(cur - 1, d.a, -180, d.v, M.defaultSpatial, vis); }
    setTimeout(() => { dragged = false; }, 60);
  };
  host.addEventListener('pointerup', end);
  host.addEventListener('pointercancel', end);
  vis();
  return { next: () => next(), prev: () => prev(), jump, get cur() { return cur; }, justDragged: () => dragged, leaf: i => leaves[i] };
}

/* ---------- Abrir / fechar: capa gira na lombada e o álbum cresce ---------- */
function bookCtl({ book, cover, C, O, onP, onOpenStart, onOpened, onCloseStart, onClosed, coverSpring = M.slowSpatial }) {
  const st = { a: 0, p: 0, open: false, busy: false };
  const setP = p => { st.p = p; book.style.transform = `translate(${lerp(C.x, O.x, p)}px,${lerp(C.y, O.y, p)}px) scale(${lerp(C.s, O.s, p)})`; onP && onP(p); };
  const setA = a => { st.a = a; cover.style.transform = `rotateY(${a}deg)`; };
  function open(v0 = 0) {
    if (st.busy || st.open) return;
    st.busy = true; onOpenStart && onOpenStart(); cover.style.visibility = 'visible';
    let started = false;
    spring({ from: st.a, to: -180, velocity: v0, ...coverSpring,
      onUpdate: a => { setA(a); if (!started && a < -95) { started = true; spring({ from: st.p, to: 1, ...M.defaultSpatial, onUpdate: setP }); } },
      onDone: () => { if (!started) setP(1); cover.style.visibility = 'hidden'; st.open = true; st.busy = false; onOpened && onOpened(); } });
  }
  function close() {
    if (st.busy || !st.open) return;
    st.busy = true; onCloseStart && onCloseStart();
    let started = false;
    const back = () => { started = true; cover.style.visibility = 'visible'; spring({ from: st.a, to: 0, ...coverSpring, onUpdate: setA, onDone: () => { st.open = false; st.busy = false; onClosed && onClosed(); } }); };
    spring({ from: st.p, to: 0, ...M.defaultSpatial, onUpdate: p => { setP(p); if (!started && p < .35) back(); }, onDone: () => { if (!started) back(); } });
  }
  setP(0); setA(0);
  return { st, setA, setP, open, close };
}
