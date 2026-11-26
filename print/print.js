/* ============================================================
   ✏️ 영어 단어 쓰기 활동지 (출력용 A4)
   - 서윤: Bricks Reading 300 단원 단어 / 서현: Smart Phonics 2 단원 단어
   - 쓰기 연습지(점선 따라 쓰기 → 혼자 쓰기), 시험지, 정답(엄마만)
   ============================================================ */
const app = document.getElementById('app'), sheets = document.getElementById('sheets');
const FONT = "Andika, 'Comic Relief', 'Comic Sans MS', sans-serif";
const NS = 'http://www.w3.org/2000/svg';
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let PH = null;   // 스마트파닉스 데이터 (UNITS, PIC)

async function loadPhonics() {
  if (PH) return PH;
  const s = await fetch('../en2/phonics.js').then(r => r.text());
  const grab = n => { const i = s.indexOf('const ' + n); let j = s.indexOf('=', i) + 1; while (s[j] === ' ') j++; const o = s[j], c = o === '[' ? ']' : '}'; let d = 0; for (let k = j; k < s.length; k++) { if (s[k] === o) d++; if (s[k] === c) { d--; if (!d) return s.slice(j, k + 1); } } };
  PH = {UNITS: (0, eval)('(' + grab('UNITS') + ')'), PIC: (0, eval)('(' + grab('PIC') + ')')};
  return PH;
}

/* ---------- 영어 4선 줄 (SVG, mm 단위) ---------- */
function fourLine(widthMm, H, words, opt = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', widthMm + 'mm'); svg.setAttribute('height', H + 'mm'); svg.setAttribute('viewBox', `0 0 ${widthMm} ${H}`);
  svg.classList.add('fl');
  const g = H / 3;
  [[0, 'top'], [g, 'mid'], [2 * g, 'base'], [H, 'bot']].forEach(([y, c]) => {
    const l = document.createElementNS(NS, 'line'); l.setAttribute('x1', 0); l.setAttribute('x2', widthMm);
    const yy = Math.min(Math.max(y, 0.12), H - 0.12); l.setAttribute('y1', yy); l.setAttribute('y2', yy); l.setAttribute('class', 'ln ' + c); svg.append(l);
  });
  if (words && words.length) {
    svg._todo = {words, opt, H, widthMm};
  }
  return svg;
}
/* 화면에 붙인 뒤 글자 길이를 재서 따라 쓰기 글자를 배치 */
function layoutTraces(root) {
  root.querySelectorAll('svg.fl').forEach(svg => {
    const t = svg._todo; if (!t) return; delete svg._todo;
    const {words, opt, H, widthMm} = t;
    let fs = opt.size || H * 0.8; const gap = opt.gap || 9; const x0 = opt.x0 || 2;
    const mk = (txt, x) => { const e = document.createElementNS(NS, 'text'); e.textContent = txt; e.setAttribute('x', x); e.setAttribute('y', 2 * H / 3); e.setAttribute('font-size', fs); e.setAttribute('font-family', FONT); e.setAttribute('class', opt.solid ? 'tx solid' : 'tx trace'); svg.append(e); return e; };
    // 한 번 써 보고 너무 길면 글자를 줄여요
    const probe = mk(words[0], x0); let w = probe.getComputedTextLength(); probe.remove();
    const room = widthMm - x0 - 1;
    if (words.length === 1 && w > room) fs = fs * room / w * 0.98;
    else if (w > room) fs = fs * room / w * 0.98;
    let x = x0;
    for (const wd of words) {
      const e = mk(wd, x); const len = e.getComputedTextLength();
      if (x + len > widthMm - 0.5) { e.remove(); break; }
      x += len + gap;
    }
  });
}

