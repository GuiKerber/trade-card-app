/* Telas da v1: Trocas, Amigos e Loja (o Álbum usa mountBinder da rodada 3) */
const cap = s => s[0].toUpperCase() + s.slice(1);
const offerTile = ({ f, c }) => `<button class="otile" data-offer="${f.id}:${c.n}" aria-label="${c.name}, de ${f.name}${c.have ? '' : ', falta pra você'}">${thumb(c)}${c.have ? '' : '<span class="need">Falta</span>'}<span class="oby">${avatar(f, 22)}${f.name}</span></button>`;

/* ---------- Pedido de troca (em etapas: carta → onde → quando → confirmar) ---------- */
function proposeSheet(api, fid, n) {
  const f = friendById(fid), get = byN(n), st = { step: 1, give: null, where: null, day: null, anim: '', busy: false };
  const next = () => (!st.give ? 1 : !st.where ? 2 : !st.day ? 3 : 4);
  const body = () => {
    if (st.step === 1) {
      const mine = DATA.filter(c => c.have && c.trade);
      return `<h3 class="ps-q">Qual carta sua você dá?</h3>${mine.length
        ? `<div class="ps-grid">${mine.map(c => `<button class="ps-card" data-act="give:${c.n}" aria-pressed="${st.give === c.n}">${thumb(c)}<span>${c.name}</span></button>`).join('')}</div>`
        : '<p class="ps-empty">Você ainda não pôs cartas pra troca. No álbum, toque numa carta e escolha <b>Pôr pra troca</b>.</p>'}`;
    }
    if (st.step === 2) return `<h3 class="ps-q">Onde vocês vão se encontrar?</h3><div class="ps-opts">${Object.entries(PLACES).map(([k, l]) => `<button class="ps-opt" data-act="where:${k}" aria-pressed="${st.where === k}"><span class="ps-oi">${ico(k, 26)}</span>${l}</button>`).join('')}</div>`;
    if (st.step === 3) return `<h3 class="ps-q">Que dia?</h3><div class="ps-opts">${DAYS.map(d => `<button class="ps-opt" data-act="day:${d}" aria-pressed="${st.day === d}"><span class="ps-oi">${ico('cal', 26)}</span>${d}</button>`).join('')}</div>`;
    return `<h3 class="ps-q">Tudo certo?</h3>
      <div class="ps-sum"><button class="ps-row" data-act="go:2"><span class="ps-oi">${ico(st.where, 24)}</span><span><small>Onde</small><b>${PLACES[st.where]}</b></span><em>Mudar</em></button>
        <button class="ps-row" data-act="go:3"><span class="ps-oi">${ico('cal', 24)}</span><span><small>Quando</small><b>${st.day}</b></span><em>Mudar</em></button></div>
      <div class="sh-actions"><button class="btn btn-filled" data-act="send">Enviar pedido</button></div>
      <p class="ps-note">${ico('shield', 16)} Um adulto recebe um aviso para confirmar o encontro.</p>`;
  };
  const html = () => {
    const a = st.anim; st.anim = '';
    return `<div class="sh-handle"></div>
      <div class="ps-top">${st.step > 1 ? `<button class="ps-back" data-act="back" aria-label="Voltar">${ico('back', 22)}</button>` : ''}<h2 class="sh-title" id="shTitle">Trocar com ${f.name}</h2></div>
      <div class="ps-prog" role="progressbar" aria-label="Passo ${Math.min(st.step, 3)} de 3" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${Math.min(st.step, 3)}">${[1, 2, 3].map(i => `<i class="${i < st.step ? 'done' : i === st.step ? 'on' : ''}"></i>`).join('')}</div>
      <div class="ps-swap"><figure>${thumb(get)}<figcaption>Você recebe</figcaption></figure><span class="swap-ico">${ico('trade', 26)}</span>
        <figure>${st.give ? `<button class="ps-mine-pick" data-act="go:1" aria-label="Trocar a carta que você dá">${thumb(byN(st.give))}</button>` : '<span class="mini empty">?</span>'}<figcaption>Você dá</figcaption></figure></div>
      <div class="ps-body${a ? ` in-${a}` : ''}">${body()}</div>`;
  };
  const go = (step, dir) => { st.step = step; st.anim = dir; sheet.set(html()); };
  const sheet = api.openSheet(html(), (act, sh) => {
    if (st.busy) return;
    const [k, v] = act.split(':');
    if (k === 'back') { go(st.step - 1, 'b'); buzz(4); return; }
    if (k === 'go') { go(+v, 'b'); buzz(4); return; }
    if (k === 'send') {
      REQS.push({ id: Date.now(), friend: fid, give: st.give, get: n, where: st.where, when: st.day, status: 'out' });
      api.closeSheet(); api.toast(`Pedido enviado para ${f.name}! Veja em Pedidos.`); api.refresh(); return;
    }
    if (k === 'give') st.give = +v; else if (k === 'where') st.where = v; else if (k === 'day') st.day = v; else return;
    buzz(6); sh.set(html()); st.busy = true;
    setTimeout(() => { st.busy = false; if (api.sheetIs(sheet)) go(next(), 'f'); }, 260);
  });
}

