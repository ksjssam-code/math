/* ============================================================
   1학년용 공통 키트
   - 읽어 주기(🔊), 큰 숫자 키패드, 십 배열판, 수 모형, 수직선
   - 문제 카드(빈칸 □ 채우기 / 고르기), 스티커, 놀이(빙고·짝 맞추기·O X)
   core.js 다음에 불러와요.
   ============================================================ */
const G1 = {};

/* ---------- 소리 ---------- */
G1.voiceOn = (() => { try { return localStorage.getItem('g1-voice') !== 'off'; } catch (e) { return true; } })();
G1.speak = (text) => {
  if (!G1.voiceOn || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/□/g, '네모').replace(/[－-]/g, ' 빼기 ').replace(/[＋+]/g, ' 더하기 ').replace(/[＝=]/g, ' 는 '));
    u.lang = 'ko-KR'; u.rate = 0.92; u.pitch = 1.1;
    const v = speechSynthesis.getVoices().find(v => /ko/i.test(v.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
};
let AC = null;
G1.tone = (ok) => {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [660, 880, 1175] : [300, 220];
    notes.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = ok ? 'triangle' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, AC.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.25, AC.currentTime + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + i * 0.12 + 0.2);
      o.connect(g).connect(AC.destination); o.start(AC.currentTime + i * 0.12); o.stop(AC.currentTime + i * 0.12 + 0.22);
    });
  } catch (e) {}
};
G1.PRAISE = ['딩동댕! 🎉', '최고야! 🌟', '맞았어! 👏', '대단해! 💯', '멋져요! 🥳', '정답! 🍀'];
G1.TRY = ['다시 해 볼까? 🙂', '천천히 세어 보자 🐢', '거의 다 왔어! 💪'];
G1.pick = a => a[Math.floor(Math.random() * a.length)];
G1.ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
G1.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* 🔊 말풍선: 글 + 읽어 주기 버튼 */
G1.say = (html, speakText) => {
  const text = speakText || html.replace(/<[^>]+>/g, '');
  return h('div', {class: 'g1-say'},
    h('button', {class: 'g1-spk', title: '읽어 주기', onclick: () => G1.speak(text)}, '🔊'),
    h('div', {class: 'g1-say-t', html}));
};

/* ---------- 스티커 ---------- */
G1.STICKERS = ['🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁','🐸','🐵','🐥','🐧','🦄','🐳','🐬','🐙','🦋','🐞','🌻','🌈','⭐','🍓','🍉','🍩','🧁','🍭','🚀','🎈','🎨','🏆','👑','💎','🌙','☀️','🍀','🎵'];
G1.giveSticker = () => {
  S.stickers = S.stickers || [];
  const s = G1.pick(G1.STICKERS); S.stickers.push(s); save();
  const pop = h('div', {class: 'g1-sticker-pop'}, s);
  document.body.append(pop); setTimeout(() => pop.remove(), 1300);
  return s;
};

/* ---------- 십 배열판 ----------
   groups: [{n, color, cross}]  → 차례대로 칸을 채워요 (한 판에 10칸: 5칸 × 2줄) */
G1.COLORS = {red: '#FF7A59', blue: '#3E7BE6', green: '#2BB39A', yellow: '#FFC23C', gray: '#C9C1B3', purple: '#8A5CF6'};
G1.frames = (groups, opt = {}) => {
  const total = groups.reduce((s, g) => s + g.n, 0);
  const nf = Math.max(opt.frames || 0, Math.ceil(total / 10) || 1);
  const cells = [];
  groups.forEach(g => { for (let i = 0; i < g.n; i++) cells.push(g.color === 'empty' ? {empty: true} : {color: G1.COLORS[g.color] || g.color, cross: g.cross ? i >= g.n - g.cross : false, group: g}); });
  const wrap = h('div', {class: 'g1-frames'});
  for (let f = 0; f < nf; f++) {
    const fr = h('div', {class: 'g1-frame'});
    for (let i = 0; i < 10; i++) {
      const c = cells[f * 10 + i];
      const cell = h('div', {class: 'g1-cell'});
      if (c && !c.empty) {
        const dot = h('div', {class: 'g1-dot' + (c.cross ? ' x' : '')});
        dot.style.background = c.color; cell.append(dot);
      }
      fr.append(cell);
    }
    wrap.append(fr);
  }
  return wrap;
};

