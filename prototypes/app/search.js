/* Busca em todas as coleções (catálogo offline) com sugestões no menu da busca */
const SERIES_PT = {
  'Scarlet & Violet': 'Escarlate e Violeta', 'Sword & Shield': 'Espada e Escudo', 'Sun & Moon': 'Sol e Lua', 'Mega Evolution': 'Megaevolução',
  'Black & White': 'Preto e Branco', 'HeartGold & SoulSilver': 'HeartGold e SoulSilver', 'Diamond & Pearl': 'Diamante e Pérola', 'Platinum': 'Platina',
  'Other': 'Outras', 'POP': 'POP', 'NP': 'Promo', 'E-Card': 'e-Card', 'Gym': 'Ginásio', 'Neo': 'Neo', 'Base': 'Base', 'XY': 'XY', 'EX': 'EX',
};
const RMAP = {
  Common: 'c', Uncommon: 'u', Rare: 'r', 'Rare Holo': 'rh', 'Double Rare': 'dr', 'Illustration Rare': 'ir', 'Special Illustration Rare': 'sir',
  'Ultra Rare': 'ur', 'Rare Ultra': 'ur', 'Hyper Rare': 'hr', 'Rare Secret': 'hr', 'Rare Rainbow': 'hr', 'Mega Hyper Rare': 'hr',
  'Rare Holo ex': 'rx', 'Rare Holo EX': 'rx', 'Rare Holo GX': 'rx', 'Rare Holo V': 'rx', 'Holo Rare V': 'rx', 'Rare Holo VMAX': 'rx', 'Holo Rare VMAX': 'rx',
  'Rare Holo VSTAR': 'rx', 'Holo Rare VSTAR': 'rx', 'Rare Holo LV.X': 'rx', 'Rare Prime': 'rx', LEGEND: 'rx', 'Rare BREAK': 'rx', 'Rare Prism Star': 'rx', 'Rare Holo Star': 'rx',
  'Rare ACE': 'ace', 'ACE SPEC Rare': 'ace', 'Shiny Rare': 'sh', 'Shiny Ultra Rare': 'sh', 'Rare Shiny': 'sh', 'Rare Shiny GX': 'sh', 'Rare Shining': 'sh',
  'Radiant Rare': 'rr', 'Trainer Gallery Rare Holo': 'tg', 'Amazing Rare': 'am', Promo: 'p', '': 'n',
};
const TYPEMAP = { Grass: 'planta', Fire: 'fogo', Water: 'agua', Lightning: 'eletrico', Psychic: 'psiquico', Fighting: 'lutador', Darkness: 'sombrio', Metal: 'metal', Dragon: 'dragao', Colorless: 'incolor', Fairy: 'fada', Trainer: 'treinador', Energy: 'energia' };
Object.assign(RARITY, {
  rh: { l: 'Rara Holo', s: '★' }, rx: { l: 'Rara Holo especial', s: '★' }, ur: { l: 'Ultra Rara', s: '★★' }, hr: { l: 'Hiper Rara', s: '★★★', gold: true },
  sh: { l: 'Brilhante', s: '✦' }, rr: { l: 'Radiante', s: '✦' }, tg: { l: 'Galeria de Treinador', s: '★' }, am: { l: 'Incrível', s: '★' },
  ace: { l: 'ACE SPEC', s: '✦' }, p: { l: 'Promo', s: '✦' }, x: { l: 'Especial', s: '★' }, n: { l: 'Sem raridade', s: '·' },
});
['rh', 'rx', 'ur', 'hr', 'sh', 'rr', 'tg', 'am', 'ace', 'x'].forEach(k => { FOIL[k] = 'Holo'; });
Object.assign(TYPE_PT, { lutador: 'Lutador', sombrio: 'Sombrio', metal: 'Metal', dragao: 'Dragão', fada: 'Fada', treinador: 'Treinador', energia: 'Energia' });

const numNorm = s => String(s).toLowerCase().replace(/^0+(?=\d)/, '');
const CAT = (() => {
  const sets = CATALOG.sets.map(([id, name, series, total, year, code], i) => ({
    id, i, name, series: SERIES_PT[series] || series, total, year, code: code || id.toUpperCase(), count: 0, nameN: norm(`${name} ${code || ''}`),
  }));
  const cards = [], byId = new Map();
  CATALOG.cards.forEach((rows, si) => {
    sets[si].count = rows.length;
    rows.forEach(([name, number, ri, ti]) => { const e = { name, number, si, ri, ti, nameN: norm(name) }; cards.push(e); byId.set(`${sets[si].id}-${number}`, e); });
  });
  return { sets, cards, byId };
})();
CAT.sets.forEach(s => { SETS_BY_ID[s.id] = s; });
SETS_BY_ID.sv3pt5 = { ...SETS_BY_ID.sv3pt5, series: 'Escarlate e Violeta' };

const entryId = e => `${CAT.sets[e.si].id}-${e.number}`;
const tempCard = e => {
  const s = CAT.sets[e.si], r = RMAP[CATALOG.rarities[e.ri]] || 'x';
  return { id: `${s.id}-${e.number}`, n: -1, name: e.name, number: e.number, set: s.id, hp: '', type: TYPEMAP[CATALOG.types[e.ti]] || 'incolor', r, artist: '', dex: null, have: 0, trade: 0, holo: false };
};
let NEXT_N = 100000;
function cardById(id) { const c = DATA.find(x => x.id === id); if (c) return c; const e = CAT.byId.get(id); return e ? tempCard(e) : null; }
function ensureCard(id) {
  let c = DATA.find(x => x.id === id); if (c) return c;
  const e = CAT.byId.get(id); if (!e) return null;
  c = { ...tempCard(e), n: NEXT_N++, cond: null, lang: null, variant: null, isNew: false };
  DATA.push(c); return c;
}