/* ---------- Trocas ---------- */
const TRADES_UI = { tab: 'ofertas', pick: null, set: null, all: null };
function mountTrades(stage, api) {
  stage.className = 'stage page';
  const row = c => {
    const who = offers().filter(o => o.c.id === c.id);
    const act = who.length ? `<button class="btn-s" data-offer="${who[0].f.id}:${who[0].c.n}">Trocar</button>`
      : c.have ? '' : `<button class="btn-s ghost" data-wish="${c.id}" aria-pressed="${WISH.has(c.id)}">${WISH.has(c.id) ? 'Na lista' : 'Quero'}</button>`;
    return `<div class="rrow">${thumb(c, 'sm')}<div class="rinfo"><b>${c.name}</b><span>${setOf(c).name} · ${numStr(c)} · ${c.have ? `você tem ${c.have}` : 'falta pra você'}</span>${who.length ? `<span class="rwho">${who.map(o => `${avatar(o.f, 20)}${o.f.name}`).join('')}</span>` : '<span class="rnone">Ninguém pôs pra troca ainda</span>'}</div>${act}</div>`;
  };
  const head = (t, sub) => `<div class="rhead"><span><b>${t}</b>${sub ? `<em>${sub}</em>` : ''}</span><button class="btn-s ghost" data-clear>Limpar</button></div>`;
  const results = () => {
    const P = TRADES_UI;
    if (P.pick) return `${head('Resultado')}${row(cardById(P.pick))}`;
    if (P.set != null) { const st = CAT.sets[P.set]; return `${head(st.name, `${st.series} · ${st.count} cartas`)}${setCards(P.set, 60).map(e => row(cardById(entryId(e)))).join('')}${st.count > 60 ? `<p class="pg-empty">Mostrando 60 de ${st.count}. Digite o nome ou o número para achar outra.</p>` : ''}`; }
    if (P.all) { const r = searchCatalog(P.all, 60); return `${head(`“${P.all}”`, `${r.total.toLocaleString('pt-BR')} cartas`)}${r.cards.map(e => row(cardById(entryId(e)))).join('') || '<p class="pg-empty">Nada encontrado.</p>'}`; }
    const off = [...new Map(offers().map(o => [o.c.id, o.c])).values()];
    const wish = [...WISH].map(cardById).filter(c => c && !off.some(o => o.id === c.id));
    return `<h3 class="pg-h">Ofertas dos seus amigos</h3>${off.map(row).join('')}${wish.length ? `<h3 class="pg-h">Sua lista de desejos</h3>${wish.map(row).join('')}` : ''}`;
  };
  const reqCard = r => {
    const f = friendById(r.friend), give = byN(r.give), get = byN(r.get);
    const title = r.status === 'new' ? `${f.name} quer trocar com você` : r.status === 'ok' ? `Troca combinada com ${f.name}` : `Esperando ${f.name} responder`;
    const acts = r.status === 'new' ? `<button class="btn-s ghost" data-rq="decline:${r.id}">Recusar</button><button class="btn-s" data-rq="accept:${r.id}">Aceitar</button>`
      : r.status === 'ok' ? `<button class="btn-s ghost" data-rq="cancel:${r.id}">Desmarcar</button><button class="btn-s" data-rq="done:${r.id}">Já trocamos</button>`
        : `<button class="btn-s ghost" data-rq="cancel:${r.id}">Cancelar pedido</button>`;
    return `<article class="rq rq-${r.status}"><header>${avatar(f, 32)}<b>${title}</b></header>
      <div class="rq-swap"><figure>${thumb(give)}<figcaption>Você dá<b>${give.name}</b></figcaption></figure><span class="swap-ico">${ico('trade', 22)}</span><figure>${thumb(get)}<figcaption>Você recebe<b>${get.name}</b></figcaption></figure></div>
      <p class="rq-when">${ico('pin', 18)} ${PLACES[r.where]} · ${r.when}</p><div class="rq-act">${acts}</div></article>`;
  };
  const body = () => {
    if (TRADES_UI.tab === 'ofertas') {
      const all = offers(), miss = all.filter(o => !o.c.have), rest = all.filter(o => o.c.have);
      return `<p class="pg-lede">Cartas que seus amigos puseram pra troca.</p>
        ${miss.length ? `<h3 class="pg-h">Faltam no seu álbum</h3><div class="ogrid">${miss.map(offerTile).join('')}</div>` : ''}
        ${rest.length ? `<h3 class="pg-h">Você já tem</h3><div class="ogrid">${rest.map(offerTile).join('')}</div>` : ''}`;
    }
    if (TRADES_UI.tab === 'procurar') {
      return `${searchBox('q', 'Nome ou número da carta')}<p class="pg-hint">Todas as ${CAT.sets.length} coleções · ${CAT.cards.length.toLocaleString('pt-BR')} cartas. Ex.: Pikachu, 025, 006/165</p>
        <div class="rlist" id="rlist">${results()}</div>`;
    }
    const sec = (t, st) => { const l = REQS.filter(r => r.status === st); return l.length ? `<h3 class="pg-h">${t}</h3>${l.map(reqCard).join('')}` : ''; };
    const all = sec('Novos pedidos', 'new') + sec('Combinadas', 'ok') + sec('Enviados', 'out');
    return all || '<p class="pg-empty">Nenhum pedido por enquanto. Veja as ofertas dos seus amigos!</p>';
  };
  const render = () => {
    const pend = REQS.filter(r => r.status === 'new').length;
    stage.innerHTML = `<div class="pg"><div class="segin" role="tablist" aria-label="Trocas">${[['ofertas', 'Ofertas'], ['procurar', 'Procurar'], ['pedidos', 'Pedidos']].map(([k, l]) => `<button role="tab" data-tt="${k}" aria-selected="${k === TRADES_UI.tab}">${l}${k === 'pedidos' && pend ? `<i class="dotn">${pend}</i>` : ''}</button>`).join('')}</div><div class="pg-body">${body()}</div></div>`;
    const q = $('#q', stage);
    if (q) {
      const show = patch => { Object.assign(TRADES_UI, { pick: null, set: null, all: null }, patch); $('#rlist', stage).innerHTML = results(); };
      attachSuggest(q, { onPick: id => show({ pick: id }), onSet: st => show({ set: st.i }), onAll: v => show({ all: v.trim() }) });
    }
  };
  render();
  stage.addEventListener('click', e => {
    const t = e.target.closest('[data-tt]'); if (t) { TRADES_UI.tab = t.dataset.tt; render(); buzz(4); return; }
    const o = e.target.closest('[data-offer]'); if (o) { const [fid, n] = o.dataset.offer.split(':'); proposeSheet(api, fid, +n); return; }
    const w = e.target.closest('[data-wish]'); if (w) { const id = w.dataset.wish; WISH.has(id) ? WISH.delete(id) : WISH.add(id); $('#rlist', stage).innerHTML = results(); api.toast(WISH.has(id) ? `${cardById(id).name} está na sua lista de desejos. Seus amigos vão ver.` : 'Tirei da sua lista de desejos.'); return; }
    if (e.target.closest('[data-clear]')) { Object.assign(TRADES_UI, { pick: null, set: null, all: null }); const q = $('#q', stage); if (q) q.value = ''; $('#rlist', stage).innerHTML = results(); return; }
    const r = e.target.closest('[data-rq]'); if (!r) return;
    const [act, id] = r.dataset.rq.split(':'), rq = REQS.find(x => String(x.id) === id); if (!rq) return;
    const f = friendById(rq.friend);
    if (act === 'accept') { rq.status = 'ok'; api.toast(`Combinado! ${PLACES[rq.where]}, ${rq.when}.`); buzz(12); }
    if (act === 'decline') { REQS.splice(REQS.indexOf(rq), 1); api.toast('Pedido recusado. Tudo bem!'); }
    if (act === 'cancel') { REQS.splice(REQS.indexOf(rq), 1); api.toast(rq.status === 'ok' ? `Troca desmarcada. Avisamos ${f.name}.` : 'Pedido cancelado.'); }
    if (act === 'done') {
      const give = byN(rq.give), get = byN(rq.get);
      give.have = Math.max(0, give.have - 1); give.trade = Math.min(give.trade, give.have ? give.trade - 1 : 0);
      get.have += 1; get.isNew = true; if (!get.cond) { get.cond = 'NM'; get.lang = 'PT'; get.variant = FOIL[get.r] || 'Normal'; get.holo = get.variant !== 'Normal'; }
      f.offers = f.offers.filter(x => x !== get.n);
      if (!give.have) albumRemove(give.n); albumPlace(get.n);
      REQS.splice(REQS.indexOf(rq), 1);
      api.counter(); api.tradeShow({ give, get, f });
    }
    render();
  });
  return { close() {}, isOpen: () => false, key() {} };
}