/* ---------- 수 모형 (십 모형 막대 + 일 모형) ---------- */
G1.blocks = (n, opt = {}) => {
  const tens = Math.floor(n / 10), ones = n % 10;
  const xt = opt.crossTens || 0, xo = opt.crossOnes || 0;
  const color = opt.color || '#3E7BE6';
  const wrap = h('div', {class: 'g1-blocks'});
  const tw = h('div', {class: 'g1-tens'});
  for (let i = 0; i < tens; i++) {
    const rod = h('div', {class: 'g1-rod' + (i >= tens - xt ? ' x' : '')});
    for (let k = 0; k < 10; k++) rod.append(h('i'));
    rod.style.setProperty('--c', color);
    if (opt.onRod) rod.onclick = () => opt.onRod(rod, i);
    tw.append(rod);
  }
  const ow = h('div', {class: 'g1-ones'});
  for (let i = 0; i < ones; i++) {
    const cube = h('div', {class: 'g1-cube' + (i >= ones - xo ? ' x' : '')});
    cube.style.setProperty('--c', color);
    if (opt.onCube) cube.onclick = () => opt.onCube(cube, i);
    ow.append(cube);
  }
  wrap.append(tw, ow);
  if (opt.label !== false) wrap.append(h('div', {class: 'g1-blk-lab'}, `${n}`));
  return wrap;
};

/* ---------- 수직선 (이어 세기 / 거꾸로 세기) ---------- */
G1.line = (from, to, start, jumps, opt = {}) => {
  const W = Math.min(720, (to - from) * 44 + 40), step = (W - 40) / (to - from);
  const x = v => 20 + (v - from) * step;
  let s = `<svg viewBox="0 0 ${W} 110" width="100%" style="max-width:${W}px"><line x1="10" y1="70" x2="${W - 10}" y2="70" stroke="#1F2A44" stroke-width="2"/>`;
  for (let v = from; v <= to; v++) s += `<line x1="${x(v)}" y1="64" x2="${x(v)}" y2="76" stroke="#888"/><text x="${x(v)}" y="96" font-size="15" text-anchor="middle" fill="${v === start ? '#FF7A59' : '#1F2A44'}" font-weight="${v === start ? 'bold' : 'normal'}">${v}</text>`;
  let cur = start;
  for (let i = 0; i < jumps; i++) {
    const nx = cur + (opt.back ? -1 : 1);
    s += `<path d="M${x(cur)} 64 Q ${(x(cur) + x(nx)) / 2} 22 ${x(nx)} 64" fill="none" stroke="${opt.back ? '#E5484D' : '#2BB39A'}" stroke-width="2.5"/><text x="${(x(cur) + x(nx)) / 2}" y="30" font-size="12" text-anchor="middle" fill="#5B6478">${i + 1}</text>`;
    cur = nx;
  }
  s += `<text x="${x(cur)}" y="56" font-size="22" text-anchor="middle">🐸</text></svg>`;
  return h('div', {class: 'g1-line', html: s});
};

