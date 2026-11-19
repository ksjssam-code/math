
/* ============================================================
   수학 계산 도구
   ============================================================ */
const M = {
  gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a},
  lcm(a,b){return a/M.gcd(a,b)*b},
  divs(n){const r=[];for(let i=1;i<=n;i++) if(n%i===0) r.push(i);return r},
  sum(arr){return arr.reduce((s,x)=>s+x,0)},
  ri(a,b){return a+Math.floor(Math.random()*(b-a+1))},
  pick(arr){return arr[Math.floor(Math.random()*arr.length)]},
  shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
  multiplesIn(k,lo,hi){let c=0;for(let x=lo;x<=hi;x++) if(x%k===0) c++;return c},
  ladder(a,b){ // 거꾸로 나눗셈: 가장 작은 공약수부터
    const steps=[];let x=a,y=b;
    while(M.gcd(x,y)>1){let d=2;while(!(x%d===0&&y%d===0))d++;steps.push(d);x/=d;y/=d}
    return {steps,x,y};
  }
};
const fmt = arr => arr.join(', ');

/* ============================================================
   저장 (브라우저에만 저장, 실패해도 동작)
   ============================================================ */
const STU_KEY='math-lab-student';
let STUDENT=null;try{STUDENT=JSON.parse(localStorage.getItem(STU_KEY))}catch(e){}
const KEY='math-lab-'+(window.UNIT?UNIT.id:'x')+'-'+(STUDENT?STUDENT.name:'');
let S={explore:{},concept:{},solved:{},notes:{}};
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(S,JSON.parse(raw));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.append(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800)}
function markSolved(id){if(!S.solved[id]){S.solved[id]=1;save()}}

/* ============================================================
   학생 정보 + 구글 시트 기록
   ============================================================ */