/* ---------- 공통 머리말 ---------- */
function head(title, sub, kind, score) {
  return h('div', {class: 'sh-head'},
    h('div', {class: 'sh-kind'}, kind),
    h('div', {class: 'sh-title'}, h('b', {}, title), h('span', {}, sub)),
    h('div', {class: 'sh-name'}, h('span', {}, '이름 ________'), h('span', {}, '날짜 ____ / ____'), score ? h('span', {class: 'sh-score'}, `점수 ____ / ${score}`) : ''));
}
const page = cls => h('section', {class: 'sheet ' + (cls || '')});

/* ---------- 서윤: Bricks ---------- */
function brPractice(U, withExtra) {
  const out = [];
  const p1 = page(); p1.append(head(`Bricks Reading 300 · Unit ${String(U.n).padStart(2, '0')}`, U.t, '✏️ 단어 쓰기 연습', 0),
    h('div', {class: 'sh-tip'}, '① 소리 내어 읽으며 점선을 따라 써요 → ② 아래 줄에 혼자 3번 써요 → ③ 뜻을 가리고 말해 봐요'));
  U.v.forEach((w, i) => {
    p1.append(h('div', {class: 'wb'},
      h('div', {class: 'wb-l'}, h('div', {class: 'wb-w'}, `${i + 1}. ${w[0]}`), h('div', {class: 'wb-ko'}, `${w[1] ? w[1] + ' ' : ''}${w[2]}`)),
      h('div', {class: 'wb-r'}, fourLine(132, 12.4, [w[0], w[0], w[0]], {gap: 8}), fourLine(132, 12.4))));
  });
  out.push(p1);
  const p2 = page(); p2.append(head(`Bricks Reading 300 · Unit ${String(U.n).padStart(2, '0')}`, U.t, '✏️ 예문 따라 쓰기', 0),
    h('div', {class: 'sh-tip'}, '예문을 소리 내어 읽고 따라 써요. 그다음 줄에는 보지 않고 써 봐요. 위에 적힌 단어가 문장 어디에 있는지 찾아봐요!'));
  U.v.forEach((w, i) => {
    p2.append(h('div', {class: 'sb'}, h('div', {class: 'sb-n'}, `${i + 1}. ${w[0]} — ${w[2]}`), fourLine(186, 9.5, [w[3]], {gap: 0, size: 6.6}), fourLine(186, 9.5)));
  });
  out.push(p2);
  const more = (WL[U.n] || []).filter(([en]) => !U.v.some(w => w[0].toLowerCase() === en.toLowerCase()));
  if (withExtra && more.length) {
    const p3 = page(); p3.append(head(`Bricks Reading 300 · Unit ${String(U.n).padStart(2, '0')}`, U.t, '📒 단어장 단어 쓰기', 0),
      h('div', {class: 'sh-tip'}, '책 단어장에 있는 단어예요. 따라 쓰고 한 번 더 혼자 써요.'));
    const grid = h('div', {class: 'xg'});
    more.slice(0, 12).forEach(([en, ko]) => grid.append(h('div', {class: 'xb'}, h('div', {class: 'wb-w', style: 'font-size:13px'}, en, h('span', {class: 'wb-ko'}, '  ' + ko)), fourLine(88, 10, [en, en], {gap: 6}), fourLine(88, 10))));
    p3.append(grid); out.push(p3);
  }
  return out;
}
function brTest(U, withExtra, key) {
  const p = page();
  const more = withExtra ? shuffle((WL[U.n] || []).filter(([en]) => !U.v.some(w => w[0].toLowerCase() === en.toLowerCase()))).slice(0, 4) : [];
  const A = shuffle(U.v);
  const B = shuffle(U.v.filter(w => cloze(w))).slice(0, 4);
  const total = A.length + B.length + more.length;
  p.append(head(`Bricks Reading 300 · Unit ${String(U.n).padStart(2, '0')}`, U.t, '📝 단어 시험', total));
  p.append(h('div', {class: 'q-t'}, 'A. 우리말 뜻을 보고 영어 단어를 쓰세요.'));
  const ga = h('div', {class: 'tg'});
  A.forEach((w, i) => ga.append(h('div', {class: 'ti'}, h('div', {class: 'ti-q'}, `${i + 1}. ${w[2]}`, h('span', {class: 'pos'}, w[1] ? ` (${w[1]})` : '')), fourLine(88, 12))));
  p.append(ga);
  p.append(h('div', {class: 'q-t'}, 'B. 빈칸에 알맞은 단어를 쓰세요. (모양이 바뀔 수 있어요)'));
  B.forEach((w, i) => { const c = cloze(w); p.append(h('div', {class: 'ti-s'}, h('span', {}, `${A.length + i + 1}. `), h('span', {html: c.text.replace(/_{2,}/g, '<span class="blank"></span>')}), h('span', {class: 'pos'}, `  (${w[2]})`))); });
  if (more.length) {
    p.append(h('div', {class: 'q-t'}, 'C. 영어 단어의 뜻을 우리말로 쓰세요.'));
    const gc = h('div', {class: 'tg'});
    more.forEach(([en], i) => gc.append(h('div', {class: 'ti-c'}, `${A.length + B.length + i + 1}. ${en}`, h('span', {class: 'kline'}))));
    p.append(gc);
  }
  p.append(h('div', {class: 'q-t'}, '✍️ 채점한 뒤: 틀린 단어를 3번씩 다시 써요.'), fourLine(186, 12), fourLine(186, 12), fourLine(186, 12));
  p.append(h('div', {class: 'q-t'}, '⭐ 보너스: 이번 단원 단어를 넣어 나만의 문장을 써 봐요.'), fourLine(186, 11), fourLine(186, 11));
  key.push({title: `Bricks Unit ${String(U.n).padStart(2, '0')} · ${U.t}`, items: [...A.map(w => w[0]), ...B.map(w => cloze(w).ans), ...more.map(([en, ko]) => `${en} = ${ko}`)]});
  return [p];
}

