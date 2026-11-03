/* Entrar e criar conta (email ou Google). Abaixo de 13 anos, um adulto cria a conta junto. */

Object.assign(UI, {
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7.5 7.5 5.8 7.5-5.8"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
  out: '<path d="M14 4.5H7.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H14"/><path d="M11 12h9.5M17 8.5l3.5 3.5-3.5 3.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
});
const G_LOGO = '<svg class="g-logo" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
const APP_NAME = 'Meu Álbum';
const AV_COLORS = ['#FFD6E8', '#FFE38A', '#B4F5DC', '#A9DCFF', '#E3CCFF', '#FFC8A8'];
const G_ACCOUNTS = [{ name: 'Ana Souza', email: 'ana.souza@gmail.com', c: '#7aa7ff' }];   // conta de exemplo do protótipo

const AUTH = { user: null };
try { const u = JSON.parse(localStorage.getItem('tc-auth') || 'null'); if (u && u.name) { AUTH.user = u; Object.assign(ME, { name: u.name, color: u.color }); } } catch (err) { /* sem armazenamento */ }
const saveAuth = () => { try { if (AUTH.user) localStorage.setItem('tc-auth', JSON.stringify(AUTH.user)); else localStorage.removeItem('tc-auth'); } catch (err) { /* ok */ } };
const maskEmail = e => { const [u, d] = String(e).split('@'); return d ? `${u.slice(0, 2)}${'•'.repeat(Math.max(2, Math.min(6, u.length - 2)))}@${d}` : e; };
const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function showAuth(api) {
  const screen = api.screen();
  const A = { r: 'welcome', hist: [], flow: 'login', email: '', pass: '', show: false, age: null, adult: false, terms: false, consent: false, code: '', nick: '', color: AV_COLORS[0], via: 'email', err: '', busy: false, g: false, t: null, wait: 0 };
  const ov = document.createElement('div'); ov.className = 'auth'; screen.appendChild(ov);
  const STEPS = { age: 1, adult: 1, signup: 2, code: 3, profile: 4 };
  const top = () => `<div class="au-top">${A.r !== 'welcome' && A.r !== 'done' ? `<button class="ps-back" data-au="back" aria-label="Voltar">${ico('back', 22)}</button>` : ''}
      ${STEPS[A.r] ? `<div class="ps-prog au-prog" role="progressbar" aria-label="Passo ${STEPS[A.r]} de 4" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${STEPS[A.r]}">${[1, 2, 3, 4].map(i => `<i class="${i < STEPS[A.r] ? 'done' : i === STEPS[A.r] ? 'on' : ''}"></i>`).join('')}</div>` : ''}</div>`;
  const gBtn = (l = 'Continuar com Google') => `<button class="btn au-google" data-au="google">${G_LOGO}<span>${l}</span></button>`;
  const field = (id, label, type, val, ph, ac, extra = '') => `<label class="au-field"><span>${label}</span><span class="au-in"><input id="${id}" type="${type}" value="${val}" placeholder="${ph}" autocomplete="${ac}" ${extra}>${type === 'password' || id === 'auPass' ? `<button type="button" class="au-eye" data-au="eye" aria-label="${A.show ? 'Esconder' : 'Mostrar'} senha">${ico(A.show ? 'eyeOff' : 'eye', 22)}</button>` : ''}</span></label>`;
  const passField = (ac, ph) => field('auPass', 'Senha', A.show ? 'text' : 'password', A.pass, ph, ac);
  const err = () => `<p class="au-err" role="alert"${A.err ? '' : ' hidden'}>${A.err}</p>`;
  const busyBtn = (act, label, dis) => `<button class="btn btn-filled au-main${A.busy ? ' busy' : ''}" data-au="${act}"${dis ? ' disabled' : ''}>${A.busy ? '<i class="au-spin"></i>' : ''}<span>${label}</span></button>`;
  const fan = () => `<div class="au-fan"><i class="au-glow"></i>${[25, 6, 151].map((n, i) => `<span class="au-fc au-fc${i}">${cardHTML(byN(n))}</span>`).join('')}</div>`;

  const V = {
    welcome: () => `<div class="au-body au-welcome">${fan()}
        <h1 class="au-brand">${APP_NAME}</h1><p class="au-lede">Guarde suas cartas num álbum de verdade e combine trocas com seus amigos.</p>
        <div class="au-actions">${gBtn()}<button class="btn btn-filled" data-au="go:login">${ico('mail', 22)}<span>Entrar com email</span></button>
          <p class="au-alt">Ainda não tem conta? <button class="au-link" data-au="signup">Criar conta</button></p></div>
        <p class="au-legal">Ao continuar, você concorda com os <u>Termos de Uso</u> e a <u>Política de Privacidade</u>.</p></div>`,
    login: () => `<div class="au-body"><h2 class="au-h">Entrar</h2><p class="au-p">Use o email e a senha da sua conta.</p>
        ${field('auEmail', 'Email', 'email', A.email, 'nome@email.com', 'email', 'inputmode="email"')}${passField('current-password', 'Sua senha')}
        <button class="au-link au-forgot" data-au="go:forgot">Esqueci minha senha</button>${err()}
        ${busyBtn('login', A.busy ? 'Entrando...' : 'Entrar', !okEmail(A.email) || !A.pass)}
        <div class="au-or"><span>ou</span></div>${gBtn()}
        <p class="au-alt">Ainda não tem conta? <button class="au-link" data-au="signup">Criar conta</button></p></div>`,
    forgot: () => `<div class="au-body"><h2 class="au-h">Esqueci minha senha</h2><p class="au-p">Digite o email da conta. Vamos mandar um link para você criar uma senha nova.</p>
        ${field('auEmail', 'Email', 'email', A.email, 'nome@email.com', 'email', 'inputmode="email"')}${err()}
        ${busyBtn('forgot', A.busy ? 'Enviando...' : 'Enviar link', !okEmail(A.email))}</div>`,
    sent: () => `<div class="au-body au-center"><span class="au-big">${ico('mail', 56)}</span><h2 class="au-h">Olhe seu email</h2>
        <p class="au-p">Mandamos um link para <b>${maskEmail(A.email)}</b>. Abra o link para criar uma senha nova. Se não achar, olhe no spam.</p>
        <button class="btn btn-filled au-main" data-au="tologin">Voltar para entrar</button>
        <button class="au-link" data-au="resend"${A.wait ? ' disabled' : ''}>${A.wait ? `Reenviar em ${A.wait}s` : 'Não chegou? Reenviar'}</button></div>`,
    age: () => `<div class="au-body"><h2 class="au-h">Quantos anos você tem?</h2><p class="au-p">Perguntamos para deixar o app seguro para você.</p>
        <div class="au-ages">${[6, 7, 8, 9, 10, 11, 12].map(n => `<button class="au-age" data-au="age:${n}" aria-pressed="${A.age === n}">${n}</button>`).join('')}<button class="au-age wide" data-au="age:13" aria-pressed="${A.age === 13}">13 ou mais</button></div></div>`,
    adult: () => `<div class="au-body au-center"><span class="au-big">${ico('shield', 56)}</span><h2 class="au-h">Chame um adulto</h2>
        <p class="au-p">Para criar sua conta, um adulto da sua família precisa ajudar. É rapidinho.</p>
        <button class="btn btn-filled au-main" data-au="go:signup">Sou o adulto</button><button class="au-link" data-au="home">Agora não</button></div>`,
    signup: () => `<div class="au-body"><h2 class="au-h">${A.adult ? 'Conta do adulto' : 'Crie sua conta'}</h2>
        <p class="au-p">${A.adult ? 'Use o <b>seu</b> email. É por ele que você aprova amigos, encontros e compras da criança.' : 'Escolha o email e uma senha.'}</p>
        ${field('auEmail', A.adult ? 'Email do adulto' : 'Email', 'email', A.email, 'nome@email.com', 'email', 'inputmode="email"')}${passField('new-password', 'Pelo menos 6 letras ou números')}
        <label class="au-check"><input type="checkbox" id="auTerms"${A.terms ? ' checked' : ''}><span class="au-box">${ico('check', 16)}</span><span>Li e aceito os <u>Termos de Uso</u> e a <u>Política de Privacidade</u>.</span></label>
        ${A.adult ? `<label class="au-check"><input type="checkbox" id="auConsent"${A.consent ? ' checked' : ''}><span class="au-box">${ico('check', 16)}</span><span>Sou o responsável e autorizo esta criança a usar o ${APP_NAME}.</span></label>` : ''}
        ${err()}${busyBtn('create', A.busy ? 'Criando...' : 'Continuar', !okEmail(A.email) || A.pass.length < 6 || !A.terms || (A.adult && !A.consent))}
        <div class="au-or"><span>ou</span></div>${gBtn(A.adult ? 'Usar minha conta Google' : 'Continuar com Google')}</div>`,
    code: () => `<div class="au-body"><h2 class="au-h">Confirme o email</h2><p class="au-p">Digite o código de 6 números que mandamos para <b>${maskEmail(A.email)}</b>.</p>
        <label class="au-code"><input id="auCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" value="${A.code}" aria-label="Código de 6 números">
          ${[0, 1, 2, 3, 4, 5].map(i => `<span class="au-cb${i === A.code.length ? ' cur' : ''}">${A.code[i] || ''}</span>`).join('')}</label>
        ${err()}<p class="au-hint">Protótipo: qualquer código de 6 números serve.</p>
        <button class="au-link" data-au="resend"${A.wait ? ' disabled' : ''}>${A.wait ? `Reenviar código em ${A.wait}s` : 'Reenviar código'}</button></div>`,
    profile: () => `<div class="au-body"><h2 class="au-h">Como seus amigos vão te chamar?</h2>
        <div class="au-prev">${avatar({ name: A.nick.trim() || '?', color: A.color }, 84)}</div>
        <label class="au-field"><span>Apelido</span><span class="au-in"><input id="auNick" maxlength="12" value="${A.nick}" placeholder="Seu apelido" autocomplete="off"></span></label>
        <p class="au-hint">${ico('shield', 16)} Use um apelido. Não coloque sobrenome, telefone ou endereço.</p>
        <div class="au-colors" role="radiogroup" aria-label="Cor do avatar">${AV_COLORS.map(c => `<button class="au-col" data-au="col:${c}" style="--c:${c}" role="radio" aria-checked="${A.color === c}" aria-label="Cor"></button>`).join('')}</div>
        ${err()}${busyBtn('profile', 'Pronto!', A.nick.trim().length < 2)}</div>`,
    done: () => `<div class="au-body au-center"><div class="au-prev">${avatar({ name: A.nick, color: A.color }, 96)}</div><h2 class="au-h">Tudo pronto, ${A.nick}!</h2>
        <p class="au-p">Seu código de amigo é <b>${ME.code}</b>. Mostre para um amigo quando estiverem juntos.</p>
        ${A.adult ? `<p class="au-note">${ico('mail', 18)} Mandamos um email para o adulto confirmar a conta.</p>` : ''}
        <button class="btn btn-filled au-main" data-au="enter">Abrir meu álbum</button></div>`,
  };
  const gSheet = () => `<div class="g-scrim" data-au="gclose"></div><div class="g-sheet" role="dialog" aria-label="Escolha uma conta do Google">
      <div class="g-head">${G_LOGO}<span>Fazer login com o Google</span></div><h3>Escolha uma conta</h3><p>para continuar no <b>${APP_NAME}</b></p>
      ${G_ACCOUNTS.map((a, i) => `<button class="g-acc" data-au="gpick:${i}"><span class="g-av" style="background:${a.c}">${a.name[0]}</span><span><b>${a.name}</b><em>${a.email}</em></span></button>`).join('')}
      <button class="g-acc" data-au="gother"><span class="g-av g-add">${ico('plus', 20)}</span><span><b>Usar outra conta</b></span></button>
      <p class="g-legal">O Google vai compartilhar seu nome, email e foto com o ${APP_NAME}. Protótipo: nada é enviado.</p></div>`;

  const render = (anim = '') => {
    ov.innerHTML = `${top()}<div class="au-scroll${anim ? ` in-${anim}` : ''}">${V[A.r]()}</div>${A.g ? gSheet() : ''}`;
    bind();
  };
  const go = r => { A.hist.push(A.r); A.r = r; A.err = ''; A.busy = false; render('f'); };
  const back = () => { if (A.g) { A.g = false; render(); return true; } if (!A.hist.length) return false; A.r = A.hist.pop(); A.err = ''; A.busy = false; render('b'); return true; };
  const setErr = m => { A.err = m; const e = $('.au-err', ov); if (e) { e.textContent = m; e.hidden = !m; } };
  const syncBtn = () => {
    const b = $('.au-main', ov); if (!b) return;
    const dis = { login: !okEmail(A.email) || !A.pass, forgot: !okEmail(A.email), signup: !okEmail(A.email) || A.pass.length < 6 || !A.terms || (A.adult && !A.consent), profile: A.nick.trim().length < 2 }[A.r];
    if (dis !== undefined) b.disabled = dis;
  };
  const busy = (ms, fn) => { A.busy = true; render(); setTimeout(() => { A.busy = false; fn(); }, ms); };
  const countdown = () => { A.wait = 30; clearInterval(A.t); A.t = setInterval(() => { A.wait -= 1; if (A.wait <= 0) { A.wait = 0; clearInterval(A.t); } const l = $('[data-au="resend"]', ov); if (l) { l.disabled = !!A.wait; l.textContent = A.wait ? `${A.r === 'code' ? 'Reenviar código' : 'Reenviar'} em ${A.wait}s` : (A.r === 'code' ? 'Reenviar código' : 'Não chegou? Reenviar'); } }, 1000); };
  const finish = user => {
    AUTH.user = user; saveAuth(); Object.assign(ME, { name: user.name, color: user.color });
    clearInterval(A.t); window.authBack = null;
    const fade = ov.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(1.03)' }], { duration: 260, fill: 'forwards' });
    fade.onfinish = () => ov.parentNode && ov.parentNode.removeChild(ov);
    api.rebuild(); setTimeout(() => api.toast(`Oi, ${user.name}! Seu álbum está aqui.`), 300);
  };
  function bind() {
    const e = $('#auEmail', ov), p = $('#auPass', ov), c = $('#auCode', ov), n = $('#auNick', ov), t = $('#auTerms', ov), k = $('#auConsent', ov);
    if (e) e.addEventListener('input', () => { A.email = e.value.trim(); setErr(''); syncBtn(); });
    if (p) p.addEventListener('input', () => { A.pass = p.value; setErr(''); syncBtn(); });
    if (t) t.addEventListener('change', () => { A.terms = t.checked; syncBtn(); });
    if (k) k.addEventListener('change', () => { A.consent = k.checked; syncBtn(); });
    if (n) n.addEventListener('input', () => {
      A.nick = n.value; setErr(''); syncBtn();
      const pv = $('.au-prev .fav', ov); if (pv) pv.textContent = (A.nick.trim() || '?')[0].toUpperCase();
    });
    if (c) {
      c.addEventListener('input', () => {
        A.code = c.value.replace(/\D/g, '').slice(0, 6); c.value = A.code; setErr('');
        $$('.au-cb', ov).forEach((b, i) => { b.textContent = A.code[i] || ''; b.classList.toggle('cur', i === A.code.length); });
        if (A.code.length === 6) { c.blur(); busy(700, () => go('profile')); }
      });
      setTimeout(() => c.focus(), 320);
    }
  }
  ov.addEventListener('submit', ev => ev.preventDefault());
  ov.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target.matches('input')) { const b = $('.au-main', ov); if (b && !b.disabled) b.click(); } });
  ov.addEventListener('click', ev => {
    const b = ev.target.closest('[data-au]'); if (!b || b.disabled || A.busy) return;
    const [k, v] = b.dataset.au.split(/:(.*)/);
    buzz(4);
    if (k === 'back') back();
    else if (k === 'home') { A.hist = []; A.r = 'welcome'; render('b'); }
    else if (k === 'go') go(v);
    else if (k === 'signup') { A.flow = 'signup'; A.age = null; A.adult = false; go('age'); }
    else if (k === 'eye') { A.show = !A.show; const pf = $('#auPass', ov), pos = pf ? pf.selectionStart : 0; render(); const np = $('#auPass', ov); if (np) { np.focus(); try { np.setSelectionRange(pos, pos); } catch (err) { /* ok */ } } }
    else if (k === 'login') {
      if (A.pass.length < 6) { setErr('A senha tem pelo menos 6 letras ou números. Confira e tente de novo.'); return; }
      busy(800, () => finish({ name: 'Lia', color: '#FFD6E8', email: A.email, via: 'email' }));
    } else if (k === 'forgot') busy(700, () => { go('sent'); countdown(); });
    else if (k === 'tologin') { A.hist = ['welcome']; A.r = 'login'; render('b'); }
    else if (k === 'resend') { countdown(); api.toast(A.r === 'code' ? 'Mandamos um código novo.' : 'Mandamos o link de novo.'); }
    else if (k === 'age') { A.age = +v; A.adult = A.age < 13; render(); setTimeout(() => go(A.adult ? 'adult' : 'signup'), 220); }
    else if (k === 'create') busy(800, () => { A.via = 'email'; A.code = ''; go('code'); countdown(); });
    else if (k === 'col') { A.color = v; $$('.au-col', ov).forEach(x => x.setAttribute('aria-checked', x.dataset.au === `col:${v}`)); const pv = $('.au-prev .fav', ov); if (pv) pv.style.setProperty('--fc', v); }
    else if (k === 'profile') {
      const nk = A.nick.trim();
      if (!/^[\p{L} ]{2,12}$/u.test(nk)) { setErr('Use só letras no apelido, sem números nem símbolos.'); return; }
      A.nick = nk.charAt(0).toUpperCase() + nk.slice(1); go('done');
      const r = screen.getBoundingClientRect(); void r; api.confetti(screen.offsetWidth / 2, 220, 26);
    } else if (k === 'enter') finish({ name: A.nick, color: A.color, email: A.email, via: A.via });
    else if (k === 'google') { A.g = true; render(); }
    else if (k === 'gclose') { A.g = false; render(); }
    else if (k === 'gother') api.toast('No app de verdade, aqui abre a tela do Google para entrar com outra conta.');
    else if (k === 'gpick') {
      const acc = G_ACCOUNTS[+v]; A.g = false; A.email = acc.email; A.via = 'google';
      if (A.flow === 'signup') { if (A.adult) A.consent = true; busy(700, () => go('profile')); }
      else busy(800, () => finish({ name: 'Lia', color: '#FFD6E8', email: acc.email, via: 'google' }));
    }
  });
  window.authBack = back;
  render();
}

