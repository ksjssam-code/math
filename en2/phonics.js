/* ============================================================
   Smart Phonics 2 (단모음 a · e · i) 혼자 공부하기
   - 책의 단원·단어 순서를 따르고, 문장과 이야기는 같은 단어로 새로 지었어요.
   - 영어 소리는 기기의 영어 음성(TTS)으로 들려줘요.
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

const PIC = {
  dam: '🦫', ham: '🍖', jam: '🍓', ram: '🐏', cap: '🧢', lap: '🧸', map: '🗺️', nap: '😴',
  can: '🥫', fan: '🪭', man: '👨', pan: '🍳', bat: '🦇', cat: '🐱', hat: '👒', mat: '🧘',
  jet: '✈️', net: '🥅', vet: '🩺', wet: '💦', bed: '🛏️', red: '🔴', hen: '🐔', pen: '🖊️',
  bib: '👶', rib: '🍗', kid: '🧒', lid: '🫕', pig: '🐷', wig: '💇', fin: '🦈', pin: '📌',
  dip: '🥣', hip: '💃', lip: '👄', rip: '📄', hit: '⚾', sit: '🪑', mix: '🥄', six: '6️⃣',
  pot: '🍲', hot: '🔥', fox: '🦊', box: '📦', log: '🪵', dog: '🐕', hop: '🐇', cop: '👮', mop: '🧹', top: '🔝',
  bug: '🐛', hug: '🤗', mug: '☕', rug: '🧶', rub: '🧽', tub: '🛁', cup: '🥤', pup: '🐶', jug: '🏺', sub: '🥪',
  bun: '🍔', fun: '🎉', run: '🏃', sun: '☀️', bud: '🌱', mud: '🟤', cut: '✂️', nut: '🥜', hut: '🛖',
  phone: '📱', photo: '📷', father: '👨', mother: '👩', knife: '🔪', knock: '🚪', write: '✍️', wrist: '⌚',
  blue: '🔵', glue: '🧴', fruit: '🍎', suit: '🤵', claw: '🦀', draw: '🖍️', chew: '😋', new: '🆕',
  field: '🌾', thief: '🦹', pie: '🥧', tie: '👔', hare: '🐇', square: '🟥', chair: '🪑', hair: '💇‍♀️',
  cinema: '🎬', circle: '⭕', game: '🎮', gorilla: '🦍', giraffe: '🦒', gym: '🏋️',
  ten: '🔟', pet: '🐶', van: '🚐', rat: '🐀', tap: '🚰', yam: '🍠', zip: '🤐', dig: '⛏️', big: '🐘', tin: '🥫', win: '🏆', kit: '🧰', fix: '🔧', men: '👬', sat: '🪑',
};
const UNITS = [
  {no: 1, vowel: 'a', title: 'am · ap', em: '🐏', color: '#FF7A59',
    fam: {am: ['dam', 'ham', 'jam', 'ram'], ap: ['cap', 'lap', 'map', 'nap']},
    extra: {am: ['yam', 'Sam', 'Pam'], ap: ['tap', 'gap', 'rap']},
    sight: ['a', 'has', 'his', 'oh', 'on', 'the'],
    sent: [['Sam has a ___.', 'map'], ['The ___ is on his lap.', 'cap'], ['The ram has ___.', 'jam'], ['The ___ has a nap.', 'ram'], ['The ham is on the ___.', 'map']],
    story: ['Sam has a map.', 'The map is on his lap.', 'Oh! The ram has the map.', 'The ram has a nap on the map.'],
    storyQ: {q: 'Who has a nap? (낮잠 자는 건 누구?)', options: ['🐏 the ram', '🧒 Sam', '🍖 the ham'], ans: 0}},
  {no: 2, vowel: 'a', title: 'an · at', em: '🐱', color: '#FFB020',
    fam: {an: ['can', 'fan', 'man', 'pan'], at: ['bat', 'cat', 'hat', 'mat']},
    extra: {an: ['van', 'ran', 'tan'], at: ['rat', 'sat', 'pat']},
    sight: ['a', 'goodbye', 'has', 'is', 'oh', 'on', 'the'],
    sent: [['The cat has a ___.', 'hat'], ['The ___ has a fan.', 'man'], ['The rat is in the ___.', 'pan'], ['The ___ is on the mat.', 'bat'], ['The can is in the ___.', 'van']],
    story: ['A fat cat sat on a mat.', 'The cat has a hat.', 'A rat ran to the cat.', 'Oh! The rat has the hat!'],
    storyQ: {q: 'What does the rat have? (쥐가 가진 것은?)', options: ['👒 a hat', '🍳 a pan', '🪭 a fan'], ans: 0}},
  {no: 3, vowel: 'e', title: 'ed · en · et', em: '🐔', color: '#2BB39A',
    fam: {ed: ['bed', 'red'], en: ['hen', 'pen'], et: ['jet', 'net', 'vet', 'wet']},
    extra: {ed: ['fed', 'wed'], en: ['ten', 'men', 'den'], et: ['pet', 'get', 'set']},
    sight: ['a', 'has', 'is', 'oh', 'on', 'the'],
    sent: [['The hen is on the ___.', 'bed'], ['The pen is ___.', 'red'], ['The net is ___.', 'wet'], ['The ___ has a pet.', 'vet'], ['The ___ has a red pen.', 'hen']],
    story: ['The hen has a red pen.', 'The hen is on the bed.', 'Oh no! The bed is wet.', 'The vet has a net for the hen.'],
    storyQ: {q: 'What color is the pen? (펜은 무슨 색?)', options: ['🔴 red', '🟢 green', '🔵 blue'], ans: 0}},
  {no: 4, vowel: 'i', title: 'ib · id · ig · in', em: '🐷', color: '#3E7BE6',
    fam: {ib: ['bib', 'rib'], id: ['kid', 'lid'], ig: ['pig', 'wig'], in: ['fin', 'pin']},
    extra: {ib: [], id: ['hid', 'did', 'bid'], ig: ['big', 'dig', 'jig'], in: ['win', 'tin', 'kin']},
    sight: ['a', 'has', 'oh', 'sees', 'the'],
    sent: [['The pig has a ___.', 'wig'], ['The ___ has a bib.', 'kid'], ['The pin is on the ___.', 'lid'], ['The ___ can dig.', 'pig'], ['The kid has a ___.', 'rib']],
    story: ['The kid has a pig.', 'The pig has a big wig.', 'The pig hid the wig.', 'Oh! The wig is on the kid!'],
    storyQ: {q: 'Where is the wig at the end? (마지막에 가발은 어디에?)', options: ['🧒 on the kid', '🐷 on the pig', '🛏️ on the bed'], ans: 0}},
  {no: 5, vowel: 'i', title: 'ip · it · ix', em: '6️⃣', color: '#8A5CF6',
    fam: {ip: ['dip', 'hip', 'lip', 'rip'], it: ['hit', 'sit'], ix: ['mix', 'six']},
    extra: {ip: ['tip', 'zip'], it: ['fit', 'kit', 'bit'], ix: ['fix']},
    sight: ['a', 'fun', 'have', 'on', 'run', 'the'],
    sent: [['Six kids ___ on the mat.', 'sit'], ['The kids ___ the jam.', 'mix'], ['The cat can ___ the map.', 'rip'], ['The kid can ___ the pan.', 'hit'], ['I see ___ hens.', 'six']],
    story: ['Six kids sit on a mat.', 'The kids mix red and tan.', 'Oh! The kids hit the pans.', 'The kids have fun!'],
    storyQ: {q: 'How many kids? (아이들은 몇 명?)', options: ['6️⃣ six', '🔟 ten', '2️⃣ two'], ans: 0}},
  {no: 6, vowel: 'o', title: 'og · op · ot · ox', em: '🦊', color: '#E2731B',
    fam: {og: ['dog', 'log'], op: ['cop', 'hop'], ot: ['hot', 'pot'], ox: ['box', 'fox']},
    extra: {og: ['fog', 'hog', 'jog'], op: ['mop', 'pop', 'top'], ot: ['dot', 'got', 'not'], ox: []},
    sight: ['and', 'are', 'is', 'not', 'on', 'the'],
    sent: [['The fox is in the ___.', 'box'], ['The cop has a hot ___.', 'pot'], ['The ___ sits on the log.', 'dog'], ['The fox can ___.', 'hop'], ['Do not touch. It is ___!', 'hot']],
    story: ['The dog hops on a log.', 'The fox is in the box.', 'The pot is hot!', 'The dog and the fox hop, hop, hop.'],
    storyQ: {q: 'Where is the fox? (여우는 어디에?)', options: ['📦 in the box', '🪵 on the log', '🍲 in the pot'], ans: 0}},
  {no: 7, vowel: 'u', title: 'ub · ug · up', em: '🐛', color: '#D6457A',
    fam: {ub: ['rub', 'tub'], ug: ['bug', 'hug', 'mug', 'rug'], up: ['cup', 'pup']},
    extra: {ub: ['cub', 'sub'], ug: ['dug', 'jug', 'tug'], up: ['up']},
    sight: ['are', 'in', 'is', 'on', 'one', 'the'],
    sent: [['The ___ is in the tub.', 'pup'], ['The bug is on the ___.', 'rug'], ['The pup has a ___.', 'mug'], ['I ___ my mom.', 'hug'], ['One ___ is on the cup.', 'bug']],
    story: ['A bug is on the rug.', 'The pup sees the bug.', 'The bug hops in a cup.', 'The pup and the bug hug.'],
    storyQ: {q: 'Who hugs the pup? (강아지와 안은 건?)', options: ['🐛 the bug', '🐱 the cat', '🦊 the fox'], ans: 0}},
  {no: 8, vowel: 'u', title: 'ud · un · ut', em: '☀️', color: '#0E8F8F',
    fam: {ud: ['bud', 'mud'], un: ['bun', 'fun', 'run', 'sun'], ut: ['cut', 'nut']},
    extra: {ud: ['dud'], un: ['nun', 'pun'], ut: ['hut', 'but', 'rut']},
    sight: ['in', 'is', 'says', 'sorry', 'the'],
    sent: [['The ___ is up.', 'sun'], ['The pup can ___.', 'run'], ['The pig is in the ___.', 'mud'], ['The ___ is on the bun.', 'nut'], ['Mom can ___ the bun.', 'cut']],
    story: ['The sun is up.', 'The pup can run.', 'Oh no! The pup is in the mud.', 'The pup has a bun. Fun!'],
    storyQ: {q: 'Where is the pup? (강아지는 어디에?)', options: ['🟤 in the mud', '🛁 in the tub', '📦 in the box'], ans: 0}},
  {no: 9, se: true, vowel: 'ph·th·kn·wr', title: 'Sound 1: ph · th · kn · wr', em: '📱', color: '#5B6478',
    fam: {ph: ['phone', 'photo'], th: ['father', 'mother'], kn: ['knife', 'knock'], wr: ['write', 'wrist']},
    extra: {}, sight: ['my', 'has', 'a', 'I'],
    sent: [['I take a ___ of my cat.', 'photo'], ['My ___ has a phone.', 'mother'], ['___, knock! Who is it?', 'knock'], ['I ___ my name.', 'write']],
    story: ['Knock, knock!', 'My father has a phone.', 'My mother has a photo.', 'I write a card for them.'],
    storyQ: {q: 'Who has a phone? (전화기를 가진 사람은?)', options: ['👨 father', '👩 mother', '🧒 me'], ans: 0},
    tip: 'ph는 [f], th는 [ð/θ], kn의 k와 wr의 w는 소리가 나지 않아요!'},
  {no: 10, se: true, vowel: 'ue·ui·aw·ew', title: 'Sound 2: ue · ui · aw · ew', em: '🔵', color: '#3E7BE6',
    fam: {ue: ['blue', 'glue'], ui: ['fruit', 'suit'], aw: ['claw', 'draw'], ew: ['chew', 'new']},
    extra: {}, sight: ['I', 'the', 'a', 'has'],
    sent: [['The sky is ___.', 'blue'], ['I eat ___.', 'fruit'], ['I can ___ a cat.', 'draw'], ['I have a ___ bag.', 'new']],
    story: ['I draw a blue cat.', 'The cat has a new suit.', 'The cat eats fruit.', 'Chew, chew, chew!'],
    storyQ: {q: 'What color is the cat? (고양이는 무슨 색?)', options: ['🔵 blue', '🔴 red', '🟢 green'], ans: 0}},
  {no: 11, se: true, vowel: 'ie·are·air', title: 'Sound 3: ie · are · air', em: '🥧', color: '#B5442A',
    fam: {'ie (이-)': ['field', 'thief'], 'ie (아이)': ['pie', 'tie'], are: ['hare', 'square'], air: ['chair', 'hair']},
    mark: {'ie (이-)': 'ie', 'ie (아이)': 'ie'},
    extra: {}, sight: ['a', 'is', 'in', 'the', 'has'],
    sent: [['I eat a ___.', 'pie'], ['Sit on the ___.', 'chair'], ['The ___ runs fast.', 'hare'], ['Dad has a red ___.', 'tie']],
    story: ['A hare is in the field.', 'The hare sits on a chair.', 'The hare has a pie.', 'Oh! A thief has the pie!'],
    storyQ: {q: 'Who has the pie at the end? (마지막에 파이를 가진 건?)', options: ['🦹 a thief', '🐇 the hare', '👨 dad'], ans: 0},
    tip: 'ie는 [이-]로도, [아이]로도 소리 나요. are와 air는 [에어] 소리예요.'},
  {no: 12, se: true, vowel: 'c·g', title: 'Sound 4: c · g', em: '🦒', color: '#2C8C5A',
    fam: {'c (k 소리)': ['cap', 'cat'], 'c (s 소리)': ['cinema', 'circle'], 'g (g 소리)': ['game', 'gorilla'], 'g (j 소리)': ['giraffe', 'gym']},
    mark: {'c (k 소리)': 'c', 'c (s 소리)': 'c', 'g (g 소리)': 'g', 'g (j 소리)': 'g'}, first: true,
    extra: {}, sight: ['a', 'and', 'is', 'at', 'the'],
    sent: [['I see a movie at the ___.', 'cinema'], ['The ___ is tall.', 'giraffe'], ['Draw a ___.', 'circle'], ['Let us play a ___.', 'game']],
    story: ['A cat and a gorilla play a game.', 'They draw a circle.', 'A giraffe is at the gym.', 'What fun!'],
    storyQ: {q: 'Who is at the gym? (체육관에 있는 건?)', options: ['🦒 a giraffe', '🦍 a gorilla', '🐱 a cat'], ans: 0},
    tip: 'c와 g 다음에 e, i, y가 오면 부드러운 소리 [s], [j]가 나요.'},
];
const allWords = U => Object.values(U.fam).flat();
const rimeOf = (U, w) => Object.keys(U.fam).find(r => U.fam[r].includes(w)) || w.slice(1);
const markOf = (U, key) => (U.mark && U.mark[key]) || key;
const onset = w => w.slice(0, w.length - 2);
const wordHTML = (w, color, U) => {
  if (!U || !U.se) return `<span class="en-on">${onset(w)}</span><span class="en-rime" style="color:${color}">${w.slice(-2)}</span>`;
  const m = markOf(U, rimeOf(U, w)); const i = U.first ? 0 : w.indexOf(m);
  return `${w.slice(0, i)}<span class="en-rime" style="color:${color}">${w.slice(i, i + m.length)}</span>${w.slice(i + m.length)}`;
};
const pic = w => PIC[w.toLowerCase()] || '❓';
const R = G1.ri, P = G1.pick, SH = G1.shuffle;
const others = (U, w, n) => SH(allWords(U).filter(x => x !== w)).slice(0, n);
const enKey = (U, part) => `en-${U.no}-${part}`;

/* 문제 카드: 듣기 버튼이 있는 고르기 문제 */
function listenProblem(U, opt) {
  const p = Object.assign({id: 'en-' + Math.random().toString(36).slice(2), tag: `${U.se ? U.title.split(':')[0] : 'Unit ' + U.no} ${opt.tag || ''}`}, opt);
  const card = G1.problem(p, opt.problemOpts || {});
  if (opt.play) { const vis = h('div', {class: 'en-listen'}, EN.btn(opt.play, '🔊 다시 듣기', true)); card.insertBefore(vis, card.children[1] || null); setTimeout(() => { EN.stop(); EN.speak(opt.play); }, 250); }
  return card;
}
/* 문제를 하나씩 차례로 */
function quizRunner(makeList, n, onDone, intro) {
  const root = h('div'); const prog = h('div', {class: 'g1-progress'}); const slot = h('div');
  let list = makeList(), i = 0, solved = 0;
  function draw() { prog.innerHTML = ''; for (let k = 0; k < n; k++) prog.append(h('span', {class: k < solved ? 'on' : ''}, k < solved ? '⭐' : '☆')); }
  function show() {
    slot.innerHTML = ''; draw();
    if (i >= n) { slot.append(h('div', {class: 'g1-big', style: 'text-align:center;margin:20px 0'}, '🎉 Great job!'), h('div', {style: 'text-align:center'}, h('button', {class: 'g1-btn', onclick: () => { list = makeList(); i = 0; solved = 0; show(); }}, '🔄 한 번 더'))); onDone && onDone(); return; }
    const card = list[i]({onSolve: () => { solved++; i++; setTimeout(show, 900); }});
    slot.append(card);
  }
  if (intro) root.append(G1.say(intro));
  root.append(prog, slot); show();
  return root;
}

