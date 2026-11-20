/* ============================================================
   Bricks Reading 300 · Level 1 — 서윤이 혼자 공부하기
   책으로 본문을 읽고, 여기서는 단어 · 이해 확인 · 생각 쓰기 · 단어 놀이를 해요.
   ============================================================ */
const app = document.getElementById('app');
const SH = G1.shuffle, P = G1.pick;
const key = (U, k) => `br-${U.n}-${k}`;
const got = (U, k) => !!S.explore[key(U, k)];
const PARTS = [
  {k: 'words', n: '🔤 Words', d: '단어 익히기 → 읽기·뜻 말하기 → 단어 퀴즈'},
  {k: 'check', n: '📚 Reading Check', d: '책을 읽고 이해 확인'},
  {k: 'grammar', n: '🧩 Grammar', d: '이 단원의 문법 익히기 (6문제)'},
  {k: 'think', n: '✍️ Think & Write', d: '내 생각 쓰기 (엄마에게 전달돼요)'},
  {k: 'test', n: '📝 Unit Test', d: '단원 평가 유형 10문제 (한 번에 맞힌 것만 점수)'},
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
  const IRR = {come: 'came', take: 'took', break: 'broke', overcome: 'overcame', be: 'is|was|are|were'};
  const head = '(?:' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[a-z’]*' + (IRR[first] ? '|' + IRR[first] : '') + ')';
  const re = new RegExp('\\b(' + head + (rest ? ' ' + rest.replace(/one’s/, '\\w+') : '') + ')\\b', 'i');
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
  const more = (WL[U.n] || []).filter(([en]) => !U.v.some(w => w[0].toLowerCase() === en.toLowerCase()));
  if (more.length) {
    const box = h('details', {class: 'br-more'}, h('summary', {}, `📒 책 단어장의 단어 더 보기 (${more.length}개)`));
    const mg = h('div', {class: 'br-mini'});
    more.forEach(([en, ko]) => mg.append(h('div', {class: 'br-minicard'}, h('b', {}, en), h('span', {}, ko), EN.btn(en, '🔊'))));
    box.append(mg); root.append(box);
  }
  const quizArea = h('div'); const readArea = h('div');
  root.append(h('div', {style: 'text-align:center;margin:16px 0 0'}, h('button', {class: 'g1-btn mint', onclick: (e) => { e.target.remove(); readArea.append(readSession(SH(U.v.map(w => ({en: w[0], pos: w[1], ko: w[2], ex: w[3], u: U.n, w}))), {label: `Unit ${U.n} 읽기·뜻`, pool: wordPool(20)})); readArea.scrollIntoView({behavior: 'smooth'}); }}, '🗣️ 먼저 읽기·뜻 말하기 연습 (8단어)')), readArea);
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

