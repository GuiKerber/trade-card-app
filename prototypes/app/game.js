/* Conquistas: ranking de trocas entre amigos, insígnias por número de trocas e a loja */

Object.assign(IC, {
  rocha: '<path d="M4.5 17.5 7 9l6-3.8 6 4.3 1 8z"/><path d="M7 9l5 3.2 1-7M12 12.2l-2 5.3M12 12.2l7.8-2.4" fill="none"/>',
  espiral: '<path d="M12 12.4a1.7 1.7 0 1 1 1.8-1.9 3.5 3.5 0 1 1-3.7 3.9 5.4 5.4 0 1 1 5.8-6.1" fill="none"/>',
  monte: '<path d="M2.5 19.5 9 8l3.6 5.6L15 10l6.5 9.5z"/><path d="M7.3 11 9 12.6l1.6-1.5" fill="none"/>',
});
Object.assign(UI, {
  trofeu: '<path d="M8 4.5h8V10a4 4 0 0 1-8 0z"/><path d="M8 6.5H5.5a3 3 0 0 0 3 4.2M16 6.5h2.5a3 3 0 0 1-3 4.2"/><path d="M12 14v3M9 20.5h6v-3.5H9z"/>',
});

// Uma insígnia a cada marco de trocas. Desenhos originais: forma + ícone do tipo.
const BADGES = [
  { id: 'pedra', name: 'Pedra', need: 10, c: '#D6BF92', c2: '#9C7F55', shape: 'hex', icon: 'rocha' },
  { id: 'agua', name: 'Água', need: 25, c: '#8CCBFF', c2: '#2F7FD8', shape: 'drop', icon: 'agua' },
  { id: 'raio', name: 'Raio', need: 50, c: '#FFE97A', c2: '#E8B400', shape: 'star', icon: 'eletrico' },
  { id: 'planta', name: 'Planta', need: 75, c: '#8BEBB8', c2: '#2FAE6E', shape: 'flower', icon: 'planta' },
  { id: 'psiquica', name: 'Psíquica', need: 100, c: '#FFB3DE', c2: '#D45BA5', shape: 'circle', icon: 'espiral' },
  { id: 'fogo', name: 'Fogo', need: 150, c: '#FFAA70', c2: '#E2490F', shape: 'flame', icon: 'fogo' },
  { id: 'terra', name: 'Terra', need: 200, c: '#E8B98A', c2: '#A5683A', shape: 'shield', icon: 'monte' },
  { id: 'dragao', name: 'Dragão', need: 300, c: '#C4B0FF', c2: '#6A4BE0', shape: 'gem', icon: 'sonho' },
];
const badgeOf = n => BADGES.filter(b => n >= b.need).pop() || null;   // última insígnia ganha
const nextBadge = n => BADGES.find(b => n < b.need) || null;

const BSHAPE = (() => {
  const P = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join(' ');
  const pt = (a, r, cx = 32, cy = 33) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  const star = `M${P(16, i => `${pt(-Math.PI / 2 + i * Math.PI / 8, i % 2 ? 22 : 30)}L`).replace(/L$/, '')}z`;
  const flower = `M${pt(-Math.PI / 2, 22)} ${P(6, i => `Q${pt(-Math.PI / 2 + (i + .5) * Math.PI / 3, 40)} ${pt(-Math.PI / 2 + (i + 1) * Math.PI / 3, 22)}`)}z`;
  return {
    hex: 'M32 3 57 17.5v31L32 63 7 48.5v-31z',
    drop: 'M32 2C26 14 9 25 9 40a23 23 0 0 0 46 0C55 25 38 14 32 2z',
    star, flower,
    circle: 'M32 4a29 29 0 1 1 0 58a29 29 0 1 1 0-58z',
    flame: 'M32 1c5 11 22 18 22 38a22 22 0 0 1-44 0c0-10 6-17 10-21 0 7 3 10 7 11-1-11 1-20 5-28z',
    shield: 'M32 3 58 11v20c0 16-11 27-26 32C17 58 6 47 6 31V11z',
    gem: 'M32 2 60 31 32 63 4 31z',
  };
})();
function badgeSVG(b, size = 64, on = true) {
  const g = `bg-${b.id}-${on ? 1 : 0}`, d = BSHAPE[b.shape];
  return `<svg class="bsvg${on ? ' on' : ''}" viewBox="-2 -2 68 72" width="${size}" height="${Math.round(size * 72 / 68)}" aria-hidden="true">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="${on ? b.c : '#EEEAF6'}"/><stop offset="1" stop-color="${on ? b.c2 : '#C9C3D9'}"/></linearGradient></defs>
    <path d="${d}" transform="translate(0 4)" fill="${on ? '#2a1a7a' : '#B9B2CC'}"/>
    <path d="${d}" fill="url(#${g})" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2" transform="translate(32 33) scale(.8) translate(-32 -33)"/>
    <svg x="18" y="19" width="28" height="28" viewBox="0 0 24 24" fill="${on ? '#fff' : '#F6F4FA'}" stroke="${on ? '#000' : '#9A92B4'}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${IC[b.icon]}</svg>
    ${on ? '<ellipse cx="22" cy="17" rx="9" ry="4" fill="rgba(255,255,255,.6)" transform="rotate(-32 22 17)"/>' : ''}</svg>`;
}