/* ---------------- 1. Learn ---------------- */
function learn(U, done) {
  const root = h('div'); const heard = new Set(); const all = allWords(U);
  const info = h('div', {class: 'small'});
  const upd = () => { info.textContent = `들은 단어 ${heard.size} / ${all.length}`; if (heard.size === all.length) done(); };
  root.append(G1.say(`카드를 눌러 소리를 듣고 <b>따라 말해요</b>. 모든 단어를 한 번씩 들으면 별을 받아요!`));
  Object.entries(U.fam).forEach(([rime, words]) => {
    const fam = h('div', {class: 'en-fam'});
    fam.append(h('div', {class: 'en-fam-head'}, h('span', {class: 'en-rime-big', style: `color:${U.color}`}, U.se ? rime : '-' + rime), U.se ? '' : EN.btn(rime, '🔊'),
      h('button', {class: 'g1-btn ghost', onclick: () => EN.seq([rime, ...words.flatMap(w => [w])])}, '▶ 차례로 듣기')));
    const row = h('div', {class: 'en-cards'});
    words.forEach(w => row.append(h('button', {class: 'en-card', onclick: async () => { EN.stop(); if (U.se) { await EN.speak(w); await EN.speak(w, 0.55); } else { await EN.speak(onset(w)); await EN.speak(rime); await EN.speak(w); } heard.add(w); upd(); }},
      h('div', {class: 'en-pic'}, pic(w)), h('div', {class: 'en-word', html: wordHTML(w, U.color, U)}))));
    fam.append(row); root.append(fam);
  });
  root.append(info);
  root.append(h('div', {class: 'en-tip'}, U.se ? '💡 ' + (U.tip || '색칠된 글자가 내는 소리에 귀 기울여요.') + ' 카드를 누르면 보통 빠르기 → 천천히 두 번 들려줘요.' : '💡 카드를 누르면 앞소리 → 끝소리 → 단어 순서로 들려줘요. 예) c … ap … cap'));
  upd();
  return root;
}

