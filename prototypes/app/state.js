/* Estado da v1: cartas pra troca, amigos, pedidos, loja (capas e adesivos) e a capa do álbum */

// Ícones extras para os adesivos da loja
Object.assign(IC, {
  coracao: '<path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/>',
  coroa: '<path d="M4 18 3 7.5l5 4 4-6.5 4 6.5 5-4-1 10.5z"/>',
  lua: '<path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z"/>',
  nuvem: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 17.8 9a4.8 4.8 0 0 1-.3 9.5z"/>',
});
Object.assign(UI, {
  bag: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
  shield: '<path d="M12 3 5 6v5.5c0 4.5 3 7.8 7 9.5 4-1.7 7-5 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
});

// Cartas que a Lia já marcou pra troca (as repetidas)
const TRADE0 = { 4: 1, 25: 1, 129: 1, 133: 1 };
function resetTrade() { DATA.forEach(c => { c.trade = TRADE0[c.n] || 0; }); }
resetTrade();

const ME = { name: 'Lia', code: 'ESTRELA-264' };
const PLACES = { escola: 'Na escola', parque: 'No parque', clube: 'No clube' };
const DAYS = ['Amanhã', 'Sábado', 'Domingo'], PERIODS = ['manhã', 'tarde'];
let FRIENDS, REQS, WISH;
const NEW_FRIEND = { id: 'lucas', name: 'Lucas', code: 'NUVEM-357', color: '#FFC8E6', offers: [199, 35] };
function resetSocial() {
  FRIENDS = [
    { id: 'theo', name: 'Theo', code: 'SOL-482', color: '#FFE38A', offers: [3, 26, 39] },
    { id: 'bia', name: 'Bia', code: 'LUA-731', color: '#E3CCFF', offers: [94, 133, 52] },
    { id: 'davi', name: 'Davi', code: 'RAIO-205', color: '#A9DCFF', offers: [168, 129, 8] },
    { id: 'manu', name: 'Manu', code: 'FOLHA-918', color: '#B4F5DC', offers: [150, 54] },
  ];
  REQS = [
    { id: 1, friend: 'bia', give: 25, get: 94, where: 'escola', when: 'Amanhã · manhã', status: 'new' },
    { id: 2, friend: 'theo', give: 4, get: 26, where: 'parque', when: 'Sábado · tarde', status: 'ok' },
  ];
  WISH = new Set([199]);
}
resetSocial();
const friendById = id => FRIENDS.find(f => f.id === id);
const offers = () => FRIENDS.flatMap(f => f.offers.map(n => ({ f, c: byN(n) })));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Loja: 10 capas e 10 adesivos (preço em centavos; 0 = grátis)
const SKINS = [
  { id: 'arco', name: 'Arco-íris', price: 0, f: ['#ffd6e8', '#fff3c4', '#c9f7e3', '#cfe6ff', '#e6d4ff'], spine: '#1d1a26' },
  { id: 'aurora', name: 'Aurora', price: 0, f: ['#c9f7e3', '#b8f0ff', '#cfd8ff', '#e2ccff', '#d6fff0'], spine: '#123a3a' },
  { id: 'sol', name: 'Pôr do sol', price: 390, f: ['#ffd1a8', '#ffb3c1', '#ffe39a', '#ffc4e1', '#ffcaa0'], spine: '#4a1d2a' },
  { id: 'oceano', name: 'Oceano', price: 390, f: ['#bfe9ff', '#9fd8ff', '#b9fff1', '#a9c8ff', '#c8f2ff'], spine: '#0f2a4a' },
  { id: 'galaxia', name: 'Galáxia', price: 590, f: ['#3a2a7a', '#6a2a96', '#24408a', '#8a2a7e', '#2a2466'], spine: '#0d0a1a', word: 'rgba(255, 255, 255, .85)' },
  { id: 'algodao', name: 'Algodão-doce', price: 390, f: ['#ffd6f0', '#f3d6ff', '#d6e6ff', '#ffe0f0', '#ffe8f6'], spine: '#5a2a5a' },
  { id: 'floresta', name: 'Floresta', price: 390, f: ['#d4f5c4', '#b8ebd0', '#e8f7b0', '#c0e8c8', '#dff7cf'], spine: '#1f3a24' },
  { id: 'vulcao', name: 'Vulcão', price: 590, f: ['#ff9a7a', '#ffcf6e', '#ff7a9a', '#ffb36e', '#ff8a6a'], spine: '#2a0f0a' },
  { id: 'gelo', name: 'Gelo', price: 390, f: ['#f4fbff', '#dff1ff', '#eef4ff', '#e3f7ff', '#f8fdff'], spine: '#3a4a5a' },
  { id: 'ouro', name: 'Ouro', price: 990, f: ['#fff1b8', '#f5d27a', '#fff6d6', '#e8c060', '#fff0c0'], spine: '#3a2a0a' },
];
const STICKERS = [
  { id: 'chama', name: 'Chama', icon: 'fogo', fill: '#FB4903', price: 0 },
  { id: 'gota', name: 'Gota', icon: 'agua', fill: '#4DA2FF', price: 0 },
  { id: 'folha', name: 'Folha', icon: 'planta', fill: '#55DB9C', price: 0 },
  { id: 'raio', name: 'Raio holo', icon: 'eletrico', fill: 'url(#r3dVivid)', price: 0, holo: true },
  { id: 'estrela', name: 'Estrela holo', icon: 'sonho', fill: 'url(#r3dVivid)', price: 0, holo: true },
  { id: 'fantasma', name: 'Fantasminha', icon: 'fantasma', fill: '#5C4ADE', price: 190 },
  { id: 'coracao', name: 'Coração holo', icon: 'coracao', fill: 'url(#r3dVivid)', price: 290, holo: true },
  { id: 'coroa', name: 'Coroa', icon: 'coroa', fill: '#FFD731', price: 290 },
  { id: 'lua', name: 'Lua', icon: 'lua', fill: '#E9CCFF', price: 190 },
  { id: 'nuvem', name: 'Nuvem', icon: 'nuvem', fill: '#ffffff', price: 190 },
];
let COVER;
function resetStore() {
  SKINS.forEach(k => { k.owned = k.price === 0; });
  STICKERS.forEach(s => { s.owned = s.price === 0; });
  COVER = { skin: 'arco', stickers: [{ id: 'raio', x: 234, y: 330, r: 12 }, { id: 'estrela', x: 46, y: 336, r: -10 }] };
}
resetStore();
const MAX_STICKERS = 6;
const priceStr = c => (c ? `R$ ${(c / 100).toFixed(2).replace('.', ',')}` : 'Grátis');
const skinOf = id => SKINS.find(k => k.id === id);
const stkOf = id => STICKERS.find(s => s.id === id);
function applySkin(el, id = COVER.skin) {
  const k = skinOf(id);
  k.f.forEach((c, i) => el.style.setProperty(`--f${i + 1}`, c));
  el.style.setProperty('--spine', k.spine);
  el.style.setProperty('--word', k.word || 'rgba(23, 20, 31, .62)');
}

