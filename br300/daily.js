/* ============================================================
   📅 오늘의 단어 — 소리 내어 읽기 + 뜻 말하기 + 확인 (단어 상자 복습)
   엄마표 읽기에서 약한 '단어를 정확히 읽기'와 '뜻을 정확히 알기'를 매일 조금씩.
   bricks.js 앞에 불러와요 (SH, P, cloze 등은 호출할 때 씀).
   ============================================================ */
const BOX_DAYS = [0, 1, 2, 4, 7, 14, 30];   // 상자 번호별 다음 복습까지 날짜
const dayNo = () => { const d = new Date(); return Math.floor((d - d.getTimezoneOffset() * 60000) / 864e5); };
const BOX = () => (S.box = S.box || {});

function wordPool(maxU, withExtra) {
  const out = [];
  BR.filter(U => U.n <= maxU).forEach(U => {
    U.v.forEach(w => out.push({en: w[0], pos: w[1], ko: w[2], ex: w[3], u: U.n, w}));
    if (withExtra) (WL[U.n] || []).forEach(([en, ko]) => { if (!U.v.some(w => w[0].toLowerCase() === en.toLowerCase())) out.push({en, pos: '', ko, ex: '', u: U.n}); });
  });
  return out;
}
function defaultRange() {
  let m = 1; BR.forEach(U => { if (PARTS.some(p => got(U, p.k))) m = Math.max(m, U.n); });
  return S.dRange || m;
}
function todaySet() {
  const pool = wordPool(defaultRange(), !!S.dExtra); const B = BOX(); const t = dayNo();
  const due = pool.filter(x => B[x.en] && B[x.en].b < 7 && B[x.en].due <= t).sort((a, b) => B[a.en].b - B[b.en].b);
  const fresh = pool.filter(x => !B[x.en]);
  const nNew = Math.max(3, Math.min(8, 20 - due.length));
  return {due: due.slice(0, 15), fresh: fresh.slice(0, nNew)};
}
function moveBox(x, ok) {
  const B = BOX(); const cur = B[x.en] ? B[x.en].b : 0; const b = ok ? Math.min(cur + 1, 7) : 1;
  B[x.en] = {b, due: dayNo() + (ok ? BOX_DAYS[Math.min(b, 6)] : 1), u: x.u};
}