/* ---------------- 2. Practice ---------------- */
function practice(U, done) {
  const make = () => {
    const ws = SH(allWords(U)); const rimes = Object.keys(U.fam);
    const qs = [];
    ws.slice(0, 8).forEach((w, k) => {
      const t = k % 4;
      if (t === 0) qs.push(o => { const opts = SH([w, ...others(U, w, 2)]); return listenProblem(U, {tag: '듣고 그림 고르기', q: '잘 듣고 알맞은 그림을 골라요.', play: w, choices: {options: opts.map(x => `<span style="font-size:46px">${pic(x)}</span>`), ans: opts.indexOf(w)}, problemOpts: o, sol: `${pic(w)} ${w}`}); });
      if (t === 1) qs.push(o => { const opts = SH([w, ...others(U, w, 2)]); return listenProblem(U, {tag: '듣고 단어 고르기', q: '잘 듣고 알맞은 단어를 골라요.', play: w, choices: {options: opts.map(x => `<span class="en-opt">${x}</span>`), ans: opts.indexOf(w)}, problemOpts: o, sol: w}); });
      if (U.se && (t === 2 || t === 3)) { qs.push(o => { const r = rimeOf(U, w); const opts = SH(Object.keys(U.fam)).slice(0, 3); if (!opts.includes(r)) opts[0] = r; const op2 = SH(opts); return listenProblem(U, {tag: '어떤 소리일까', q: `잘 듣고, 이 단어에 들어 있는 소리를 골라요.  <span style="font-size:46px">${pic(w)}</span>`, play: w, choices: {options: op2.map(x => `<span class="en-opt" style="font-size:24px">${x}</span>`), ans: op2.indexOf(r)}, problemOpts: o, sol: `${w}: ${r}`}); }); return; }
      if (t === 2) qs.push(o => { const r = rimeOf(U, w); const opts = rimes.length > 1 ? SH(rimes) : [r, 'ag']; return listenProblem(U, {tag: '끝소리 고르기', q: `그림을 보고 끝소리를 골라요.  <span style="font-size:46px">${pic(w)}</span>  <span class="en-opt">${onset(w)} _ _</span>`, choices: {options: opts.map(x => `<span class="en-opt">${x}</span>`), ans: opts.indexOf(r)}, problemOpts: o, sol: w, hint: () => EN.btn(w, '🔊 소리 듣기')}); });
      if (t === 3) qs.push(o => { const on = onset(w); const pool = SH([...new Set(allWords(U).map(onset).concat(['b', 's', 't', 'g']))].filter(x => x !== on)).slice(0, 2); const opts = SH([on, ...pool]); return listenProblem(U, {tag: '첫소리 고르기', q: `그림을 보고 첫소리를 골라요.  <span style="font-size:46px">${pic(w)}</span>  <span class="en-opt">_ ${w.slice(-2)}</span>`, choices: {options: opts.map(x => `<span class="en-opt">${x}</span>`), ans: opts.indexOf(on)}, problemOpts: o, sol: w, hint: () => EN.btn(w, '🔊 소리 듣기')}); });
    });
    return qs;
  };
  return quizRunner(make, 8, done, '듣고 고르기, 보고 고르기를 해요. 8문제를 맞히면 별을 받아요!');
}