/* ---------------- 📝 Unit Test (단원 평가 유형, 지문 없이 새로 만든 문제) ---------------- */
const CONNECT = [
  ['I was very tired. ___, I went to bed early.', 'As a result'], ['Dogs love people. ___, cats like to be alone.', 'On the other hand'],
  ['Some fruits are sour. ___, lemons taste very sour.', 'For example'], ['She is smart. ___, she is very kind.', 'In addition'],
  ['I wanted to play outside. ___, it was raining.', 'However'], ['It snowed all night. ___, school was closed.', 'As a result'],
  ['There are many ways to save water. ___, you can turn off the tap.', 'For example'], ['The test was hard. ___, I got a good score.', 'However'],
  ['Reading builds knowledge. ___, it helps you write better.', 'In addition'], ['Summer is hot in Korea. ___, winter is very cold.', 'On the other hand'],
];
const LINKS = ['However', 'For example', 'As a result', 'In addition', 'On the other hand'];
const GRAMMAR = [
  [['The dictionary was written in 1604.', 'He is called “Tree” by his friends.', 'The goose flies at the front.', 'She has lived here since 2010.'], 'The bridge was measure by students.', 'was measure → was measured (수동태: be + 과거분사)'],
  [['Geese fly in a V shape.', 'My brother doesn’t like carrots.', 'They were surprised at the news.', 'Bacteria cannot live without water.'], 'She go to school by bus every day.', 'go → goes (3인칭 단수 현재)'],
  [['The man who lives next door is a vet.', 'This is the book which I bought yesterday.', 'I am taller than my sister.', 'He decided to read more books.'], 'This is the most biggest tree in the park.', 'the most biggest → the biggest'],
  [['We stayed home because it was raining.', 'Because of the fog, the ship slowed down.', 'I want to be a pilot.', 'Can you help me?'], 'Because of it rained, we stayed home.', 'Because of + 명사 / Because + 주어 + 동사 → Because it rained'],
  [['There are many books on the shelf.', 'Two children are playing outside.', 'I saw three geese in the sky.', 'She has two boxes.'], 'There is five apples on the table.', 'There is → There are (복수)'],
  [['He can swim very fast.', 'You should wear a helmet.', 'We must protect the earth.', 'She will visit her grandma.'], 'They can plays the piano well.', 'can + 동사원형 → can play'],
  [['I enjoy reading books.', 'She finished doing her homework.', 'He wants to learn Chinese.', 'We decided to go camping.'], 'I enjoy to read books.', 'enjoy + -ing → enjoy reading'],
  [['The cake was made by my mom.', 'English is spoken in many countries.', 'The window was broken last night.', 'The letter was sent yesterday.'], 'The song was sing by a famous singer.', 'was sing → was sung'],
  [['If it rains, we will stay home.', 'When I was young, I lived in Busan.', 'I was reading when he called.', 'She has never seen snow.'], 'Yesterday I go to the museum.', 'Yesterday(과거) → went'],
  [['Everyone is happy today.', 'Each student has a book.', 'Nobody knows the answer.', 'Both of them are tall.'], 'Every students has a pencil.', 'Every + 단수 명사 → Every student'],
];
function testTab(U, done) {
  const items = [];
  const others = (w, n) => SH(U.v.filter(x => x !== w)).slice(0, n);
  // 1. 밑줄 친 부분의 뜻이 올바르지 않은 것
  (() => { const ws = SH(U.v).slice(0, 5); const bad = P(ws); const fake = P(U.v.filter(x => x !== bad))[2];
    const ul = w => { const c = cloze(w); return c ? w[3].replace(c.ans, `<u>${c.ans}</u>`) : `${w[3]} <u>(${w[0]})</u>`; };
    items.push({type: 'mc', q: '다음 중 밑줄 친 부분의 뜻이 <b>올바르지 않은</b> 것은?', opts: ws.map(w => `${ul(w)} <span class="small">(${w === bad ? fake : w[2]})</span>`), ans: ws.indexOf(bad), sol: `${bad[0]} = ${bad[2]}`}); })();
  // 2-3. 빈칸에 알맞은 단어
  SH(U.v.filter(w => cloze(w))).slice(0, 2).forEach(w => { const opts = SH([w, ...others(w, 4)]); items.push({type: 'mc', q: `다음 빈칸에 들어갈 말로 가장 적절한 것은? <span class="small">(모양이 바뀔 수 있어요)</span><br><span class="br-sent">${cloze(w).text}</span>`, opts: opts.map(x => x[0]), ans: opts.indexOf(w), sol: w[3]}); });
  // 4. 연결어
  (() => { const [t, a] = P(CONNECT); items.push({type: 'mc', q: `다음 빈칸에 들어갈 말로 가장 적절한 것은?<br><span class="br-sent">${t}</span>`, opts: LINKS, ans: LINKS.indexOf(a), sol: t.replace('___', a)}); })();
  // 5-6. 어법
  items.push(grItem(U.n - 1));
  SH(GRAMMAR).slice(0, 1).forEach(([ok, bad, why]) => { const opts = SH([...ok, bad]); items.push({type: 'mc', q: '다음 중 어법상 <b>틀린</b> 문장은?', opts, ans: opts.indexOf(bad), sol: why}); });
  // 7-8. 배열 영작
  SH(U.v.filter(w => w[3].split(' ').length <= 10)).slice(0, 2).forEach(w => items.push({type: 'order', q: `단어를 바르게 배열하여 문장을 완성하시오. <span class="small">(힌트: ${w[0]} = ${w[2]})</span>`, sent: w[3]}));
  // 9. 내용 일치
  (() => { const tf = U.q.filter(q => q[0] === 'TF'); const t = P(tf); items.push({type: 'mc', q: `글의 내용과 일치하면 True, 일치하지 않으면 False를 고르시오.<br><span class="br-sent">${t[1]}</span>`, opts: ['True', 'False'], ans: t[2] ? 0 : 1, sol: '책에서 근거 문장을 찾아 확인해 봐요.'}); })();
  // 10. 영어로 답하기 (스스로 채점)
  (() => { const mc = P(U.q.filter(q => q[0] === 'MC' && !/mostly about/.test(q[1]))); items.push({type: 'open', q: `글의 내용에 맞게 다음 질문에 <b>영어로</b> 답하시오.<br><span class="br-sent">${mc[1]}</span>`, model: mc[2][mc[3]]}); })();
  return runTest(items, {label: `Unit ${U.n} 단원 평가`, note: `Bricks Unit ${U.n} 단원 평가`, pass: 8, done, again: () => testTab(U, done),
    intro: '책 단원 평가와 같은 유형을 <b>새로 만든 문제</b>로 풀어요. 한 번에 맞힌 것만 점수가 돼요. 볼 때마다 문제가 바뀌어요!'});
}