/* ---------- 숫자 키패드 ---------- */
G1.activeBox = null;
G1.keypad = h('div', {class: 'g1-keypad'});
['1','2','3','4','5','6','7','8','9','⌫','0','✔'].forEach(k => {
  G1.keypad.append(h('button', {class: 'g1-key' + (k === '✔' ? ' ok' : k === '⌫' ? ' del' : ''), onclick: (e) => { e.preventDefault(); G1.key(k); }}, k));
});
G1.key = (k) => {
  const b = G1.activeBox; if (!b) return;
  if (k === '⌫') b.dataset.v = (b.dataset.v || '').slice(0, -1);
  else if (k === '✔') { const card = b.closest('.g1-prob'); if (card && card._check) card._check(); return; }
  else if ((b.dataset.v || '').length < (Number(b.dataset.max) || 2)) b.dataset.v = (b.dataset.v || '') + k;
  b.textContent = b.dataset.v || '';
  b.classList.remove('ok', 'no');
  // 칸이 다 차면 다음 빈칸으로
  if (k !== '⌫' && (b.dataset.v || '').length >= (Number(b.dataset.max) || 2)) {
    const card = b.closest('.g1-prob'); if (card) { const all = (card._boxes || [...card.querySelectorAll('.g1-box')]).filter(x => !x.classList.contains('done')); const nx = all[all.indexOf(b) + 1]; if (nx) G1.focus(nx); }
  }
};
G1.focus = (b) => {
  document.querySelectorAll('.g1-box.focus').forEach(x => x.classList.remove('focus'));
  G1.activeBox = b; b.classList.add('focus');
  const card = b.closest('.g1-prob');
  if (card) { const slot = card.querySelector('.g1-kp-slot'); if (slot && G1.keypad.parentNode !== slot) slot.append(G1.keypad); }
};
document.addEventListener('keydown', (e) => {
  if (!G1.activeBox || !document.body.contains(G1.activeBox)) return;
  if (/^[0-9]$/.test(e.key)) { G1.key(e.key); e.preventDefault(); }
  else if (e.key === 'Backspace') { G1.key('⌫'); e.preventDefault(); }
  else if (e.key === 'Enter') { G1.key('✔'); e.preventDefault(); }
});
/* 식 문자열 → 빈칸(□)이 있는 줄.  ans 배열 순서대로 □에 들어가요. "{2}" 처럼 쓰면 그 칸의 정답 자리수 */
G1.eqLine = (eq, boxes) => {
  const line = h('div', {class: 'g1-eq'});
  eq.split(/(□)/).forEach(part => {
    if (part === '□') { const b = h('span', {class: 'g1-box', onclick: () => G1.focus(b)}); boxes.push(b); line.append(b); }
    else if (part) line.append(h('span', {}, part));
  });
  return line;
};

/* ---------- 세로셈 (일의 자리부터 써요) ---------- */
G1.vertical = (a, b, op, boxes) => {
  const r = op === '+' ? a + b : a - b;
  const pad = n => String(n).padStart(2, ' ').split('');
  const tbl = h('div', {class: 'g1-vert'});
  const row = (cells, cls) => { const d = h('div', {class: 'g1-vrow ' + (cls || '')}); cells.forEach(c => d.append(c)); tbl.append(d); };
  const cell = t => h('span', {class: 'g1-vc'}, t.trim());
  row([h('span', {class: 'g1-vc op'}, ''), h('span', {class: 'g1-vc hd'}, '십'), h('span', {class: 'g1-vc hd'}, '일')], 'head');
  row([h('span', {class: 'g1-vc op'}, ''), ...pad(a).map(cell)]);
  row([h('span', {class: 'g1-vc op'}, op === '+' ? '+' : '−'), ...pad(b).map(cell)], 'under');
  const tensBox = h('span', {class: 'g1-box g1-vc', onclick: () => G1.focus(tensBox)});
  const onesBox = h('span', {class: 'g1-box g1-vc', onclick: () => G1.focus(onesBox)});
  tensBox.dataset.max = 1; onesBox.dataset.max = 1;
  row([h('span', {class: 'g1-vc op'}, ''), tensBox, onesBox]);
  boxes.push(onesBox, tensBox);   // 일의 자리 먼저
  const rr = String(r).padStart(2, '0');
  return {el: tbl, ans: [Number(rr[1]), Number(rr[0])], result: r};
};

/* ---------- 문제 카드 ----------
   p = {id, tag, say(읽을 글), q(html), visual(()=>El), lines:['7 + 5 = □'], ans:[12],
        vertical:{a,b,op}, choices:{options:[...], ans:i}, hint(()=>El|html), sol(html)} */