const Q_KEY='math-lab-queue';
function stripHtml(x){const d=document.createElement('div');d.innerHTML=x||'';return d.textContent.replace(/\s+/g,' ').trim().slice(0,200)}
let memQueue=[];
function readQ(){try{return JSON.parse(localStorage.getItem(Q_KEY))||[]}catch(e){return memQueue}}
function writeQ(q){memQueue=q;try{localStorage.setItem(Q_KEY,JSON.stringify(q))}catch(e){}}
function logEvent(type,data={}){
  const C=window.MATHLAB_CONFIG||{};if(!C.sheetUrl)return;
  if(isMom()&&type!=='security')return;
  if(['note','letter','mood'].includes(type)&&!data.id)data.id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const ev=Object.assign({time:new Date().toISOString(),unit:(window.UNIT&&UNIT.title)||'',name:STUDENT?(STUDENT.name||''):'',page:(location.hash||'#home').slice(1),type},data);
  const q=readQ();q.push(ev);writeQ(q.slice(-500));
  clearTimeout(logEvent._t);logEvent._t=setTimeout(flushLog,1200);
}
let flushing=false;
function flushLog(){
  const C=window.MATHLAB_CONFIG||{};const q=readQ();if(!C.sheetUrl||!q.length||flushing)return;
  flushing=true;const batch=q.slice(0,50);
  fetch(C.sheetUrl,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({events:batch})})
    .then(()=>{writeQ(readQ().slice(batch.length));flushing=false;if(readQ().length)setTimeout(flushLog,500)})
    .catch(()=>{flushing=false;setTimeout(flushLog,15000)});
}
window.addEventListener('pagehide',flushLog);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushLog()});
function studentLabel(){return STUDENT?STUDENT.name:''}
async function sha256(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const UNLOCK_KEY='math-lab-unlocked-';
let UNLOCK_MEM={};
function deviceStr(){
  let id='';try{id=localStorage.getItem('math-lab-device');if(!id){id=Math.random().toString(36).slice(2,6).toUpperCase();localStorage.setItem('math-lab-device',id)}}catch(e){id='?'}
  const u=navigator.userAgent;const os=/iPad/.test(u)?'iPad':/iPhone/.test(u)?'iPhone':/Android/.test(u)?(/Mobile/.test(u)?'안드로이드폰':'안드로이드 태블릿'):/CrOS/.test(u)?'크롬북':/Mac/.test(u)?'Mac':/Windows/.test(u)?'Windows':'기타';
  const br=/SamsungBrowser/.test(u)?'삼성 인터넷':/Whale/.test(u)?'웨일':/Edg\//.test(u)?'엣지':/CriOS|Chrome/.test(u)?'크롬':/Safari/.test(u)?'사파리':'기타';
  return `기기 #${id} · ${os} · ${br}`;
}
function kidOf(name){const C=window.MATHLAB_CONFIG||{};if(C.mom&&name===C.mom.name)return C.mom;return (C.kids||[]).find(k=>k.name===name)}
function isMom(){return !!(STUDENT&&STUDENT.mom)}
function readKey(name){try{return localStorage.getItem('math-lab-key-'+name)||''}catch(e){return UNLOCK_MEM['key-'+name]||''}}
function isUnlocked(name){const k=kidOf(name);if(!k)return false;if(!k.passHash)return !k.isMom;try{return localStorage.getItem(UNLOCK_KEY+name)===k.passHash}catch(e){return UNLOCK_MEM[name]===k.passHash}}
function askPass(kid,onOk,onCancel){
  const inp=h('input',{class:'ans',type:'password',placeholder:'내 비밀번호',style:'width:180px',autocomplete:'off'});const err=h('div',{class:'small',style:'color:var(--bad);min-height:20px'});
  let fails=0;
  const go=async()=>{const pw=inp.value.trim();const hv=await sha256(pw);
    if(hv===kid.passHash){const rk=await sha256('read:'+pw);UNLOCK_MEM['key-'+kid.name]=rk;try{localStorage.setItem('math-lab-key-'+kid.name,rk)}catch(e){}logEvent('security',{name:kid.name,tag:'비밀번호 통과',ok:'O',answer:deviceStr()});UNLOCK_MEM[kid.name]=hv;try{localStorage.setItem(UNLOCK_KEY+kid.name,hv)}catch(e){}ov.remove();onOk()}
    else{fails++;logEvent('security',{name:kid.name,tag:'비밀번호 틀림',ok:'X',answer:deviceStr()});flushLog();inp.value='';inp.focus();
      if(fails>=5){err.textContent='여러 번 틀렸어요. 30초 뒤에 다시 해 보세요.';inp.disabled=true;setTimeout(()=>{inp.disabled=false;fails=0;err.textContent='';inp.focus()},30000)}
      else err.textContent='비밀번호가 달라요.'}};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  const ov=h('div',{class:'overlay'},h('div',{class:'card',style:'max-width:360px;width:92%;text-align:center'},
    h('div',{style:'font-size:44px'},kid.emoji||'🙂'),h('h2',{style:'margin:4px 0'},`${kid.name}의 비밀번호`),h('p',{class:'small',style:'margin:0 0 14px'},'이 기기에서는 한 번만 입력하면 돼요.'),
    h('div',{class:'row',style:'justify-content:center'},inp,h('button',{class:'btn coral',onclick:go},'확인')),err,
    h('button',{class:'btn ghost small',style:'margin-top:6px',onclick:()=>{ov.remove();onCancel&&onCancel()}},'← 이름 다시 고르기')));
  document.body.append(ov);inp.focus();
}
function ensureStudent(cb,force){
  if(STUDENT&&!force&&isUnlocked(STUDENT.name)){afterLogin(cb);return}
  const C=window.MATHLAB_CONFIG||{};const kids=C.kids||[];
  const ov=h('div',{class:'overlay',style:'background:var(--bg)'},h('div',{class:'card',style:'max-width:420px;width:92%;text-align:center'},
    h('h2',{style:'margin:0 0 6px'},'누가 공부할까요? 👋'),h('p',{class:'small',style:'margin:0 0 16px'},'내 이름을 누르고 내 비밀번호를 입력해요.'),
    h('div',{class:'row',style:'justify-content:center;gap:14px'},...kids.map(k=>h('button',{class:'kid-btn',style:`--c:${k.color||'var(--coral)'}`,onclick:()=>{
      const done=()=>{STUDENT=k.isMom?{name:k.name,mom:true}:{name:k.name};try{localStorage.setItem(STU_KEY,JSON.stringify(STUDENT))}catch(e){}
        if(force){location.reload();return}updateWho();logEvent('login',{answer:deviceStr()});afterLogin(cb)};
      ov.remove();
      if(isUnlocked(k.name))done();else askPass(k,done,()=>ensureStudent(cb,force));
    }},h('span',{style:'font-size:40px'},k.emoji||'🙂'),h('b',{},k.name)))),
    (C.mom&&C.mom.passHash)?h('button',{class:'mom-link',onclick:()=>{ov.remove();const m=Object.assign({isMom:true},C.mom);const done=()=>{STUDENT={name:m.name,mom:true};try{localStorage.setItem(STU_KEY,JSON.stringify(STUDENT))}catch(e){}location.reload()};if(isUnlocked(m.name))done();else askPass(m,done,()=>ensureStudent(cb,force))}},'엄마'):''));
  document.body.append(ov);
}
const MOODS=[['😆','신나요'],['🙂','좋아요'],['😐','그저 그래요'],['😢','속상해요'],['😠','화나요'],['😴','피곤해요']];
function todayStr(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function afterLogin(cb){
  cb&&cb();addLetterButton();
  if(isMom()){if(!document.getElementById('mom-bar'))document.body.prepend(h('div',{id:'mom-bar',class:'mom-bar'},'👩 엄마 모드 · 아이 화면과 똑같이 보이고, 기록은 남지 않아요 · ',h('button',{onclick:openMomInbox},'📬 아이들 글 보기')));return}
  checkReplies();
  try{if(!sessionStorage.getItem('math-lab-visit-'+STUDENT.name)){sessionStorage.setItem('math-lab-visit-'+STUDENT.name,'1');logEvent('visit',{answer:deviceStr()})}}catch(e){}
  const k='math-lab-mood-'+(STUDENT&&STUDENT.name);let last='';try{last=localStorage.getItem(k)}catch(e){}
  if(last===todayStr())return;
  let pick=null;const line=h('input',{class:'ans',style:'width:100%',placeholder:'왜 그런 기분인지 한 줄로 써도 좋아요 (안 써도 돼요)'});
  const box=h('div',{class:'row',style:'justify-content:center'});
  MOODS.forEach(([e,t])=>box.append(h('button',{class:'mood-btn',onclick:(ev)=>{pick=[e,t];[...box.children].forEach(x=>x.classList.remove('sel'));ev.currentTarget.classList.add('sel')}},h('span',{style:'font-size:30px'},e),h('small',{},t))));
  const ov=h('div',{class:'overlay'},h('div',{class:'card',style:'max-width:460px;width:92%;text-align:center'},
    h('h2',{style:'margin:0 0 4px'},`${STUDENT.name}, 오늘 기분은 어때?`),h('p',{class:'small',style:'margin:0 0 12px'},'하루에 한 번만 물어볼게요.'),box,
    h('div',{style:'margin-top:12px'},line),
    h('div',{class:'row',style:'justify-content:center;margin-top:12px'},h('button',{class:'btn coral',onclick:()=>{
      if(!pick)return;logEvent('mood',{tag:pick[1],q:pick[0],answer:line.value.trim()});try{localStorage.setItem(k,todayStr())}catch(e){}ov.remove();toast('엄마에게 기분을 전했어요 💛');
    }},'보내기'),h('button',{class:'btn ghost',onclick:()=>{try{localStorage.setItem(k,todayStr())}catch(e){}ov.remove()}},'나중에'))));
  document.body.append(ov);
}
function addLetterButton(){
  if(document.getElementById('letter-fab'))return;
  document.body.append(h('button',{id:'letter-fab',class:'letter-fab',title:isMom()?'아이들 글 보기':'마음 우체통',onclick:()=>isMom()?openMomInbox():openLetter()},isMom()?'📬':'📮',h('span',{id:'fab-badge',class:'fab-badge hide'})));
}
function openLetter(startMode){
  const MODES={
    letter:{icon:'💌',title:'엄마에게 편지',info:'엄마에게 전달돼요.',ph:'고마운 일, 속상한 일, 갖고 싶은 것, 하고 싶은 말… 뭐든지 좋아요.',send:true},
    ask:{icon:'❓',title:'궁금해요',info:'엄마에게 전달돼요. 수학이든 뭐든 궁금한 걸 물어보세요.',ph:'예) 0은 모든 수의 배수인가요? / 최소공배수는 어디에 써요?',send:true},
    diary:{icon:'📔',title:'나만의 일기',info:'🔒 이 기기에만 저장되고 아무에게도 보내지 않아요.',ph:'오늘 하루는 어땠나요?',send:false},
    reply:{icon:'💬',title:'엄마 답장',info:'엄마가 내 글에 단 답장이에요.',ph:'',send:false,read:true},
  };
  let mode='letter';
  const tabs=h('div',{class:'row',style:'margin-bottom:10px'});const info=h('p',{class:'small',style:'margin:0 0 8px'});
  const ta=h('textarea',{class:'note',style:'min-height:160px'});const fb=h('div',{class:'small',style:'min-height:20px'});const past=h('div');
  const dkey=()=>'math-lab-diary-'+STUDENT.name;
  function setMode(m){mode=m;const M2=MODES[m];ta.style.display=M2.read?'none':'';sendBtn.style.display=M2.read?'none':'';
    [...tabs.children].forEach(t=>t.classList.toggle('sel',t.dataset.m===m));info.textContent=M2.info;fb.textContent='';
    if(M2.read){past.innerHTML='<div class="small">불러오는 중…</div>';fetchWritings(STUDENT.name).then(rows=>{past.innerHTML='';const rs=(rows||[]).filter(r=>r.reply);markRepliesSeen(rs);
      if(!rs.length){past.append(h('div',{class:'cond'},'아직 답장이 없어요. 엄마에게 편지를 보내 보세요!'));return}
      rs.forEach(r=>past.append(h('div',{class:'cond'},h('div',{class:'small'},`${fmtTime(r.time)} · ${r.kind}`),h('div',{style:'white-space:pre-wrap;color:var(--sub)'},r.text),h('div',{class:'reply-bubble'},'👩 ',r.reply))))}).catch(()=>{past.innerHTML='<div class="small">답장을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</div>'});return}[...tabs.children].forEach(t=>t.classList.toggle('sel',t.dataset.m===m));info.textContent=M2.info;ta.placeholder=M2.ph;fb.textContent='';
    past.innerHTML='';if(m==='diary'){let arr=[];try{arr=JSON.parse(localStorage.getItem(dkey())||'[]')}catch(e){}
      if(arr.length)past.append(h('div',{class:'jua',style:'margin-top:10px'},'지난 일기'),...arr.slice().reverse().slice(0,10).map(x=>h('div',{class:'cond'},h('div',{class:'small'},new Date(x.t).toLocaleDateString('ko-KR')),h('div',{style:'white-space:pre-wrap'},x.v))))}}
  Object.entries(MODES).forEach(([k,v])=>{const b=h('button',{class:'mood-btn',style:'flex-direction:row;gap:6px;padding:6px 12px',onclick:()=>setMode(k)},h('span',{},v.icon),h('span',{},v.title));b.dataset.m=k;tabs.append(b)});
  const sendBtn=h('button',{class:'btn coral',onclick:()=>doSend()},'보내기 / 저장');
  const ov=h('div',{class:'overlay'},h('div',{class:'card',style:'max-width:540px;width:92%;max-height:90vh;overflow:auto'},
    h('h2',{style:'margin:0 0 8px'},'📮 마음 우체통'),tabs,info,ta,fb,
    h('div',{class:'row',style:'margin-top:10px'},sendBtn,h('button',{class:'btn ghost',onclick:()=>ov.remove()},'닫기')),past));
  document.body.append(ov);setMode(startMode||'letter');ta.focus();
  function doSend(){
      const v=ta.value.trim();if(!v){fb.textContent='한 글자라도 써 볼까요?';return}
      const M2=MODES[mode];
      if(M2.send){logEvent('letter',{tag:M2.title,answer:v});flushLog();ov.remove();toast(`${M2.icon} 엄마에게 보냈어요`)}
      else{try{const arr=JSON.parse(localStorage.getItem(dkey())||'[]');arr.push({t:new Date().toISOString(),v});localStorage.setItem(dkey(),JSON.stringify(arr.slice(-200)))}catch(e){}ta.value='';fb.textContent='📔 일기를 저장했어요.';setMode('diary')}
      }
}

function updateWho(){const w=document.getElementById('who');if(w){w.innerHTML='';if(STUDENT)w.append(h('button',{class:'who-btn',title:'다른 사람으로 바꾸기',onclick:()=>ensureStudent(null,true)},(isMom()?'👩 ':'🙂 ')+studentLabel()+' · 바꾸기'))}}

function solvedCount(prefix){return Object.keys(S.solved).filter(k=>k.startsWith(prefix)).length}

/* ============================================================
   DOM 도우미
   ============================================================ */
function h(tag,attrs={},...kids){
  const el=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){
    if(k==='class') el.className=v;
    else if(k==='html') el.innerHTML=v;
    else if(k.startsWith('on')) el.addEventListener(k.slice(2),v);
    else if(k==='style') el.setAttribute('style',v);
    else el.setAttribute(k,v);
  }
  for(const kid of kids.flat()){ if(kid==null||kid===false) continue; el.append(kid.nodeType?kid:document.createTextNode(kid)); }
  return el;
}
function parseNums(s){return (String(s).match(/-?\d+/g)||[]).map(Number)}
function sameSet(a,b){if(a.length!==b.length)return false;const x=[...a].sort((p,q)=>p-q),y=[...b].sort((p,q)=>p-q);return x.every((v,i)=>v===y[i])}

/* ============================================================
   문제 카드 렌더러
   문제 형식: {id, q(html), tag, fields:[{label,kind:'num'|'set'|'choice'|'multi'|'select', ans, unit, options}], hints:[], sol(html)}
   ============================================================ */
let probCounter=0;
function renderProblem(p, num, opts={}){
  const card=h('div',{class:'prob'+(S.solved[p.id]?' solved':'')});
  if(opts.color) card.style.setProperty('--c',opts.color);
  if(p.tag) card.append(h('span',{class:'tag'},p.tag));
  card.append(h('div',{class:'qtext',html:`<span class="pn">${num}</span>${p.q}`}));
  const fieldWrap=h('div',{class:'fields'});
  const getters=[];
  p.fields.forEach(f=>{
    const lab=h('label');
    if(f.label) lab.append(h('span',{html:f.label}));
    if(f.kind==='choice'||f.kind==='multi'){
      const box=h('div',{class:'choice'});let sel=new Set();
      f.options.forEach((o,i)=>{
        const b=h('button',{type:'button',html:o,onclick:()=>{
          if(f.kind==='choice'){sel=new Set([i]);[...box.children].forEach(c=>c.classList.remove('sel'))}
          else{sel.has(i)?sel.delete(i):sel.add(i)}
          b.classList.toggle('sel',sel.has(i));
        }});box.append(b);
      });
      lab.append(box);
      getters.push({el:box,check:()=>f.kind==='choice'?(sel.size===1&&[...sel][0]===f.ans):sameSet([...sel],f.ans)});
    }else if(f.kind==='select'){
      const s=h('select',{class:'ans'},h('option',{value:''},'선택'),...f.options.map(o=>h('option',{value:o},o)));
      lab.append(s);
      getters.push({el:s,check:()=>s.value===f.ans});
    }else{
      const inp=h('input',{class:'ans'+(f.kind==='set'?' wide':''),inputmode:f.kind==='set'?'text':'numeric',placeholder:f.kind==='set'?'예) 1, 2, 4':''});
      inp.addEventListener('keydown',e=>{if(e.key==='Enter') checkBtn.click()});
      lab.append(inp);
      getters.push({el:inp,check:()=>{
        const v=parseNums(inp.value);
        if(f.kind==='set') return sameSet(v,f.ans);
        return v.length===1&&v[0]===f.ans;
      }});
    }
    if(f.unit) lab.append(h('span',{},f.unit));
    fieldWrap.append(lab);
  });
  card.append(fieldWrap);
  const fb=h('div',{class:'fb'});
  const hint=h('div',{class:'hintbox'});
  const sol=h('div',{class:'solbox',html:'<b class="jua">풀이</b><br>'+(p.sol||'')});
  let tries=0,hintIdx=0;
  const solBtn=h('button',{class:'btn ghost small hide',type:'button',onclick:()=>{sol.style.display='block'}},'풀이 보기');
  const hintBtn=h('button',{class:'btn ghost small',type:'button',onclick:()=>{
    if(!p.hints||!p.hints.length){hint.innerHTML='이 문제는 힌트 없이 도전해 봐요!';hint.style.display='block';return}
    hint.innerHTML='💡 '+p.hints.slice(0,hintIdx+1).map((x,i)=>`<div>${i+1}. ${x}</div>`).join('');
    hint.style.display='block'; if(hintIdx<p.hints.length-1) hintIdx++;
  }},'힌트');
  const checkBtn=h('button',{class:'btn small',type:'button',onclick:()=>{
    tries++;
    const res=getters.map(g=>g.check());
    getters.forEach((g,i)=>{if(g.el.tagName==='INPUT'||g.el.tagName==='SELECT'){g.el.classList.toggle('right',res[i]);g.el.classList.toggle('wrong',!res[i])}});
    const ok=res.every(Boolean);
    fb.className='fb show '+(ok?'good':'bad');
    if(ok){fb.innerHTML='정답이에요! 👏 '+(p.praise||'어떻게 풀었는지 짝에게 설명해 보세요.');card.classList.add('solved');markSolved(p.id);if(opts.onSolve)opts.onSolve();}
    else{fb.innerHTML=tries===1?'다시 생각해 볼까요? 힌트를 눌러 보세요.':'아직이에요. 힌트나 풀이를 보고 어디서 달라졌는지 찾아보세요.';}
    if(tries>=1) solBtn.classList.remove('hide');
    if(!opts.silent) logEvent('attempt',{tag:p.tag||'',q:stripHtml(p.q),ok:ok?'O':'X',tries,answer:getters.map(g=>g.el.tagName==='INPUT'||g.el.tagName==='SELECT'?g.el.value:[...g.el.querySelectorAll('.sel')].map(b=>b.textContent).join('/')).join(' | ')});
  }},'채점');
  card.grade=()=>{if(card.classList.contains('solved'))return true;checkBtn.click();return card.classList.contains('solved')};
  card.append(h('div',{class:'acts'},checkBtn,hintBtn,solBtn),fb,hint,sol);
  return card;
}

/* ============================================================
   기본 문제 생성기 (단계별)
   ============================================================ */
const uid=(p)=>p+'-'+Date.now().toString(36)+'-'+(probCounter++);
const G = {
  divisor:[
    ()=>{const n=M.pick([12,18,20,24,28,30,32,36,40,42,45,48,50,54,60]);const d=M.divs(n);
      return {id:uid('divisor'),tag:'약수 구하기',q:`${n}의 약수를 모두 쓰세요.`,fields:[{kind:'set',ans:d}],
      hints:[`${n}을 1, 2, 3, …으로 차례로 나누어 나누어떨어지는지 보세요.`,`곱해서 ${n}이 되는 두 수를 짝지어 찾으면 빠뜨리지 않아요.`,'1과 자기 자신도 약수예요!'],
      sol:d.filter(x=>x*x<=n).map(x=>`${x}×${n/x}=${n}`).join(', ')+`<br>➜ ${n}의 약수: ${fmt(d)}`}},
    ()=>{const n=M.pick([16,24,30,36,44,48,56,64,72,80,84,90,96,100]);const d=M.divs(n);
      return {id:uid('divisor'),tag:'약수의 개수',q:`${n}의 약수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:d.length,unit:'개'}],
      hints:['약수를 짝지어(곱해서 '+n+'이 되는 두 수) 찾아보세요.','같은 수끼리 곱하는 경우(예: 6×6)는 한 번만 세요.'],sol:`${n}의 약수: ${fmt(d)} ➜ ${d.length}개`}},
    ()=>{const n=M.pick([18,24,27,30,36,40,42,45,48]);const d=M.divs(n);const non=M.shuffle([...Array(n).keys()].map(x=>x+1).filter(x=>!d.includes(x)&&x>1&&x<n))[0];
      const opts=M.shuffle([non,...M.shuffle(d).slice(0,4)]);
      return {id:uid('divisor'),tag:'약수 판단',q:`${n}의 약수가 <b>아닌</b> 수를 고르세요.`,fields:[{kind:'choice',options:opts.map(String),ans:opts.indexOf(non)}],
      hints:[`${n}을 각 수로 나누어 나머지가 있는지 확인해 보세요.`],sol:`${n}의 약수: ${fmt(d)}<br>${n}÷${non}은 나누어떨어지지 않으므로 ${non}은 ${n}의 약수가 아니에요.`}},
    ()=>{const n=M.pick([12,16,18,20,24,28,30,36,40,45,48]);const d=M.divs(n);const thing=M.pick(['구슬','쿠키','색종이','스티커','사탕']);
      return {id:uid('divisor'),tag:'약수 활용',q:`${thing} ${n}개를 친구들에게 남김없이 똑같이 나누어 주려고 합니다. 나누어 줄 수 있는 방법은 모두 몇 가지인가요? (1명에게 모두 주는 경우도 셉니다.)`,fields:[{kind:'num',ans:d.length,unit:'가지'}],
      hints:[`남김없이 똑같이 나누려면 친구 수로 ${n}을 나누었을 때 나누어떨어져야 해요.`,`즉, 친구 수는 ${n}의 무엇일까요?`],sol:`친구 수는 ${n}의 약수여야 해요. ${n}의 약수: ${fmt(d)} ➜ ${d.length}가지`}},
    ()=>{const n=M.pick([10,12,15,16,18,20,21,28]);const d=M.divs(n);
      return {id:uid('divisor'),tag:'약수의 합',q:`${n}의 약수를 모두 더하면 얼마인가요?`,fields:[{kind:'num',ans:M.sum(d)}],hints:['먼저 약수를 모두 찾고 더해요.'],sol:`${fmt(d)} ➜ ${d.join('+')}=${M.sum(d)}`}},
  ],
  multiple:[
    ()=>{const k=M.ri(3,15);const a=[1,2,3,4,5].map(i=>k*i);
      return {id:uid('multiple'),tag:'배수 구하기',q:`${k}의 배수를 가장 작은 수부터 차례로 5개 쓰세요.`,fields:[{kind:'set',ans:a}],hints:[`${k}를 1배, 2배, 3배, … 해 보세요.`,`가장 작은 배수는 ${k}×1이에요!`],sol:a.map((x,i)=>`${k}×${i+1}=${x}`).join(', ')}},
    ()=>{const k=M.ri(6,13);const lim=M.pick([50,60,80,100]);const c=Math.floor((lim-1)/k);
      return {id:uid('multiple'),tag:'배수의 개수',q:`${lim}보다 작은 자연수 중에서 ${k}의 배수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:c,unit:'개'}],hints:[`${k}×1, ${k}×2, …를 ${lim}을 넘기 전까지 써 보세요.`,`${lim-1}÷${k}의 몫을 생각해 봐도 좋아요.`],sol:`${lim-1}÷${k}=${Math.floor((lim-1)/k)} … ${(lim-1)%k}이므로 ${k}×1부터 ${k}×${c}=${k*c}까지 ${c}개`}},
    ()=>{const k=M.pick([6,7,8,9,12]);let ys=[];const mul=[k*M.ri(3,6),k*M.ri(7,11)];let non=[];while(non.length<3){const x=M.ri(20,99);if(x%k&&!non.includes(x))non.push(x)}
      const opts=M.shuffle([...mul,...non]);
      return {id:uid('multiple'),tag:'배수 찾기',q:`${k}의 배수를 <b>모두</b> 고르세요.`,fields:[{kind:'multi',options:opts.map(String),ans:mul.map(x=>opts.indexOf(x))}],hints:[`${k}로 나누어떨어지는 수를 찾아요.`],sol:mul.map(x=>`${x}=${k}×${x/k}`).join(', ')}},
    ()=>{let k,t;do{k=M.pick([7,9,11,13,14,17]);t=M.pick([50,100,150,200])}while(t%k*2===k);
      const lo=Math.floor(t/k)*k,hi=lo+k;const ans=(t-lo<hi-t)?lo:hi;
      return {id:uid('multiple'),tag:'가장 가까운 배수',q:`${k}의 배수 중에서 ${t}에 가장 가까운 수를 구하세요.`,fields:[{kind:'num',ans}],hints:[`${t}÷${k}를 해 보면 ${t} 바로 앞과 뒤의 배수를 알 수 있어요.`],sol:`${t}에 가까운 ${k}의 배수: ${lo}(차 ${t-lo}), ${hi}(차 ${hi-t}) ➜ ${ans}`}},
    ()=>{const k=M.pick([12,13,14,15,16,18]);const c=M.multiplesIn(k,10,99);
      return {id:uid('multiple'),tag:'배수의 개수',q:`두 자리 수 중에서 ${k}의 배수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:c,unit:'개'}],hints:['두 자리 수는 10부터 99까지예요.'],sol:`${k}의 배수 중 두 자리 수: ${[...Array(99).keys()].map(x=>x+1).filter(x=>x>=10&&x%k===0).join(', ')} ➜ ${c}개`}},
  ],
  relation:[
    ()=>{const pairs=[];const good=[];for(let i=0;i<5;i++){let a,b,rel=Math.random()<.5;do{a=M.ri(3,15);b=rel?a*M.ri(2,7):M.ri(10,80)}while(!rel&&(b%a===0));pairs.push(Math.random()<.5?[a,b]:[b,a]);if(rel)good.push(i)}
      if(!good.length){pairs[0]=[4,28];good.push(0)}
      const labels=['㉠','㉡','㉢','㉣','㉤'];
      return {id:uid('relation'),tag:'관계 알아보기',q:`두 수가 약수와 배수의 관계인 것을 <b>모두</b> 고르세요.`,fields:[{kind:'multi',options:pairs.map((p,i)=>`${labels[i]} (${p[0]}, ${p[1]})`),ans:good}],hints:['큰 수를 작은 수로 나누어 나누어떨어지는지 확인해 보세요.'],sol:pairs.map((p,i)=>{const [s,l]=p[0]<p[1]?p:[p[1],p[0]];return `${labels[i]} ${l}÷${s} ${l%s===0?`=${l/s} ➜ 관계 있음`:'➜ 나누어떨어지지 않음'}`}).join('<br>')}},
    ()=>{const n=M.pick([24,30,36,40,48,60]);const d=M.divs(n);const k=M.ri(2,3);const ans=d[d.length-k];
      return {id:uid('relation'),tag:'관계 활용',q:`${n}은 ■의 배수입니다. ■에 들어갈 수 있는 수 중에서 ${k===2?'두':'세'} 번째로 큰 수를 구하세요.`,fields:[{kind:'num',ans}],hints:[`${n}이 ■의 배수이면 ■는 ${n}의 무엇일까요?`],sol:`■는 ${n}의 약수예요. ${n}의 약수: ${fmt(d)} ➜ ${k===2?'두':'세'} 번째로 큰 수는 ${ans}`}},
    ()=>{const a=M.pick([4,6,7,8,9,12]);const opts=[a*3,a*5+1,a*7,a*4+2,a*9];const ans=[0,2,4];
      return {id:uid('relation'),tag:'관계 알아보기',q:`${a}와 약수와 배수의 관계인 수를 <b>모두</b> 고르세요.`,fields:[{kind:'multi',options:opts.map(String),ans}],hints:[`${a}로 나누어떨어지는 수를 찾아보세요.`],sol:`${a*3}=${a}×3, ${a*7}=${a}×7, ${a*9}=${a}×9 이므로 ${a}의 배수예요.`}},
    ()=>{const n=M.pick([18,20,28,32,44,45,50]);const d=M.divs(n);
      return {id:uid('relation'),tag:'곱셈식과 관계',q:`${n}을 두 수의 곱으로 나타낸 곱셈식을 모두 생각해 보세요. ${n}은 어떤 수들의 배수인가요? 모두 쓰세요.`,fields:[{kind:'set',ans:d}],hints:['곱셈식 1×'+n+'부터 시작해 보세요.',`곱셈식에 있는 수가 모두 답이에요.`],sol:d.filter(x=>x*x<=n).map(x=>`${n}=${x}×${n/x}`).join(', ')+`<br>➜ ${n}은 ${fmt(d)}의 배수이고, 이 수들은 ${n}의 약수예요.`}},
  ],
  gcd:[
    ()=>{let a,b;do{a=M.ri(12,60);b=M.ri(12,60)}while(a===b||M.gcd(a,b)<3);const c=M.divs(M.gcd(a,b));
      return {id:uid('gcd'),tag:'공약수',q:`${a}와 ${b}의 공약수를 모두 쓰세요.`,fields:[{kind:'set',ans:c}],hints:['두 수의 약수를 각각 쓰고 공통인 수를 찾아요.','또는 최대공약수를 먼저 구하고, 최대공약수의 약수를 써도 돼요.'],sol:`${a}의 약수: ${fmt(M.divs(a))}<br>${b}의 약수: ${fmt(M.divs(b))}<br>➜ 공약수: ${fmt(c)}`}},
    ()=>{let a,b;do{a=M.ri(18,96);b=M.ri(18,96)}while(a===b||M.gcd(a,b)<4);const g=M.gcd(a,b);const L=M.ladder(a,b);
      return {id:uid('gcd'),tag:'최대공약수',q:`${a}와 ${b}의 최대공약수를 구하세요.`,fields:[{kind:'num',ans:g}],hints:['두 수를 공약수로 계속 나누어 보세요(거꾸로 나눗셈).','공약수가 1뿐일 때까지 나누어야 해요!'],sol:`공약수로 나눈 수: ${L.steps.join(', ')} / 남은 몫: ${L.x}, ${L.y}<br>➜ 최대공약수: ${L.steps.join('×')}=${g}`}},
    ()=>{const g=M.pick([12,16,18,20,24,28,30,36]);const c=M.divs(g);
      return {id:uid('gcd'),tag:'최대공약수의 성질',q:`어떤 두 수의 최대공약수가 ${g}입니다. 두 수의 공약수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:c.length,unit:'개'}],hints:['두 수의 공약수는 최대공약수의 ○○와 같아요.'],sol:`공약수 = 최대공약수의 약수 = ${fmt(c)} ➜ ${c.length}개`}},
    ()=>{const g=M.pick([6,8,9,12,14]);let p,q;do{p=M.ri(2,6);q=M.ri(2,7)}while(p===q||M.gcd(p,q)!==1);const [x,y]=[g*p,g*q];const A=M.pick([['연필','지우개'],['사과','귤'],['초콜릿','사탕'],['공책','색연필']]);
      return {id:uid('gcd'),tag:'최대공약수 활용',q:`${A[0]} ${x}개와 ${A[1]} ${y}개를 될 수 있는 대로 많은 학생에게 남김없이 똑같이 나누어 주려고 합니다. 최대 몇 명에게 나누어 줄 수 있나요?`,fields:[{kind:'num',ans:g,unit:'명'}],hints:['학생 수로 두 수가 모두 나누어떨어져야 해요 ➜ 공약수','"될 수 있는 대로 많은" ➜ 가장 큰 공약수'],sol:`${x}와 ${y}의 최대공약수: ${g} ➜ ${g}명 (한 명에게 ${A[0]} ${p}개, ${A[1]} ${q}개)`}},
    ()=>{let a,b;do{a=M.ri(12,48);b=M.ri(12,48)}while(a===b||M.gcd(a,b)<2);const c=M.divs(M.gcd(a,b));
      return {id:uid('gcd'),tag:'공약수의 합',q:`${a}와 ${b}의 공약수를 모두 더하면 얼마인가요?`,fields:[{kind:'num',ans:M.sum(c)}],hints:['공약수를 모두 찾은 다음 더해요.'],sol:`최대공약수 ${M.gcd(a,b)}의 약수: ${fmt(c)} ➜ 합 ${M.sum(c)}`}},
  ],
  lcm:[
    ()=>{let a,b;do{a=M.ri(4,30);b=M.ri(4,30)}while(a===b||M.gcd(a,b)<2||M.lcm(a,b)>300);const l=M.lcm(a,b);const L=M.ladder(a,b);
      return {id:uid('lcm'),tag:'최소공배수',q:`${a}와 ${b}의 최소공배수를 구하세요.`,fields:[{kind:'num',ans:l}],hints:['거꾸로 나눗셈으로 나눈 수와 마지막 몫을 모두 곱해요.'],sol:`나눈 수 ${L.steps.join(', ')}, 마지막 몫 ${L.x}, ${L.y}<br>➜ 최소공배수: ${[...L.steps,L.x,L.y].join('×')}=${l}`}},
    ()=>{let a,b;do{a=M.ri(3,15);b=M.ri(3,15)}while(a===b||M.lcm(a,b)>80);const l=M.lcm(a,b);
      return {id:uid('lcm'),tag:'공배수',q:`${a}와 ${b}의 공배수를 가장 작은 수부터 차례로 3개 쓰세요.`,fields:[{kind:'set',ans:[l,2*l,3*l]}],hints:['두 수의 공배수는 최소공배수의 배수와 같아요.'],sol:`최소공배수 ${l} ➜ 공배수: ${l}, ${2*l}, ${3*l}, …`}},
    ()=>{const l=M.pick([12,15,18,20,24,35]);const k=M.ri(3,6);
      return {id:uid('lcm'),tag:'최소공배수의 성질',q:`어떤 두 수의 최소공배수가 ${l}입니다. 두 수의 공배수 중에서 ${['','','','세','네','다섯','여섯'][k]} 번째로 작은 수는 무엇인가요?`,fields:[{kind:'num',ans:l*k}],hints:['공배수 = 최소공배수의 배수'],sol:`${l}의 배수: ${[1,2,3,4,5,6].slice(0,k).map(i=>l*i).join(', ')} ➜ ${l*k}`}},
    ()=>{let a,b;do{a=M.ri(4,12);b=M.ri(4,12)}while(a===b||M.lcm(a,b)>40||M.lcm(a,b)===Math.max(a,b));const lim=M.pick([100,150,200]);const l=M.lcm(a,b);const c=Math.floor((lim-1)/l);
      return {id:uid('lcm'),tag:'공배수의 개수',q:`${lim}보다 작은 수 중에서 ${a}와 ${b}의 공배수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:c,unit:'개'}],hints:['먼저 최소공배수를 구해요.',`${lim}보다 작은 최소공배수의 배수를 세어요.`],sol:`최소공배수 ${l} ➜ ${[...Array(c).keys()].map(i=>l*(i+1)).join(', ')} ➜ ${c}개`}},
    ()=>{let a,b;do{a=M.pick([6,8,9,10,12,15,18,20]);b=M.pick([6,8,9,10,12,15,18,20,25,30])}while(a===b||M.lcm(a,b)>90);const l=M.lcm(a,b);const hh=M.ri(7,10),mm=M.pick([0,10,15,20,30]);const t=hh*60+mm+l;
      return {id:uid('lcm'),tag:'최소공배수 활용',q:`어느 정류장에서 ㉮ 버스는 ${a}분마다, ㉯ 버스는 ${b}분마다 출발합니다. 오전 ${hh}시 ${mm}분에 두 버스가 동시에 출발했다면, 바로 다음번에 동시에 출발하는 시각은 오전 몇 시 몇 분인가요?`,fields:[{kind:'num',ans:Math.floor(t/60),unit:'시'},{kind:'num',ans:t%60,unit:'분'}],hints:['동시에 출발하는 간격은 두 수의 최소공배수예요.','시각에 그 간격(분)을 더해요. 60분은 1시간이에요.'],sol:`${a}와 ${b}의 최소공배수: ${l} ➜ ${l}분마다 동시에 출발<br>오전 ${hh}시 ${mm}분 + ${l}분 = 오전 ${Math.floor(t/60)}시 ${t%60}분`}},
  ],
};



/* ============================================================
   엄마 답장 · 엄마 모드
   ============================================================ */
function fmtTime(t){try{const d=new Date(t);return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}catch(e){return ''}}
function fetchWritings(who){
  const C=window.MATHLAB_CONFIG||{};const key=readKey(who);
  if(!C.sheetUrl||!key)return Promise.resolve([]);
  return fetch(`${C.sheetUrl}?who=${encodeURIComponent(who)}&key=${key}&t=${Date.now()}`).then(r=>r.json()).then(j=>j.ok?j.rows:Promise.reject(j.error));
}
function seenKey(){return 'math-lab-seen-'+(STUDENT?STUDENT.name:'')}
function markRepliesSeen(rows){try{localStorage.setItem(seenKey(),JSON.stringify(rows.map(r=>r.id+'|'+r.reply)))}catch(e){};const b=document.getElementById('fab-badge');if(b)b.classList.add('hide')}
function checkReplies(){
  fetchWritings(STUDENT.name).then(rows=>{let seen=[];try{seen=JSON.parse(localStorage.getItem(seenKey())||'[]')}catch(e){}
    const n=(rows||[]).filter(r=>r.reply&&!seen.includes(r.id+'|'+r.reply)).length;
    const b=document.getElementById('fab-badge');if(b&&n){b.textContent=n;b.classList.remove('hide');toast(`💬 엄마 답장이 ${n}개 왔어요! 📮를 눌러 보세요`)}
  }).catch(()=>{});
}
function sendReply(id,text){
  const C=window.MATHLAB_CONFIG||{};
  return fetch(C.sheetUrl,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({who:STUDENT.name,key:readKey(STUDENT.name),events:[{type:'reply',id,answer:text,time:new Date().toISOString(),name:STUDENT.name}]})});
}
function openMomInbox(){
  let filter='전체',rows=[];
  const list=h('div');const tabs=h('div',{class:'row',style:'margin:8px 0'});
  const kids=['전체',...((window.MATHLAB_CONFIG||{}).kids||[]).map(k=>k.name)];
  kids.forEach(k=>{const b=h('button',{class:'mood-btn',style:'flex-direction:row;padding:6px 14px',onclick:()=>{filter=k;draw()}},k);b.dataset.k=k;tabs.append(b)});
  function draw(){
    [...tabs.children].forEach(t=>t.classList.toggle('sel',t.dataset.k===filter));list.innerHTML='';
    const rs=rows.filter(r=>filter==='전체'||r.name===filter);
    if(!rs.length){list.append(h('div',{class:'cond'},'아직 글이 없어요.'));return}
    rs.forEach(r=>{
      const ta=h('textarea',{class:'note',style:'min-height:60px',placeholder:`${r.name}에게 답장 쓰기…`});ta.value=r.reply||'';
      const st=h('span',{class:'small'});
      const btn=h('button',{class:'btn small coral',onclick:()=>{const v=ta.value.trim();if(!v)return;btn.disabled=true;st.textContent='보내는 중…';
        sendReply(r.id,v).then(()=>{r.reply=v;st.textContent='✔ 보냈어요. 아이가 다음에 들어오면 알림이 떠요.';btn.disabled=false}).catch(()=>{st.textContent='보내지 못했어요. 다시 눌러 주세요.';btn.disabled=false})}},r.reply?'답장 고치기':'답장 보내기');
      list.append(h('div',{class:'prob'},h('div',{class:'small'},`${r.name} · ${fmtTime(r.time)} · ${r.kind}${r.topic?' · '+r.topic:''}`),
        h('div',{style:'white-space:pre-wrap;margin:6px 0 10px'},r.text||''),ta,h('div',{class:'row',style:'margin-top:6px'},btn,st)));
    });
  }
  const ov=h('div',{class:'overlay'},h('div',{class:'card',style:'max-width:680px;width:94%;max-height:92vh;overflow:auto'},
    h('div',{class:'row',style:'justify-content:space-between'},h('h2',{style:'margin:0'},'📬 아이들 글'),h('button',{class:'btn ghost small',onclick:()=>ov.remove()},'닫기')),
    h('p',{class:'small',style:'margin:4px 0'},'편지, 궁금해요, 오늘 기분, 발견 노트, 서술형 풀이가 모여요. 나만의 일기는 아이 기기에만 있어서 여기 오지 않아요.'),tabs,list));
  document.body.append(ov);
  list.append(h('div',{class:'small'},'불러오는 중…'));
  fetchWritings(STUDENT.name).then(r=>{rows=r||[];draw()}).catch(e=>{list.innerHTML='';list.append(h('div',{class:'cond'},'글을 불러오지 못했어요. ('+e+')'))});
}