/* ---- 말하기 인식 (되면 쓰고, 안 되면 스스로 확인) ---- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function listen() {
  return new Promise(res => {
    if (!SR) return res(null);
    let fin = false; const end = v => { if (!fin) { fin = true; res(v); } };
    try {
      const r = new SR(); r.lang = 'en-US'; r.maxAlternatives = 5; r.interimResults = false;
      r.onresult = e => end([...e.results[0]].map(a => a.transcript));
      r.onerror = () => end([]); r.onend = () => end([]);
      r.start(); setTimeout(() => { try { r.stop(); } catch (e) {} }, 5000);
    } catch (e) { end(null); }
  });
}
const norm = s => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
function heardRight(alts, word) {
  const w = norm(word.replace(/one[’']s/, '')).replace(/ +$/, '');
  return alts.some(a => (' ' + norm(a) + ' ').includes(' ' + w.split(' ')[0]) && w.split(' ').every(p => norm(a).includes(p)));
}
function boldIn(x) {
  if (!x.ex) return '';
  const c = x.w && cloze(x.w);
  return c ? x.ex.replace(c.ans, `<b class="br-hl">${c.ans}</b>`) : x.ex;
}

/* ---- 한 단어 카드 ---- */
function readCard(x, pool, next) {
  const res = {x, read: null, mean: null};
  const c = h('div', {class: 'g1-prob br-read'});
  c.append(h('div', {class: 'small'}, `Unit ${x.u}${x.pos ? ' · ' + x.pos : ''}`), h('div', {class: 'br-read-w'}, x.en));
  const A = h('div', {class: 'br-stage'}); const B = h('div', {class: 'br-stage'}); const C = h('div', {class: 'br-stage'});
  c.append(A, B, C);
  // A. 소리 내어 읽기
  const selfRow = h('div', {class: 'g1-row hide', style: 'gap:8px;flex-wrap:wrap;margin-top:8px'});
  const msg = h('div', {class: 'small', style: 'min-height:20px;margin-top:6px'});
  const readDone = ok => { if (res.read !== null) return; res.read = ok; selfRow.remove(); A.querySelectorAll('button').forEach(b => b.disabled = true);
    msg.innerHTML = ok ? '👍 잘 읽었어요!' : '괜찮아요. 🔊 를 몇 번 더 듣고 따라 읽어 봐요.'; G1.tone(ok); goMeaning(); };
  selfRow.append(h('div', {class: 'small', style: 'width:100%'}, '내가 읽은 소리와 같았나요?'),
    h('button', {class: 'g1-btn mint', onclick: () => readDone(true)}, '⭕ 맞게 읽었어요'), h('button', {class: 'g1-btn ghost', onclick: () => readDone(false)}, '❌ 다르게 읽었어요'));
  const hear = (rate, label) => h('button', {class: 'en-play', onclick: () => { EN.stop(); EN.speak(x.en, rate); selfRow.classList.remove('hide'); }}, label);
  const mic = SR ? h('button', {class: 'g1-btn', onclick: async () => {
    mic.disabled = true; mic.textContent = '🎙️ 듣고 있어요… 읽어 보세요!';
    const alts = await listen(); mic.disabled = false; mic.textContent = '🎤 다시 읽기';
    if (alts && alts.length && heardRight(alts, x.en)) { readDone(true); return; }
    msg.innerHTML = alts && alts.length ? `“${alts[0]}” 처럼 들렸어요. 🔊 로 들어 보고 다시 해 봐요.` : '소리가 잘 안 들렸어요. 다시 하거나 🔊 로 들어 보고 스스로 확인해요.';
    selfRow.classList.remove('hide');
  }}, '🎤 읽기') : '';
  A.append(h('div', {class: 'br-q'}, '🗣️ ① 먼저 소리 내어 읽어 보세요.'), h('div', {class: 'g1-row', style: 'gap:8px;flex-wrap:wrap'}, mic, hear(0.75, '🔊 들어 보기'), hear(0.45, '🐢 천천히')), msg, selfRow);
  // B. 뜻 말하기 → C. 확인 (뜻을 보기 전에 풀어요) → 뜻·예문 보기
  function goMeaning() {
    const go = h('button', {class: 'g1-btn', onclick: () => { go.remove(); check(); }}, '말했어요 → 확인 문제');
    B.append(h('div', {class: 'br-q', html: '🤔 ② 이 단어의 뜻을 <b>소리 내어</b> 말해 보세요.'}), go);
  }
  function check() {
    const others = SH(pool.filter(o => o.en !== x.en && o.ko !== x.ko)).slice(0, 3);
    const opts = SH([x, ...others]);
    C.append(h('div', {class: 'br-q', html: x.ex ? `✅ ③ 내가 말한 뜻이 맞는지 골라 봐요. 이 문장의 <b>${x.en}</b> 뜻은?<br><span class="br-sent" style="font-size:18px">${boldIn(x)}</span>` : `✅ ③ 내가 말한 뜻이 맞는지 골라 봐요. <b>${x.en}</b> 의 뜻은?`}));
    const list = h('div', {class: 'br-opts'});
    const pick = (o, btn) => {
      if (res.mean !== null) return; const ok = o === x; res.mean = ok;
      if (btn) btn.classList.add(ok ? 'ok' : 'no'); list.children[opts.indexOf(x)].classList.add('ok'); G1.tone(ok);
      C.append(h('div', {class: 'br-meaning', style: 'margin-top:8px'}, h('div', {class: 'br-ko'}, `${x.en} = ${x.ko}`), x.ex ? h('div', {class: 'br-ex', html: boldIn(x)}) : '', x.ex ? EN.btn(x.ex, '🔊 예문 듣기') : ''));
      finish(ok ? '정확해요! 🎯' : '이번에 확실히 익혀요. 뜻을 소리 내어 한 번 더 말해 봐요!');
    };
    opts.forEach(o => { const btn = h('button', {class: 'br-optbtn', onclick: () => pick(o, btn)}, o.ko); list.append(btn); });
    list.append(h('button', {class: 'br-optbtn', style: 'opacity:.75', onclick: () => pick(null, null)}, '🤷 잘 모르겠어요'));
    C.append(list);
  }
  function finish(t) {
    C.append(h('div', {class: 'g1-fb ' + (res.read && res.mean ? 'good' : 'bad'), html: t}),
      h('button', {class: 'g1-btn mint', style: 'margin-top:8px', onclick: () => next(res)}, '다음 단어 →'));
  }
  return c;
}

