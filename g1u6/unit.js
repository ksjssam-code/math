/* ============================================================
   1-2 · 6단원 덧셈과 뺄셈(3) — 받아올림·받아내림이 없는 두 자리 수의 덧셈과 뺄셈
   (교과서 활동을 바탕으로 숫자와 상황을 바꾼 문제예요)
   ============================================================ */
const R = G1.ri, P = G1.pick;
/* 받아올림 없는 덧셈 / 받아내림 없는 뺄셈 */
const ADD = {
  tensOnes_ones: () => { const t = R(1, 8), o = R(0, 7); const b = R(1, 9 - o); return [t * 10 + o, b]; },
  tens_tens: () => { const x = R(1, 8); const y = R(1, 9 - x); return [x * 10, y * 10]; },
  tensOnes_tens: () => { const t = R(1, 7), o = R(1, 9); const y = R(1, 9 - t); return [t * 10 + o, y * 10]; },
  tensOnes_tensOnes: () => { const t1 = R(1, 7), o1 = R(1, 8); const t2 = R(1, 9 - t1), o2 = R(1, 9 - o1); return [t1 * 10 + o1, t2 * 10 + o2]; },
};
const SUB = {
  tensOnes_ones: () => { const t = R(1, 9), o = R(2, 9); return [t * 10 + o, R(1, o)]; },
  tens_tens: () => { const x = R(2, 9); return [x * 10, R(1, x - 1) * 10]; },
  tensOnes_tens: () => { const t = R(2, 9), o = R(1, 9); return [t * 10 + o, R(1, t - 1) * 10]; },
  tensOnes_tensOnes: () => { const t1 = R(2, 9), o1 = R(1, 9); return [t1 * 10 + o1, R(1, t1 - 1) * 10 + R(0, o1)]; },
};
const anyAdd = () => P(Object.values(ADD))();
const anySub = () => P(Object.values(SUB))();
const emo = (e, n) => h('div', {style: 'font-size:24px;letter-spacing:2px;line-height:1.3'}, e.repeat(n));
const twoBlocks = (a, b, op) => h('div', {class: 'g1-row', style: 'gap:12px;flex-wrap:wrap;align-items:flex-end'}, G1.blocks(a, {color: '#3E7BE6'}), h('span', {class: 'g1-big'}, op), G1.blocks(b, {color: op === '+' ? '#FF7A59' : '#3E7BE6'}));

