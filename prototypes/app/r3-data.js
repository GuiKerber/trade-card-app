/* Coleção da Lia sobre cartas reais + dados no formato de anúncio de marketplace
   (nome · coleção e número · raridade · variante · condição · idioma · quantidade · ilustrador) */
const SET = { name: '151', series: 'Escarlate e Violeta', total: 165, code: 'MEW' };
const SETS_BY_ID = {};
const setOf = c => SETS_BY_ID[c.set] || SET;
const REAL_IDS = new Set(REAL.map(x => x.id));
const RARITY = {
  c: { l: 'Comum', s: '●' }, u: { l: 'Incomum', s: '◆' }, r: { l: 'Rara', s: '★' },
  dr: { l: 'Rara Dupla', s: '★★' }, ir: { l: 'Ilustração Rara', s: '★', gold: true }, sir: { l: 'Ilustração Rara Especial', s: '★★', gold: true },
};
const COND = { NM: 'Novinha', LP: 'Pouco usada', MP: 'Usada', HP: 'Bem usada' };
const LANG = { PT: 'Português', EN: 'Inglês', JP: 'Japonês' };
const TYPE_PT = { planta: 'Planta', fogo: 'Fogo', agua: 'Água', eletrico: 'Elétrico', psiquico: 'Psíquico', incolor: 'Incolor' };
// n: [quantidade, condição, idioma, variante]
const OWN0 = {
  1: [1, 'NM', 'PT', 'Normal'], 2: [1, 'NM', 'PT', 'Normal'], 3: [0], 4: [2, 'LP', 'PT', 'Normal'], 5: [1, 'NM', 'PT', 'Normal'],
  6: [1, 'NM', 'PT', 'Holo'], 7: [1, 'NM', 'PT', 'Reverse Poké Ball'], 8: [1, 'LP', 'EN', 'Normal'], 9: [1, 'NM', 'PT', 'Holo'],
  25: [3, 'MP', 'EN', 'Normal'], 26: [0], 35: [1, 'NM', 'PT', 'Normal'], 39: [1, 'NM', 'PT', 'Normal'], 52: [1, 'LP', 'PT', 'Normal'],
  54: [1, 'NM', 'PT', 'Reverse Master Ball'], 92: [1, 'NM', 'JP', 'Normal'], 93: [1, 'NM', 'PT', 'Normal'], 94: [0],
  129: [2, 'NM', 'PT', 'Normal'], 133: [2, 'NM', 'PT', 'Normal'], 143: [1, 'LP', 'PT', 'Normal'], 150: [0], 151: [1, 'NM', 'PT', 'Holo'],
  166: [1, 'NM', 'PT', 'Holo'], 168: [0], 170: [1, 'NM', 'EN', 'Holo'], 199: [0],
};
const FOIL = { dr: 'Holo', ir: 'Holo', sir: 'Holo', r: 'Holo' };
function resetData() {
  DATA = REAL.map(x => {
    const [have, cond, lang, variant] = OWN0[x.n] || [0];
    return { ...x, number: String(x.n), set: 'sv3pt5', have, cond: cond || null, lang: lang || null, variant: variant || null, isNew: false, holo: !!variant && variant !== 'Normal' };
  });
}
resetData();
const total = () => DATA.length;
const fmtNum = v => (/^\d+$/.test(v) ? v.padStart(3, '0') : v);
const numStr = c => `${fmtNum(String(c.number ?? c.n))}/${setOf(c).total}`;
const imgSrc = c => (window.CARD_BASE || !REAL_IDS.has(c.id) ? `https://images.pokemontcg.io/${c.set || 'sv3pt5'}/${c.number || c.n}.png` : `cards/${c.id}.webp`);

/* Miniatura da carta real (com moldura de reserva enquanto a imagem não existe) */
const TCOL = { planta: '#6CC35A', fogo: '#F27A3C', agua: '#4EA3E6', eletrico: '#F5CF2E', psiquico: '#B37AD6', lutador: '#C9834E', sombrio: '#4A5664', metal: '#A3AEBB', dragao: '#BFA23A', fada: '#EE8FC4', incolor: '#CFCAB8', treinador: '#93A3B8', energia: '#C2BBD6' };
const FB_BALL = '<svg class="fb-ball" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><path d="M3 20h11.5M25.5 20H37"/><circle cx="20" cy="20" r="5.5"/></svg>';
/* Moldura de reserva: aparece quando a foto da carta não carrega (sem internet ou bloqueada) */
const fbHTML = c => `<span class="rc-fb" style="--tc:${TCOL[c.type] || TCOL.incolor}"><b>${c.name}</b><span class="fb-art">${FB_BALL}</span><em>${numStr(c)}<small>${setOf(c).code || ''}</small></em></span>`;
function cardHTML(c) {
  return `<div class="rcard" data-r="${c.r}">${fbHTML(c)}<img src="${imgSrc(c)}" alt="${c.name}" draggable="false" onerror="this.remove()">${c.holo ? '<i class="holo"></i>' : ''}<i class="tc-glare"></i></div>`;
}
function ph(c) {
  return `<span class="ph rghost"><span class="rcard" data-r="${c.r}">${fbHTML(c)}<img src="${imgSrc(c)}" alt="" draggable="false" onerror="this.remove()"></span><em class="ph-num">${pad(c.n)}</em></span>`;
}
function badges(c) {
  if (!c.have) return '';
  const v = c.variant && c.variant !== 'Normal' ? `<span class="vtag" title="${c.variant}">${c.variant.startsWith('Reverse') ? 'R' : '✦'}</span>` : '';
  const l = c.lang && c.lang !== 'PT' ? `<span class="ltag">${c.lang}</span>` : '';
  return `${c.have > 1 ? `<span class="dup">×${c.have}</span>` : ''}${v}${l}${c.isNew ? '<span class="newb">NOVA</span>' : ''}`;
}
function aria(c) {
  return c.have > 0 ? `${c.name}, ${numStr(c)}, ${RARITY[c.r].l}${c.have > 1 ? `, você tem ${c.have}` : ''}` : `${c.name}, ${numStr(c)}, falta essa`;
}

/* Bloco de anúncio, no formato que TCGplayer, Cardmarket e Liga Pokémon usam */
function listingHTML(c, owned) {
  const r = RARITY[c.r];
  const row = (k, v) => `<div class="ls-row"><dt>${k}</dt><dd>${v || '—'}</dd></div>`;
  return `<div class="listing">
    <p class="ls-set"><span class="ls-code">${setOf(c).code}</span>${setOf(c).name} · ${setOf(c).series}</p>
    <h2 class="sh-title" id="shTitle">${c.name}</h2>
    <p class="ls-num"><b>${numStr(c)}</b><span class="ls-rar${r.gold ? ' gold' : ''}">${r.s}</span>${r.l}</p>
    <dl class="ls-grid">
      ${owned ? row('Variante', c.variant) : row('Tipo', TYPE_PT[c.type])}
      ${owned ? row('Condição', `<span class="cond">${c.cond}</span> ${COND[c.cond]}`) : row('PS', c.hp)}
      ${owned ? row('Idioma', `${c.lang} · ${LANG[c.lang]}`) : row('Pokédex', c.dex ? `#${pad(c.dex)}` : '')}
      ${row('Ilustração', c.artist)}
    </dl>
  </div>`;
}