G1.problem = (p, opts = {}) => {
  const card = h('div', {class: 'g1-prob'});
  if (S.solved[p.id]) card.classList.add('solved');
  if (opts.num) card.append(h('div', {class: 'g1-num'}, String(opts.num)));
  card.append(G1.say(p.q, p.say));
  if (p.visual) { const v = p.visual(); if (v) card.append(h('div', {class: 'g1-visual'}, v)); }
  const boxes = []; let ans = (p.ans || []).slice();
  const area = h('div', {class: 'g1-eq-area'});
  (p.lines || []).forEach(l => area.append(G1.eqLine(l, boxes)));
  if (p.vertical) { const v = G1.vertical(p.vertical.a, p.vertical.b, p.vertical.op, boxes); area.append(v.el); ans = v.ans; }
  boxes.forEach((b, i) => { if (!b.dataset.max) b.dataset.max = String(String(ans[i] ?? '').length || 2); });
  card.append(area);
  let choice = null; const chWrap = h('div', {class: 'g1-choices'});
  if (p.choices) {
    p.choices.options.forEach((o, i) => chWrap.append(h('button', {class: 'g1-choice', html: o, onclick: (e) => {
      choice = i; [...chWrap.children].forEach(c => c.classList.remove('sel')); e.currentTarget.classList.add('sel');
      if (!boxes.length) check();
    }})));
    card.append(chWrap);
  }
  card.append(h('div', {class: 'g1-kp-slot'}));
  const fb = h('div', {class: 'g1-fb'}); const extra = h('div');
  let tries = 0, done = false;
  function check() {
    if (done) return;
    let ok = true;
    boxes.forEach((b, i) => { const good = (b.dataset.v || '') !== '' && Number(b.dataset.v) === ans[i]; b.classList.toggle('ok', good); b.classList.toggle('no', !good); ok = ok && good; });
    if (p.choices) { const good = choice === p.choices.ans; ok = ok && good; [...chWrap.children].forEach((c, i) => { c.classList.toggle('ok', good && i === choice); c.classList.toggle('no', !good && i === choice); }); }
    if (!boxes.length && !p.choices) ok = true;
    tries++;
    logEvent('attempt', {tag: p.tag || '', q: (p.say || p.q || '').replace(/<[^>]+>/g, '').slice(0, 160), ok: ok ? 'O' : 'X', tries,
      answer: [...boxes.map(b => b.dataset.v || ''), ...(p.choices && choice != null ? [p.choices.options[choice].replace(/<[^>]+>/g, '')] : [])].join(' | ')});
    if (ok) {
      done = true; card.classList.add('solved'); boxes.forEach(b => b.classList.add('done'));
      const msg = G1.pick(G1.PRAISE); fb.className = 'g1-fb good'; fb.textContent = msg;
      G1.tone(true); G1.speak(msg.replace(/[^가-힣! ]/g, ''));
      if (!S.solved[p.id]) { markSolved(p.id); G1.giveSticker(); }
      if (G1.keypad.parentNode && card.contains(G1.keypad)) G1.keypad.remove();
      opts.onSolve && opts.onSolve();
    } else {
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      G1.tone(false);
      const msg = G1.pick(G1.TRY); fb.className = 'g1-fb bad'; fb.textContent = msg;
      if (tries === 1 && p.hint) { extra.innerHTML = ''; const hv = typeof p.hint === 'function' ? p.hint() : h('div', {html: p.hint}); extra.append(h('div', {class: 'g1-hint'}, h('b', {}, '💡 힌트 '), hv)); }
      if (tries >= 2 && p.sol && !extra.querySelector('.g1-sol')) extra.append(h('div', {class: 'g1-sol', html: '👀 <b>이렇게 풀어요</b><br>' + p.sol}));
    }
  }
  card._check = check; card._boxes = boxes;
  const btnRow = h('div', {class: 'g1-acts'});
  if (boxes.length) btnRow.append(h('button', {class: 'g1-btn', onclick: check}, '확인 ✔'));
  card.append(btnRow, fb, extra);
  if (boxes.length && opts.autofocus) setTimeout(() => G1.focus(boxes[0]), 50);
  card.addEventListener('click', (e) => { if (!done && boxes.length && !e.target.closest('.g1-box,.g1-keypad,button')) G1.focus(boxes.find(b => !b.dataset.v) || boxes[0]); });
  return card;
};

/* 연습 문제 묶음: gens 함수들로 n개 만들고, 다 맞히면 onAll */
G1.practiceSet = (gens, n, prefix, onAll) => {
  const root = h('div');
  const list = h('div');
  const status = h('div', {class: 'g1-progress'});
  function build() {
    list.innerHTML = ''; let solved = 0;
    const order = G1.shuffle(gens).concat(G1.shuffle(gens)).concat(G1.shuffle(gens)).slice(0, n);
    const draw = () => { status.innerHTML = ''; for (let i = 0; i < n; i++) status.append(h('span', {class: i < solved ? 'on' : ''}, i < solved ? '⭐' : '☆')); };
    order.forEach((g, i) => { const p = g(); p.id = prefix + '-' + Date.now().toString(36) + i + Math.random().toString(36).slice(2, 5);
      list.append(G1.problem(p, {num: i + 1, onSolve: () => { solved++; draw(); if (solved === n) { G1.speak('다 맞혔어요! 정말 잘했어요!'); onAll && onAll(); } }})); });
    draw();
  }
  root.append(h('div', {class: 'g1-row', style: 'justify-content:space-between;margin-bottom:8px'}, status, h('button', {class: 'g1-btn ghost', onclick: build}, '🔄 새 문제')), list);
  build();
  return root;
};