/* ---------------- 3. Practice More ---------------- */
function practiceMore(U, done) {
  const make = () => {
    const ws = SH(allWords(U)); const qs = [];
    // 읽고 그림 고르기 (소리 없이 스스로 읽기)
    ws.slice(0, 3).forEach(w => qs.push(o => { const opts = SH([w, ...others(U, w, 2)]); return listenProblem(U, {tag: '읽고 그림 고르기', q: `소리 없이 읽어 봐요! <span class="en-opt" style="font-size:40px">${w}</span>`, choices: {options: opts.map(x => `<span style="font-size:46px">${pic(x)}</span>`), ans: opts.indexOf(w)}, problemOpts: o, hint: () => EN.btn(w, '🔊 소리 듣고 다시 해 보기'), sol: `${w} ${pic(w)}`}); }));
    // 문장 완성
    SH(U.sent).slice(0, 3).forEach(([s, a]) => qs.push(o => { const opts = SH([a, ...SH(allWords(U).concat(Object.values(U.extra).flat().map(x => x.toLowerCase())).filter(x => x !== a)).slice(0, 2)]); return listenProblem(U, {tag: '문장 완성', q: `빈칸에 알맞은 단어는? <span style="font-size:40px">${pic(a)}</span><br><span class="en-sent">${s.replace('___', '<u>&nbsp;?&nbsp;&nbsp;</u>')}</span>`, choices: {options: opts.map(x => `<span class="en-opt">${x}</span>`), ans: opts.indexOf(a)}, problemOpts: o, hint: () => EN.btn(s.replace('___', a), '🔊 문장 듣기'), sol: s.replace('___', a)}); }));
    // 새 단어 읽기: 같은 끝소리(라임) 찾기
    const fams = Object.entries(U.extra).filter(([r, xs]) => xs.length);
    SH(fams).slice(0, 2).forEach(([r, xs]) => qs.push(o => { const nw = P(xs); const base = P(U.fam[r]); const wrongR = Object.keys(U.fam).filter(x => x !== r); const wr = wrongR.length ? U.fam[P(wrongR)].slice(0, 2) : ['big', 'pen']; const opts = SH([base, ...wr]); return listenProblem(U, {tag: '새 단어 읽기', q: `처음 보는 단어예요. 읽어 볼까요? <span class="en-opt" style="font-size:40px">${nw}</span><br>이 단어와 <b>끝소리가 같은</b> 단어는?`, choices: {options: opts.map(x => `<span class="en-opt">${x}</span>`), ans: opts.indexOf(base)}, problemOpts: o, hint: () => EN.btn(nw, '🔊 ' + nw), sol: `${nw} - ${base} (둘 다 -${r})`}); }));
    while (qs.length < 8) { const w = P(allWords(U)); qs.push(o => { const opts = SH([w, ...others(U, w, 2)]); return listenProblem(U, {tag: '읽고 그림 고르기', q: `소리 없이 읽어 봐요! <span class="en-opt" style="font-size:40px">${w}</span>`, choices: {options: opts.map(x => `<span style="font-size:46px">${pic(x)}</span>`), ans: opts.indexOf(w)}, problemOpts: o, hint: () => EN.btn(w, '🔊 소리 듣고 다시 해 보기'), sol: `${w} ${pic(w)}`}); }); }
    return SH(qs).slice(0, 8);
  };
  return quizRunner(make, 8, done, '이번엔 <b>소리 없이 스스로 읽어요</b>. 틀리면 소리 듣기 힌트가 나와요!');
}