/* 공통 시험 진행기: items = [{type:'mc'|'order'|'open', ...}] */
function runTest(items, cfg) {
  const root = h('div'); let score = 0, idx = 0; const total = items.length;
  const prog = h('div', {class: 'g1-progress'}); const slot = h('div'); const head = h('div', {class: 'jua', style: 'font-size:20px'});
  const drawHead = () => { head.textContent = `문제 ${Math.min(idx + 1, total)} / ${total} · 점수 ${score}`; prog.innerHTML = ''; items.forEach((_, k) => prog.append(h('span', {class: k < idx ? 'on' : ''}, k < idx ? '●' : '○'))); };
  const next = () => { idx++; setTimeout(show, 300); };
  function card(it) {
    const c = h('div', {class: 'g1-prob'}); c.append(h('div', {class: 'g1-num'}, String(idx + 1)), h('div', {class: 'br-tq', html: it.q}));
    const fb = h('div', {class: 'g1-fb'}); const nx = h('button', {class: 'g1-btn mint hide', onclick: next}, '다음 →');
    if (it.type === 'mc') {
      const list = h('div', {class: 'br-opts'}); let locked = false;
      it.opts.forEach((o, i) => list.append(h('button', {class: 'br-optbtn', html: `<b>${'①②③④⑤'[i]}</b> ${o}`, onclick: (e) => {
        if (locked) return; locked = true; const ok = i === it.ans; if (ok) score++;
        e.currentTarget.classList.add(ok ? 'ok' : 'no'); list.children[it.ans].classList.add('ok');
        fb.className = 'g1-fb ' + (ok ? 'good' : 'bad'); fb.innerHTML = (ok ? '정답! ' : '오답. ') + `<span class="small">${it.sol || ''}</span>`; G1.tone(ok);
        logEvent('attempt', {tag: cfg.label, q: it.q.replace(/<[^>]+>/g, ' ').slice(0, 160), ok: ok ? 'O' : 'X', answer: it.opts[i].replace(/<[^>]+>/g, '')});
        nx.classList.remove('hide'); drawHead();
      }})));
      c.append(list);
    } else if (it.type === 'order') {
      const words = it.sent.split(' '); let picked = [];
      const line = h('div', {class: 'br-line'}); const pool = h('div', {class: 'br-pool'});
      const draw = () => { line.innerHTML = ''; picked.forEach((p, k) => line.append(h('button', {class: 'br-tile on', onclick: () => { picked.splice(k, 1); p.b.disabled = false; draw(); }}, p.w))); if (!picked.length) line.append(h('span', {class: 'small'}, '아래 단어를 순서대로 눌러요')); };
      SH(words.map((w, i) => ({w, i}))).forEach(o => { const b = h('button', {class: 'br-tile', onclick: () => { b.disabled = true; picked.push({w: o.w, b}); draw(); if (picked.length === words.length) chk(); }}, o.w); pool.append(b); });
      let done1 = false;
      function chk() { if (done1) return; done1 = true; const ans = picked.map(p => p.w).join(' '); const ok = ans === it.sent; if (ok) score++;
        fb.className = 'g1-fb ' + (ok ? 'good' : 'bad'); fb.innerHTML = ok ? '정답!' : `오답. 바른 문장: <span class="br-sent" style="font-size:18px">${it.sent}</span>`; G1.tone(ok); EN.speak(it.sent);
        logEvent('attempt', {tag: cfg.label + ' 배열', q: it.sent, ok: ok ? 'O' : 'X', answer: ans}); nx.classList.remove('hide'); drawHead(); }
      c.append(line, pool); draw();
    } else {
      const ta = h('textarea', {class: 'note', style: 'min-height:70px', placeholder: 'Write in English.'});
      const sub = h('button', {class: 'g1-btn', onclick: () => {
        if (ta.value.trim().length < 3) return; sub.remove(); ta.readOnly = true;
        logEvent('note', {tag: '발견 노트', q: `[${cfg.note}] ${it.q.replace(/<[^>]+>/g, ' ')}`, answer: ta.value.trim()});
        c.append(h('div', {class: 'g1-sol', html: `<b>예시 답</b><br>${it.model}<br><span class="small">내 답이 같은 뜻이면 맞은 거예요. 스스로 채점해요!</span>`}),
          h('div', {class: 'g1-row', style: 'gap:10px;margin-top:8px'}, h('button', {class: 'g1-btn mint', onclick: () => { score++; drawHead(); next(); }}, '⭕ 맞았어요'), h('button', {class: 'g1-btn ghost', onclick: next}, '❌ 다시 볼게요')));
      }}, '답 제출');
      c.append(ta, sub);
    }
    c.append(fb, nx); return c;
  }
  function show() {
    drawHead(); slot.innerHTML = '';
    if (idx >= items.length) {
      const pass = score >= cfg.pass;
      slot.append(h('div', {class: 'g1-big', style: 'text-align:center;margin:18px 0'}, `Score ${score} / ${total} ${pass ? '🎉' : '💪'}`),
        h('div', {style: 'text-align:center'}, pass ? `잘했어요! ${cfg.pass}점 이상이면 별을 받아요.` : `${cfg.pass}점 이상이면 별을 받아요. 틀린 문제를 다시 보고 도전해요!`),
        h('div', {style: 'text-align:center;margin-top:10px'}, h('button', {class: 'g1-btn', onclick: () => { root.replaceWith(cfg.again()); }}, '🔄 새 시험 보기')));
      logEvent('score', {tag: '전체 채점', q: cfg.note, ok: pass ? 'O' : 'X', answer: `${score}/${total}`});
      if (pass && cfg.done) cfg.done();
      return;
    }
    slot.append(card(items[idx]));
  }
  root.append(G1.say(cfg.intro), head, prog, slot);
  show();
  return root;
}