/* ---- 여러 단어 연습 ---- */
function readSession(list, cfg) {
  const root = h('div'); const prog = h('div', {class: 'g1-progress'}); const slot = h('div'); const results = []; let i = 0;
  const pool = cfg.pool || list;
  const draw = () => { prog.innerHTML = ''; list.forEach((_, k) => prog.append(h('span', {class: k < i ? 'on' : ''}, k < i ? (results[k].read && results[k].mean ? '⭐' : '🔸') : '☆'))); };
  function show() {
    draw(); slot.innerHTML = ''; EN.stop();
    if (i >= list.length) return end();
    slot.append(readCard(list[i], pool.length >= 4 ? pool : wordPool(20), r => { results.push(r); if (!cfg.practice) moveBox(r.x, r.read && r.mean); save(); i++; show(); window.scrollTo(0, root.offsetTop - 70); }));
  }
  function end() {
    const nr = results.filter(r => r.read).length, nm = results.filter(r => r.mean).length, hard = results.filter(r => !(r.read && r.mean));
    slot.append(h('div', {class: 'g1-big', style: 'text-align:center;margin:14px 0'}, `🗣️ 읽기 ${nr} / ${list.length}  ·  💡 뜻 ${nm} / ${list.length}`));
    if (!cfg.practice) logEvent('score', {tag: cfg.label, q: `Bricks ${cfg.label}`, ok: hard.length ? 'X' : 'O', answer: `읽기 ${nr}/${list.length}, 뜻 ${nm}/${list.length}` + (hard.length ? ` · 어려운 단어: ${hard.map(r => r.x.en + (r.read ? '' : '(읽기)') + (r.mean ? '' : '(뜻)')).join(', ')}` : '')});
    hard.forEach(r => { if (r.x.w && !r.mean) addWrong(r.x.w); });
    if (hard.length) {
      const g = h('div', {class: 'br-mini'});
      hard.forEach(r => g.append(h('div', {class: 'br-minicard'}, h('b', {}, r.x.en), h('span', {}, r.x.ko), h('span', {class: 'small'}, (r.read ? '' : '🗣️읽기 ') + (r.mean ? '' : '💡뜻')), EN.btn(r.x.en, '🔊'))));
      slot.append(h('h3', {class: 'jua'}, '😤 아직 어려운 단어'), g,
        h('div', {style: 'text-align:center;margin-top:12px'}, h('button', {class: 'g1-btn', onclick: () => root.replaceWith(readSession(hard.map(r => r.x), {label: cfg.label + ' 다시', pool, practice: true}))}, '🔁 어려운 단어만 한 번 더')));
    } else slot.append(h('div', {style: 'text-align:center'}, '모든 단어를 정확히 읽고 뜻도 알았어요! 👏'));
    cfg.onEnd && cfg.onEnd(hard.length === 0);
  }
  root.append(prog, slot); show(); return root;
}

/* ---- 📅 오늘의 단어 화면 ---- */
function boxBar() {
  const B = BOX(); const cnt = [0, 0, 0, 0, 0, 0, 0, 0]; Object.values(B).forEach(v => cnt[v.b]++);
  const bar = h('div', {class: 'br-boxes'});
  [['1', '매일'], ['2', '2일'], ['3', '4일'], ['4', '1주'], ['5', '2주'], ['6', '한 달']].forEach(([n, t], k) => bar.append(h('div', {class: 'br-box b' + n}, h('b', {}, String(cnt[k + 1])), h('span', {}, `상자 ${n}`), h('small', {}, t))));
  bar.append(h('div', {class: 'br-box b7'}, h('b', {}, String(cnt[7])), h('span', {}, '🎓 졸업'), h('small', {}, '완벽!')));
  return bar;
}
function dailyPage() {
  const {due, fresh} = todaySet(); const doneToday = S.dDone === dayNo();
  app.append(h('section', {class: 'lesson-head'}, h('div', {class: 'kicker'}, '📅 오늘의 단어'), h('h1', {}, '소리 내어 읽고, 뜻 말하기'),
    G1.say('단어마다 <b>① 소리 내어 읽기 → ② 뜻 말하기 → ③ 확인 문제</b> 순서예요. 읽기와 뜻이 둘 다 맞아야 통과! 다 맞힌 단어는 다음 상자로 가서 점점 드물게 나오고, 틀린 단어는 상자 1로 돌아와 내일 또 나와요.')));
  app.append(boxBar());
  const opt = h('div', {class: 'g1-row', style: 'gap:10px;flex-wrap:wrap;margin:10px 0'});
  const sel = h('select', {class: 'br-sel', onchange: () => { S.dRange = +sel.value; save(); route(); }});
  BR.forEach(U => sel.append(h('option', {value: U.n}, `Unit 1 ~ ${U.n}`))); sel.value = defaultRange();
  const ex = h('input', {type: 'checkbox', onchange: () => { S.dExtra = ex.checked; save(); route(); }}); ex.checked = !!S.dExtra;
  opt.append(h('span', {class: 'small'}, '범위'), sel, h('label', {class: 'small'}, ex, ' 📒 책 단어장 단어도 넣기'));
  app.append(opt);
  const list = SH(due).concat(fresh);
  app.append(h('div', {class: 'cond'}, `오늘: 복습 ${due.length}개 + 새 단어 ${fresh.length}개 = ${list.length}개` + (doneToday ? ' · ✅ 오늘 이미 했어요 (더 해도 좋아요)' : '')));
  if (!list.length) { app.append(h('div', {class: 'cond'}, '오늘 할 단어가 없어요! 범위를 넓혀 보세요. 🎉')); return; }
  const area = h('div');
  app.append(h('div', {style: 'text-align:center;margin:14px 0'}, h('button', {class: 'g1-btn', onclick: e => { e.target.remove(); area.append(readSession(list, {label: '오늘의 단어', pool: wordPool(20, true), onEnd: () => { S.dDone = dayNo(); save(); }})); }}, `🗣️ 시작하기 (${list.length}단어)`)), area);
}