/* ---------------- 4. Story & Write ---------------- */
function storyWrite(U, done) {
  const root = h('div'); let storyOk = false, spelled = 0; const NEED = 4;
  const check = () => { if (storyOk && spelled >= NEED) done(); };
  // 이야기
  const st = h('div', {class: 'en-story'});
  st.append(h('div', {class: 'en-story-t'}, `📖 Story · ${U.se ? U.title.split(':')[0] : 'Unit ' + U.no}`), G1.say('한 문장씩 <b>먼저 혼자 읽고</b>, 🔊 를 눌러 맞게 읽었는지 확인해요. 모르는 단어는 눌러 보세요.'));
  U.story.forEach(line => {
    const ln = h('div', {class: 'en-line'});
    ln.append(EN.btn(line, '🔊'));
    const words = h('span', {class: 'en-sent'});
    line.split(' ').forEach(t => { const clean = t.replace(/[^A-Za-z]/g, ''); const isSight = U.sight.includes(clean.toLowerCase()); words.append(h('span', {class: 'en-w' + (isSight ? ' sight' : ''), onclick: () => { EN.stop(); EN.speak(clean); }}, t)); words.append(' '); });
    ln.append(words); st.append(ln);
  });
  st.append(h('div', {class: 'small'}, `🔷 사이트 워드(통째로 익히는 단어): ${U.sight.join(', ')}`));
  root.append(st);
  root.append(listenProblem(U, {tag: '이야기 이해', q: U.storyQ.q, choices: {options: U.storyQ.options.map(x => `<span class="en-opt" style="font-size:24px">${x}</span>`), ans: U.storyQ.ans}, problemOpts: {onSolve: () => { storyOk = true; check(); }}}));
  // 쓰기
  root.append(h('h3', {style: 'margin:24px 0 4px'}, '✏️ Write — 소리를 듣고 철자를 맞춰요'));
  const prog = h('div', {class: 'g1-progress'}); root.append(prog);
  const area = h('div'); root.append(area);
  const ws = SH(allWords(U)).slice(0, NEED);
  const drawProg = () => { prog.innerHTML = ''; ws.forEach((_, k) => prog.append(h('span', {class: k < spelled ? 'on' : ''}, k < spelled ? '⭐' : '☆'))); };
  function speller(w) {
    area.innerHTML = '';
    const letters = w.split(''); const extra = SH('abcdefghijklmnoprstuvw'.split('').filter(c => !letters.includes(c))).slice(0, 3);
    const tiles = SH([...letters, ...extra]); let typed = [];
    const card = h('div', {class: 'g1-prob'});
    const slots = h('div', {class: 'en-slots'}); const tileRow = h('div', {class: 'en-tiles'}); const fb = h('div', {class: 'g1-fb'});
    const draw = () => { slots.innerHTML = ''; letters.forEach((_, i) => slots.append(h('span', {class: 'en-slot' + (typed[i] ? ' full' : '')}, typed[i] ? typed[i].c : ''))); };
    tiles.forEach((c, i) => { const b = h('button', {class: 'en-tile', onclick: () => { if (b.disabled || typed.length >= letters.length) return; typed.push({c, b}); b.disabled = true; draw(); EN.speak(c); if (typed.length === letters.length) test(); }}, c); tileRow.append(b); });
    function test() {
      const ans = typed.map(t => t.c).join('');
      const ok = ans === w;
      logEvent('attempt', {tag: `Unit ${U.no} 철자 쓰기`, q: w, ok: ok ? 'O' : 'X', answer: ans});
      if (ok) { fb.className = 'g1-fb good'; fb.textContent = 'Great! ' + G1.pick(['🎉', '🌟', '👏']); G1.tone(true); EN.speak(w); spelled++; drawProg(); if (!S.solved['en-spell-' + U.no + w]) { markSolved('en-spell-' + U.no + w); G1.giveSticker(); }
        setTimeout(() => { if (spelled < ws.length) speller(ws[spelled]); else { area.innerHTML = ''; area.append(h('div', {class: 'g1-big', style: 'text-align:center'}, '✏️ 철자 쓰기 완료!')); } check(); }, 1100); }
      else { fb.className = 'g1-fb bad'; fb.textContent = '다시 들어 볼까요?'; G1.tone(false); setTimeout(() => { typed.forEach(t => t.b.disabled = false); typed = []; draw(); fb.textContent = ''; EN.speak(w); }, 1100); }
    }
    card.append(h('div', {class: 'g1-row', style: 'gap:16px;flex-wrap:wrap'}, h('span', {style: 'font-size:64px'}, pic(w)), EN.btn(w, '🔊 듣기', true),
      h('button', {class: 'g1-btn ghost', onclick: () => { typed.forEach(t => t.b.disabled = false); typed = []; draw(); }}, '↺ 지우기')), slots, tileRow, fb);
    area.append(card); draw(); setTimeout(() => EN.speak(w), 300);
  }
  drawProg(); speller(ws[0]);
  return root;
}