/* ---------- Amigos ---------- */
function friendSheet(api, f) {
  api.openSheet(`<div class="sh-handle"></div><div class="fs-head">${avatar(f, 56)}<div><h2 class="sh-title" id="shTitle">${f.name}</h2><p class="ls-set">Código ${f.code}</p></div></div>
    <h3 class="ps-h">Pra troca</h3>${f.offers.length ? `<div class="ogrid">${f.offers.map(n => offerTile({ f, c: byN(n) })).join('')}</div>` : `<p class="ps-empty">${f.name} ainda não pôs cartas pra troca.</p>`}
    <div class="sh-actions"><button class="btn btn-text" data-act="close">Fechar</button></div>`,
  (act, sheet, el) => { if (act === 'close') api.closeSheet(); }, e => { const o = e.target.closest('[data-offer]'); if (o) { const [fid, n] = o.dataset.offer.split(':'); proposeSheet(api, fid, +n); return true; } return false; });
}
function addFriendSheet(api) {
  api.openSheet(`<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Adicionar amigo</h2>
    <p class="sh-text">Peça o código para o seu amigo. Vocês precisam estar juntos.</p>
    <button class="btn btn-tonal" data-act="scan">${ico('qr', 22)} Escanear o código</button>
    <label class="field" for="fcode"><span>Ou digite o código</span><input id="fcode" placeholder="Ex.: NUVEM-357" autocomplete="off" autocapitalize="characters"></label>
    <p class="field-err" id="ferr" hidden></p>
    <div class="sh-actions"><button class="btn btn-filled" data-act="add">Adicionar</button></div>
    <p class="ps-note">${ico('shield', 16)} Um adulto precisa aprovar cada amigo novo.</p>`,
  (act, sheet) => {
    if (act === 'scan') { api.toast('No app, a câmera abre aqui. Neste protótipo, digite NUVEM-357.'); return; }
    const code = $('#fcode').value.trim().toUpperCase(), err = $('#ferr');
    const fail = m => { err.textContent = m; err.hidden = false; buzz(20); };
    if (!code) return fail('Digite o código do seu amigo.');
    if (code === ME.code) return fail('Esse é o seu código! Digite o do seu amigo.');
    if (FRIENDS.some(x => x.code === code)) return fail('Vocês já são amigos.');
    if (code !== NEW_FRIEND.code) return fail('Não achamos esse código. Confira as letras e os números.');
    FRIENDS.push({ ...NEW_FRIEND, offers: [...NEW_FRIEND.offers] });
    api.closeSheet(); api.toast(`${NEW_FRIEND.name} agora é seu amigo! Já dá pra ver as cartas pra troca.`); api.refresh();
  });
}
function mountFriends(stage, api) {
  stage.className = 'stage page';
  stage.innerHTML = `<div class="pg"><div class="pg-body">
    <section class="mycode"><div class="qr" id="qr"></div><div class="mc-txt"><span>Seu código</span><b>${ME.code}</b><p>Mostre para um amigo escanear. Só vale pessoalmente!</p></div></section>
    <button class="btn btn-filled add-friend" data-fa="add">${ico('plus', 22)} Adicionar amigo</button>
    <h3 class="pg-h">Seus amigos · ${FRIENDS.length}</h3>
    <ul class="flist">${FRIENDS.map(f => `<li><button class="frow" data-friend="${f.id}">${avatar(f, 44)}<span class="fr-txt"><b>${f.name}</b><span>${f.offers.length} ${f.offers.length === 1 ? 'carta' : 'cartas'} pra troca</span></span>${ico('chevR', 22)}</button></li>`).join('')}</ul>
    <p class="pg-safe">${ico('shield', 18)} Aqui não tem chat. Vocês combinam a troca pelo app e se encontram com um adulto por perto.</p>
  </div></div>`;
  const qr = $('#qr', stage);
  try {
    const q = qrcode(0, 'M'); q.addData(`TRADECARD:${ME.code}`); q.make();
    qr.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  } catch (err) { qr.innerHTML = `<span class="qr-fb">${ico('qr', 64)}</span>`; }
  stage.addEventListener('click', e => {
    if (e.target.closest('[data-fa]')) { addFriendSheet(api); return; }
    const b = e.target.closest('[data-friend]'); if (b) friendSheet(api, friendById(b.dataset.friend));
  });
  return { close() {}, isOpen: () => false, key() {} };
}

