/* ============================================================
   1-2 · 4단원 덧셈과 뺄셈(2) — 받아올림이 있는 (몇)+(몇), 받아내림이 있는 (십몇)-(몇)
   (교과서 활동을 바탕으로 숫자와 상황을 바꾼 문제예요)
   ============================================================ */
const R = G1.ri, P = G1.pick;
const add2 = () => { const a = R(3, 9); const b = R(Math.max(2, 11 - a), 9); return [a, b]; };       // 합 11~18
const sub2 = () => { const b = R(3, 9); const a = R(11, b + 9); return [a, b]; };                      // 받아내림 (십몇)-(몇)=(몇)
const THINGS = [['구슬', '개', '🔵'], ['사탕', '개', '🍬'], ['우유갑', '개', '🥛'], ['딱지', '장', '🟥'], ['색종이', '장', '🟨'], ['연필', '자루', '✏️']];
const emo = (e, n) => h('div', {style: 'font-size:26px;letter-spacing:2px;line-height:1.3'}, e.repeat(n));

/* 눌러서 지우는 십 배열판 */
function tapFrames(total, color, onChange) {
  const crossed = new Set(); const wrap = h('div');
  function draw() {
    wrap.innerHTML = '';
    const fr = G1.frames([{n: total, color}], {frames: Math.ceil(total / 10)});
    fr.querySelectorAll('.g1-dot').forEach((d, i) => {
      if (crossed.has(i)) d.classList.add('x');
      d.parentNode.classList.add('tap');
      d.parentNode.onclick = () => { crossed.has(i) ? crossed.delete(i) : crossed.add(i); draw(); onChange && onChange(crossed.size); };
    });
    wrap.append(fr);
  }
  draw(); return {el: wrap, count: () => crossed.size};
}
/* 10 만들기 그림: 첫 판에 a, 둘째 판에 b (moved 개는 첫 판으로 옮김) */
function make10Frames(a, b, moved, cross) {
  const groups = [{n: a, color: 'red'}, {n: moved, color: 'blue'}, {n: 10 - a - moved, color: 'empty'}, {n: b - moved, color: 'blue'}];
  return G1.frames(groups.filter(g => g.n > 0), {frames: 2});
}