const LESSONS = [
  {key: 'add2', no: 1, em: '🪨', title: '덧셈을 알아볼까요', sub: '공깃돌 21개에 7개를 더 가져왔어요. 수 모형으로 더해 봐요.',
    explore(root, done) {
      const EX = [[21, 7], [20, 40], [46, 11], [32, 24]]; let k = 0;
      function start() {
        root.innerHTML = ''; const [a, b] = EX[k];
        root.append(G1.say(`<b>${a}</b>와 <b>${b}</b>를 수 모형으로 나타냈어요. 막대(십 모형)는 10, 작은 네모(일 모형)는 1이에요. <b>모으기</b>를 눌러 보세요!`));
        const area = h('div', {class: 'g1-visual'}, twoBlocks(a, b, '+'));
        const btn = h('button', {class: 'g1-btn sky', onclick: () => {
          btn.remove(); area.innerHTML = '';
          const both = h('div', {class: 'g1-blocks'}); const tens = h('div', {class: 'g1-tens'}), ones = h('div', {class: 'g1-ones'});
          const addRods = (n, c) => { for (let i = 0; i < n; i++) { const r = h('div', {class: 'g1-rod'}); for (let j = 0; j < 10; j++) r.append(h('i')); r.style.setProperty('--c', c); tens.append(r); } };
          const addCubes = (n, c) => { for (let i = 0; i < n; i++) { const q = h('div', {class: 'g1-cube'}); q.style.setProperty('--c', c); ones.append(q); } };
          addRods(Math.floor(a / 10), '#3E7BE6'); addRods(Math.floor(b / 10), '#FF7A59'); addCubes(a % 10, '#3E7BE6'); addCubes(b % 10, '#FF7A59');
          both.append(tens, ones); area.append(both);
          root.append(G1.steps([
            {q: '십 모형(막대)은 모두 몇 개인가요?', lines: ['□ 개'], ans: [Math.floor(a / 10) + Math.floor(b / 10)]},
            {q: '일 모형(작은 네모)은 모두 몇 개인가요?', lines: ['□ 개'], ans: [a % 10 + b % 10]},
            {q: `그래서 ${a} + ${b} 는?`, lines: [`${a} + ${b} = □`], ans: [a + b], hint: '십 모형은 십 모형끼리, 일 모형은 일 모형끼리 더해요.'},
          ], () => { done(); if (k < EX.length - 1) root.append(h('button', {class: 'g1-btn', style: 'margin-top:10px', onclick: () => { k++; start(); }}, `다음 수로 (${k + 2}/${EX.length})`)); }));
        }}, '🤲 모으기');
        root.append(area, btn);
      }
      start();
    },
    gens: [
      () => { const [a, b] = ADD.tensOnes_ones(); return {tag: '(몇십몇)+(몇)', q: '수 모형을 보고 계산해요.', visual: () => twoBlocks(a, b, '+'), lines: [`${a} + ${b} = □`], ans: [a + b], hint: '일 모형끼리 더하고, 십 모형은 그대로예요.', sol: `${a % 10} + ${b} = ${a % 10 + b}, 십 모형 ${Math.floor(a / 10)}개 → ${a + b}`}; },
      () => { const [a, b] = ADD.tens_tens(); return {tag: '(몇십)+(몇십)', q: '계산해요.', visual: () => twoBlocks(a, b, '+'), lines: [`${a} + ${b} = □`], ans: [a + b], hint: `십 모형이 ${a / 10}개와 ${b / 10}개예요.`, sol: `십 모형 ${a / 10 + b / 10}개 → ${a + b}`}; },
      () => { const [a, b] = P([ADD.tensOnes_tens, ADD.tensOnes_tensOnes])(); return {tag: '(몇십몇)+(몇십몇)', q: '세로로 계산해요. <b>일의 자리부터</b> 써요!', vertical: {a, b, op: '+'}, hint: '일은 일끼리, 십은 십끼리 더해요.', sol: `일: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}, 십: ${Math.floor(a / 10)} + ${Math.floor(b / 10)} = ${Math.floor(a / 10) + Math.floor(b / 10)} → ${a + b}`}; },
      () => { const [a, b] = anyAdd(); const t = P([['공깃돌', '개'], ['구슬', '개'], ['딱지', '장'], ['종이배', '개']]); return {tag: '덧셈 이야기', q: `${t[0]}을 ${a}${t[1]} 가지고 있었는데 ${b}${t[1]}를 더 받았어요. 모두 몇 ${t[1]}일까요?`, lines: [`${a} + ${b} = □`], ans: [a + b], sol: `${a} + ${b} = ${a + b}`}; },
    ],
    game: (done) => { const nums = new Set(); while (nums.size < 9) { const [a, b] = anyAdd(); nums.add(a + b); } const split = t => { const tt = Math.floor(t / 10), oo = t % 10; const bt = R(0, Math.max(0, tt - 1)), bo = R(0, oo); const b = bt * 10 + bo || (oo ? 1 : 10); return [t - b, b]; }; return G1.bingo([...nums], t => { const [a, b] = split(t); return {text: `${a} + ${b}`}; }, done); },
    note: {prompt: '두 자리 수 덧셈을 어떻게 했나요?', chips: ['수 모형', '십끼리 일끼리', '세로로 쓰기', '이어 세기']}},

  {key: 'sub2', no: 2, em: '🏹', title: '뺄셈을 알아볼까요', sub: '화살 34개 중 12개를 던졌어요. 남은 화살은 몇 개일까요?',
    explore(root, done) {
      const EX = [[26, 3], [50, 20], [34, 12], [48, 25]]; let k = 0;
      function start() {
        root.innerHTML = ''; const [a, b] = EX[k]; const bt = Math.floor(b / 10), bo = b % 10;
        root.append(G1.say(`<b>${a}</b>에서 <b>${b}</b>를 빼요. 빼는 만큼 수 모형을 눌러서 지워 보세요. (막대 ${bt}개, 작은 네모 ${bo}개)`));
        let xT = new Set(), xO = new Set(); const info = h('div', {class: 'g1-big'}, '지운 수: 0'); const area = h('div', {class: 'g1-visual'}); let went = false;
        function draw() {
          area.innerHTML = '';
          const blk = G1.blocks(a, {onRod: (el, i) => { xT.has(i) ? xT.delete(i) : xT.add(i); upd(); }, onCube: (el, i) => { xO.has(i) ? xO.delete(i) : xO.add(i); upd(); }});
          blk.classList.add('tap');
          blk.querySelectorAll('.g1-rod').forEach((r, i) => r.classList.toggle('x', xT.has(i)));
          blk.querySelectorAll('.g1-cube').forEach((r, i) => r.classList.toggle('x', xO.has(i)));
          area.append(blk);
        }
        function upd() {
          draw(); const n = xT.size * 10 + xO.size; info.textContent = `지운 수: ${n}`; G1.speak(String(n));
          if (!went && xT.size === bt && xO.size === bo) { went = true;
            root.append(G1.steps([
              {q: '남은 십 모형(막대)은 몇 개인가요?', lines: ['□ 개'], ans: [Math.floor(a / 10) - bt]},
              {q: '남은 일 모형(작은 네모)은 몇 개인가요?', lines: ['□ 개'], ans: [a % 10 - bo]},
              {q: `그래서 ${a} - ${b} 는?`, lines: [`${a} - ${b} = □`], ans: [a - b], hint: '십 모형은 십 모형끼리, 일 모형은 일 모형끼리 빼요.'},
            ], () => { done(); if (k < EX.length - 1) root.append(h('button', {class: 'g1-btn', style: 'margin-top:10px', onclick: () => { k++; start(); }}, `다음 수로 (${k + 2}/${EX.length})`)); }));
          }
        }
        root.append(area, info); draw();
      }
      start();
    },
    gens: [
      () => { const [a, b] = SUB.tensOnes_ones(); return {tag: '(몇십몇)-(몇)', q: '계산해요.', visual: () => G1.blocks(a, {crossOnes: b}), lines: [`${a} - ${b} = □`], ans: [a - b], hint: '일 모형에서 빼요. 십 모형은 그대로예요.', sol: `${a % 10} - ${b} = ${a % 10 - b} → ${a - b}`}; },
      () => { const [a, b] = SUB.tens_tens(); return {tag: '(몇십)-(몇십)', q: '계산해요.', visual: () => G1.blocks(a, {crossTens: b / 10}), lines: [`${a} - ${b} = □`], ans: [a - b], sol: `십 모형 ${a / 10}개에서 ${b / 10}개 → ${a / 10 - b / 10}개 → ${a - b}`}; },
      () => { const [a, b] = P([SUB.tensOnes_tens, SUB.tensOnes_tensOnes])(); return {tag: '(몇십몇)-(몇십몇)', q: '세로로 계산해요. <b>일의 자리부터</b> 써요!', vertical: {a, b, op: '-'}, hint: '일은 일끼리, 십은 십끼리 빼요.', sol: `일: ${a % 10} - ${b % 10} = ${a % 10 - b % 10}, 십: ${Math.floor(a / 10)} - ${Math.floor(b / 10)} = ${Math.floor(a / 10) - Math.floor(b / 10)} → ${a - b}`}; },
      () => { const [a, b] = anySub(); const t = P([['딱지', '장', '파란', '빨간'], ['화살', '개', '', '']]); return t[0] === '딱지' ? {tag: '비교하기', q: `파란 딱지 ${a}장, 빨간 딱지 ${b}장이 있어요. 파란 딱지가 몇 장 더 많을까요?`, lines: [`${a} - ${b} = □`], ans: [a - b]} : {tag: '남은 수', q: `화살 ${a}개 중 ${b}개를 던졌어요. 남은 화살은 몇 개일까요?`, lines: [`${a} - ${b} = □`], ans: [a - b]}; },
    ],
    game: (done) => { const nums = new Set(); while (nums.size < 9) { const [a, b] = anySub(); nums.add(a - b); } return G1.bingo([...nums], t => { const tt = Math.floor(t / 10), oo = t % 10; const bt = tt < 9 ? R(1, 9 - tt) : 0; const b = bt * 10 + R(bt ? 0 : 1, 9 - oo); return {text: `${t + b} - ${b}`}; }, done); },
    note: {prompt: '두 자리 수 뺄셈을 어떻게 했나요?', chips: ['수 모형 지우기', '십끼리 일끼리', '세로로 쓰기', '거꾸로 세기']}},

  {key: 'story', no: 3, em: '🍡', title: '덧셈과 뺄셈을 해 볼까요', sub: '전통 과자 가게 그림을 보고 덧셈 이야기, 뺄셈 이야기를 만들어요.',
    explore(root, done) {
      const ITEMS = [{n: '약과', e: '🍪', v: 24}, {n: '유과', e: '🍘', v: 12}, {n: '꿀떡', e: '🍡', v: 35}, {n: '쑥떡', e: '🟢', v: 23}];
      let pick = [], did = new Set();
      root.append(G1.say('과자 두 가지를 고르고, <b>모두 몇 개?</b> 또는 <b>몇 개 더 많을까?</b>를 골라 이야기를 만들어요. 덧셈과 뺄셈 이야기를 하나씩 만들어 봐요!'));
      const shelf = h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;margin:10px 0'});
      const opRow = h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;margin:10px 0'});
      const out = h('div');
      ITEMS.forEach(it => { const b = h('button', {class: 'g1-pick', onclick: () => {
        if (pick.includes(it)) pick = pick.filter(x => x !== it); else { pick.push(it); if (pick.length > 2) pick.shift(); }
        [...shelf.children].forEach((c, i) => c.classList.toggle('sel', pick.includes(ITEMS[i]))); G1.speak(`${it.n} ${it.v}개`);
      }}, h('span', {class: 'em'}, it.e), it.n, h('span', {class: 'g1-big', style: 'font-size:26px'}, `${it.v}개`)); shelf.append(b); });
      const mk = (op) => {
        if (pick.length < 2) { G1.speak('과자 두 가지를 먼저 골라요'); toast('과자 두 가지를 먼저 골라요'); return; }
        const [x, y] = pick[0].v >= pick[1].v ? [pick[0], pick[1]] : [pick[1], pick[0]];
        out.innerHTML = '';
        const p = op === '+' ? {q: `${x.n} ${x.v}개와 ${y.n} ${y.v}개가 있어요. <b>모두 몇 개</b>일까요?`, lines: [`${x.v} + ${y.v} = □`], ans: [x.v + y.v]}
          : {q: `${x.n}는 ${x.v}개, ${y.n}는 ${y.v}개예요. ${x.n}가 <b>몇 개 더 많을까요?</b>`, lines: [`${x.v} - ${y.v} = □`], ans: [x.v - y.v]};
        p.id = 'story-' + Math.random().toString(36).slice(2); p.tag = '이야기 만들기';
        out.append(G1.problem(p, {autofocus: true, onSolve: () => { did.add(op); if (did.has('+') && did.has('-')) { done(); G1.speak('덧셈 이야기와 뺄셈 이야기를 모두 만들었어요!'); } else toast(op === '+' ? '이번엔 뺄셈 이야기도 만들어 봐요!' : '이번엔 덧셈 이야기도 만들어 봐요!'); }}));
        G1.speak(p.q.replace(/<[^>]+>/g, ''));
      };
      opRow.append(h('button', {class: 'g1-btn', onclick: () => mk('+')}, '➕ 모두 몇 개?'), h('button', {class: 'g1-btn sky', onclick: () => mk('-')}, '➖ 몇 개 더 많을까?'));
      root.append(shelf, opRow, out);
    },
    gens: [
      () => { const [a, b] = anyAdd(); const opts = G1.shuffle([`${a} + ${b}`, `${a} - ${b}`]); return {tag: '알맞은 식 고르기', q: `송편 ${a}개를 빚었는데 ${b}개를 더 빚었어요. 송편은 모두 몇 개인지 구하는 식을 고르고 답을 써요.`, choices: {options: opts, ans: opts.indexOf(`${a} + ${b}`)}, lines: ['□ 개'], ans: [a + b], sol: `${a} + ${b} = ${a + b}`}; },
      () => { const [a, b] = anySub(); const opts = G1.shuffle([`${a} + ${b}`, `${a} - ${b}`]); return {tag: '알맞은 식 고르기', q: `딱지가 ${a}장 있었는데 친구에게 ${b}장을 주었어요. 남은 딱지는 몇 장인지 구하는 식을 고르고 답을 써요.`, choices: {options: opts, ans: opts.indexOf(`${a} - ${b}`)}, lines: ['□ 장'], ans: [a - b], sol: `${a} - ${b} = ${a - b}`}; },
      () => { const [a, b] = anySub(); return {tag: '비교하기', q: `꿀떡이 ${a}개, 쑥떡이 ${b}개 있어요. 꿀떡이 쑥떡보다 몇 개 더 많을까요?`, lines: [`${a} - ${b} = □`], ans: [a - b]}; },
      () => { const [a, b] = anyAdd(); return {tag: '모두 몇 개', q: `상자에 약과가 ${a}개, 바구니에 ${b}개 있어요. 약과는 모두 몇 개일까요?`, lines: [`${a} + ${b} = □`], ans: [a + b]}; },
    ],
    game: (done) => {
      const items = [];
      for (let i = 0; i < 4; i++) { const [a, b] = anyAdd(); const ok = Math.random() < .5; const wrong = P([a + b + 10, a + b + 1, a + b - 1]); items.push({text: `${a} + ${b} = ${ok ? a + b : wrong}`, ok, fix: `${a} + ${b} = ${a + b}`}); }
      for (let i = 0; i < 4; i++) { const [a, b] = anySub(); const ok = Math.random() < .5; const wrong = a - b + P([10, 1, -1 + (a - b === 0 ? 2 : 0)]); items.push({text: `${a} - ${b} = ${ok ? a - b : wrong}`, ok, fix: `${a} - ${b} = ${a - b}`}); }
      return G1.ox(items, done, '⭕❌ 바르게 계산했으면 ⭕, 틀렸으면 ❌!');
    },
    note: {prompt: '내가 만든 이야기 중 하나를 써 볼까요?', chips: ['덧셈 이야기를 만들었어요', '뺄셈 이야기를 만들었어요', '둘 다 만들었어요']}},

  {key: 'order', no: 4, em: '🤖', title: '덧셈·뺄셈 명령어', sub: '로봇에게 계산 순서를 알려 주는 명령어를 만들어요.',
    explore(root, done) {
      const TASKS = [
        {a: 34, b: 21, op: '+', cards: ['낱개끼리 더해요', '합을 낱개 자리에 써요', '10개씩 묶음끼리 더해요', '합을 10개씩 묶음 자리에 써요']},
        {a: 58, b: 12, op: '-', cards: ['낱개끼리 빼요', '차를 낱개 자리에 써요', '10개씩 묶음끼리 빼요', '차를 10개씩 묶음 자리에 써요']},
      ];
      let t = 0;
      function start() {
        root.innerHTML = ''; const T = TASKS[t]; let order = [];
        root.append(G1.say(`<b>${T.a} ${T.op === '+' ? '+' : '-'} ${T.b}</b> 를 로봇이 계산하도록 명령어 카드를 <b>순서대로</b> 눌러요. 낱개(일의 자리)부터 해요!`));
        const list = h('div', {class: 'g1-orderlist'}); const cards = h('div', {class: 'g1-row', style: 'gap:8px;flex-wrap:wrap'}); const fb = h('div', {class: 'g1-fb'});
        G1.shuffle(T.cards).forEach(c => { const b = h('button', {class: 'g1-ordercard', onclick: () => {
          if (b.classList.contains('used')) return;
          const need = T.cards[order.length];
          if (c === need) { order.push(c); b.classList.add('used'); list.append(h('div', {}, `${order.length}. ${c}`)); G1.tone(true); G1.speak(c); fb.className = 'g1-fb good'; fb.textContent = '좋아요!';
            if (order.length === T.cards.length) { fb.textContent = '🤖 명령어 완성! 이제 직접 계산해요.'; const p = {id: 'order-' + t + Math.random(), tag: '세로셈', q: `명령어 순서대로 ${T.a} ${T.op} ${T.b} 를 계산해요.`, vertical: {a: T.a, b: T.b, op: T.op}};
              root.append(G1.problem(p, {autofocus: true, onSolve: () => { if (t === TASKS.length - 1) done(); else root.append(h('button', {class: 'g1-btn', style: 'margin-top:10px', onclick: () => { t++; start(); }}, '다음: 뺄셈 명령어 →')); }})); } }
          else { G1.tone(false); fb.className = 'g1-fb bad'; fb.textContent = '순서가 달라요. 낱개부터 생각해 봐요!'; }
        }}, c); cards.append(b); });
        root.append(cards, list, fb);
      }
      start();
    },
    gens: [
      () => { const [a, b] = anyAdd(); return {tag: '세로셈 덧셈', q: '일의 자리부터 계산해요.', vertical: {a, b, op: '+'}}; },
      () => { const [a, b] = anySub(); return {tag: '세로셈 뺄셈', q: '일의 자리부터 계산해요.', vertical: {a, b, op: '-'}}; },
      () => { const [a, b] = anyAdd(); return {tag: '자리 알기', q: `${a} + ${b} 에서 낱개끼리 더하면 몇일까요?`, lines: [`${a % 10} + ${b % 10} = □`], ans: [a % 10 + b % 10], hint: `${a}의 낱개는 ${a % 10}, ${b}의 낱개는 ${b % 10}이에요.`}; },
    ],
    game: (done) => { const pairs = []; const used = new Set(); while (pairs.length < 4) { const [a, b] = anyAdd(); const s = a + b; if (used.has(s) || s < 20 || s >= 90) continue; used.add(s); const c = R(1, Math.min(9 - Math.floor(s / 10), 4)) * 10 + R(0, 9 - s % 10); pairs.push([`${a}+${b}`, `${s + c}-${c}`]); } return G1.match(pairs, done, '🃏 덧셈과 뺄셈, 답이 같은 카드 짝 맞추기!'); },
    note: {prompt: '계산할 때 무엇부터 하나요?', chips: ['낱개(일)부터', '10개씩 묶음(십)부터', '아무거나']}},
];