/* ---------- Sua conta ---------- */
function adultGate(api, onOk) {
  const a = 6 + Math.floor(Math.random() * 4), b = 4 + Math.floor(Math.random() * 5), ans = a + b;
  const opts = [ans, ans - 1, ans + 2].sort(() => Math.random() - .5);
  api.openSheet(`<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Só para adultos</h2>
    <p class="sh-text">Para abrir esta parte, um adulto precisa responder:</p><p class="gate-q">Quanto é ${a} + ${b}?</p>
    <div class="gate-opts">${opts.map(o => `<button class="btn btn-tonal" data-act="ans:${o}">${o}</button>`).join('')}</div>
    <div class="sh-actions"><button class="btn btn-text" data-act="close">Agora não</button></div>`,
  act => { if (act === 'close') { api.closeSheet(); return; } if (+act.split(':')[1] === ans) onOk(); else { api.closeSheet(); api.toast('Essa parte é para um adulto. Tente com alguém junto.'); } });
}
const ADULT = { trades: true, friends: true, mail: true };
function mountAccount(stage, api) {
  stage.className = 'stage page';
  const u = AUTH.user || { email: 'ana.souza@gmail.com', via: 'google' };
  const row = (act, icon, label, sub) => `<li><button class="acc-row" data-ac="${act}"><span class="ps-oi">${icon}</span><span class="acc-t">${sub ? `<small>${sub}</small>` : ''}<b>${label}</b></span>${ico('chevR', 22)}</button></li>`;
  stage.innerHTML = `<div class="pg acc"><div class="pg-body">
    <div class="acc-card">${avatar(ME, 76)}<div class="acc-who"><b>${ME.name}</b><span>Código de amigo</span><em>${ME.code}</em></div><button class="btn-s ghost" data-ac="edit">Editar</button></div>
    <div class="acc-stats"><span><b>${ME.trades}</b>trocas</span><span><b>${DATA.filter(c => c.have).length}</b>cartas</span><span><b>${FRIENDS.length}</b>amigos</span></div>
    <h3 class="pg-h">Conta</h3>
    <ul class="acc-list"><li><div class="acc-row static"><span class="ps-oi">${u.via === 'google' ? G_LOGO : ico('mail', 22)}</span><span class="acc-t"><small>${u.via === 'google' ? 'Entrou com Google' : 'Entrou com email'}</small><b>${maskEmail(u.email)}</b></span></div></li>
      ${row('adult', ico('shield', 22), 'Área do adulto', 'Aprovações e avisos')}${row('terms', ico('lock', 22), 'Termos e privacidade')}</ul>
    <button class="btn acc-out" data-ac="logout">${ico('out', 22)}<span>Sair da conta</span></button>
    <p class="pg-hint acc-ver">${APP_NAME} · protótipo v1</p></div></div>`;
  stage.addEventListener('click', e => {
    const b = e.target.closest('[data-ac]'); if (!b) return;
    const act = b.dataset.ac; buzz(4);
    if (act === 'edit') {
      const st = { nick: ME.name, color: ME.color };
      api.openSheet(`<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Editar perfil</h2>
        <div class="au-prev">${avatar(ME, 72)}</div>
        <label class="au-field"><span>Apelido</span><span class="au-in"><input id="edNick" maxlength="12" value="${ME.name}" autocomplete="off"></span></label>
        <div class="au-colors">${AV_COLORS.map(c => `<button class="au-col" data-act="col:${c}" style="--c:${c}" role="radio" aria-checked="${ME.color === c}" aria-label="Cor"></button>`).join('')}</div>
        <p class="au-err" hidden></p><div class="sh-actions"><button class="btn btn-text" data-act="close">Cancelar</button><button class="btn btn-filled" data-act="save">Salvar</button></div>`,
      (a, sh) => {
        const sheet = $('#sheet', api.screen()), inp = $('#edNick', sheet);
        if (a === 'close') { api.closeSheet(); return; }
        if (a.startsWith('col:')) { st.color = a.slice(4); $$('.au-col', sheet).forEach(x => x.setAttribute('aria-checked', x.dataset.act === a)); $('.au-prev .fav', sheet).style.setProperty('--fc', st.color); return; }
        st.nick = inp.value.trim();
        if (!/^[\p{L} ]{2,12}$/u.test(st.nick)) { const er = $('.au-err', sheet); er.textContent = 'Use só letras no apelido, de 2 a 12.'; er.hidden = false; return; }
        Object.assign(ME, { name: st.nick, color: st.color }); if (AUTH.user) Object.assign(AUTH.user, { name: st.nick, color: st.color }); saveAuth();
        api.closeSheet(); api.remount(); api.toast('Perfil salvo!'); void sh;
      });
      return;
    }
    if (act === 'adult') {
      adultGate(api, () => {
        const html = () => `<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Área do adulto</h2>
          <p class="sh-text">Escolha o que precisa da sua aprovação. Os avisos vão para <b>${maskEmail(u.email)}</b>.</p>
          <ul class="acc-list">${[['trades', 'Aprovar cada encontro de troca'], ['friends', 'Aprovar amigos novos'], ['mail', 'Receber avisos por email']].map(([k, l]) => `<li><button class="acc-row" data-act="tg:${k}" role="switch" aria-checked="${ADULT[k]}"><span class="acc-t"><b>${l}</b></span><span class="tg${ADULT[k] ? ' on' : ''}"><i></i></span></button></li>`).join('')}</ul>
          <div class="sh-actions"><button class="btn btn-text" data-act="del">Excluir conta</button><button class="btn btn-filled" data-act="close">Pronto</button></div>`;
        api.openSheet(html(), (a, sh) => {
          if (a === 'close') { api.closeSheet(); return; }
          if (a === 'del') { api.toast('No app de verdade, o adulto confirma por email antes de excluir.'); return; }
          const k = a.split(':')[1]; ADULT[k] = !ADULT[k]; sh.set(html());
        });
      });
      return;
    }
    if (act === 'terms') { api.toast('Os Termos e a Política de Privacidade abrem aqui no app final.'); return; }
    if (act === 'logout') {
      api.openSheet(`<div class="sh-handle"></div><h2 class="sh-title" id="shTitle">Sair da conta?</h2>
        <p class="sh-text">Seu álbum continua guardado. Para voltar, entre com o mesmo email ou com o Google.</p>
        <div class="sh-actions"><button class="btn btn-text" data-act="close">Ficar</button><button class="btn btn-filled" data-act="out">Sair</button></div>`,
      a => { api.closeSheet(); if (a !== 'out') return; AUTH.user = null; saveAuth(); api.go('album'); setTimeout(() => showAuth(api), 120); });
    }
  });
  return { close() {}, isOpen: () => false, key() {} };
}
function authBoot(api) { if (!AUTH.user) showAuth(api); }