/* ---------- 놀이: 빙고 ----------
   nums: 판에 들어갈 수(9개), makeQ(target) → {text, say} : target이 답인 문제 */
G1.bingo = (nums, makeQ, onWin) => {
  const root = h('div', {class: 'g1-game'});
  const board = h('div', {class: 'g1-bingo'});
  const qBox = h('div', {class: 'g1-bingo-q'});
  const fb = h('div', {class: 'g1-fb'});
  let cells = G1.shuffle(nums).map(v => ({v, on: false})), target = null, won = false;
  function lines() { const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; return L.filter(l => l.every(i => cells[i].on)).length; }
  function next() {
    const left = cells.filter(c => !c.on); if (!left.length) return;
    target = G1.pick(left).v; const q = makeQ(target);
    qBox.innerHTML = ''; qBox.append(G1.say(`<span class="g1-big">${q.text}</span>`, q.say || q.text));
    G1.speak(q.say || q.text);
  }
  function draw() {
    board.innerHTML = '';
    cells.forEach((c, i) => board.append(h('button', {class: 'g1-bcell' + (c.on ? ' on' : ''), onclick: () => {
      if (c.on || won) return;
      if (c.v === target) { c.on = true; G1.tone(true); const n = lines(); fb.className = 'g1-fb good'; fb.textContent = n ? `빙고 ${n}줄!` : G1.pick(G1.PRAISE);
        logEvent('attempt', {tag: '빙고', q: qBox.textContent.replace('🔊', '').trim(), ok: 'O', answer: String(c.v)});
        if (n >= 2 && !won) { won = true; fb.textContent = '🎉 빙고 두 줄! 이겼어요!'; G1.speak('빙고! 이겼어요!'); onWin && onWin(); }
        draw(); if (!won) next(); }
      else { G1.tone(false); fb.className = 'g1-fb bad'; fb.textContent = '다시 계산해 볼까? 🙂'; logEvent('attempt', {tag: '빙고', q: qBox.textContent.replace('🔊', '').trim(), ok: 'X', answer: String(c.v)}); }
    }}, String(c.v))));
  }
  root.append(h('div', {class: 'g1-game-t'}, '🎲 빙고 놀이 — 문제의 답을 판에서 찾아 눌러요. 두 줄을 먼저 만들면 이겨요!'), qBox, board, fb,
    h('button', {class: 'g1-btn ghost', onclick: () => { cells = G1.shuffle(nums).map(v => ({v, on: false})); won = false; fb.className = 'g1-fb'; draw(); next(); }}, '🔄 다시 하기'));
  draw(); next();
  return root;
};

/* ---------- 놀이: 짝 맞추기 (값이 같은 카드 2장) ----------
   pairs: [[식, 식], ...] 같은 값끼리 */
G1.match = (pairs, onWin, title) => {
  const root = h('div', {class: 'g1-game'});
  const grid = h('div', {class: 'g1-match'});
  const fb = h('div', {class: 'g1-fb'});
  let cards, open = [], found = 0, lock = false;
  function setup() {
    cards = G1.shuffle(pairs.flatMap((p, i) => p.map(t => ({t, k: i, up: false, done: false}))));
    open = []; found = 0; grid.innerHTML = ''; fb.className = 'g1-fb';
    cards.forEach(c => { const b = h('button', {class: 'g1-mcard', onclick: () => flip(c, b)}, '?'); c.el = b; grid.append(b); });
  }
  function flip(c, b) {
    if (lock || c.up || c.done) return;
    c.up = true; b.classList.add('up'); b.textContent = c.t; G1.speak(c.t); open.push(c);
    if (open.length === 2) {
      lock = true;
      const [a, d] = open;
      setTimeout(() => {
        if (a.k === d.k) { a.done = d.done = true; a.el.classList.add('done'); d.el.classList.add('done'); found++; G1.tone(true); fb.className = 'g1-fb good'; fb.textContent = '짝을 찾았어요! ' + G1.pick(['👏','🎉','🌟']);
          if (found === pairs.length) { fb.textContent = '🎉 모든 짝을 찾았어요!'; G1.speak('모든 짝을 찾았어요!'); logEvent('score', {tag: '짝 맞추기', q: title || '', ok: 'O', answer: `${found}쌍`}); onWin && onWin(); } }
        else { a.up = d.up = false; a.el.classList.remove('up'); d.el.classList.remove('up'); a.el.textContent = '?'; d.el.textContent = '?'; G1.tone(false); fb.className = 'g1-fb bad'; fb.textContent = '값이 달라요. 다시 찾아봐요!'; }
        open = []; lock = false;
      }, 900);
    }
  }
  root.append(h('div', {class: 'g1-game-t'}, title || '🃏 짝 맞추기 — 계산 결과가 같은 카드 2장을 찾아요!'), grid, fb, h('button', {class: 'g1-btn ghost', onclick: setup}, '🔄 다시 하기'));
  setup();
  return root;
};