const LESSONS = [
  {key: 'add-meet', no: 1, em: '🥛', title: '덧셈을 알아볼까요', sub: '우유갑 7개에 5개를 더 가져왔어요. 모두 몇 개일까요?',
    explore(root, done) {
      let a = 7, b = 5;
      function start() {
        root.innerHTML = ''; let added = 0;
        root.append(G1.say(`빨간 우유갑이 <b>${a}개</b> 있어요. 파란 버튼을 눌러 <b>${b}개</b>를 하나씩 더 넣으면서 소리 내어 세어 보세요.`));
        const fr = h('div', {class: 'g1-visual'}), ln = h('div', {class: 'g1-visual'}), cnt = h('div', {class: 'g1-big'}, `${a}`);
        const redraw = () => { fr.innerHTML = ''; fr.append(G1.frames([{n: a, color: 'red'}, {n: added, color: 'blue'}], {frames: 2})); ln.innerHTML = ''; ln.append(G1.line(a - 2 < 0 ? 0 : a - 2, Math.min(20, a + b + 2), a, added)); };
        const btn = h('button', {class: 'g1-btn sky', onclick: () => {
          if (added >= b) return; added++; redraw(); cnt.textContent = Array.from({length: added + 1}, (_, i) => a + i).join(' → '); G1.speak(String(a + added));
          if (added === b) { btn.disabled = true;
            root.append(G1.steps([{q: `빨간 ${a}개와 파란 ${b}개, 모두 몇 개일까요?`, lines: [`${a} + ${b} = □`], ans: [a + b], hint: `${a} 다음부터 ${b}번 이어 세어 봐요.`}], () => {
              done(); root.append(h('div', {class: 'g1-row', style: 'gap:10px;margin-top:10px'}, h('button', {class: 'g1-btn ghost', onclick: () => { [a, b] = add2(); start(); }}, '🔄 다른 수로 또 해 보기')));
            })); }
        }}, `➕ 파란 우유갑 넣기`);
        root.append(fr, ln, cnt, h('div', {style: 'margin:10px 0'}, btn));
        redraw();
      }
      start();
    },
    gens: [
      () => { const [a, b] = add2(); return {tag: '(몇)+(몇)', q: `${a} + ${b} 를 계산해요.`, visual: () => G1.frames([{n: a, color: 'red'}, {n: b, color: 'blue'}], {frames: 2}), lines: [`${a} + ${b} = □`], ans: [a + b], hint: () => G1.line(a - 1, a + b + 1, a, b), sol: `${a}에서 ${b}번 이어 세면 ${a + b}`}; },
      () => { const [a, b] = add2(); const t = P(THINGS); return {tag: '덧셈 이야기', q: `${t[0]}이 ${a}${t[1]} 있었는데 ${b}${t[1]}를 더 가져왔어요. 모두 몇 ${t[1]}일까요?`, visual: () => h('div', {}, emo(t[2], a), emo('➕', 1), emo(t[2], b)), lines: [`${a} + ${b} = □`], ans: [a + b], hint: `${a}에 ${b}를 더해요.`, sol: `${a} + ${b} = ${a + b}`}; },
      () => { const [a, b] = add2(); return {tag: '이어 세기', q: `개구리가 ${a}에서 ${b}칸 뛰었어요. 어디에 도착할까요?`, visual: () => G1.line(Math.max(0, a - 1), Math.min(20, a + b + 1), a, b), lines: [`${a} + ${b} = □`], ans: [a + b], sol: `${a}부터 ${b}칸 → ${a + b}`}; },
    ],
    game: (done) => G1.bingo([10, 11, 12, 13, 14, 15, 16, 17, 18], t => { const a = R(Math.max(1, t - 9), Math.min(9, t - 1)); return {text: `${a} + ${t - a}`}; }, done),
    note: {prompt: '덧셈을 어떻게 했나요?', chips: ['이어 세기', '그림 그리기', '손가락으로', '구슬 옮기기']}},

  {key: 'make10', no: 2, em: '🔟', title: '덧셈을 해 볼까요', sub: '10을 만들어서 더하면 쉬워요! 6 + 9를 해 봐요.',
    explore(root, done) {
      let [a, b] = [6, 9]; let did = new Set();
      function run(way) {
        root.innerHTML = '';
        const x = way === 'a' ? a : b, y = way === 'a' ? b : a;   // x를 10으로 만들어요
        const need = 10 - x, rest = y - need;
        root.append(G1.say(way === 'a' ? `<b>${a}</b>를 10으로 만들어 볼까요?` : `이번에는 <b>${b}</b>를 10으로 만들어 볼까요?`));
        root.append(G1.steps([
          {q: `${x}에 몇을 더하면 10이 될까요?`, visual: () => make10Frames(x, y, 0), lines: [`${x} + □ = 10`], ans: [need], hint: '빈칸이 몇 개 남았는지 세어 봐요.'},
          {q: `${y}를 ${need}와 몇으로 가르기 할까요?`, visual: () => make10Frames(x, y, need), lines: [`${y} = ${need} + □`], ans: [rest], hint: `${need}개를 옮기고 남은 파란 구슬을 세어 봐요.`},
          {q: `10과 ${rest}를 더하면?`, visual: () => make10Frames(x, y, need), lines: [`10 + ${rest} = □`], ans: [10 + rest]},
          {q: `그래서 ${a} + ${b} 는?`, lines: [`${a} + ${b} = □`], ans: [a + b]},
        ], () => {
          did.add(way); if (did.size >= 1) done();
          const other = way === 'a' ? 'b' : 'a';
          root.append(h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;margin-top:12px'},
            !did.has(other) ? h('button', {class: 'g1-btn', onclick: () => run(other)}, other === 'b' ? `${b}로 10 만들기도 해 볼까?` : `${a}로 10 만들기도 해 볼까?`) : '',
            h('button', {class: 'g1-btn ghost', onclick: () => { [a, b] = P([[9, 8], [7, 5], [8, 6], [7, 9], [5, 8]]); did = new Set(); run('a'); }}, '🔄 다른 수로')));
        }));
      }
      run('a');
    },
    gens: [
      () => { const [a, b] = add2(); const need = 10 - a; return {tag: '가르기', q: `${a} + ${b}: ${a}를 10으로 만들려면 ${b}를 어떻게 가를까요?`, visual: () => make10Frames(a, b, 0), lines: [`${b} = ${need} + □`], ans: [b - need], hint: `${a}는 ${need}가 있으면 10이 돼요.`, sol: `${b} = ${need} + ${b - need}`}; },
      () => { const [a, b] = add2(); return {tag: '10 만들기', q: `${a} + ${b} 를 10을 만들어 계산해요.`, lines: [`${a} + ${b} = 10 + □ = □`], ans: [a + b - 10, a + b], hint: () => make10Frames(a, b, 10 - a), sol: `${a} + ${10 - a} = 10, 10 + ${a + b - 10} = ${a + b}`}; },
      () => { const [a, b] = add2(); return {tag: '(몇)+(몇)=(십몇)', q: `계산해요.`, lines: [`${a} + ${b} = □`], ans: [a + b], hint: () => make10Frames(a, b, 10 - a), sol: `10을 만들면 10 + ${a + b - 10} = ${a + b}`}; },
    ],
    game: (done) => { const items = []; for (let i = 0; i < 8; i++) { const [a, b] = add2(); const ok = Math.random() < .5; const wrong = a + b + P([-1, 1, -10]); items.push({text: `${a} + ${b} = ${ok ? a + b : wrong}`, ok, fix: `${a} + ${b} = ${a + b}`}); } return G1.ox(items, done, '⭕❌ 덧셈이 맞으면 ⭕, 틀리면 ❌!'); },
    note: {prompt: '10을 만들어 더하니 어땠나요?', chips: ['10 만들기가 쉬워요', '이어 세기가 더 편해요', '아직 헷갈려요']}},

  {key: 'add-many', no: 3, em: '🔢', title: '여러 가지 덧셈을 해 볼까요', sub: '더하는 수가 1씩 커지면 합은 어떻게 될까요?',
    explore(root, done) {
      root.append(G1.say('8에 1, 2, 3, … 을 차례로 더해 봐요. 무엇이 보이나요?'));
      root.append(G1.frames([{n: 8, color: 'red'}, {n: 2, color: 'blue'}], {frames: 2}));
      root.append(h('div', {class: 'g1-eq'}, '8 + 2 = 10'));
      root.append(G1.steps([
        {q: '8 + 3 은?', visual: () => G1.frames([{n: 8, color: 'red'}, {n: 3, color: 'blue'}], {frames: 2}), lines: ['8 + 3 = □'], ans: [11]},
        {q: '8 + 4 는?', visual: () => G1.frames([{n: 8, color: 'red'}, {n: 4, color: 'blue'}], {frames: 2}), lines: ['8 + 4 = □'], ans: [12]},
        {q: '8 + 5 는?', lines: ['8 + 5 = □'], ans: [13]},
        {q: '더하는 수가 1씩 커지면 합은 어떻게 될까요?', choices: {options: ['1씩 커져요', '그대로예요', '1씩 작아져요'], ans: 0}},
        {q: '9 + 7 과 합이 같은 식을 골라요.', choices: {options: ['8 + 8', '8 + 7', '9 + 6'], ans: 0}, hint: '9 + 7 = 16 이에요.'},
      ], done));
    },
    gens: [
      () => { const a = R(4, 9), k = R(Math.max(1, 10 - a), 8); return {tag: '규칙', q: `${a} + ${k} = ${a + k} 이에요. 그럼 ${a} + ${k + 1} 은?`, lines: [`${a} + ${k + 1} = □`], ans: [a + k + 1], hint: '더하는 수가 1 커지면 합도 1 커져요.', sol: `${a + k} 보다 1 큰 ${a + k + 1}`}; },
      () => { const [a, b] = add2(); return {tag: '바꾸어 더하기', q: `${a} + ${b} = ${a + b} 이에요. 그럼 ${b} + ${a} 는?`, lines: [`${b} + ${a} = □`], ans: [a + b], hint: '두 수를 바꾸어 더해도 합은 같아요.', sol: `${a + b}`}; },
      () => { const [a, b] = add2(); const s = a + b; const right = [Math.min(9, s - 2), s - Math.min(9, s - 2)]; const w1 = [right[0], right[1] + 1], w2 = [right[0] - 1, right[1] - 1]; const opts = G1.shuffle([right, w1, w2]); return {tag: '합이 같은 식', q: `${a} + ${b} 와 합이 같은 식을 골라요.`, choices: {options: opts.map(o => `${o[0]} + ${o[1]}`), ans: opts.indexOf(right)}, sol: `${a} + ${b} = ${s}, ${right[0]} + ${right[1]} = ${s}`}; },
    ],
    game: (done) => G1.match([['9+7', '8+8'], ['7+5', '8+4'], ['8+5', '5+8'], ['7+7', '8+6']], done, '🃏 합이 같은 식 짝 맞추기!'),
    note: {prompt: '어떤 규칙을 찾았나요?', chips: ['1씩 커져요', '바꿔 더해도 같아요', '10을 넘으면 십몇이 돼요']}},

  {key: 'sub-meet', no: 4, em: '🐷', title: '뺄셈을 알아볼까요', sub: '우유갑 13개 중 5개로 저금통을 만들었어요. 몇 개 남을까요?',
    explore(root, done) {
      let [a, b] = [13, 5];
      function start() {
        root.innerHTML = '';
        root.append(G1.say(`우유갑 <b>${a}개</b>가 있어요. 저금통을 만드는 데 쓴 <b>${b}개</b>를 눌러서 지워 보세요.`));
        const msg = h('div', {class: 'g1-big'}, `지운 개수: 0`);
        let went = false;
        const tf = tapFrames(a, 'green', n => { msg.textContent = `지운 개수: ${n}`; G1.speak(String(n));
          if (n === b && !went) { went = true; root.append(G1.steps([
            {q: `남은 우유갑은 몇 개일까요?`, lines: [`${a} - ${b} = □`], ans: [a - b], hint: () => G1.line(a - b - 1, a + 1, a, b, {back: true})},
            {q: '이번에는 비교해요. 사과 주스는 12병, 포도 주스는 7병이에요. 사과 주스가 몇 병 더 많을까요?', visual: () => h('div', {}, emo('🍎', 12), emo('🍇', 7)), lines: ['12 - 7 = □'], ans: [5], hint: '하나씩 짝 지으면 남는 사과 주스를 세어요.'},
          ], () => { done(); root.append(h('button', {class: 'g1-btn ghost', style: 'margin-top:10px', onclick: () => { [a, b] = sub2(); start(); }}, '🔄 다른 수로 또 해 보기')); })); }
        });
        root.append(h('div', {class: 'g1-visual'}, tf.el), msg);
      }
      start();
    },
    gens: [
      () => { const [a, b] = sub2(); return {tag: '(십몇)-(몇)', q: `${a}개 중에서 ${b}개를 빼면?`, visual: () => G1.frames([{n: a - b, color: 'green'}, {n: b, color: 'green', cross: b}], {frames: 2}), lines: [`${a} - ${b} = □`], ans: [a - b], hint: () => G1.line(a - b - 1, a + 1, a, b, {back: true}), sol: `${a}에서 거꾸로 ${b}번 세면 ${a - b}`}; },
      () => { const [a, b] = sub2(); const t = P(THINGS); return {tag: '비교하기', q: `빨간 ${t[0]} ${a}${t[1]}, 파란 ${t[0]} ${b}${t[1]}. 빨간 것이 몇 ${t[1]} 더 많을까요?`, lines: [`${a} - ${b} = □`], ans: [a - b], hint: '하나씩 짝 지어 보면 남는 것이 더 많은 수예요.', sol: `${a} - ${b} = ${a - b}`}; },
      () => { const [a, b] = sub2(); return {tag: '거꾸로 세기', q: `개구리가 ${a}에서 뒤로 ${b}칸 뛰었어요. 어디에 도착할까요?`, visual: () => G1.line(a - b - 1, Math.min(20, a + 1), a, b, {back: true}), lines: [`${a} - ${b} = □`], ans: [a - b]}; },
    ],
    game: (done) => G1.bingo([2, 3, 4, 5, 6, 7, 8, 9, 10], t => { const b = R(Math.max(2, 11 - t), Math.min(9, 18 - t)); return {text: `${t + b} - ${b}`}; }, done),
    note: {prompt: '뺄셈을 어떻게 했나요?', chips: ['거꾸로 세기', '지우기(/ 긋기)', '짝 짓기', '손가락으로']}},

  {key: 'sub-do', no: 5, em: '🌷', title: '뺄셈을 해 볼까요', sub: '14 - 9를 두 가지 방법으로 해 봐요.',
    explore(root, done) {
      let [a, b] = [14, 9]; const did = new Set();
      function run(way) {
        root.innerHTML = ''; const o = a - 10;
        if (way === 'ones') {
          root.append(G1.say(`<b>방법 1</b> 낱개 ${o}개를 먼저 빼요.`));
          root.append(G1.steps([
            {q: `${a}에서 낱개 ${o}개를 먼저 빼면?`, visual: () => G1.frames([{n: 10, color: 'green'}, {n: o, color: 'green', cross: o}], {frames: 2}), lines: [`${a} - ${o} = □`], ans: [10]},
            {q: `${b}개를 빼야 하는데 ${o}개를 뺐어요. 몇 개를 더 빼야 할까요?`, lines: [`${b} - ${o} = □`], ans: [b - o]},
            {q: `10에서 ${b - o}개를 더 빼면?`, visual: () => G1.frames([{n: 10 - (b - o), color: 'green'}, {n: b - o, color: 'green', cross: b - o}, {n: o, color: 'gray', cross: o}], {frames: 2}), lines: [`10 - ${b - o} = □`], ans: [a - b]},
            {q: `그래서 ${a} - ${b} 는?`, lines: [`${a} - ${b} = □`], ans: [a - b]},
          ], () => fin('ones')));
        } else {
          root.append(G1.say(`<b>방법 2</b> 10개 묶음에서 ${b}개를 빼요.`));
          root.append(G1.steps([
            {q: `10에서 ${b}를 빼면?`, visual: () => G1.frames([{n: 10 - b, color: 'green'}, {n: b, color: 'green', cross: b}, {n: o, color: 'green'}], {frames: 2}), lines: [`10 - ${b} = □`], ans: [10 - b]},
            {q: `남은 ${10 - b}개와 낱개 ${o}개를 더하면?`, lines: [`${10 - b} + ${o} = □`], ans: [a - b]},
            {q: `그래서 ${a} - ${b} 는?`, lines: [`${a} - ${b} = □`], ans: [a - b]},
          ], () => fin('tens')));
        }
      }
      function fin(way) {
        did.add(way); done();
        root.append(h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;margin-top:12px'},
          !did.has('ones') ? h('button', {class: 'g1-btn', onclick: () => run('ones')}, '방법 1도 해 볼까?') : '',
          !did.has('tens') ? h('button', {class: 'g1-btn', onclick: () => run('tens')}, '방법 2도 해 볼까?') : '',
          h('button', {class: 'g1-btn ghost', onclick: () => { [a, b] = P([[15, 7], [13, 8], [16, 9], [12, 5], [17, 8]]); did.clear(); run('ones'); }}, '🔄 다른 수로')));
      }
      run('ones');
    },
    gens: [
      () => { const [a, b] = sub2(); return {tag: '(십몇)-(몇)=(몇)', q: '계산해요.', lines: [`${a} - ${b} = □`], ans: [a - b], hint: () => G1.frames([{n: 10, color: 'green'}, {n: a - 10, color: 'green'}], {frames: 2}), sol: `10에서 ${b}를 빼면 ${10 - b}, ${10 - b} + ${a - 10} = ${a - b}`}; },
      () => { const [a, b] = sub2(); const o = a - 10; if (b <= o) return LESSONS[4].gens[0](); return {tag: '낱개 먼저 빼기', q: `${a} - ${b}: ${a}에서 ${o}를 먼저 빼면 10. 몇을 더 빼야 할까요?`, lines: [`10 - □ = ${a - b}`], ans: [b - o], sol: `${b} = ${o} + ${b - o}`}; },
      () => { const a = R(11, 19); return {tag: '(십몇)-(몇)=(십)', q: `${a}에서 낱개를 모두 빼면?`, visual: () => G1.frames([{n: 10, color: 'green'}, {n: a - 10, color: 'green', cross: a - 10}], {frames: 2}), lines: [`${a} - ${a - 10} = □`], ans: [10]}; },
    ],
    game: (done) => { const items = []; for (let i = 0; i < 8; i++) { const [a, b] = sub2(); const ok = Math.random() < .5; let w = a - b + P([1, -1, 10]); if (w < 0) w = a - b + 1; items.push({text: `${a} - ${b} = ${ok ? a - b : w}`, ok, fix: `${a} - ${b} = ${a - b}`}); } return G1.ox(items, done, '⭕❌ 뺄셈이 맞으면 ⭕, 틀리면 ❌!'); },
    note: {prompt: '어떤 방법이 더 좋았나요?', chips: ['낱개 먼저 빼기', '10에서 빼기', '거꾸로 세기']}},

  {key: 'sub-many', no: 6, em: '✏️', title: '여러 가지 뺄셈을 해 볼까요', sub: '빼는 수가 1씩 커지면 차는 어떻게 될까요?',
    explore(root, done) {
      root.append(G1.say('12에서 2, 3, 4, … 를 차례로 빼 봐요.'));
      root.append(h('div', {class: 'g1-eq'}, '12 - 2 = 10'));
      root.append(G1.steps([
        {q: '12 - 3 은?', visual: () => G1.frames([{n: 9, color: 'green'}, {n: 3, color: 'green', cross: 3}], {frames: 2}), lines: ['12 - 3 = □'], ans: [9]},
        {q: '12 - 4 는?', visual: () => G1.frames([{n: 8, color: 'green'}, {n: 4, color: 'green', cross: 4}], {frames: 2}), lines: ['12 - 4 = □'], ans: [8]},
        {q: '12 - 5 는?', lines: ['12 - 5 = □'], ans: [7]},
        {q: '빼는 수가 1씩 커지면 차는 어떻게 될까요?', choices: {options: ['1씩 커져요', '그대로예요', '1씩 작아져요'], ans: 2}},
        {q: '13 - 5 와 차가 같은 식을 골라요.', choices: {options: ['12 - 4', '12 - 5', '11 - 4'], ans: 0}, hint: '13 - 5 = 8 이에요.'},
      ], done));
    },
    gens: [
      () => { const a = R(11, 17), k = R(Math.max(2, a - 9), 8); return {tag: '규칙', q: `${a} - ${k} = ${a - k} 이에요. 그럼 ${a} - ${k + 1} 은?`, lines: [`${a} - ${k + 1} = □`], ans: [a - k - 1], hint: '빼는 수가 1 커지면 차는 1 작아져요.'}; },
      () => { const [a, b] = sub2(); const d = a - b; const right = [d + 9 <= 18 ? d + 9 : d + 8, 0]; right[1] = right[0] - d; const w1 = [right[0], right[1] + 1], w2 = [right[0] - 1, right[1] + 1]; const opts = G1.shuffle([right, w1, w2]); return {tag: '차가 같은 식', q: `${a} - ${b} 와 차가 같은 식을 골라요.`, choices: {options: opts.map(o => `${o[0]} - ${o[1]}`), ans: opts.indexOf(right)}, sol: `${a} - ${b} = ${d}, ${right[0]} - ${right[1]} = ${d}`}; },
      () => { const [a, b] = sub2(); return {tag: '빈칸 채우기', q: `□ 에 알맞은 수는?`, lines: [`${a} - □ = ${a - b}`], ans: [b], hint: `${a}에서 몇을 빼야 ${a - b}가 될까요? 거꾸로 세어 봐요.`, sol: `${a} - ${b} = ${a - b}`}; },
    ],
    game: (done) => G1.match([['11-7', '12-8'], ['13-5', '12-4'], ['11-5', '13-7'], ['18-9', '14-5']], done, '🃏 차가 같은 식 짝 맞추기!'),
    note: {prompt: '어떤 규칙을 찾았나요?', chips: ['차가 1씩 작아져요', '둘 다 1씩 커지면 차는 그대로', '잘 모르겠어요']}},
];