/* ---------------- 단원 복습 놀이: 그림-단어 짝 맞추기 ---------------- */
function review(U, done) {
  const ws = SH(allWords(U)).slice(0, 4);
  return G1.match(ws.map(w => [pic(w), w]), done, '🃏 그림과 단어 짝 맞추기 — 같은 것끼리 찾아요!');
}

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
  function show() { draw(); slot.innerHTML = ''; if (i >= steps.length) { slot.append(h('div', {class: 'g1-big', style: 'text-align:center;margin:16px 0'}, '📝 학습지 완료! 🎉')); onDone && onDone(); return; }
    slot.append(steps[i](() => { i++; if (!S.solved['en-ws-' + i + location.hash]) { markSolved('en-ws-' + i + location.hash); G1.giveSticker(); } setTimeout(show, 1000); })); }
  if (intro) root.append(G1.say(intro));
  root.append(prog, slot); show(); return root;
}

/* ---------------- 📝 Worksheet (학습지 1·2) ---------------- */
function worksheet(U, done) {
  const keys = Object.keys(U.fam);
  const ws1 = SH(allWords(U)).slice(0, 6).map(w => next => {
    const card = h('div', {class: 'g1-prob'});
    const r = rimeOf(U, w);
    const head = h('div', {class: 'g1-row', style: 'gap:16px;flex-wrap:wrap;align-items:center'}, h('span', {style: 'font-size:64px'}, pic(w)), EN.btn(w, '🔊'));
    card.append(h('div', {class: 'en-ws-t'}, U.se ? '1 · Listen, circle and write. 어떤 소리가 들어 있나요? 고르고 단어를 써요.' : '1 · Circle and write. 끝소리를 고르고 단어를 써요.'), head);
    const pick = h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;align-items:center;margin:10px 0'});
    if (!U.se) pick.append(h('span', {class: 'en-opt', style: 'font-size:44px'}, onset(w)));
    const write = h('div');
    keys.forEach(k => { const b = h('button', {class: 'g1-choice', onclick: () => {
      if (k === r) { b.classList.add('ok'); [...pick.querySelectorAll('.g1-choice')].forEach(x => x.disabled = true); G1.tone(true); write.append(h('div', {class: 'small', style: 'margin-top:6px'}, '이제 단어를 써 보세요 ✏️'), typer(w, {tag: `${U.title} 학습지 1`, q: w, onDone: next}).el); }
      else { b.classList.add('no'); G1.tone(false); logEvent('attempt', {tag: `${U.title} 학습지 1 고르기`, q: w, ok: 'X', answer: k}); }
    }}, h('span', {class: 'en-opt'}, U.se ? k : k)); pick.append(b); });
    card.append(pick, write); if (!U.se) setTimeout(() => {}, 0); return card;
  });
  const ws2 = SH(U.sent).slice(0, 4).map(([sent, a]) => next => {
    const card = h('div', {class: 'g1-prob'});
    card.append(h('div', {class: 'en-ws-t'}, '2 · Look and write. 그림을 보고 빈칸에 알맞은 단어를 써요.'),
      h('div', {class: 'g1-row', style: 'gap:14px;flex-wrap:wrap;align-items:center'}, h('span', {style: 'font-size:64px'}, pic(a)), h('span', {class: 'en-sent', html: sent.replace('___', '<u>&nbsp;&nbsp;?&nbsp;&nbsp;</u>')})),
      h('div', {style: 'margin:6px 0'}, EN.btn(a, '🔊 단어 소리 힌트')),
      typer(a, {tag: `${U.title} 학습지 2`, q: sent, onDone: next}).el);
    return card;
  });
  return stepRunner([...ws1, ...ws2], done, '책 학습지처럼 <b>고르고, 직접 써요</b>. 화면 자판이나 키보드로 글자를 입력해요.');
}