/* ---------- 놀이: 맞을까 틀릴까 (O / X) ----------
   items: [{text, ok:boolean, fix}] */
G1.ox = (items, onWin, title) => {
  const root = h('div', {class: 'g1-game'});
  const box = h('div'); const fb = h('div', {class: 'g1-fb'}); const prog = h('div', {class: 'g1-progress'});
  let i = 0, score = 0, list = G1.shuffle(items);
  function show() {
    box.innerHTML = ''; prog.innerHTML = '';
    list.forEach((_, k) => prog.append(h('span', {class: k < i ? 'on' : ''}, k < i ? '●' : '○')));
    if (i >= list.length) {
      box.append(h('div', {class: 'g1-big', style: 'text-align:center'}, `${score} / ${list.length} 맞았어요!`));
      logEvent('score', {tag: 'O X 놀이', q: title || '', ok: score === list.length ? 'O' : 'X', answer: `${score}/${list.length}`});
      if (score >= list.length - 1) { G1.speak('정말 잘했어요!'); onWin && onWin(); }
      box.append(h('button', {class: 'g1-btn', style: 'margin:10px auto;display:block', onclick: () => { i = 0; score = 0; list = G1.shuffle(items); fb.className = 'g1-fb'; show(); }}, '한 번 더!'));
      return;
    }
    const it = list[i];
    box.append(G1.say(`<span class="g1-big">${it.text}</span>`, it.text + ' 맞을까요 틀릴까요?'));
    const ans = (v) => {
      const good = v === it.ok; if (good) score++;
      G1.tone(good); fb.className = 'g1-fb ' + (good ? 'good' : 'bad');
      fb.innerHTML = (good ? G1.pick(G1.PRAISE) : '앗! ') + (it.ok ? '' : ` 바른 답: <b>${it.fix}</b>`);
      i++; setTimeout(show, it.ok ? 700 : 1600);
    };
    box.append(h('div', {class: 'g1-row', style: 'justify-content:center;gap:24px;margin:12px 0'},
      h('button', {class: 'g1-ox o', onclick: () => ans(true)}, '⭕'), h('button', {class: 'g1-ox x', onclick: () => ans(false)}, '❌')));
  }
  root.append(h('div', {class: 'g1-game-t'}, title || '⭕❌ 계산이 맞으면 ⭕, 틀리면 ❌를 눌러요!'), prog, box, fb);
  show();
  return root;
};

/* ---------- 단계 따라 하기 (해 보기 활동용) ----------
   steps: [{say, visual(state)→El, lines:[...], ans:[...], choices, after(state)}] */
G1.steps = (steps, onDone) => {
  const root = h('div', {class: 'g1-steps'});
  let k = 0;
  function show() {
    if (k >= steps.length) { onDone && onDone(); return; }
    const s = steps[k];
    const p = Object.assign({id: 'step-' + Math.random().toString(36).slice(2)}, s, {q: `<span class="g1-stepno">${k + 1}</span> ${s.q}`});
    const card = G1.problem(p, {autofocus: true, onSolve: () => { k++; setTimeout(show, 700); }});
    card.classList.add('g1-step');
    root.append(card);
    setTimeout(() => card.scrollIntoView({behavior: 'smooth', block: 'center'}), 80);
    G1.speak(s.say || s.q.replace(/<[^>]+>/g, ''));
  }
  show();
  return root;
};