/* ---------------- 🧩 Grammar ---------------- */
function grItem(i, label) {
  const g = GR[i]; const [sent, opts0] = P(g.items); const opts = SH(opts0);
  return {type: 'mc', q: `${label ? `<span class="small">[${label}]</span> ` : ''}빈칸에 알맞은 것은?<br><span class="br-sent">${sent.replace('___', '<u>&nbsp;&nbsp;?&nbsp;&nbsp;</u>')}</span>`,
    opts, ans: opts.indexOf(opts0[0]), sol: `${sent.replace('___', opts0[0])}<br>📌 ${g.t}: ${g.ex}`};
}
function grammarTab(U, done) {
  const g = GR[U.n - 1];
  const items = SH(g.items).map(([sent, o]) => { const opts = SH(o); return {type: 'mc', q: `빈칸에 알맞은 것은?<br><span class="br-sent">${sent.replace('___', '<u>&nbsp;&nbsp;?&nbsp;&nbsp;</u>')}</span>`, opts, ans: opts.indexOf(o[0]), sol: sent.replace('___', o[0])}; });
  const root = h('div');
  root.append(h('div', {class: 'br-gbox'}, h('div', {class: 'kicker'}, '📌 오늘의 문법'), h('h3', {}, g.t), h('p', {}, g.ex),
    h('div', {class: 'small'}, '책의 Grammar Sheet에 나온 문법이에요. 본문에서 이 문법이 쓰인 문장을 찾아 밑줄 쳐 봐요!')));
  root.append(runTest(items, {label: `Unit ${U.n} 문법`, note: `Bricks Unit ${U.n} 문법`, pass: 5, done, again: () => grammarTab(U, done),
    intro: '6문제 중 5개 이상 한 번에 맞히면 별을 받아요.'}));
  return root;
}