function brGrammar(U, key) {
  const g = GR[U.n - 1]; const p = page();
  p.append(head(`Bricks Reading 300 · Unit ${String(U.n).padStart(2, '0')}`, U.t, '🧩 문법 활동지', g.items.length));
  p.append(h('div', {class: 'gbox'}, h('div', {class: 'gbox-t'}, '📌 ' + g.t), h('div', {}, g.ex)));
  p.append(h('div', {class: 'q-t'}, 'A. 괄호 안에서 알맞은 말에 ○ 하고, 완성한 문장을 바르게 쓰세요.'));
  const items = shuffle(g.items);
  items.forEach(([s, o], i) => p.append(h('div', {class: 'gi'},
    h('div', {class: 'gi-s', html: `${i + 1}. ` + s.replace('___', `( ${shuffle(o).join(' / ')} )`)}), fourLine(186, 11))));
  p.append(h('div', {class: 'q-t'}, `⭐ 보너스: '${g.t}'을(를) 써서 나만의 문장을 2개 써 봐요.`), fourLine(186, 11), fourLine(186, 11));
  key.push({title: `Bricks Unit ${String(U.n).padStart(2, '0')} 문법 · ${g.t}`, items: items.map(([s, o]) => s.replace('___', o[0]))});
  return [p];
}

