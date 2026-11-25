/* ============================================================
   📖 Read — 본문 읽기 · 원어민 전체 듣기 · 한 문장씩 듣기 · 단어 누르면 소리+뜻
   본문과 원어민 녹음은 공개 저장소에 넣지 않아요.
   엄마 구글 드라이브의 '브릭스 본문' 폴더 → Apps Script가 로그인한 가족에게만 보내 줘요.
   ============================================================ */
const BRK = {text: null, audio: {}};

/* 단어 → 사전 기본형 후보 */
const IRR_W = {was: 'be', were: 'be', is: 'be', are: 'be', am: 'be', been: 'be', has: 'have', had: 'have', does: 'do', did: 'do', done: 'do', went: 'go', gone: 'go', goes: 'go', came: 'come', began: 'begin', got: 'get', made: 'make', took: 'take', taken: 'take', gave: 'give', given: 'give', saw: 'see', seen: 'see', said: 'say', told: 'tell', found: 'find', thought: 'think', brought: 'bring', sold: 'sell', felt: 'feel', kept: 'keep', led: 'lead', met: 'meet', ran: 'run', sank: 'sink', broke: 'break', chose: 'choose', chosen: 'choose', known: 'know', knew: 'know', grew: 'grow', heard: 'hear', held: 'hold', lost: 'lose', meant: 'mean', taught: 'teach', threw: 'throw', understood: 'understand', wrote: 'write', written: 'write', fell: 'fall', flew: 'fly', became: 'become', children: 'child', men: 'man', geese: 'goose', feet: 'foot', fungi: 'fungus', best: 'good', better: 'good', worse: 'bad', farther: 'far'};
function wordKeys(raw) {
  const n = raw.toLowerCase().replace(/’/g, "'");
  const w = n.replace(/'s$/, '');
  const c = [n, w]; if (IRR_W[w]) c.push(IRR_W[w]);
  const R = (re, s) => { if (re.test(w)) c.push(w.replace(re, s)); };
  R(/ies$/, 'y'); R(/ied$/, 'y'); R(/ier$/, 'y'); R(/iest$/, 'y'); R(/ily$/, 'y'); R(/ves$/, 'f'); R(/ves$/, 'fe');
  R(/(ss|sh|ch|x|z|o)es$/, '$1'); R(/([^s])s$/, '$1'); R(/(.)\1ed$/, '$1'); R(/(.)\1ing$/, '$1'); R(/(.)\1er$/, '$1'); R(/(.)\1est$/, '$1');
  R(/ed$/, ''); R(/ed$/, 'e'); R(/d$/, ''); R(/ing$/, ''); R(/ing$/, 'e'); R(/er$/, ''); R(/er$/, 'e'); R(/est$/, ''); R(/est$/, 'e'); R(/ly$/, ''); R(/ly$/, 'le');
  return [...new Set(c)];
}
function lookUp(raw, U) {
  const ks = wordKeys(raw);
  const v = U.v.find(x => ks.includes(x[0].toLowerCase()) || ks.some(k => x[0].toLowerCase().split(' ')[0] === k));
  const extra = (WL[U.n] || []).find(x => ks.includes(x[0].toLowerCase()));
  const k = ks.find(x => GLOSS[x]);
  return {vocab: v, extra, base: k && k !== ks[0] && k !== ks[1] ? k : null, ko: v ? v[2] : extra ? extra[1] : k ? GLOSS[k] : null};
}

/* 서버(Apps Script)에서 본문·녹음 받기 */
function brApi(action, extra) { return api(action, Object.assign({who: STUDENT.name, token: readKey(STUDENT.name)}, extra || {})); }
async function loadText() {
  if (BRK.text) return BRK.text;
  try { const c = JSON.parse(localStorage.getItem('br-text-v1') || 'null'); if (c && c.u) { BRK.text = c.u; return BRK.text; } } catch (e) {}
  const j = await brApi('brText');
  if (!j || !j.ok) throw new Error(j && j.error || '불러오지 못했어요');
  BRK.text = j.data; try { localStorage.setItem('br-text-v1', JSON.stringify({u: j.data})); } catch (e) {}
  return BRK.text;
}
async function loadAudio(n) {
  if (BRK.audio[n]) return BRK.audio[n];
  const j = await brApi('brAudio', {unit: n});
  if (!j || !j.ok || !j.b64) throw new Error(j && j.error || '녹음을 불러오지 못했어요');
  const bin = atob(j.b64); const arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  BRK.audio[n] = URL.createObjectURL(new Blob([arr], {type: j.mime || 'audio/mp4'}));
  return BRK.audio[n];
}

/* 긴 문장도 끝까지 읽는 TTS */
function speakFull(text, rate) {
  return new Promise(res => {
    try {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate; if (EN.voice) u.voice = EN.voice;
      let fin = false; const end = () => { if (!fin) { fin = true; res(); } };
      u.onend = end; u.onerror = end; speechSynthesis.speak(u);
      setTimeout(end, 1500 + text.length * 140 / rate);
    } catch (e) { res(); }
  });
}
const splitSent = p => p.match(/[^.!?]+[.!?]+[”"’)]*\s*|[^.!?]+$/g) || [p];

/* 단어 풀이 창 */
let popEl = null;
document.addEventListener('click', e => { if (popEl && !popEl.contains(e.target) && !e.target.classList.contains('rw')) closePop(); });
function closePop() { if (popEl) { popEl.remove(); popEl = null; } document.querySelectorAll('.rw.on').forEach(x => x.classList.remove('on')); }
function wordPop(raw, sent, U, span) {
  closePop(); span.classList.add('on');
  const word = raw.replace(/[’']s$/, '').replace(/’/g, "'");
  const L = lookUp(raw, U);
  EN.stop(); EN.speak(word, 0.7);
  const saved = S.wrong && S.wrong[(L.vocab ? L.vocab[0] : word)];
  popEl = h('div', {class: 'rpop'},
    h('button', {class: 'rpop-x', onclick: closePop}, '✕'),
    h('div', {class: 'rpop-w'}, word, L.vocab ? h('span', {class: 'rpop-tag'}, '⭐ 이번 단원 단어') : L.extra ? h('span', {class: 'rpop-tag'}, '📒 단어장') : ''),
    L.base ? h('div', {class: 'small'}, `기본형: ${L.base}`) : '',
    h('div', {class: 'rpop-ko'}, L.ko || '(뜻을 찾지 못했어요. 엄마에게 물어봐요!)'),
    L.vocab ? h('div', {class: 'small', style: 'margin-top:4px'}, '예문: ' + L.vocab[3]) : '',
    h('div', {class: 'g1-row', style: 'gap:6px;flex-wrap:wrap;margin-top:8px'},
      h('button', {class: 'en-play', onclick: () => { EN.stop(); EN.speak(word, 0.7); }}, '🔊 다시'),
      h('button', {class: 'en-play', onclick: () => { EN.stop(); EN.speak(word, 0.4); }}, '🐢 천천히'),
      h('button', {class: 'en-play', onclick: () => { EN.stop(); speakFull(sent, 0.75); }}, '💬 이 문장 듣기'),
      h('button', {class: 'en-play' + (saved ? ' on' : ''), onclick: e => {
        const w = L.vocab || [word, '', L.ko || '', sent.trim()];
        if (S.wrong && S.wrong[w[0]]) { removeWrong(w); e.target.classList.remove('on'); e.target.textContent = '📌 단어 모으기'; }
        else { addWrong(w); e.target.classList.add('on'); e.target.textContent = '📌 모았어요'; toast('🔁 다시 볼 단어에 담았어요'); }
      }}, saved ? '📌 모았어요' : '📌 단어 모으기')));
  document.body.append(popEl);
}

/* 📖 Read 탭 */
function readTab(U, done) {
  const root = h('div');
  const box = h('div', {class: 'rbox'}, h('div', {class: 'small'}, '📖 본문을 불러오는 중…'));
  root.append(box);
  loadText().then(T => drawRead(T[U.n] || T[String(U.n)])).catch(err => {
    box.innerHTML = '';
    box.append(h('div', {class: 'br-book'}, h('div', {style: 'font-size:40px'}, '📗'), h('div', {},
      h('div', {class: 'br-big'}, `책 Unit ${String(U.n).padStart(2, '0')}을 펴요`), h('div', {}, `“${U.t}”`),
      h('div', {class: 'small'}, '본문이 아직 준비되지 않았어요. 엄마가 준비를 마치면 여기서 읽고 들을 수 있어요. 오늘은 책으로 읽어요!'))));
    if (isMom()) box.append(h('div', {class: 'cond'}, '👩 엄마에게만 보여요: ' + err.message));
  });
  function drawRead(P) {
    box.innerHTML = '';
    if (!P) { box.append(h('div', {class: 'cond'}, '이 단원 본문을 찾지 못했어요.')); return; }
    // 듣기 도구
    const audio = h('audio', {preload: 'none'}); let rate = 1;
    const aBtn = h('button', {class: 'g1-btn', onclick: async () => {
      EN.stop(); stopTts();
      if (!audio.src) { aBtn.textContent = '⏳ 녹음 불러오는 중…'; aBtn.disabled = true;
        try { audio.src = await loadAudio(U.n); } catch (e) { aBtn.disabled = false; aBtn.textContent = '🎧 원어민 전체 듣기'; toast('녹음을 불러오지 못했어요'); if (isMom()) toast(e.message); return; }
        aBtn.disabled = false; }
      if (audio.paused) { audio.playbackRate = rate; audio.play(); } else audio.pause();
    }}, '🎧 원어민 전체 듣기');
    audio.onplay = () => aBtn.textContent = '⏸ 잠깐 멈추기'; audio.onpause = () => aBtn.textContent = '▶ 이어서 듣기';
    audio.onended = () => { aBtn.textContent = '🎧 다시 듣기'; logEvent('attempt', {tag: `Unit ${U.n} 본문 듣기`, q: U.t, ok: 'O', answer: '원어민 전체 듣기'}); };
    const sp = h('div', {class: 'rspeed'}); [[1, '보통'], [0.85, '조금 느리게'], [0.7, '느리게']].forEach(([r, t]) => sp.append(h('button', {class: 'g1-chip' + (r === 1 ? ' sel' : ''), onclick: e => { rate = r; audio.playbackRate = r; [...sp.children].forEach(c => c.classList.toggle('sel', c === e.target)); }}, t)));
    let ttsOn = false, gapMode = S.gapMode || 'auto', skip = null, again = false, nextNow = false;
    const tBtn = h('button', {class: 'g1-btn ghost', onclick: () => { if (ttsOn) return stopTts(); audio.pause(); runTts(0); }}, '🔊 한 문장씩 듣고 따라 읽기');
    const gp = h('div', {class: 'rspeed'});
    [['auto', '자동 (문장 길이만큼)'], ['long', '넉넉하게'], ['tap', '내가 넘기기']].forEach(([k, t]) => gp.append(h('button', {class: 'g1-chip' + (k === gapMode ? ' sel' : ''), onclick: e => { gapMode = k; S.gapMode = k; save(); [...gp.children].forEach(c => c.classList.toggle('sel', c === e.target)); }}, t)));
    // 따라 읽기 막대 (화면 아래)
    const barTxt = h('div', {class: 'rbar-t'}), barFill = h('div', {class: 'rbar-fill'});
    const bar = h('div', {class: 'rbar hide'}, barTxt, h('div', {class: 'rbar-track'}, barFill),
      h('div', {class: 'g1-row', style: 'gap:6px;justify-content:center;flex-wrap:wrap'},
        h('button', {class: 'en-play', onclick: () => { again = true; EN.stop(); skip && skip(); }}, '🔁 다시 듣기'),
        h('button', {class: 'en-play', onclick: () => { if (bar.classList.contains('listen')) nextNow = true; EN.stop(); skip && skip(); }}, '다음 문장 ▶'),
        h('button', {class: 'en-play', onclick: () => stopTts()}, '⏹ 그만')));
    function stopTts() { ttsOn = false; EN.stop(); skip && skip(); bar.classList.add('hide'); tBtn.textContent = '🔊 한 문장씩 듣고 따라 읽기'; root.querySelectorAll('.rs.now').forEach(x => x.classList.remove('now')); }
    const waitFor = ms => new Promise(res => {
      let t = null, start = Date.now(), tick = null;
      skip = () => { clearTimeout(t); clearInterval(tick); skip = null; res(); };
      if (ms == null) { barFill.style.width = '100%'; return; }
      tick = setInterval(() => { const p = Math.min(1, (Date.now() - start) / ms); barFill.style.width = (100 - p * 100) + '%'; }, 100);
      t = setTimeout(() => skip && skip(), ms);
    });
    async function runTts(from) {
      ttsOn = true; tBtn.textContent = '⏹ 멈추기'; bar.classList.remove('hide'); const ss = [...root.querySelectorAll('.rs')];
      for (let i = from; i < ss.length && ttsOn; i++) {
        ss.forEach(x => x.classList.remove('now')); ss[i].classList.add('now'); ss[i].scrollIntoView({block: 'center', behavior: 'smooth'});
        barTxt.innerHTML = `👂 잘 들어요 <span class="small">(${i + 1} / ${ss.length})</span>`; barFill.style.width = '100%'; bar.classList.add('listen');
        const t0 = Date.now();
        await Promise.race([speakFull(ss[i].textContent, 0.75 * rate), new Promise(r => { skip = r; })]); skip = null;
        if (!ttsOn) break;
        if (again) { again = false; i--; continue; }
        if (nextNow) { nextNow = false; continue; }
        const spoken = Date.now() - t0;
        bar.classList.remove('listen');
        barTxt.innerHTML = gapMode === 'tap' ? '🗣️ 이제 따라 읽어요! 다 읽으면 <b>다음 문장 ▶</b>' : `🗣️ 이제 따라 읽어요! <span class="small">(${i + 1} / ${ss.length})</span>`;
        const ms = gapMode === 'tap' ? null : gapMode === 'long' ? spoken * 1.8 + 2500 : spoken * 1.2 + 1200;
        await waitFor(ms);
        if (again) { again = false; i--; continue; }
      }
      if (ttsOn) { stopTts(); toast('👏 한 문장씩 따라 읽기 끝!'); logEvent('attempt', {tag: `Unit ${U.n} 따라 읽기`, q: U.t, ok: 'O', answer: '한 문장씩 듣고 따라 읽기 완료'}); }
    }
    document.body.append(bar);
    window.addEventListener('hashchange', () => { stopTts(); bar.remove(); }, {once: true});
    box.append(h('div', {class: 'rtools'}, h('div', {class: 'g1-row', style: 'gap:8px;flex-wrap:wrap'}, aBtn, tBtn), h('div', {class: 'small', style: 'margin-top:6px'}, '빠르기'), sp, h('div', {class: 'small', style: 'margin-top:6px'}, '따라 읽기 시간'), gp, audio),
      G1.say('<b>① 원어민 소리로 전체 듣기 → ② 한 문장씩 듣고 따라 읽기 → ③ 혼자 소리 내어 읽기</b><br>②에서는 한 문장을 들려준 뒤 따라 읽을 시간을 줘요.<br>모르는 단어는 <b>눌러 보세요.</b> 소리와 뜻이 나와요. 노란 밑줄은 이번 단원 단어예요.'));
    // 본문
    const art = h('article', {class: 'rtext'}, h('h2', {}, P.title || U.t));
    const vocabSet = new Set(U.v.flatMap(w => [w[0].toLowerCase(), ...(cloze(w) ? [cloze(w).ans.toLowerCase()] : [])]));
    P.paras.forEach(p => {
      const para = h('p');
      splitSent(p).forEach(s => {
        const ss = h('span', {class: 'rs'});
        s.split(/([A-Za-zÀ-ÿĀ-ɏẠ-ỹ]+(?:[’'][A-Za-z]+)?)/).forEach((tok, i) => {
          if (i % 2 === 0) { if (tok) ss.append(document.createTextNode(tok)); return; }
          const isV = [...vocabSet].some(v => v === tok.toLowerCase() || (v.includes(' ') && v.split(' ')[0] === tok.toLowerCase()) || wordKeys(tok).includes(v));
          ss.append(h('span', {class: 'rw' + (isV ? ' v' : ''), onclick: e => { e.stopPropagation(); wordPop(tok, s, U, e.currentTarget); }}, tok));
        });
        para.append(ss);
      });
      art.append(para);
    });
    if (P.info) art.append(h('div', {class: 'rinfo'}, h('b', {}, '📌 더 알아보기 '), h('span', {}, P.info)));
    art.addEventListener('dblclick', e => { const s = e.target.closest('.rs'); if (s) { audio.pause(); stopTts(); runTts([...root.querySelectorAll('.rs')].indexOf(s)); } });
    box.append(art);
    // 마무리
    const reads = (S.reads = S.reads || {})[U.n] || 0;
    box.append(h('div', {class: 'rdone'}, h('div', {class: 'jua', style: 'font-size:18px'}, '소리 내어 혼자 다 읽었나요?'),
      h('button', {class: 'g1-btn mint', onclick: () => {
        S.reads[U.n] = Math.max(S.reads[U.n] || 0, 1); save();
        logEvent('attempt', {tag: `Unit ${U.n} 본문 읽기`, q: U.t, ok: 'O', answer: '화면 본문 혼자 읽기 완료'});
        done(); toast('📖 잘 읽었어요! 이제 Reading Check로 가요');
      }}, reads ? '✅ 또 읽었어요!' : '✅ 다 읽었어요!')));
  }
  return root;
}