/* ---------------- 🎮 Word Game ---------------- */
function gameTab(U, done) {
  const ws = SH(U.v).slice(0, 5);
  const root = h('div');
  root.append(G1.match(ws.map(w => [w[0], w[2]]), done, '🃏 영어 단어와 뜻 짝 맞추기!'));
  const more = (WL[U.n] || []).filter(([en]) => !U.v.some(w => w[0].toLowerCase() === en.toLowerCase()));
  if (more.length >= 5) root.append(h('div', {style: 'margin-top:18px'}), G1.match(SH(more).slice(0, 5).map(([en, ko]) => [en, ko.split(/,|\//)[0].trim()]), () => toast('📒 단어장 단어도 척척! 👏'), '📒 보너스: 책 단어장 단어 짝 맞추기'));
  return root;
}


/* ---------------- 📋 Review Test (4단원씩) · 🏁 Final Test ---------------- */
const SYN = [['big', 'huge'], ['quickly', 'fast'], ['receive', 'get'], ['occur', 'happen'], ['begin', 'start'], ['choose', 'select'], ['finish', 'complete'], ['look for', 'search'], ['shout', 'yell'], ['smart', 'clever'], ['ancient', 'old'], ['scared', 'afraid']];
const ANT = [['wide', 'narrow'], ['dangerous', 'safe'], ['fill', 'empty'], ['borrow', 'lend'], ['modern', 'traditional'], ['increase', 'reduce'], ['accept', 'refuse'], ['remember', 'forget'], ['visible', 'invisible'], ['common', 'rare'], ['damage', 'repair'], ['arrive', 'leave']];
const pair = p => `${p[0]} : ${p[1]}`;
function relItem() {
  const syn = Math.random() < .5; const same = SH(syn ? SYN : ANT); const odd = P(syn ? ANT : SYN);
  const opts = SH([...same.slice(1, 4), odd].map(pair));
  return {type: 'mc', q: `다음 &lt;보기&gt;와 관계가 <b>다른</b> 것은?<br><span class="br-sent">&lt;보기&gt; ${pair(same[0])}</span> <span class="small">(${syn ? '비슷한 말' : '반대말'})</span>`, opts, ans: opts.indexOf(pair(odd)), sol: `${pair(odd)} 는 ${syn ? '반대말' : '비슷한 말'}이에요.`};
}
function wlItem(us) {
  const all = us.flatMap(U => (WL[U.n] || []).filter(([en]) => !U.v.some(w => w[0].toLowerCase() === en.toLowerCase()))); const sh = SH(all); const w = sh[0];
  const seen = new Set([w[1]]); const others = sh.slice(1).filter(x => !seen.has(x[1]) && seen.add(x[1])).slice(0, 3);
  const opts = SH([w, ...others]); return {type: 'mc', q: `<b class="br-big">${w[0]}</b> 의 뜻은? <span class="small">(📒 책 단어장)</span>`, opts: opts.map(x => x[1]), ans: opts.indexOf(w), sol: `${w[0]} = ${w[1]}`};
}
function buildTest(us, n) {
  const items = []; const V = us.flatMap(U => U.v.map(w => [w, U])); const C = SH(V.filter(([w]) => cloze(w)));
  const lab = U => `Unit ${U.n}`;
  // 단어 상자에서 골라 쓰기
  const bank = C.slice(0, n.bank); const bw = bank.map(([w]) => w[0]);
  bank.forEach(([w, U]) => items.push({type: 'mc', q: `<span class="small">[단어 상자: ${SH(bw).join(' · ')}]</span><br>빈칸에 알맞은 단어는? <span class="small">(${lab(U)}, 모양이 바뀔 수 있어요)</span><br><span class="br-sent">${cloze(w).text}</span>`, opts: bw, ans: bw.indexOf(w[0]), sol: w[3]}));
  // 알맞은 단어 고르기
  C.slice(n.bank, n.bank + n.choose).forEach(([w, U]) => { const o = SH([w, ...SH(V.map(x => x[0]).filter(x => x !== w)).slice(0, 3)]); items.push({type: 'mc', q: `빈칸에 가장 알맞은 것은? <span class="small">(${lab(U)})</span><br><span class="br-sent">${cloze(w).text}</span>`, opts: o.map(x => x[0]), ans: o.indexOf(w), sol: w[3]}); });
  for (let i = 0; i < n.wl; i++) items.push(wlItem(us));
  for (let i = 0; i < n.rel; i++) items.push(relItem());
  SH(us).slice(0, n.gr).forEach(U => items.push(grItem(U.n - 1, `${lab(U)} 문법`)));
  SH(V.filter(([w]) => w[3].split(' ').length <= 10)).slice(0, n.order).forEach(([w]) => items.push({type: 'order', q: `단어를 바르게 배열하여 문장을 완성하시오. <span class="small">(힌트: ${w[0]} = ${w[2]})</span>`, sent: w[3]}));
  SH(us).slice(0, n.tf).forEach(U => { const t = P(U.q.filter(q => q[0] === 'TF')); items.push({type: 'mc', q: `<span class="small">[${lab(U)} ${U.t}]</span><br>글의 내용과 일치하면 True, 아니면 False.<br><span class="br-sent">${t[1]}</span>`, opts: ['True', 'False'], ans: t[2] ? 0 : 1, sol: '생각이 안 나면 책을 다시 펴서 확인해요.'}); });
  return items;
}
const REVIEWS = [1, 2, 3, 4, 5].map(r => ({r, from: r * 4 - 3, to: r * 4}));
const rgot = k => !!S.explore['br-' + k];
function rstar(k, label) { if (!rgot(k)) { S.explore['br-' + k] = 1; save(); toast(`🏆 ${label} 통과!`); logEvent('star', {tag: label, q: 'Bricks Reading 300'}); } }
function reviewPage(R) {
  const us = BR.filter(U => U.n >= R.from && U.n <= R.to); const label = `Review Test ${R.r} (Unit ${R.from}~${R.to})`;
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '📋 Review Test'), h('h1', {}, label), h('p', {}, us.map(U => `${U.em} ${U.t}`).join(' · '))));
  const mk = () => runTest(buildTest(us, {bank: 5, choose: 4, wl: 2, rel: 1, gr: 4, order: 2, tf: 2}), {label, note: `Bricks ${label}`, pass: 16, done: () => rstar('R' + R.r, label), again: mk,
    intro: '책 Review Test와 같은 유형(단어 상자, 알맞은 단어, 문법, 문장 배열, 내용 확인)을 <b>새로 만든 20문제</b>로 풀어요. 16점 이상이면 🏆!'});
  app.append(mk());
}
function finalPage() {
  const label = 'Final Test (Unit 1~20)';
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '🏁 Final Test'), h('h1', {}, label), G1.say('20단원 전체에서 골고루 나와요. 리뷰 테스트를 다 통과한 뒤에 도전해 봐요!')));
  const mk = () => runTest(buildTest(BR, {bank: 0, choose: 6, wl: 3, rel: 3, gr: 5, order: 1, tf: 2}), {label, note: `Bricks ${label}`, pass: 16, done: () => rstar('F', label), again: mk,
    intro: '20문제 · 16점 이상이면 🏆 Level 1 완료! 볼 때마다 문제가 바뀌어요.'});
  app.append(mk());
}