const CHALLENGE = () => [
  {tag: '빈칸', q: '□ 에 알맞은 수는?', lines: ['35 + □ = 58'], ans: [23], hint: '일의 자리: 5 + □ = 8, 십의 자리: 3 + □ = 5', sol: '35 + 23 = 58'},
  {tag: '빈칸', q: '□ 에 알맞은 수는?', lines: ['76 - □ = 42'], ans: [34], hint: '일의 자리: 6 - □ = 2, 십의 자리: 7 - □ = 4', sol: '76 - 34 = 42'},
  {tag: '수 카드', q: '수 카드 <b>20, 23, 34, 45</b> 중 2장을 골라 합이 <b>가장 큰</b> 덧셈을 하면?', visual: () => h('div', {class: 'g1-big'}, '🃏 20  23  34  45'), lines: ['□'], ans: [79], hint: '가장 큰 수 두 개를 골라요.', sol: '45 + 34 = 79'},
  {tag: '수 카드', q: '같은 카드 중 2장을 골라 차가 <b>가장 큰</b> 뺄셈을 하면?', visual: () => h('div', {class: 'g1-big'}, '🃏 20  23  34  45'), lines: ['□'], ans: [25], hint: '가장 큰 수에서 가장 작은 수를 빼요.', sol: '45 - 20 = 25'},
  {tag: '이야기', q: '옛날이야기 책이 38쪽이에요. 서현이는 24쪽까지 읽었어요. 남은 쪽수는?', lines: ['38 - 24 = □'], ans: [14]},
  {tag: '틀린 식 찾기', q: '<b>바르게 계산하지 않은</b> 식을 골라요.', choices: {options: ['59 - 23 = 33', '12 + 40 = 52', '30 + 50 = 80'], ans: 0}, hint: '하나씩 계산해 봐요.', sol: '59 - 23 = 36 이에요.'},
  {tag: '두 번 생각하기', q: '구슬 32개가 있었는데 14개를 더 샀어요. 그중 21개를 동생에게 주면 몇 개 남을까요?', lines: ['32 + 14 = □', '□ - 21 = □'], ans: [46, 46, 25], hint: '먼저 산 다음 구슬 수를 구해요.', sol: '32 + 14 = 46, 46 - 21 = 25'},
  {tag: '두 번 생각하기', q: '흰 우유 27개, 딸기 우유 11개, 초코 우유 6개가 있어요. 흰 우유는 딸기 우유와 초코 우유를 합한 것보다 몇 개 더 많을까요?', lines: ['11 + 6 = □', '27 - □ = □'], ans: [17, 17, 10], sol: '11 + 6 = 17, 27 - 17 = 10'},
  {tag: '크기 비교', q: '○ 에 들어갈 알맞은 것을 골라요.  <span class="g1-big">43 + 25 ○ 89 - 12</span>', choices: {options: ['&gt;', '=', '&lt;'], ans: 2}, hint: '양쪽을 먼저 계산해요.', sol: '68 < 77'},
  {tag: '수 모형', q: '십 모형 3개, 일 모형 4개인 수보다 21 큰 수는?', visual: () => G1.blocks(34), lines: ['□'], ans: [55], sol: '34 + 21 = 55'},
];

const route = G1.unitApp({kicker: '1학년 2학기 · 6단원', title: '덧셈과 뺄셈(3)', intro: '두 자리 수끼리 더하고 빼요. 십은 십끼리, 일은 일끼리! 해 보기 → 연습 → 놀이 순서로 해요.', lessons: LESSONS, challenge: CHALLENGE});
updateWho(); ensureStudent(route); flushLog();
