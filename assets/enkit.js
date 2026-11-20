/* ============================================================
   영어 공통: 영어 음성(TTS), 글자 쓰기 자판, 단계 진행
   core.js · g1kit.js 다음에 불러와요.
   ============================================================ */
const EN = {};
EN.voice = null;
EN.pickVoice = () => { try { const vs = speechSynthesis.getVoices(); EN.voice = vs.find(v => /en[-_]US/i.test(v.lang) && /samantha|google us|female|aria|jenny/i.test(v.name)) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch (e) {} };
try { EN.pickVoice(); speechSynthesis.onvoiceschanged = EN.pickVoice; } catch (e) {}
EN.speak = (text, rate) => new Promise(res => {
  try {
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate || 0.75; if (EN.voice) u.voice = EN.voice;
    u.onend = res; u.onerror = res; speechSynthesis.speak(u);
    setTimeout(res, 4000);
  } catch (e) { res(); }
});
EN.stop = () => { try { speechSynthesis.cancel(); } catch (e) {} };
EN.seq = async (list, gap = 350) => { EN.stop(); for (const t of list) { await EN.speak(t); await new Promise(r => setTimeout(r, gap)); } };
EN.btn = (text, label, big) => h('button', {class: 'en-play' + (big ? ' big' : ''), onclick: (e) => { e.stopPropagation(); EN.stop(); EN.speak(text); }}, label || '🔊');


/* ---------------- 글자 쓰기 (화면 자판) ---------------- */
EN.activeTyper = null;
document.addEventListener('keydown', e => { const t = EN.activeTyper; if (!t || !document.body.contains(t.el)) return; if (/^[a-zA-Z]$/.test(e.key)) { t.key(e.key.toLowerCase()); e.preventDefault(); } else if (e.key === 'Backspace') { t.key('⌫'); e.preventDefault(); } });
function typer(word, opt = {}) {
  const pre = opt.prefix || ''; const need = word.slice(pre.length).toLowerCase(); let typed = []; let done = false;
  const el = h('div', {class: 'en-typer'}); const slots = h('div', {class: 'en-slots'}); const fb = h('div', {class: 'g1-fb'});
  const draw = () => { slots.innerHTML = ''; pre.split('').forEach(c => slots.append(h('span', {class: 'en-slot given'}, c))); for (let i = 0; i < need.length; i++) slots.append(h('span', {class: 'en-slot' + (typed[i] ? ' full' : '') + (i === typed.length && !done ? ' cur' : '')}, typed[i] || '')); };
  const kb = h('div', {class: 'en-kb'});
  'abcdefghijklmnopqrstuvwxyz'.split('').concat(['⌫']).forEach(c => kb.append(h('button', {class: 'en-key' + (c === '⌫' ? ' del' : ''), onclick: () => api.key(c)}, c)));
  const api = {el, key(c) {
    if (done) return; EN.activeTyper = api;
    if (c === '⌫') typed.pop(); else if (typed.length < need.length) typed.push(c);
    draw(); if (typed.length === need.length) check();
  }};
  function check() {
    const ok = typed.join('') === need;
    logEvent('attempt', {tag: opt.tag || '철자 쓰기', q: opt.q || word, ok: ok ? 'O' : 'X', answer: pre + typed.join('')});
    if (ok) { done = true; el.classList.add('done'); fb.className = 'g1-fb good'; fb.textContent = G1.pick(['Great! 🎉', 'Good job! 🌟', 'Perfect! 👏']); G1.tone(true); EN.speak(word); kb.remove(); opt.onDone && opt.onDone(); }
    else { fb.className = 'g1-fb bad'; fb.innerHTML = '다시 써 볼까요? ' + (opt.hintSound !== false ? '🔊 를 눌러 소리를 들어 봐요.' : ''); G1.tone(false); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); setTimeout(() => { typed = []; draw(); }, 700); }
  }
  el.append(slots, kb, fb); draw(); EN.activeTyper = api; el.addEventListener('click', () => EN.activeTyper = api);
  return api;
}
function stepRunner(steps, onDone, intro) {
  const root = h('div'); const prog = h('div', {class: 'g1-progress'}); const slot = h('div'); let i = 0;
  const draw = () => { prog.innerHTML = ''; steps.forEach((_, k) => prog.append(h('span', {class: k < i ? 'on' : ''}, k < i ? '⭐' : '☆'))); };
  function show() { draw(); slot.innerHTML = ''; if (i >= steps.length) { slot.append(h('div', {class: 'g1-big', style: 'text-align:center;margin:16px 0'}, '🎉 다 했어요! 잘했어요!')); onDone && onDone(); return; }
    slot.append(steps[i](() => { i++; if (!S.solved['en-ws-' + i + location.hash]) { markSolved('en-ws-' + i + location.hash); G1.giveSticker(); } setTimeout(show, 1000); })); }
  if (intro) root.append(G1.say(intro));
  root.append(prog, slot); show(); return root;
}

