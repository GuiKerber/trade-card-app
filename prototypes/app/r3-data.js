/* Coleção da Lia sobre cartas reais + dados no formato de anúncio de marketplace
   (nome · coleção e número · raridade · variante · condição · idioma · quantidade · ilustrador) */
const SET = { name: '151', series: 'Escarlate e Violeta', total: 165, code: 'MEW' };
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
    return { ...x, have, cond: cond || null, lang: lang || null, variant: variant || null, isNew: false, holo: !!variant && variant !== 'Normal' };
  });
}
resetData();
const total = () => DATA.length;
const numStr = c => `${pad(c.n)}/${SET.total}`;
const imgSrc = c => (window.CARD_BASE ? `${window.CARD_BASE}${c.n}.png` : `cards/${c.id}.webp`);

/* Miniatura da carta real (com moldura de reserva enquanto a imagem não existe) */
function cardHTML(c) {
  return `<div class="rcard" data-r="${c.r}"><span class="rc-fb"><b>${c.name}</b><em>${numStr(c)}</em></span><img src="${imgSrc(c)}" alt="${c.name}" draggable="false" onerror="this.remove()">${c.holo ? '<i class="holo"></i>' : ''}<i class="tc-glare"></i></div>`;
}
function ph(c) {
  return `<span class="ph rghost"><span class="rcard" data-r="${c.r}"><span class="rc-fb"><b>${c.name}</b><em>${numStr(c)}</em></span><img src="${imgSrc(c)}" alt="" draggable="false" onerror="this.remove()"></span><em class="ph-num">${pad(c.n)}</em></span>`;
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
  const row = (k, v) => `<div class="ls-row"><dt>${k}</dt><dd>${v}</dd></div>`;
  return `<div class="listing">
    <p class="ls-set"><span class="ls-code">${SET.code}</span>${SET.name} · ${SET.series}</p>
    <h2 class="sh-title" id="shTitle">${c.name}</h2>
    <p class="ls-num"><b>${numStr(c)}</b><span class="ls-rar${r.gold ? ' gold' : ''}">${r.s}</span>${r.l}</p>
    <dl class="ls-grid">
      ${owned ? row('Variante', c.variant) : row('Tipo', TYPE_PT[c.type])}
      ${owned ? row('Condição', `<span class="cond">${c.cond}</span> ${COND[c.cond]}`) : row('PS', c.hp)}
      ${owned ? row('Idioma', `${c.lang} · ${LANG[c.lang]}`) : row('Pokédex', `#${pad(c.dex)}`)}
      ${row('Ilustração', c.artist)}
    </dl>
  </div>`;
}