/* ---------- 나의 생각 (발견 노트, 1학년용) ---------- */
G1.thinkNote = (key, prompt, chips) => {
  const box = h('div', {class: 'g1-note'});
  const ta = h('textarea', {class: 'note', style: 'min-height:60px', placeholder: '하고 싶은 말을 써도 돼요 (안 써도 괜찮아요)'});
  S.picks = S.picks || {}; let picked = (S.picks[key] || '');
  ta.value = S.notes[key] || '';
  const fb = h('span', {class: 'small'});
  const row = h('div', {class: 'g1-row', style: 'flex-wrap:wrap;gap:8px;margin:8px 0'});
  chips.forEach(c => { const b = h('button', {class: 'g1-chip' + (picked === c ? ' sel' : ''), onclick: () => { picked = c; [...row.children].forEach(x => x.classList.remove('sel')); b.classList.add('sel'); G1.speak(c); }}, c); row.append(b); });
  box.append(G1.say('📒 <b>나의 생각</b> · ' + prompt), row, ta,
    h('div', {class: 'g1-row', style: 'gap:10px;margin-top:6px'}, h('button', {class: 'g1-btn', onclick: () => {
      const text = [picked, ta.value.trim()].filter(Boolean).join(' / ');
      if (!text) { fb.textContent = '하나를 골라 볼까요?'; return; }
      S.notes[key] = text; S.picks[key] = picked; save();
      logEvent('note', {tag: '발견 노트', q: prompt, answer: text});
      fb.textContent = '📒 노트에 저장했어요! 엄마에게도 보여요.'; G1.tone(true);
    }}, '노트에 저장'), fb));
  return box;
};

/* ============================================================
   단원 화면 틀: def = {title, lessons:[...], challenge:()=>[문제], intro}
   lesson = {key, no, title, em, sub, explore(root, done), gens:[], game(done)→El, note:{prompt, chips}}
   ============================================================ */