/* ---------------- 화면 ---------------- */
function home() {
  const total = BR.reduce((s, U) => s + PARTS.filter(p => got(U, p.k)).length, 0);
  const nWrong = Object.keys(S.wrong || {}).length;
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, 'English · Bricks Reading 300'), h('h1', {}, 'Level 1 · 20 Units'),
    G1.say('단원마다 <b>Words → 책 읽기 + Reading Check → Grammar → Think & Write → Unit Test → Word Game</b> 순서로 해요. 본문은 책으로 읽어요.'),
    h('div', {class: 'g1-row', style: 'gap:12px;flex-wrap:wrap;margin-top:6px'}, h('span', {class: 'big-num'}, `⭐ ${total} / ${BR.length * PARTS.length}`),
      nWrong ? h('a', {class: 'g1-btn ghost', href: '#wrong', style: 'text-decoration:none'}, `🔁 다시 볼 단어 ${nWrong}개`) : '', EN.btn('Hello, Seoyun! Let’s read!', '🔊 소리 확인'))));
  const td = todaySet(); const tn = td.due.length + td.fresh.length;
  app.append(h('a', {class: 'br-daily', href: '#daily'}, h('div', {class: 'em'}, S.dDone === dayNo() ? '✅' : '📅'), h('div', {}, h('b', {}, '오늘의 단어'), h('div', {class: 'small'}, S.dDone === dayNo() ? '오늘 완료! 더 해도 좋아요' : `소리 내어 읽고 뜻 말하기 · 오늘 ${tn}단어 (복습 ${td.due.length})`)), h('span', {class: 'g1-btn'}, '시작 →')));
  const g = h('div', {class: 'g1-map'});
  BR.forEach(U => g.append(h('div', {class: 'g1-mapcard', onclick: () => location.hash = 'U' + U.n},
    h('div', {class: 'em'}, U.em), h('div', {class: 'small'}, `Unit ${String(U.n).padStart(2, '0')}`), h('h3', {style: 'font-size:20px'}, U.t), h('div', {class: 'small'}, U.ko),
    h('div', {class: 'st', html: PARTS.map(p => `<span class="${got(U, p.k) ? 'on' : ''}">★</span>`).join('')}))));
  app.append(g);
  const rv = h('div', {class: 'g1-map', style: 'margin-top:16px'});
  REVIEWS.forEach(R => rv.append(h('div', {class: 'g1-mapcard br-rv', onclick: () => location.hash = 'R' + R.r}, h('div', {class: 'em'}, rgot('R' + R.r) ? '🏆' : '📋'), h('h3', {style: 'font-size:19px'}, `Review Test ${R.r}`), h('div', {class: 'small'}, `Unit ${R.from} ~ ${R.to} · 20문제`))));
  rv.append(h('div', {class: 'g1-mapcard br-rv', onclick: () => location.hash = 'F'}, h('div', {class: 'em'}, rgot('F') ? '🏆' : '🏁'), h('h3', {style: 'font-size:19px'}, 'Final Test'), h('div', {class: 'small'}, 'Unit 1 ~ 20 · 20문제')));
  app.append(h('h2', {class: 'jua', style: 'margin:22px 0 4px'}, '📋 4단원마다 복습 시험'), rv);
}
function unit(U) {
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, `Unit ${String(U.n).padStart(2, '0')} ${U.em}`), h('h1', {}, U.t), h('p', {}, U.ko)));
  const tabs = h('div', {class: 'g1-tabs'}); const body = h('div');
  const F = {words: wordsTab, check: checkTab, grammar: grammarTab, think: thinkTab, test: testTab, game: gameTab};
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
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === r || (r.startsWith('U') && a.dataset.r === 'home') || (/^R\d/.test(r) && a.dataset.r === 'R1')));
  if (r.startsWith('U')) { const U = BR.find(x => 'U' + x.n === r); if (U) return unit(U); }
  if (r === 'wrong') return wrongPage();
  if (/^R[1-5]$/.test(r)) return reviewPage(REVIEWS[+r[1] - 1]);
  if (r === 'F') return finalPage();
  if (r === 'daily') return dailyPage();
  home();
}
window.addEventListener('hashchange', route);
updateWho(); ensureStudent(route); flushLog();