/* ---------- 서현: Smart Phonics ---------- */
const phWords = u => Object.values(u.fam).flat();
const phExtra = u => Object.values(u.extra || {}).flat().filter(w => /^[a-z]+$/.test(w));
function phTitle(u) { return u.se ? `Sound Expansion ${u.no - 8}` : `Unit ${u.no}`; }
function phPractice(u) {
  const p = page('big'); const ws = phWords(u).slice(0, 8);
  p.append(head(`Smart Phonics 2 · ${phTitle(u)}`, u.title, '✏️ 단어 쓰기 연습', 0),
    h('div', {class: 'sh-tip'}, '소리 내어 읽으며 점선을 따라 써요. 아래 줄에는 혼자 써요.'));
  ws.forEach(w => p.append(h('div', {class: 'wb'},
    h('div', {class: 'wb-l pic'}, h('div', {class: 'emo'}, PH.PIC[w] || '✏️'), h('div', {class: 'wb-w'}, w)),
    h('div', {class: 'wb-r'}, fourLine(146, 12.5, [w, w, w], {gap: 12}), fourLine(146, 12.5)))));
  return [p];
}
function phTest(u, key) {
  const p = page('big'); const ws = shuffle(phWords(u).slice(0, 8)); const ex = shuffle(phExtra(u).length ? phExtra(u) : phWords(u)).slice(0, 4);
  p.append(head(`Smart Phonics 2 · ${phTitle(u)}`, u.title, '📝 단어 시험', ws.length + ex.length));
  p.append(h('div', {class: 'q-t'}, 'A. 그림을 보고 단어를 쓰세요.'));
  const g = h('div', {class: 'tg'});
  ws.forEach((w, i) => g.append(h('div', {class: 'ti pic'}, h('div', {class: 'ti-q'}, `${i + 1}. `, h('span', {class: 'emo'}, PH.PIC[w] || '❓'), h('span', {class: 'dots'}, '○'.repeat(w.length))), fourLine(86, 14))));
  p.append(g);
  p.append(h('div', {class: 'q-t'}, 'B. 엄마가 불러 주는 단어를 잘 듣고 쓰세요.'));
  const g2 = h('div', {class: 'tg'});
  ex.forEach((w, i) => g2.append(h('div', {class: 'ti'}, h('div', {class: 'ti-q'}, `${ws.length + i + 1}.`), fourLine(86, 14))));
  p.append(g2);
  p.append(h('div', {class: 'q-t'}, '✍️ 채점한 뒤: 틀린 단어를 3번씩 다시 써요.'), fourLine(186, 14), fourLine(186, 14), fourLine(186, 14));
  key.push({title: `Smart Phonics 2 · ${phTitle(u)} (${u.title})`, items: [...ws.map(w => w + (PH.PIC[w] ? ' ' + PH.PIC[w] : '')), ...ex.map(w => '🗣️ ' + w)]});
  return [p];
}

/* ---------- 정답지 ---------- */
function keyPages(key) {
  if (!key.length) return [];
  const out = [];
  for (let i = 0; i < key.length; i += 7) {
    const p = page('key'); p.append(h('div', {class: 'sh-head'}, h('div', {class: 'sh-kind'}, '✅ 정답 (엄마용)'), h('div', {class: 'sh-title'}, h('b', {}, '단어 시험 정답'), h('span', {}, '번호 순서대로 · 🗣️는 엄마가 불러 주는 단어'))));
    key.slice(i, i + 7).forEach(k => p.append(h('div', {class: 'key'}, h('b', {}, k.title), h('div', {}, k.items.map((x, j) => `${j + 1}. ${x}`).join('   ')))));
    out.push(p);
  }
  return out;
}