const CHALLENGE = () => [
  {tag: '빈칸', q: '□ 에 알맞은 수는?', lines: ['□ + 7 = 13'], ans: [6], hint: '7에서 몇을 이어 세면 13이 될까요?', sol: '6 + 7 = 13'},
  {tag: '빈칸', q: '□ 에 알맞은 수는?', lines: ['15 - □ = 8'], ans: [7], hint: '15에서 거꾸로 세어 8이 될 때까지!', sol: '15 - 7 = 8'},
  {tag: '수 카드', q: '수 카드 <b>5, 6, 8, 9</b> 중 2장을 골라 합이 <b>가장 작은</b> 덧셈식을 만들면 합은?', visual: () => h('div', {class: 'g1-big'}, '🃏 5  6  8  9'), lines: ['□'], ans: [11], hint: '가장 작은 수와 둘째로 작은 수를 더해요.', sol: '5 + 6 = 11'},
  {tag: '수 카드', q: '수 카드 <b>5, 6, 7, 9</b> 중 2장을 골라 합이 <b>가장 큰</b> 덧셈식을 만들면 합은?', visual: () => h('div', {class: 'g1-big'}, '🃏 5  6  7  9'), lines: ['□'], ans: [16], hint: '가장 큰 수와 둘째로 큰 수를 더해요.', sol: '9 + 7 = 16'},
  {tag: '이야기', q: '어항에 붕어가 8마리 있었는데 6마리를 더 넣었어요. 붕어는 모두 몇 마리일까요?', visual: () => h('div', {}, emo('🐟', 8), emo('🐟', 6)), lines: ['8 + 6 = □'], ans: [14]},
  {tag: '이야기', q: '음료수가 8개 있어요. 12명에게 한 개씩 주려면 몇 개가 더 필요할까요?', lines: ['12 - 8 = □'], ans: [4], hint: '12명과 8개를 하나씩 짝 지어 봐요.'},
  {tag: '두 번 생각하기', q: '서현이는 8살이에요. 오빠는 서현이보다 6살 더 많고, 언니는 오빠보다 5살 더 적어요. 언니는 몇 살일까요?', lines: ['8 + 6 = □', '□ - 5 = □'], ans: [14, 14, 9], hint: '먼저 오빠 나이를 구해요.', sol: '오빠 8 + 6 = 14, 언니 14 - 5 = 9 (9살)'},
  {tag: '크기 비교', q: '○ 에 들어갈 알맞은 것을 골라요.  <span class="g1-big">8 + 5 ○ 6 + 6</span>', choices: {options: ['&gt;', '=', '&lt;'], ans: 0}, hint: '양쪽을 먼저 계산해요.', sol: '13 > 12'},
  {tag: '빈칸', q: '차가 8이 되도록 □ 에 알맞은 수를 넣어요.', lines: ['□ - 9 = 8'], ans: [17], hint: '9에 8을 더하면?', sol: '17 - 9 = 8'},
  {tag: '이야기', q: '갈색 달걀 16개와 흰색 달걀 9개가 있어요. 갈색 달걀이 몇 개 더 많을까요?', lines: ['16 - 9 = □'], ans: [7]},
];

const route = G1.unitApp({kicker: '1학년 2학기 · 4단원', title: '덧셈과 뺄셈(2)', intro: '10을 넘는 덧셈과, 십몇에서 빼는 뺄셈을 배워요. 해 보기 → 연습 → 놀이 순서로 해요!', lessons: LESSONS, challenge: CHALLENGE});
updateWho(); ensureStudent(route); flushLog();