/* ---------------- Review 1 · 2 ---------------- */
const REVIEWS = [
  {id: 'R1', title: 'Review 1', sub: 'Unit 1 ~ 5', units: [1, 2, 3, 4, 5], color: '#FF7A59',
    look: ['net', 'pig', 'map', 'bat', 'hat', 'pin', 'lip', 'pen', 'jam', 'rib', 'pan', 'bed'],
    bank: ['bat', 'cat', 'fan', 'ham', 'hen', 'kid', 'man', 'six', 'vet', 'wig'],
    title2: 'At the Park',
    passage: ['The {kid} with the {wig} has a {bat}.', 'The {man} with the hat has {ham} in a pan.', 'The {vet} has {six} pets and a red {hen}.', 'Oh! The {cat} naps by the {fan}.']},
  {id: 'R2', title: 'Review 2', sub: 'Unit 6 ~ 8', units: [6, 7, 8], color: '#8A5CF6',
    look: ['tub', 'hop', 'fox', 'pot', 'cop', 'bun', 'hug', 'fun', 'dog', 'cup', 'nut', 'bud'],
    bank: ['bud', 'bug', 'dog', 'fox', 'hut', 'log', 'mud', 'nut', 'rug'],
    title2: 'Who Is in the Mud?',
    passage: ['The {bug} sits on a red {rug}.', 'The {fox} naps in the {hut}.', 'The pup has a {nut} and a {bud}.', 'Where is the {dog}? Oh! The dog is in the {mud} by the {log}!']},
];
function reviewPage(RV) {
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker', style: `color:${RV.color}`}, `📝 ${RV.sub} 복습`), h('h1', {}, RV.title)));
  const key = k => `en-${RV.id}-${k}`;
  const star = (k, label) => { if (!S.explore[key(k)]) { S.explore[key(k)] = 1; save(); toast(`⭐ ${RV.title} ${label} 완료!`); logEvent('star', {tag: `${RV.title} ${label}`, q: 'Smart Phonics 2'}); } };
  // A. Look and write (첫 글자가 주어져요)
  app.append(h('h2', {style: 'margin:10px 0 4px'}, 'A · Look and write'), G1.say('그림을 보고 첫 글자 다음에 오는 글자를 써요. 모르면 🔊 를 눌러요.'));
  app.append(stepRunner(SH(RV.look).map(w => next => { const c = h('div', {class: 'g1-prob'}); c.append(h('div', {class: 'g1-row', style: 'gap:16px;align-items:center'}, h('span', {style: 'font-size:64px'}, pic(w)), EN.btn(w, '🔊')), typer(w, {prefix: w[0], tag: `${RV.title} Look and write`, q: w, onDone: next}).el); return c; }), () => star('a', 'Look and write')));
  // B. Listen and fill
  app.append(h('h2', {style: 'margin:28px 0 4px'}, 'B · Listen and fill in the blanks'));
  app.append(G1.say('▶ 를 눌러 이야기를 듣고, 빈칸을 누른 다음 아래 단어 상자에서 알맞은 단어를 골라요.'));
  const box = h('div', {class: 'en-story'}); app.append(box);
  const full = RV.passage.map(l => l.replace(/[{}]/g, '')).join(' ');
  box.append(h('div', {class: 'g1-row', style: 'gap:10px;align-items:center;flex-wrap:wrap'}, h('span', {class: 'en-story-t'}, RV.title2), h('button', {class: 'en-play big', onclick: () => EN.seq(RV.passage.map(l => l.replace(/[{}]/g, '')), 500)}, '▶ 이야기 듣기')));
  const blanks = []; let cur = null;
  RV.passage.forEach(l => {
    const line = h('div', {class: 'en-sent', style: 'margin:8px 0;font-size:24px'});
    l.split(/(\{[a-z]+\})/).forEach(part => {
      const m = part.match(/^\{([a-z]+)\}$/);
      if (m) { const b = h('button', {class: 'en-blank', onclick: () => { cur = b; blanks.forEach(x => x.el.classList.remove('cur')); b.classList.add('cur'); }}, '      '); blanks.push({el: b, ans: m[1], val: ''}); line.append(b); }
      else line.append(part);
    });
    box.append(line);
  });
  const bank = h('div', {class: 'g1-row', style: 'gap:8px;flex-wrap:wrap;margin:12px 0'});
  RV.bank.forEach(w => bank.append(h('button', {class: 'g1-chip', onclick: () => { const t = cur || (blanks.find(x => !x.val) || {}).el; if (!t) return; const B = blanks.find(x => x.el === t); B.val = w; t.textContent = w; t.classList.remove('no', 'ok'); EN.speak(w); const nx = blanks.find(x => !x.val); cur = nx ? nx.el : null; blanks.forEach(x => x.el.classList.toggle('cur', x.el === cur)); }}, w)));
  const fb = h('div', {class: 'g1-fb'});
  box.append(h('div', {class: 'small'}, '단어 상자 (한 단어는 남을 수도 있어요)'), bank,
    h('button', {class: 'g1-btn', onclick: () => {
      let n = 0; blanks.forEach(B => { const ok = B.val === B.ans; B.el.classList.toggle('ok', ok); B.el.classList.toggle('no', !ok); if (ok) n++; });
      logEvent('score', {tag: `${RV.title} Listen and fill`, q: RV.title2, ok: n === blanks.length ? 'O' : 'X', answer: `${n}/${blanks.length}`});
      fb.className = 'g1-fb ' + (n === blanks.length ? 'good' : 'bad'); fb.textContent = n === blanks.length ? `🎉 ${n} / ${blanks.length} 모두 맞았어요!` : `${n} / ${blanks.length} 맞았어요. 빨간 빈칸을 다시 골라 봐요.`;
      if (n === blanks.length) { G1.tone(true); star('b', 'Listen and fill'); } else G1.tone(false);
    }}, '채점하기 ✔'), fb);
  blanks[0] && (cur = blanks[0].el, blanks[0].el.classList.add('cur'));
}

/* ============================================================
   화면
   ============================================================ */