// Capa do álbum montada a partir da capa e dos adesivos escolhidos
const stkOnCover = (s, i) => { const st = stkOf(s.id); return `<span class="r3c-stk" data-si="${i}" style="left:${s.x}px;top:${s.y}px;--r:${s.r}deg">${sticker(st.icon, 54, st.fill)}${st.holo ? '<i class="r3c-stk-foil"></i>' : ''}</span>`; };
function coverFaceHTML() {
  return `<div class="face r3c-cf"><i class="r3c-foil"></i><i class="r3c-lines"></i><i class="r3c-glitter"></i><i class="r3c-glare"></i><i class="r3c-stitch"></i>
    <div class="r3c-ball">${R3_BALL}</div><div class="r3c-word">MEU ÁLBUM</div>
    ${COVER.stickers.map(stkOnCover).join('')}</div>`;
}
R3_COVERS.holo = () => `${coverFaceHTML()}<div class="face r3c-ci"><div class="v1-plate"><small>Este álbum é da</small><b>Lia</b></div></div>`;

// Selo "pra troca" no bolso
const TRADE_ICO = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5h14.5M15 4.5l4 4-4 4M20 15.5H5.5M9 11.5l-4 4 4 4"/></svg>';
const badgesBase = badges;
badges = c => `${badgesBase(c)}${c.have && c.trade ? `<span class="ttag" title="Pra troca">${TRADE_ICO}</span>` : ''}`;
const avatar = (f, size = 36) => `<span class="fav" style="--fc:${f.color};width:${size}px;height:${size}px;font-size:${Math.round(size * .46)}px" aria-hidden="true">${f.name[0]}</span>`;
const thumb = (c, cls = '') => `<span class="mini ${cls}">${cardHTML(c)}</span>`;

// O álbum é infinito: sempre existe uma folha nova, vazia, no fim
R3_PAGES.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
