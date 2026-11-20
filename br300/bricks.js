/* ============================================================
   Bricks Reading 300 · Level 1 — 서윤이 혼자 공부하기
   책으로 본문을 읽고, 여기서는 단어 · 이해 확인 · 생각 쓰기 · 단어 놀이를 해요.
   ============================================================ */
const app = document.getElementById('app');
const SH = G1.shuffle, P = G1.pick;
const key = (U, k) => `br-${U.n}-${k}`;
const got = (U, k) => !!S.explore[key(U, k)];
const PARTS = [
  {k: 'words', n: '🔤 Words', d: '단어 익히기 → 단어 퀴즈'},
  {k: 'check', n: '📚 Reading Check', d: '책을 읽고 이해 확인'},
  {k: 'think', n: '✍️ Think & Write', d: '내 생각 쓰기 (엄마에게 전달돼요)'},
  {k: 'game', n: '🎮 Word Game', d: '영어-뜻 짝 맞추기'},
];
function giveStar(U, k, label) { if (!S.explore[key(U, k)]) { S.explore[key(U, k)] = 1; save(); toast(`⭐ Unit ${U.n} ${label} 완료!`); logEvent('star', {tag: `Unit ${U.n} ${label}`, q: 'Bricks Reading 300'}); } }
function addWrong(w) { S.wrong = S.wrong || {}; S.wrong[w[0]] = w; save(); }
function removeWrong(w) { if (S.wrong && S.wrong[w[0]]) { delete S.wrong[w[0]]; save(); } }
const single = w => !/\s/.test(w[0]);
/* 예문에서 단어(바뀐 모양 포함)를 찾아 빈칸으로 */
function cloze(w) {
  const first = w[0].split(' ')[0].replace(/[’']s$/, '');
  const stem = first.length > 4 ? first.replace(/e$|y$/, '') : first;
  const rest = w[0].split(' ').slice(1).join(' ');
  const re = new RegExp('\\b(' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[a-z’]*' + (rest ? ' ' + rest.replace(/one’s/, '\\w+') : '') + ')\\b', 'i');
  const m = w[3].match(re);
  return m ? {text: w[3].replace(m[1], '_____'), ans: m[1]} : null;
}

/* ---------------- 🔤 Words ---------------- */
function wordsTab(U, done) {
  const root = h('div');
  root.append(G1.say('카드를 눌러 뜻과 예문을 확인하고 🔊 로 발음을 들어요. 다 익혔으면 아래 <b>단어 퀴즈</b>를 풀어요!'));
  const grid = h('div', {class: 'br-cards'});
  U.v.forEach(w => {
    let open = false;
    const back = h('div', {class: 'br-back'}, h('div', {class: 'br-ko'}, w[2]), h('div', {class: 'br-ex'}, w[3]), EN.btn(w[3], '🔊 예문'));
    const card = h('div', {class: 'br-card', onclick: (e) => { if (e.target.closest('button')) return; open = !open; card.classList.toggle('open', open); }},
      h('div', {class: 'br-front'}, h('div', {class: 'br-w'}, w[0]), h('div', {class: 'small'}, w[1]), EN.btn(w[0], '🔊')), back);
    grid.append(card);
  });
  root.append(grid);
  const quizArea = h('div');
  root.append(h('div', {style: 'text-align:center;margin:16px 0'}, h('button', {class: 'g1-btn', onclick: (e) => { e.target.remove(); quizArea.append(wordQuiz(U, done)); quizArea.scrollIntoView({behavior: 'smooth'}); }}, '📝 단어 퀴즈 시작 (10문제)')), quizArea);
  return root;
}
function wordQuiz(U, done) {
  const ws = SH(U.v); const others = (w, n) => SH(U.v.filter(x => x !== w)).slice(0, n);
  const steps = [];
  const mc = (w, kind) => next => {
    let opts, ans, q;
    if (kind === 'ko') { opts = SH([w, ...others(w, 3)]); ans = opts.indexOf(w); q = `<b class="br-big">${w[0]}</b> 의 뜻은?`; opts = opts.map(x => x[2]); }
    else if (kind === 'en') { opts = SH([w, ...others(w, 3)]); ans = opts.indexOf(w); q = `<b>“${w[2]}”</b> 을(를) 영어로?`; opts = opts.map(x => `<span class="br-opt">${x[0]}</span>`); }
    else { const c = cloze(w); opts = SH([w, ...others(w, 3)]); ans = opts.indexOf(w); q = `빈칸에 알맞은 단어는? <span class="small">(모양이 조금 바뀔 수 있어요)</span><br><span class="br-sent">${c.text}</span>`; opts = opts.map(x => `<span class="br-opt">${x[0]}</span>`); }
    let wrongOnce = false;
    const card = G1.problem({id: 'br-q-' + Math.random().toString(36).slice(2), tag: `Unit ${U.n} 단어 퀴즈`, q, choices: {options: opts, ans}, sol: `${w[0]} = ${w[2]}<br>${w[3]}`}, {onSolve: () => { if (!wrongOnce) removeWrong(w); next(); }});
    setTimeout(() => card.querySelectorAll('.g1-choice').forEach(b => b.addEventListener('click', () => setTimeout(() => { if (b.classList.contains('no')) { wrongOnce = true; addWrong(w); } }, 0))), 0);
    return card;
  };
  const spell = w => next => {
    const c = h('div', {class: 'g1-prob'});
    c.append(h('div', {class: 'br-big'}, `“${w[2]}”`), h('div', {class: 'small', style: 'margin:4px 0'}, '뜻을 보고 영어 단어를 써요. 모르면 🔊 를 눌러 들어 봐요.'), EN.btn(w[0], '🔊 듣기'),
      typer(w[0], {tag: `Unit ${U.n} 철자`, q: w[0], onDone: next}).el);
    return c;
  };
  ws.slice(0, 3).forEach(w => steps.push(mc(w, 'ko')));
  ws.slice(3, 6).forEach(w => steps.push(mc(w, 'en')));
  const cl = ws.filter(w => cloze(w)); SH(cl).slice(0, 2).forEach(w => steps.push(mc(w, 'cloze')));
  const sp = ws.filter(single); SH(sp).slice(0, 10 - steps.length).forEach(w => steps.push(spell(w)));
  return stepRunner(steps, done);
}

/* ---------------- 📚 Reading Check ---------------- */
function checkTab(U, done) {
  const root = h('div');
  root.append(h('div', {class: 'br-book'}, h('div', {style: 'font-size:40px'}, '📗'), h('div', {},
    h('div', {class: 'br-big'}, `책 Unit ${String(U.n).padStart(2, '0')}을 펴요`), h('div', {}, `“${U.t}”`),
    h('div', {class: 'small'}, '본문은 책으로 읽어요. 처음엔 눈으로, 그다음엔 소리 내어 읽어요. 모르는 단어는 Words 탭에서 확인해요.'))));
  root.append(h('div', {class: 'q-box', style: '--c:var(--sky)'}, h('b', {}, '🤔 읽기 전에 '), U.pre));
  const reads = (S.reads = S.reads || {})[U.n] || 0;
  const chk = h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;margin:12px 0'});
  const qArea = h('div');
  for (let i = 1; i <= 3; i++) {
    const b = h('button', {class: 'g1-chip' + (reads >= i ? ' sel' : ''), onclick: () => {
      S.reads[U.n] = Math.max(S.reads[U.n] || 0, i); save(); [...chk.children].forEach((c, k) => c.classList.toggle('sel', k < S.reads[U.n]));
      logEvent('attempt', {tag: `Unit ${U.n} 소리 내어 읽기`, q: U.t, ok: 'O', answer: `${S.reads[U.n]}번 읽음`});
      if (!qArea.children.length) showQ();
    }}, `📖 ${i}번째 읽었어요`); chk.append(b);
  }
  root.append(h('div', {class: 'jua'}, '소리 내어 몇 번 읽었나요?'), chk, qArea);
  function showQ() {
    qArea.append(h('h3', {style: 'margin:14px 0 4px'}, '✅ 이해 확인 (6문제)'));
    const steps = U.q.map(q => next => {
      if (q[0] === 'TF') return G1.problem({id: 'br-c-' + Math.random().toString(36).slice(2), tag: `Unit ${U.n} 이해 확인`, q: `True or False?<br><span class="br-sent">${q[1]}</span>`, choices: {options: ['⭕ True', '❌ False'], ans: q[2] ? 0 : 1}, sol: q[2] ? '맞는 문장이에요. 책에서 근거를 찾아 밑줄을 그어 봐요.' : '틀린 문장이에요. 책에서 바른 내용을 찾아봐요.'}, {onSolve: next});
      const opts = q[2].map((o, i) => ({o, i})); const sh = SH(opts);
      return G1.problem({id: 'br-c-' + Math.random().toString(36).slice(2), tag: `Unit ${U.n} 이해 확인`, q: `<span class="br-sent">${q[1]}</span>`, choices: {options: sh.map(x => `<span style="font-size:19px">${x.o}</span>`), ans: sh.findIndex(x => x.i === q[3])}, sol: '책에서 답이 나온 문장을 찾아 다시 읽어 봐요.'}, {onSolve: next});
    });
    qArea.append(stepRunner(steps, done));
  }
  if (reads >= 1) showQ();
  return root;
}

/* ---------------- ✍️ Think & Write ---------------- */
function thinkTab(U, done) {
  const root = h('div');
  const k = 'br-think-' + U.n;
  const ta = h('textarea', {class: 'note', style: 'min-height:140px', placeholder: '영어로 써 보고, 어려우면 한국어로 써도 괜찮아요.'}); ta.value = S.notes[k] || '';
  const fb = h('div', {class: 'small', style: 'min-height:20px'});
  root.append(h('div', {class: 'q-box', style: '--c:var(--grape)'}, h('b', {}, `✍️ Unit ${U.n} 생각 쓰기 `), h('div', {style: 'margin-top:4px'}, U.think)), ta, fb,
    h('div', {class: 'g1-row', style: 'gap:10px;margin-top:8px;flex-wrap:wrap'}, h('button', {class: 'g1-btn', onclick: () => {
      const v = ta.value.trim(); if (v.length < 5) { fb.textContent = '조금만 더 써 볼까요?'; return; }
      S.notes[k] = v; save(); logEvent('note', {tag: '발견 노트', q: `[Bricks Unit ${U.n}] ${U.think}`, answer: v});
      fb.textContent = '📒 저장했어요! 첫 화면 발견 노트에 쌓이고, 엄마가 답장해 줄 수 있어요.'; G1.tone(true); done();
    }}, '저장하고 엄마에게 보내기'),
    h('span', {class: 'small'}, '💡 이번 단원 단어를 하나 이상 넣어 쓰면 더 좋아요: ' + U.v.slice(0, 4).map(w => w[0]).join(', '))));
  return root;
}

/* ---------------- 🎮 Word Game ---------------- */
function gameTab(U, done) {
  const ws = SH(U.v).slice(0, 5);
  return G1.match(ws.map(w => [w[0], w[2]]), done, '🃏 영어 단어와 뜻 짝 맞추기!');
}

/* ---------------- 화면 ---------------- */
function home() {
  const total = BR.reduce((s, U) => s + PARTS.filter(p => got(U, p.k)).length, 0);
  const nWrong = Object.keys(S.wrong || {}).length;
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, 'English · Bricks Reading 300'), h('h1', {}, 'Level 1 · 20 Units'),
    G1.say('단원마다 <b>Words → 책 읽기 + Reading Check → Think & Write → Word Game</b> 순서로 해요. 본문은 책으로 읽어요.'),
    h('div', {class: 'g1-row', style: 'gap:12px;flex-wrap:wrap;margin-top:6px'}, h('span', {class: 'big-num'}, `⭐ ${total} / ${BR.length * PARTS.length}`),
      nWrong ? h('a', {class: 'g1-btn ghost', href: '#wrong', style: 'text-decoration:none'}, `🔁 다시 볼 단어 ${nWrong}개`) : '', EN.btn('Hello, Seoyun! Let’s read!', '🔊 소리 확인'))));
  const g = h('div', {class: 'g1-map'});
  BR.forEach(U => g.append(h('div', {class: 'g1-mapcard', onclick: () => location.hash = 'U' + U.n},
    h('div', {class: 'em'}, U.em), h('div', {class: 'small'}, `Unit ${String(U.n).padStart(2, '0')}`), h('h3', {style: 'font-size:20px'}, U.t), h('div', {class: 'small'}, U.ko),
    h('div', {class: 'st', html: PARTS.map(p => `<span class="${got(U, p.k) ? 'on' : ''}">★</span>`).join('')}))));
  app.append(g);
}
function unit(U) {
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, `Unit ${String(U.n).padStart(2, '0')} ${U.em}`), h('h1', {}, U.t), h('p', {}, U.ko)));
  const tabs = h('div', {class: 'g1-tabs'}); const body = h('div');
  const F = {words: wordsTab, check: checkTab, think: thinkTab, game: gameTab};
  const mark = () => [...tabs.children].forEach((t, i) => t.classList.toggle('done', got(U, PARTS[i].k)));
  function show(i) {
    EN.stop(); [...tabs.children].forEach((t, j) => t.classList.toggle('on', i === j)); body.innerHTML = '';
    const p = PARTS[i]; body.append(h('div', {class: 'small', style: 'margin-bottom:6px'}, p.d));
    body.append(F[p.k](U, () => { giveStar(U, p.k, p.n.replace(/^\S+ /, '')); mark(); }));
    const nx = PARTS[i + 1];
    body.append(h('div', {style: 'text-align:right;margin-top:14px'}, nx ? h('button', {class: 'g1-btn mint', onclick: () => show(i + 1)}, `다음: ${nx.n} →`) : (BR[U.n] ? h('a', {class: 'g1-btn', style: 'text-decoration:none;display:inline-block', href: '#U' + (U.n + 1)}, `Unit ${U.n + 1} →`) : '')));
    window.scrollTo(0, 0);
  }
  PARTS.forEach((p, i) => tabs.append(h('button', {class: 'g1-tab', onclick: () => show(i)}, p.n)));
  app.append(tabs, body); mark(); show(0);
}
function wrongPage() {
  const list = Object.values(S.wrong || {});
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '🔁 복습'), h('h1', {}, '다시 볼 단어'), G1.say('퀴즈에서 틀렸던 단어예요. 다음 퀴즈에서 한 번에 맞히면 목록에서 빠져요.')));
  if (!list.length) { app.append(h('div', {class: 'cond'}, '다시 볼 단어가 없어요. 👏')); return; }
  const grid = h('div', {class: 'br-cards'});
  list.forEach(w => grid.append(h('div', {class: 'br-card open'}, h('div', {class: 'br-front'}, h('div', {class: 'br-w'}, w[0]), EN.btn(w[0], '🔊')), h('div', {class: 'br-back'}, h('div', {class: 'br-ko'}, w[2]), h('div', {class: 'br-ex'}, w[3])))));
  app.append(grid);
  if (list.length >= 3) app.append(G1.match(SH(list).slice(0, 5).map(w => [w[0], w[2]]), () => {}, '🃏 다시 볼 단어로 짝 맞추기'));
}
function route() {
  const r = (location.hash || '#home').slice(1); app.innerHTML = ''; EN.stop();
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === r || (r.startsWith('U') && a.dataset.r === 'home')));
  if (r.startsWith('U')) { const U = BR.find(x => 'U' + x.n === r); if (U) return unit(U); }
  if (r === 'wrong') return wrongPage();
  home();
}
window.addEventListener('hashchange', route);
updateWho(); ensureStudent(route); flushLog();