const PARTS = [
  {k: 'learn', n: '1 Learn', d: '듣고 따라 말하기', f: learn},
  {k: 'practice', n: '2 Practice', d: '듣고 고르기', f: practice},
  {k: 'more', n: '3 Practice More', d: '스스로 읽기', f: practiceMore},
  {k: 'story', n: '4 Story & Write', d: '이야기 읽고 철자 쓰기', f: storyWrite},
  {k: 'ws', n: '📝 Worksheet', d: '학습지: 고르고 직접 쓰기', f: worksheet},
  {k: 'review', n: '🎮 Game', d: '짝 맞추기 놀이', f: review},
];
const app = document.getElementById('app');
const got = (U, k) => !!(S.explore[enKey(U, k)]);
function giveStar(U, k, label) { if (!S.explore[enKey(U, k)]) { S.explore[enKey(U, k)] = 1; save(); toast(`⭐ ${label} 완료!`); logEvent('star', {tag: `Unit ${U.no} ${label}`, q: 'Smart Phonics 2'}); } }
function home() {
  const total = UNITS.reduce((s, U) => s + PARTS.filter(p => got(U, p.k)).length, 0) + REVIEWS.reduce((s, RV) => s + ['a', 'b'].filter(k => S.explore[`en-${RV.id}-${k}`]).length, 0);
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, 'English · Smart Phonics 2'), h('h1', {}, '짧은 모음 a · e · i · o · u'),
    G1.say('단원을 골라요. <b>Learn → Practice → Practice More → Story & Write</b> 순서로 하면 좋아요. 영어 소리는 🔊 를 눌러 들어요.'),
    h('div', {class: 'g1-row', style: 'gap:12px;margin-top:6px'}, h('span', {class: 'big-num'}, `⭐ ${total} / ${UNITS.length * PARTS.length + REVIEWS.length * 2}`), h('span', {class: 'small'}, `스티커 ${(S.stickers || []).length}개`), EN.btn('Hello! Let\'s learn phonics!', '🔊 소리 확인'))));
  const g = h('div', {class: 'g1-map'});
  const g2 = h('div', {class: 'g1-map'});
  UNITS.forEach(U => (U.se ? g2 : g).append(h('div', {class: 'g1-mapcard', style: `border-color:${U.color}55`, onclick: () => location.hash = 'U' + U.no},
    h('div', {class: 'em'}, U.em), h('div', {class: 'small'}, U.se ? 'Sound Expansion' : `Unit ${U.no} · short ${U.vowel}`), h('h3', {style: `color:${U.color}`}, U.title),
    h('div', {class: 'small'}, allWords(U).join(' · ')),
    h('div', {class: 'st', html: PARTS.map(p => `<span class="${got(U, p.k) ? 'on' : ''}">★</span>`).join('')}))));
  const rg = h('div', {class: 'g1-map'});
  REVIEWS.forEach(RV => rg.append(h('div', {class: 'g1-mapcard', style: `border-color:${RV.color}55`, onclick: () => location.hash = RV.id}, h('div', {class: 'em'}, '📝'), h('div', {class: 'small'}, RV.sub), h('h3', {style: `color:${RV.color}`}, RV.title), h('div', {class: 'small'}, 'Look and write · Listen and fill'),
    h('div', {class: 'st', html: ['a', 'b'].map(k => `<span class="${S.explore['en-' + RV.id + '-' + k] ? 'on' : ''}">★</span>`).join('')}))));
  app.append(g, h('h2', {style: 'margin:28px 0 4px'}, '📝 Review (복습 학습지)'), rg, h('h2', {style: 'margin:28px 0 4px'}, '🎧 Sound Expansion (소리 넓히기)'), h('div', {class: 'small', style: 'margin-bottom:10px'}, '단모음을 다 익히면 도전해요. 두 글자가 함께 내는 소리, 소리 나지 않는 글자를 배워요.'), g2);
}
function unit(U) {
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker', style: `color:${U.color}`}, U.se ? `Sound Expansion ${U.em}` : `Unit ${U.no} · short ${U.vowel} ${U.em}`), h('h1', {}, U.title)));
  const tabs = h('div', {class: 'g1-tabs'}); const body = h('div');
  const mark = () => [...tabs.children].forEach((t, i) => t.classList.toggle('done', got(U, PARTS[i].k)));
  function show(i) {
    EN.stop(); [...tabs.children].forEach((t, j) => t.classList.toggle('on', i === j)); body.innerHTML = '';
    const P0 = PARTS[i];
    body.append(h('div', {class: 'small', style: 'margin-bottom:6px'}, P0.d));
    body.append(P0.f(U, () => { giveStar(U, P0.k, P0.n.replace(/^\d /, '')); mark(); }));
    const nx = PARTS[i + 1];
    body.append(h('div', {style: 'text-align:right;margin-top:14px'}, nx ? h('button', {class: 'g1-btn mint', onclick: () => show(i + 1)}, `다음: ${nx.n} →`) : (UNITS[U.no] ? h('a', {class: 'g1-btn', style: 'text-decoration:none;display:inline-block', href: '#U' + (U.no + 1)}, UNITS[U.no].se ? `${UNITS[U.no].title} →` : `Unit ${U.no + 1} 로 →`) : '')));
    window.scrollTo(0, 0);
  }
  PARTS.forEach((p, i) => tabs.append(h('button', {class: 'g1-tab', onclick: () => show(i)}, p.n)));
  app.append(tabs, body); mark(); show(0);
  // 노트
  app.append(G1.thinkNote('en-' + U.no, `${U.se ? U.title : 'Unit ' + U.no}에서 기억에 남는 단어는?`, allWords(U)));
}
function stickers() {
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '🌟 스티커'), h('h1', {}, '내 스티커 모음')));
  const g = h('div', {class: 'g1-stickers'}); (S.stickers || []).forEach(s => g.append(h('span', {}, s)));
  if (!(S.stickers || []).length) g.append(h('div', {class: 'cond'}, '아직 스티커가 없어요.'));
  app.append(g);
}
function route() {
  const r = (location.hash || '#home').slice(1); app.innerHTML = ''; EN.stop(); G1.activeBox = null;
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === r || (r.startsWith('U') && a.dataset.r === 'home')));
  if (r.startsWith('U')) { const U = UNITS.find(x => 'U' + x.no === r); if (U) return unit(U); }
  if (r === 'stickers') return stickers();
  const RV = REVIEWS.find(x => x.id === r); if (RV) return reviewPage(RV);
  home();
}
window.addEventListener('hashchange', route);
updateWho(); ensureStudent(route); flushLog();