/* Busca: nome, número ("6", "006", "006/165", "TG05") e nome da coleção, em qualquer combinação */
function searchCatalog(q, limit = 6) {
  const toks = norm(q).trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return { sets: [], cards: [], total: 0, all: [] };
  const isNum = t => /\d/.test(t) && /^#?[a-z]{0,6}\d+[a-z]?(\/[a-z]{0,6}\d+)?$/.test(t);
  const numTok = toks.find(isNum), words = toks.filter(t => t !== numTok);
  let num = null, tot = null;
  if (numTok) { const [a, b] = numTok.replace('#', '').split('/'); num = numNorm(a); tot = b ? +numNorm(b.replace(/\D/g, '')) || null : null; }
  const sets = words.length && !numTok ? CAT.sets.filter(s => words.every(w => s.nameN.includes(w))).slice(0, 2) : [];
  const res = [];
  for (const c of CAT.cards) {
    const s = CAT.sets[c.si];
    if (num !== null && (numNorm(c.number) !== num || (tot && s.total !== tot))) continue;
    let score = 0, ok = true;
    for (const w of words) {
      const i = c.nameN.indexOf(w);
      if (i === 0) continue;
      if (i > 0) { score += c.nameN[i - 1] === ' ' ? 1 : 2; continue; }
      if (s.nameN.includes(w)) { score += 3; continue; }
      ok = false; break;
    }
    if (ok) res.push([score, c]);
  }
  res.sort((a, b) => a[0] - b[0] || a[1].si - b[1].si || (parseInt(a[1].number, 10) || 0) - (parseInt(b[1].number, 10) || 0));
  return { sets, cards: res.slice(0, limit).map(x => x[1]), total: res.length, all: res.map(x => x[1]), words };
}
const setCards = (si, limit = 60) => CAT.cards.filter(c => c.si === si).slice(0, limit);
const hl = (name, words) => {
  const nn = norm(name); for (const w of words || []) { const i = nn.indexOf(w); if (i >= 0) return `${name.slice(0, i)}<mark>${name.slice(i, i + w.length)}</mark>${name.slice(i + w.length)}`; }
  return name;
};
const searchBox = (id, ph) => `<div class="search-wrap"><label class="search" for="${id}">${ico('search', 22)}<input id="${id}" type="search" placeholder="${ph}" autocomplete="off" enterkeyhint="search" role="combobox" aria-expanded="false" aria-controls="${id}-sg"></label><div class="sugg" id="${id}-sg" role="listbox" hidden></div></div>`;

/* Menu de sugestões preso a um campo de busca */
function attachSuggest(input, { onPick, onSet, onAll, limit = 6 }) {
  const box = input.closest('.search-wrap').querySelector('.sugg');
  let last = null, timer = 0;
  const hide = () => { box.hidden = true; input.setAttribute('aria-expanded', 'false'); };
  const render = () => {
    const q = input.value; if (!q.trim()) { hide(); return; }
    last = searchCatalog(q, limit);
    const r = last;
    if (!r.total && !r.sets.length) { box.innerHTML = `<p class="sg-empty">Nada com “${q}”. Tente o nome, o número (006) ou o número com o total (006/165).</p>`; }
    else {
      box.innerHTML = `${r.sets.map(s => `<button class="sg-row sg-set" data-set="${s.i}" role="option">${ico('album', 22)}<span class="sg-txt"><b>${hl(s.name, r.words)}</b><em>Coleção · ${s.series} · ${s.year} · ${s.count} cartas</em></span></button>`).join('')}
        ${r.cards.map((e, i) => { const c = tempCard(e), s = CAT.sets[e.si]; return `<button class="sg-row" data-ci="${i}" role="option"><span class="sg-thumb">${cardHTML(c)}</span><span class="sg-txt"><b>${hl(e.name, r.words)}</b><em>${s.name} · ${numStr(c)} · ${RARITY[c.r].l}</em></span></button>`; }).join('')}
        ${r.total > r.cards.length ? `<button class="sg-all" data-all>Ver todas as ${r.total.toLocaleString('pt-BR')} cartas</button>` : ''}`;
    }
    box.hidden = false; input.setAttribute('aria-expanded', 'true');
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 90); });
  input.addEventListener('focus', render);
  input.addEventListener('blur', () => setTimeout(hide, 160));
  input.addEventListener('keydown', e => { if (e.key === 'Escape') { hide(); e.stopPropagation(); } if (e.key === 'Enter' && last && onAll) { hide(); input.blur(); onAll(input.value, last); } });
  box.addEventListener('pointerdown', e => e.preventDefault());
  box.addEventListener('click', e => {
    const s = e.target.closest('[data-set]'), c = e.target.closest('[data-ci]'), a = e.target.closest('[data-all]');
    if (!s && !c && !a) return;
    hide(); input.blur(); buzz(6);
    if (c) onPick(entryId(last.cards[+c.dataset.ci]));
    else if (s && onSet) onSet(CAT.sets[+s.dataset.set]);
    else if (a && onAll) onAll(input.value, last);
  });
  return { render, hide };
}