/* ---------- Loja ---------- */
function gateSheet(api, item, onOk) {
  const a = 6 + Math.floor(Math.random() * 4), b = 4 + Math.floor(Math.random() * 5), ans = a + b;
  const opts = [ans, ans - 1, ans + 2].sort(() => Math.random() - .5);
  api.openSheet(`<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Chame um adulto</h2>
    <p class="sh-text"><b>${item.name}</b> custa <b>${priceStr(item.price)}</b>. Para liberar, um adulto precisa responder:</p>
    <p class="gate-q">Quanto é ${a} + ${b}?</p>
    <div class="gate-opts">${opts.map(o => `<button class="btn btn-tonal" data-act="ans:${o}">${o}</button>`).join('')}</div>
    <p class="ps-note">Protótipo: nenhuma compra de verdade acontece.</p>
    <div class="sh-actions"><button class="btn btn-text" data-act="close">Agora não</button></div>`,
  act => {
    if (act === 'close') { api.closeSheet(); return; }
    api.closeSheet();
    if (+act.split(':')[1] === ans) { item.owned = true; onOk(); } else api.toast('Essa parte é para um adulto. Tente com alguém junto.');
  });
}
const STORE_UI = { tab: 'capas', sel: -1 };
function mountStore(stage, api) {
  stage.className = 'stage page';
  const skinTile = k => `<button class="sitem${COVER.skin === k.id ? ' on' : ''}" data-skin="${k.id}"><span class="sw${k.art ? ' art' : ''}" style="--f1:${k.f[0]};--f2:${k.f[1]};--f3:${k.f[2]};--f4:${k.f[3]};--f5:${k.f[4]};--spine:${k.spine}${k.art ? `;--art:url('${artSrc(k.art)}')${k.crop ? `;--art-zoom:${k.crop[0]};--art-pos:${k.crop[1]}` : ''}` : ''}"><i></i></span><b>${k.name}</b><em>${COVER.skin === k.id ? 'Usando' : k.owned ? 'Usar' : `${ico('lock', 14)} ${priceStr(k.price)}`}</em></button>`;
  const stkTile = s => { const n = COVER.stickers.filter(x => x.id === s.id).length; return `<button class="sitem" data-stk="${s.id}"><span class="sa">${sticker(s.icon, 50, s.fill)}</span><b>${s.name}</b><em>${s.owned ? (n ? `Na capa · colar outro` : 'Colar na capa') : `${ico('lock', 14)} ${priceStr(s.price)}`}</em></button>`; };
  const render = () => {
    const selOn = STORE_UI.sel >= 0 && STORE_UI.sel < COVER.stickers.length;
    stage.innerHTML = `<div class="pg st"><div class="pg-body">
      <div class="st-prev"><div class="st-box"><i class="st-spine"></i><div class="st-cover" id="stc">${coverFaceHTML()}</div></div>
        <div class="st-tools">${selOn ? `<button class="btn-s ghost" data-rm>${ico('x', 16)} Tirar adesivo</button>` : `<p class="st-hint">${STORE_UI.tab === 'adesivos' ? 'Arraste os adesivos na capa.' : 'Toque numa capa para provar.'}</p>`}</div></div>
      <div class="segin" role="tablist" aria-label="Loja">${[['capas', `Capas · ${SKINS.length}`], ['adesivos', `Adesivos · ${STICKERS.length}`]].map(([k, l]) => `<button role="tab" data-st="${k}" aria-selected="${k === STORE_UI.tab}">${l}</button>`).join('')}</div>
      <div class="sgrid">${STORE_UI.tab === 'capas' ? `<h3 class="pg-h sg-h">Pokémon</h3>${SKINS.filter(k => k.art).map(skinTile).join('')}<h3 class="pg-h sg-h">Holográficas</h3>${SKINS.filter(k => !k.art).map(skinTile).join('')}` : STICKERS.map(stkTile).join('')}</div>
    </div></div>`;
    applySkin($('.st-box', stage));
    if (selOn) $(`#stc [data-si="${STORE_UI.sel}"]`, stage).classList.add('sel');
  };
  render();
  const useSkin = k => { COVER.skin = k.id; render(); api.toast(`Capa ${k.name} no seu álbum!`); buzz(10); };
  const addStk = s => {
    if (COVER.stickers.length >= MAX_STICKERS) { api.toast(`A capa já tem ${MAX_STICKERS} adesivos. Tire um para colar outro.`); return; }
    const i = COVER.stickers.length;
    COVER.stickers.push({ id: s.id, x: 60 + (i * 47) % 200, y: 150 + (i * 61) % 180, r: ((i * 37) % 24) - 12 });
    STORE_UI.sel = i; render(); api.toast('Adesivo colado! Arraste para onde quiser.'); buzz(10);
  };
  stage.addEventListener('click', e => {
    const t = e.target.closest('[data-st]'); if (t) { STORE_UI.tab = t.dataset.st; STORE_UI.sel = -1; render(); return; }
    if (e.target.closest('[data-rm]')) { COVER.stickers.splice(STORE_UI.sel, 1); STORE_UI.sel = -1; render(); api.toast('Adesivo tirado da capa.'); return; }
    const k = e.target.closest('[data-skin]'); if (k) { const sk = skinOf(k.dataset.skin); sk.owned ? useSkin(sk) : gateSheet(api, sk, () => useSkin(sk)); return; }
    const s = e.target.closest('[data-stk]'); if (s) { const st = stkOf(s.dataset.stk); st.owned ? addStk(st) : gateSheet(api, st, () => addStk(st)); }
  });
  // Arrastar adesivos na prévia da capa
  let d = null;
  stage.addEventListener('pointerdown', e => {
    const el = e.target.closest('#stc .r3c-stk'); if (!el) return;
    const i = +el.dataset.si, k = $('#stc', stage).getBoundingClientRect().width / 330;
    d = { el, i, x0: e.clientX, y0: e.clientY, sx: COVER.stickers[i].x, sy: COVER.stickers[i].y, k, moved: false, id: e.pointerId };
  });
  stage.addEventListener('pointermove', e => {
    if (!d) return; const dx = (e.clientX - d.x0) / d.k, dy = (e.clientY - d.y0) / d.k;
    if (!d.moved) { if (Math.hypot(dx, dy) < 6) return; d.moved = true; try { stage.setPointerCapture(d.id); } catch (err) { /* ok */ } }
    const s = COVER.stickers[d.i]; s.x = clamp(d.sx + dx, -10, 290); s.y = clamp(d.sy + dy, -10, 410);
    d.el.style.left = `${s.x}px`; d.el.style.top = `${s.y}px`;
  });
  const up = () => { if (!d) return; const x = d; d = null; STORE_UI.sel = x.moved ? x.i : (STORE_UI.sel === x.i ? -1 : x.i); render(); };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  return { close() {}, isOpen: () => false, key() {} };
}