const GAME_UI = { tab: 'ranking' };
function mountGame(stage, api) {
  const seg = `<div class="segin" role="tablist" aria-label="Conquistas">${[['ranking', 'Ranking'], ['insignias', 'Insígnias'], ['loja', 'Loja']].map(([k, l]) => `<button role="tab" data-gt="${k}" aria-selected="${k === GAME_UI.tab}">${l}</button>`).join('')}</div>`;
  stage.addEventListener('click', e => {
    const t = e.target.closest('[data-gt]'); if (!t) return;
    if (t.dataset.gt !== GAME_UI.tab) { GAME_UI.tab = t.dataset.gt; buzz(4); api.remount(); }
  });
  if (GAME_UI.tab === 'loja') return mountStore(stage, api, seg);
  stage.className = 'stage page';

  const next = nextBadge(ME.trades), have = badgeOf(ME.trades), prev = have ? have.need : 0;
  const pct = next ? Math.round((ME.trades - prev) / (next.need - prev) * 100) : 100;
  const hero = `<div class="gm-hero">
      <div class="gm-me">${avatar(ME, 52)}<div><b>${ME.trades}</b><span>${ME.trades === 1 ? 'troca feita' : 'trocas feitas'}</span></div>${have ? `<span class="gm-cur" title="${have.name}">${badgeSVG(have, 40)}</span>` : ''}</div>
      ${next ? `<div class="gm-next">${badgeSVG(next, 40, false)}<div class="gm-nt"><small>Próxima insígnia</small><b>${next.name}</b><span class="gm-bar"><i style="width:${pct}%"></i></span><em>${ME.trades} de ${next.need} · ${next.need - ME.trades === 1 ? 'falta 1 troca' : `faltam ${next.need - ME.trades} trocas`}</em></div></div>`
        : '<p class="gm-all">Você ganhou todas as insígnias!</p>'}</div>`;

  let body;
  if (GAME_UI.tab === 'ranking') {
    const all = [{ ...ME, me: true }, ...FRIENDS].sort((a, b) => b.trades - a.trades);
    const pod = [all[1], all[0], all[2]].filter(Boolean);
    const place = p => all.indexOf(p) + 1;
    body = `${hero}<h3 class="pg-h">Quem mais trocou</h3>
      <div class="podium">${pod.map(p => `<div class="pd pd-${place(p)}${p.me ? ' me' : ''}">${place(p) === 1 ? `<span class="pd-crown"><svg viewBox="0 0 24 24" width="28" height="28" fill="#FFD731" stroke="#000" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">${IC.coroa}</svg></span>` : ''}${avatar(p, place(p) === 1 ? 58 : 48)}<b>${p.me ? 'Você' : p.name}</b><em>${p.trades} trocas</em><i class="pd-step">${place(p)}º</i></div>`).join('')}</div>
      <ol class="lb">${all.map((p, i) => { const bd = badgeOf(p.trades); return `<li class="lb-row${p.me ? ' me' : ''}"><span class="lb-pos">${i + 1}º</span>${avatar(p, 38)}<span class="lb-name"><b>${p.me ? `${p.name} (você)` : p.name}</b><em>${bd ? `Insígnia ${bd.name}` : 'Sem insígnia ainda'}</em></span>${bd ? badgeSVG(bd, 30) : '<span class="lb-nob"></span>'}<span class="lb-n"><b>${p.trades}</b><small>trocas</small></span></li>`; }).join('')}</ol>
      <p class="pg-safe">${ico('shield', 18)} O ranking mostra só você e seus amigos.</p>`;
  } else {
    const got = BADGES.filter(b => ME.trades >= b.need).length;
    body = `${hero}<h3 class="pg-h">Insígnias · ${got} de ${BADGES.length}</h3>
      <div class="bgrid">${BADGES.map(b => { const on = ME.trades >= b.need, isNext = b === next; return `<button class="btile${on ? ' on' : ''}${isNext ? ' nx' : ''}" data-badge="${b.id}">${badgeSVG(b, 66, on)}${on ? '' : `<span class="bt-lock">${ico('lock', 13)}</span>`}<b>${b.name}</b><em>${on ? 'Conquistada!' : `${b.need} trocas`}</em>${isNext ? `<span class="gm-bar sm"><i style="width:${pct}%"></i></span>` : ''}</button>`; }).join('')}</div>
      <p class="pg-hint">Cada troca feita com um amigo conta. Toque numa insígnia para ver como ganhar.</p>`;
  }
  stage.innerHTML = `<div class="pg gm">${seg}<div class="pg-body">${body}</div></div>`;
  stage.addEventListener('click', e => {
    const t = e.target.closest('[data-badge]'); if (!t) return;
    const b = BADGES.find(x => x.id === t.dataset.badge), on = ME.trades >= b.need;
    api.openSheet(`<div class="sh-handle"></div><div class="bdg-sheet">${badgeSVG(b, 132, on)}<h2 class="sh-title" id="shTitle">Insígnia ${b.name}</h2>
      <p class="sh-text">${on ? `Você ganhou ao fazer <b>${b.need} trocas</b> com seus amigos.` : `Ganhe fazendo <b>${b.need} trocas</b> com seus amigos.`}</p>
      ${on ? '' : `<span class="gm-bar"><i style="width:${Math.min(100, Math.round(ME.trades / b.need * 100))}%"></i></span><p class="bdg-left">${ME.trades} de ${b.need} · faltam ${b.need - ME.trades}</p>`}</div>
      <div class="sh-actions"><button class="btn btn-filled" data-act="close">${on ? 'Legal!' : 'Bora trocar!'}</button></div>`, () => api.closeSheet());
  });
  return { close() {}, isOpen: () => false, key() {} };
}