G1.unitApp = (def) => {
  const app = document.getElementById('app');
  const star = (k, L) => [S.explore[L.key] ? 1 : 0, (S.practice || {})[L.key] ? 1 : 0, S.concept[L.key] ? 1 : 0];
  const nav = document.getElementById('nav');
  function setNav(r) { if (nav) nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.r === r || (r.startsWith('L') && a.dataset.r === 'home'))); }
  function voiceBtn() {
    const b = h('button', {class: 'g1-voice', onclick: () => { G1.voiceOn = !G1.voiceOn; try { localStorage.setItem('g1-voice', G1.voiceOn ? 'on' : 'off'); } catch (e) {} b.textContent = G1.voiceOn ? '🔊 읽어 주기 켜짐' : '🔇 읽어 주기 꺼짐'; }}, G1.voiceOn ? '🔊 읽어 주기 켜짐' : '🔇 읽어 주기 꺼짐');
    return b;
  }
  function home() {
    const total = def.lessons.reduce((s, L) => s + M.sum(star(0, L)), 0);
    app.append(h('section', {class: 'lesson-head'},
      h('div', {class: 'kicker'}, def.kicker || ''), h('h1', {}, def.title),
      G1.say(def.intro || '해 보고, 연습하고, 놀이하면서 배워요!'),
      h('div', {class: 'g1-row', style: 'gap:12px;flex-wrap:wrap;margin-top:8px'}, h('span', {class: 'big-num'}, `⭐ ${total} / ${def.lessons.length * 3}`), h('span', {class: 'small'}, `스티커 ${(S.stickers || []).length}개`), voiceBtn())));
    const g = h('div', {class: 'g1-map'});
    def.lessons.forEach(L => {
      const st = star(0, L);
      g.append(h('div', {class: 'g1-mapcard', onclick: () => location.hash = 'L' + L.no},
        h('div', {class: 'em'}, L.em), h('div', {class: 'small'}, `${L.no}번째 공부`), h('h3', {}, L.title), h('div', {class: 'small'}, L.sub),
        h('div', {class: 'st', html: st.map(x => `<span class="${x ? 'on' : ''}">★</span>`).join('')})));
    });
    g.append(h('div', {class: 'g1-mapcard', style: 'border-color:#E8DDFE', onclick: () => location.hash = 'challenge'},
      h('div', {class: 'em'}, '🏆'), h('div', {class: 'small'}, '마지막'), h('h3', {}, '도전 문제'), h('div', {class: 'small'}, `조금 어려운 문제에 도전해요 · 해결 ${solvedCount('chal-')}개`)));
    app.append(g);
  }
  function lesson(L) {
    app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, `${L.no}번째 공부 ${L.em}`), h('h1', {}, L.title), G1.say(L.sub)));
    const tabs = h('div', {class: 'g1-tabs'}); const body = h('div');
    const names = ['🔍 해 보기', '✏️ 연습', '🎮 놀이'];
    const mark = () => { const st = star(0, L); [...tabs.children].forEach((t, i) => t.classList.toggle('done', !!st[i])); };
    function show(i) {
      [...tabs.children].forEach((t, j) => t.classList.toggle('on', i === j)); body.innerHTML = '';
      if (i === 0) {
        const root = h('div'); body.append(root);
        L.explore(root, () => { if (!S.explore[L.key]) { S.explore[L.key] = 1; save(); toast('🔍 해 보기 ⭐ 획득!'); logEvent('star', {tag: '해 보기 별', q: L.title}); } mark(); });
        if (L.note) body.append(G1.thinkNote('g1-' + L.key, L.note.prompt, L.note.chips));
        body.append(h('div', {style: 'text-align:right;margin-top:10px'}, h('button', {class: 'g1-btn mint', onclick: () => show(1)}, '연습하러 가기 →')));
      }
      if (i === 1) {
        body.append(G1.say('5문제를 모두 맞히면 별을 받아요! 빈칸을 누르고 숫자 버튼을 눌러요.'));
        body.append(G1.practiceSet(L.gens, 5, `g1p-${L.key}`, () => { S.practice = S.practice || {}; if (!S.practice[L.key]) { S.practice[L.key] = 1; save(); toast('✏️ 연습 ⭐ 획득!'); logEvent('star', {tag: '연습 별', q: L.title}); } mark(); }));
        body.append(h('div', {style: 'text-align:right;margin-top:10px'}, h('button', {class: 'g1-btn sky', onclick: () => show(2)}, '놀이하러 가기 →')));
      }
      if (i === 2) {
        body.append(L.game(() => { if (!S.concept[L.key]) { S.concept[L.key] = 1; save(); toast('🎮 놀이 ⭐ 획득!'); logEvent('star', {tag: '놀이 별', q: L.title}); } mark(); }));
        const idx = def.lessons.indexOf(L), nx = def.lessons[idx + 1];
        body.append(h('div', {style: 'text-align:right;margin-top:10px'}, nx ? h('a', {class: 'g1-btn', style: 'text-decoration:none;display:inline-block', href: '#L' + nx.no}, `다음: ${nx.title} →`) : h('a', {class: 'g1-btn', style: 'text-decoration:none;display:inline-block', href: '#challenge'}, '🏆 도전 문제 →')));
      }
      window.scrollTo(0, 0);
    }
    names.forEach((n, i) => tabs.append(h('button', {class: 'g1-tab', onclick: () => show(i)}, n)));
    app.append(tabs, body); mark(); show(0);
  }
  function challenge() {
    app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '🏆 도전'), h('h1', {}, '도전 문제'), G1.say('조금 어려워요. 천천히 생각하고, 막히면 그림을 그려 보세요!')));
    const list = h('div'); app.append(list);
    def.challenge().forEach((p, i) => { p.id = p.id || ('chal-' + i); list.append(G1.problem(p, {num: i + 1})); });
  }
  function stickers() {
    app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '🌟 스티커'), h('h1', {}, '내 스티커 모음'), G1.say(`처음 맞힌 문제마다 스티커를 받아요. 지금 ${(S.stickers || []).length}개 모았어요!`)));
    const g = h('div', {class: 'g1-stickers'}); (S.stickers || []).forEach(s => g.append(h('span', {}, s)));
    if (!(S.stickers || []).length) g.append(h('div', {class: 'cond'}, '아직 스티커가 없어요. 문제를 풀어 볼까요?'));
    app.append(g);
  }
  function route() {
    const r = (location.hash || '#home').slice(1); app.innerHTML = ''; setNav(r); G1.activeBox = null;
    try { speechSynthesis.cancel(); } catch (e) {}
    if (r.startsWith('L')) { const L = def.lessons.find(x => 'L' + x.no === r); if (L) return lesson(L); }
    if (r === 'challenge') return challenge();
    if (r === 'stickers') return stickers();
    home();
  }
  window.addEventListener('hashchange', route);
  return route;
};