/* ---------- 고르는 화면 ---------- */
function render() {
  updateWho();
  app.innerHTML = '';
  const kidDefault = STUDENT && STUDENT.name === '서현' ? 'ph' : 'br';
  const st = {book: kidDefault, units: new Set([1]), practice: true, test: true, grammar: true, key: isMom(), extra: false};
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '🖨️ 출력용'), h('h1', {}, '영어 단어 쓰기 활동지'),
    h('p', {}, '단원을 고르고 [활동지 만들기] → [🖨️ 인쇄]를 누르세요. A4 세로로 나와요. 시험지는 만들 때마다 문제 순서가 바뀌어요.')));
  const box = h('div', {class: 'pbox'}); app.append(box);
  const books = h('div', {class: 'row', style: 'gap:8px;flex-wrap:wrap'});
  [['br', '🐰 서윤 · Bricks Reading 300'], ['ph', '🐻 서현 · Smart Phonics 2']].forEach(([k, t]) => books.append(h('button', {class: 'btn ' + (st.book === k ? 'coral' : 'ghost'), onclick: () => { st.book = k; st.units = new Set([1]); draw(); }}, t)));
  const unitBox = h('div', {class: 'ubox'}), opts = h('div', {class: 'row', style: 'gap:14px;flex-wrap:wrap;margin-top:10px'});
  box.append(h('div', {class: 'small'}, '누구의 책인가요?'), books, h('div', {class: 'small', style: 'margin-top:12px'}, '단원 (여러 개 골라도 돼요)'), unitBox, opts,
    h('div', {class: 'row', style: 'gap:8px;margin-top:14px;flex-wrap:wrap'}, h('button', {class: 'btn coral', onclick: build}, '활동지 만들기'), h('button', {class: 'btn', onclick: () => window.print()}, '🖨️ 인쇄')));
  const chk = (k, t, show = true) => show ? h('label', {class: 'small'}, (() => { const c = h('input', {type: 'checkbox', onchange: () => st[k] = c.checked}); c.checked = st[k]; return c; })(), ' ' + t) : '';
  async function draw() {
    [...books.children].forEach((b, i) => b.className = 'btn ' + ((i === 0 ? 'br' : 'ph') === st.book ? 'coral' : 'ghost'));
    unitBox.innerHTML = '';
    const list = st.book === 'br' ? BR.map(U => [U.n, `Unit ${U.n}`, U.t]) : (await loadPhonics()).UNITS.map(u => [u.no, phTitle(u), u.title]);
    list.forEach(([n, a, b]) => unitBox.append(h('button', {class: 'uchip' + (st.units.has(n) ? ' sel' : ''), title: b, onclick: e => { st.units.has(n) ? st.units.delete(n) : st.units.add(n); e.currentTarget.classList.toggle('sel'); }}, h('b', {}, a), h('small', {}, b))));
    opts.innerHTML = '';
    opts.append(chk('practice', '✏️ 쓰기 연습지'), chk('test', '📝 시험지'), chk('grammar', '🧩 문법 활동지', st.book === 'br'), chk('key', '✅ 정답지 (엄마용)', isMom()), chk('extra', '📒 책 단어장 단어도 넣기', st.book === 'br'));
  }
  async function build() {
    sheets.innerHTML = ''; const key = []; const units = [...st.units].sort((a, b) => a - b);
    if (!units.length) return toast('단원을 하나 이상 골라 주세요');
    if (st.book === 'ph') await loadPhonics();
    const pages = [];
    units.forEach(n => {
      if (st.book === 'br') { const U = BR.find(x => x.n === n); if (st.practice) pages.push(...brPractice(U, st.extra)); if (st.test) pages.push(...brTest(U, st.extra, key)); if (st.grammar) pages.push(...brGrammar(U, key)); }
      else { const u = PH.UNITS.find(x => x.no === n); if (st.practice) pages.push(...phPractice(u)); if (st.test) pages.push(...phTest(u, key)); }
    });
    if (st.key && isMom()) pages.push(...keyPages(key));
    sheets.append(...pages);
    try { await document.fonts.ready; } catch (e) {}
    layoutTraces(sheets);
    toast(`📄 ${pages.length}쪽 만들었어요. 미리 보고 [🖨️ 인쇄]를 눌러요`);
    sheets.scrollIntoView({behavior: 'smooth'});
    logEvent('attempt', {tag: '쓰기 활동지', q: (st.book === 'br' ? 'Bricks ' : 'Phonics ') + units.join(','), ok: 'O', answer: `${pages.length}쪽`});
  }
  draw();
  window.__build = build; window.__st = st;
}

/* Bricks 예문 빈칸 (bricks.js와 같은 규칙) */
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

ensureStudent(render);
