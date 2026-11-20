/* ============================================================
   단원 구성
   ============================================================ */
const LESSONS=[
  {key:'divisor',no:1,title:'약수',sub:'장미꽃을 꽃병에 똑같이 나누어 꽂아요',color:'var(--coral)',page:'교과서 32~33쪽'},
  {key:'multiple',no:2,title:'배수',sub:'컵 받침을 3개씩 선물해요',color:'var(--sky)',page:'교과서 34~35쪽'},
  {key:'relation',no:3,title:'약수와 배수의 관계',sub:'직사각형 하나로 두 가지를 봐요',color:'var(--mint)',page:'교과서 36~37쪽'},
  {key:'gcd',no:4,title:'공약수와 최대공약수',sub:'과일꼬치를 똑같이 만들어요',color:'var(--grape)',page:'교과서 38~40쪽'},
  {key:'lcm',no:5,title:'공배수와 최소공배수',sub:'두 개구리가 만나는 곳은?',color:'#E2731B',page:'교과서 41~43쪽'},
  {key:'project',no:6,title:'생각을 모아 해결해요',sub:'맹꽁이 서식지 울타리 조명',color:'#2C8C5A',page:'교과서 46~47쪽'},
];
const CONCEPTS={
  divisor:{text:'어떤 수를 나누어떨어지게 하는 수를 그 수의 [약수]라고 합니다. 어떤 수의 약수에는 언제나 [1]과 그 수 [자기 자신]이 들어 있습니다.',
    extra:'약수는 곱해서 그 수가 되는 <b>짝</b>으로 찾으면 빠뜨리지 않아요. 예) 12 = 1×12 = 2×6 = 3×4'},
  multiple:{text:'어떤 수를 1배, 2배, 3배, … 한 수를 그 수의 [배수]라고 합니다. 어떤 수의 배수 중 가장 작은 수는 [자기 자신]이고, 배수는 [끝없이] 많습니다.',
    extra:'약수는 개수가 정해져 있지만, 배수는 셀 수 없이 많아요.'},
  relation:{text:'12 = 3 × 4 일 때, 12는 3과 4의 [배수]이고, 3과 4는 12의 [약수]입니다.',
    extra:'곱셈식 ■ = ▲ × ● 에서 ■는 ▲, ●의 배수, ▲와 ●는 ■의 약수예요.'},
  gcd:{text:'두 수의 공통인 약수를 [공약수], 그중 가장 큰 수를 [최대공약수]라고 합니다. 두 수의 공약수는 최대공약수의 [약수]와 같습니다.',
    extra:'거꾸로 나눗셈: 두 수를 공약수로 나누고, 몫의 공약수가 <b>1뿐일 때까지</b> 계속 나눈 뒤 <b>왼쪽에 나눈 수들</b>을 곱해요.'},
  lcm:{text:'두 수의 공통인 배수를 [공배수], 그중 가장 작은 수를 [최소공배수]라고 합니다. 두 수의 공배수는 최소공배수의 [배수]와 같습니다.',
    extra:'거꾸로 나눗셈: <b>왼쪽에 나눈 수</b>와 <b>마지막 몫</b>을 모두 곱하면 최소공배수예요.'},
};
const MISCON={
  divisor:[{who:'🐰 토토',q:'16의 약수를 구해 보세요.',ans:'16÷2=8, 16÷4=4, 16÷8=2이므로 16의 약수는 2, 4, 8입니다.',
    opts:['맞아요','1과 16을 빠뜨렸어요','8은 약수가 아니에요'],right:1,why:'어떤 수든 1로 나누면 나누어떨어지고, 자기 자신으로 나누어도 나누어떨어져요. <b>16의 약수: 1, 2, 4, 8, 16</b>'},
    {who:'🐻 곰곰',q:'약수의 개수가 더 많은 수는 16과 17 중 어느 것일까요?',ans:'17이 16보다 크니까 약수도 더 많아요.',
    opts:['맞아요','수가 크다고 약수가 많은 건 아니에요'],right:1,why:'16의 약수는 1, 2, 4, 8, 16 (5개), 17의 약수는 1, 17 (2개)이에요. 수의 크기와 약수의 개수는 상관없어요.'}],
  multiple:[{who:'🐰 토토',q:'3의 배수를 가장 작은 수부터 3개 구해 보세요.',ans:'3×2=6, 3×3=9, 3×4=12이므로 6, 9, 12입니다.',
    opts:['맞아요','3×1=3부터 시작해야 해요','12는 3의 배수가 아니에요'],right:1,why:'배수는 1배, 2배, 3배, … 한 수예요. 3을 1배 한 3이 가장 작은 배수! <b>바른 답: 3, 6, 9</b>'},
    {who:'🦊 여우',q:'6의 배수는 모두 몇 개일까요?',ans:'6, 12, 18, …, 96으로 100까지 16개입니다.',
    opts:['맞아요','배수는 끝없이 많아서 셀 수 없어요'],right:1,why:'범위를 정하지 않으면 6×1, 6×2, 6×3, …은 끝없이 계속돼요. 배수의 개수는 셀 수 없이 많아요.'}],
  relation:[{who:'🐻 곰곰',q:'24 = 4 × 6을 보고 말해 보세요.',ans:'4는 24의 배수이고, 24는 6의 약수입니다.',
    opts:['맞아요','반대로 말했어요'],right:1,why:'큰 수 24가 4와 6의 <b>배수</b>이고, 작은 수 4와 6이 24의 <b>약수</b>예요.'}],
  gcd:[{who:'🐰 토토',q:'24와 40의 최대공약수를 구해 보세요.',ans:'2)24 40 → 2)12 20 → 6 10 에서 멈춰서 최대공약수는 2×2=4입니다.',
    opts:['맞아요','6과 10은 2로 한 번 더 나눌 수 있어요','처음부터 4로 나누면 안 돼요'],right:1,why:'몫 6과 10의 공약수가 아직 2가 있어요. 공약수가 1뿐일 때까지 나누면 2×2×2 = <b>8</b>이 최대공약수예요.'},
    {who:'🦊 여우',q:'2×3과 5×7의 최대공약수는?',ans:'공통인 수가 없으니까 최대공약수는 없습니다.',
    opts:['맞아요','1이 공약수라서 최대공약수는 1이에요'],right:1,why:'모든 자연수는 1을 약수로 가져요. 공약수가 1뿐이면 최대공약수는 <b>1</b>이에요.'}],
  lcm:[{who:'🐻 곰곰',q:'24와 40의 최소공배수를 구해 보세요.',ans:'2)24 40 → 2)12 20 → 6 10, 최소공배수는 2×2×6×10=240입니다.',
    opts:['맞아요','6과 10을 2로 더 나누어야 해요','최소공배수는 24×40이에요'],right:1,why:'2로 한 번 더 나누면 몫이 3과 5. 최소공배수는 2×2×2×3×5 = <b>120</b>이에요. 다 나누지 않으면 공배수이긴 해도 가장 작은 수가 아니에요.'}],
};

/* ============================================================
   라우팅
   ============================================================ */
const app=document.getElementById('app');
function route(){
  const r=(location.hash||'#home').slice(1);
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r||(r.startsWith('lesson')&&a.dataset.r==='home')));
  app.innerHTML='';window.scrollTo(0,0);
  if(r.startsWith('lesson-')){const [k,t]=r.slice(7).split('/');const L=LESSONS.find(x=>x.key===k);if(L) return renderLesson(L,t===undefined?null:+t)}
  if(r==='challenge'){remember(r,'심화 유형 8가지');return renderChallenge()}
  if(r==='top-level'){remember(r,'최상위 도전');return renderTop()}
  if(r==='essay'){remember(r,'서술형 쓰기');return renderEssay()}
  if(r==='notes') return renderNotes();
  renderHome();
}
window.addEventListener('hashchange',route);

/* 어디까지 했는지 기억해서 '이어서 하기' */
function remember(r,label){S.last={r,label};save()}
function nextLesson(){return LESSONS.find(L=>M.sum(starsFor(L.key))<3)}
function firstTodo(L){const st=starsFor(L.key);const i=st.findIndex(x=>!x);return i<0?0:i}
function starsFor(k){
  const e=S.explore[k]?1:0, c=S.concept[k]?1:0, b=solvedCount(k+'-')>=5?1:0;
  if(k==='project') return [S.explore.project?1:0, S.concept.project?1:0, S.solved['project-own']?1:0];
  return [e,c,b];
}
function starHTML(arr){return arr.map(x=>`<span class="${x?'on':''}">★</span>`).join('')}

/* ---------------- HOME ---------------- */
function renderHome(){
  const total=LESSONS.reduce((s,L)=>s+M.sum(starsFor(L.key)),0);
  app.append(h('section',{class:'hero'},
    h('div',{},
      h('span',{class:'pill'},'2단원 · 약수와 배수'),
      h('h1',{html:'직접 <em>나누고, 곱하고, 뛰어 보며</em><br>약수와 배수를 발견해요'}),
      STUDENT?h('div',{class:'small'},`🙂 ${studentLabel()}의 탐구실`):'',
      h('p',{},'개념을 먼저 외우지 않아요. 꽃병에 꽃을 나누고, 개구리를 뛰게 하고, 타일을 깔아 보면서 규칙을 스스로 찾아요. 찾은 규칙으로 기본 문제부터 최상위 문제까지 해결해요.'),
      h('div',{class:'row'},
        S.last?h('a',{class:'btn coral',href:'#'+S.last.r,style:'text-decoration:none'},'▶ 이어서 하기: '+S.last.label):h('a',{class:'btn coral',href:'#lesson-divisor',style:'text-decoration:none'},'1단계부터 탐구 시작'),
        (()=>{const N=nextLesson();return N&&(S.last?!S.last.r.startsWith('lesson-'+N.key):N!==LESSONS[0])?h('a',{class:'btn',href:'#lesson-'+N.key,style:'text-decoration:none'},`👉 다음 차례: ${N.no}단계 ${N.title}`):''})(),
        h('a',{class:'btn ghost',href:'#challenge',style:'text-decoration:none'},'심화 유형 바로가기')),
      h('div',{class:'small',style:'margin-top:6px'},'아래 탐구 지도에서 하고 싶은 단계와 활동을 골라서 해도 돼요.')
    ),
    h('div',{class:'card'},
      h('div',{class:'jua',style:'font-size:18px'},'나의 탐구 여정'),
      h('div',{class:'big-num'},`★ ${total} / ${LESSONS.length*3}`),
      h('div',{class:'small'},'단계마다 ① 탐구 활동 ② 개념 정리 ③ 기본 문제 5개를 해결하면 별을 받아요.'),
      h('div',{class:'small',style:'margin-top:8px'},`심화·최상위 해결: ${solvedCount('ch-')+solvedCount('top-')}문제 · 서술형: ${solvedCount('essay-')}문제`)
    )
  ));
  app.append(h('div',{class:'section-title'},h('h2',{},'탐구 지도'),h('span',{},'하고 싶은 단계를 눌러요')));
  const g=h('div',{class:'grid g3'});
  const NX=nextLesson();
  LESSONS.forEach(L=>{
    const c=h('div',{class:'card step-card',onclick:()=>location.hash='lesson-'+L.key});
    c.style.setProperty('--c',L.color);
    const st=starsFor(L.key),all=M.sum(st)===st.length;
    const badge=all?'<span class="lbadge done">✅ 완료</span>':(L===NX?'<span class="lbadge next">👉 다음 차례</span>':(M.sum(st)?'<span class="lbadge">하는 중</span>':''));
    const names=L.key==='project'?['탐구','정리','내 문제']:['탐구','개념','기본','오개념'];
    c.innerHTML=`<span class="no">${L.no}단계</span>${badge}<h3>${L.title}</h3><p>${L.sub}</p><div class="small" style="margin-top:4px">${L.page}</div><div class="stars">${starHTML(st)}</div>`;
    const jump=h('div',{class:'ljump'});
    names.forEach((n,i)=>jump.append(h('button',{class:'ljump-b'+(st[i]?' ok':''),onclick:e=>{e.stopPropagation();location.hash='lesson-'+L.key+'/'+i}},(st[i]?'✓ ':'')+n)));
    c.append(jump);
    g.append(c);
  });
  app.append(g);
  app.append(h('div',{class:'section-title'},h('h2',{},'더 높이'),h('span',{},'개념을 다졌다면 도전!')));
  app.append(h('div',{class:'grid g3'},
    h('div',{class:'card step-card',style:'--c:var(--grape)',onclick:()=>location.hash='challenge',html:`<span class="no">심화</span><h3>심화 유형 8가지</h3><p>나머지가 있을 때, 배수 판정, 십간십이지까지 유형별로 단계를 밟아 풀어요.</p>`}),
    h('div',{class:'card step-card',style:'--c:var(--ink)',onclick:()=>location.hash='top-level',html:`<span class="no">최상위</span><h3>최상위 도전 12문제</h3><p>여러 개념을 엮어야 풀리는 문제. 힌트는 아껴 쓰기!</p>`}),
    h('div',{class:'card step-card',style:'--c:var(--mint)',onclick:()=>location.hash='essay',html:`<span class="no">서술형</span><h3>풀이 과정 쓰기 5문제</h3><p>단계별로 생각을 쓰고, 채점 기준으로 스스로 점검해요.</p>`})
  ));
  app.append(h('p',{class:'foot'},'별과 진도는 이 기기에 저장되고, 푼 문제와 발견 노트는 엄마에게 전달돼요. 📮 마음 우체통은 오른쪽 아래에 있어요.'));
}

/* ---------------- LESSON ---------------- */
function renderLesson(L,startTab){
  const head=h('section',{class:'lesson-head',style:`--c:${L.color}`},
    h('div',{class:'kicker'},`${L.no}단계 · ${L.page}`),h('h1',{},L.title),h('p',{},L.sub));
  app.append(head);
  const isProj=L.key==='project';
  const tabNames=isProj?['탐구','정리','내가 만든 문제']:['탐구','개념 정리','기본 문제','오개념 탐정'];
  const tabs=h('div',{class:'tabs'});const body=h('div');
  let cur=0;
  function show(i){cur=i;[...tabs.children].forEach((t,j)=>t.classList.toggle('on',j===i));body.innerHTML='';
    S.tab=S.tab||{};S.tab[L.key]=i;remember('lesson-'+L.key+'/'+i,`${L.no}단계 ${L.title} · ${tabNames[i]}`);
    try{history.replaceState(null,'','#lesson-'+L.key+'/'+i)}catch(e){}
    const fns=isProj?[exploreProject,conceptProject,ownProject]:[EXPLORE[L.key],()=>renderConcept(L),()=>renderBasics(L),()=>renderMiscon(L)];
    body.append(fns[i](L,()=>{refreshTabs()}));
    body.append(h('div',{class:'row',style:'margin-top:20px;justify-content:space-between'},
      i>0?h('button',{class:'btn ghost',onclick:()=>{show(i-1);window.scrollTo(0,head.offsetTop)}},'← 이전'):h('span'),
      i<tabNames.length-1?h('button',{class:'btn',onclick:()=>{show(i+1);window.scrollTo(0,head.offsetTop)}},'다음: '+tabNames[i+1]+' →'):nextLessonBtn(L)));
  }
  function refreshTabs(){const st=starsFor(L.key);[...tabs.children].forEach((t,j)=>t.classList.toggle('done',!!st[j]))}
  tabNames.forEach((n,i)=>tabs.append(h('button',{class:'tab',onclick:()=>show(i)},h('span',{class:'n'},String(i+1)),n)));
  app.append(tabs,body);refreshTabs();
  const def=startTab!=null&&startTab<tabNames.length?startTab:(S.tab&&S.tab[L.key]!=null?S.tab[L.key]:firstTodo(L));
  show(Math.min(def,tabNames.length-1));
}
function nextLessonBtn(L){const i=LESSONS.indexOf(L);if(i<LESSONS.length-1){const N=LESSONS[i+1];return h('a',{class:'btn coral',href:'#lesson-'+N.key+'/0',style:'text-decoration:none'},`${N.no}단계 ${N.title} →`)}return h('a',{class:'btn coral',href:'#challenge',style:'text-decoration:none'},'심화 유형 도전 →')}

function noteBox(key,prompt){
  const ta=h('textarea',{class:'note',placeholder:'내 말로 써 보세요…'});ta.value=S.notes[key]||'';
  ta.addEventListener('input',()=>{S.notes[key]=ta.value;save()});
  ta.addEventListener('change',()=>{if(ta.value.trim())logEvent('note',{tag:'발견 노트',q:stripHtml(prompt),answer:ta.value})});
  return h('div',{class:'q-box'},h('b',{},'✏️ 나의 발견 '),h('span',{html:prompt}),ta);
}
function doneExplore(k,cb){if(!S.explore[k]){S.explore[k]=1;save();toast('탐구 별 ★ 획득!');logEvent('star',{tag:'탐구 별',q:k})}cb&&cb()}

/* ---------- 탐구 1: 약수 ---------- */
const EXPLORE={};
EXPLORE.divisor=(L,cb)=>{
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🌹'),h('div',{html:'장미꽃을 꽃병 여러 개에 <b>남김없이 똑같이</b> 나누어 꽂으려고 해요. 꽃병이 몇 개일 때 가능할까요? 꽃병 수를 하나씩 눌러 직접 실험해 보세요.'})));
  const card=h('div',{class:'card'});root.append(card);
  let N=8;let found=new Set();
  const nSel=h('select',{class:'ans'},...[8,6,12,15,16,18,20,24,36].map(x=>h('option',{value:x},x+'송이')));
  const btnRow=h('div',{class:'row',style:'margin:10px 0'});
  const stage=h('div');const foundRow=h('div');const msg=h('div',{class:'fb'});
  function build(){btnRow.innerHTML='';found=new Set();stage.innerHTML='<div class="small">꽃병 수 버튼을 눌러 보세요.</div>';msg.className='fb';
    for(let k=1;k<=N;k++){const b=h('button',{class:'num-btn',onclick:()=>tryK(k,b)},String(k));btnRow.append(b)}
    drawFound();}
  function tryK(k,b){
    const q=Math.floor(N/k),r=N%k;stage.innerHTML='';
    const vw=h('div',{class:'vase-wrap'});
    const show=Math.min(k,12);
    for(let i=0;i<show;i++){const fl=h('div',{class:'fl'});for(let j=0;j<q;j++)fl.append(h('i'));vw.append(h('div',{class:'vase'},fl,h('div',{class:'body'},String(q))))}
    if(k>12) vw.append(h('div',{class:'small'},`… 꽃병 ${k}개`));
    if(r){const lo=h('div',{class:'leftover'},'남는 꽃 ');for(let j=0;j<r;j++)lo.append(h('i'));vw.append(lo)}
    stage.append(h('div',{class:'mono'},`${N} ÷ ${k} = ${q}${r?` … ${r}`:''}`),vw);
    if(r===0){b.className='num-btn ok';found.add(k)}else b.className='num-btn no';
    drawFound();
  }
  function drawFound(){
    const all=M.divs(N);foundRow.innerHTML='';
    foundRow.append(h('div',{class:'jua'},`나누어떨어지는 꽃병 수 (${found.size}개 찾음)`));
    [...found].sort((a,b)=>a-b).forEach(x=>foundRow.append(h('span',{class:'chip coral'},String(x))));
    if(found.size===all.length&&all.every(x=>found.has(x))){
      msg.className='fb show good';msg.innerHTML=`${N}을 나누어떨어지게 하는 수를 모두 찾았어요! 이 수들을 <b>${N}의 약수</b>라고 불러요.`;
      doneExplore('divisor',cb);
    }
  }
  nSel.addEventListener('change',()=>{N=+nSel.value;build();drawRect()});
  card.append(h('div',{class:'row'},h('span',{class:'jua'},'장미꽃 수'),nSel),btnRow,stage,foundRow,msg);

  // 직사각형 배열
  const card2=h('div',{class:'card',style:'margin-top:16px'});root.append(card2);
  const rIn=h('input',{class:'ans',type:'number',min:1,value:2});const rBox=h('div',{class:'svgbox'});const rList=h('div');const rects=new Set();
  function drawRect(){
    const r=Math.max(1,Math.min(N,+rIn.value||1));const c=Math.ceil(N/r);const full=N%r===0;
    const s=Math.max(10,Math.min(30,420/Math.max(c,r)));const W=c*s+20,H=r*s+20;
    let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    let n=0;for(let j=0;j<c;j++)for(let i=0;i<r;i++){/* 세로로 채움 */}
    for(let i=0;i<r;i++)for(let j=0;j<c;j++){n++;const fill=n<=N?(full?'#2BB39A':'#FFC23C'):'none';const st=n<=N?'#fff':'#E5484D';svg+=`<rect x="${10+j*s}" y="${10+i*s}" width="${s-2}" height="${s-2}" rx="3" fill="${fill}" stroke="${st}" ${n>N?'stroke-dasharray="3 2"':''}/>`}
    svg+='</svg>';rBox.innerHTML=svg;
    rBox.append(h('div',{class:'small',html:full?`✅ ${r}줄 × ${N/r}개 = ${N} — 빈칸 없이 딱 맞는 직사각형!`:`❌ ${r}줄로 놓으면 빈자리(점선)가 생겨요.`}));
    if(full){rects.add(Math.min(r,N/r)+'×'+Math.max(r,N/r))}
    rList.innerHTML='<span class="jua">찾은 직사각형: </span>'+[...rects].map(x=>`<span class="chip sky">${x}</span>`).join('');
  }
  rIn.addEventListener('input',drawRect);
  card2.append(h('h3',{style:'margin:0'},'더 탐구하기: 꽃을 직사각형으로 줄 세우기'),
    h('p',{class:'small'},'장미꽃을 한 줄에 몇 송이씩 놓으면 빈칸 없는 직사각형이 될까요? 줄 수를 바꿔 보세요.'),
    h('div',{class:'row'},'줄 수',rIn),rBox,rList);
  build();drawRect();
  root.append(noteBox('divisor-1','찾은 수들 중 <b>가장 작은 수</b>와 <b>가장 큰 수</b>는 항상 무엇인가요? 직사각형의 가로·세로 두 수를 곱하면 어떻게 되나요?'));
  return root;
};

/* ---------- 탐구 2: 배수 ---------- */
EXPLORE.multiple=(L,cb)=>{
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🧦'),h('div',{html:'양말목으로 만든 컵 받침을 친구 한 명에게 <b>3개씩</b> 선물해요. 친구가 1명, 2명, 3명, … 늘어날 때 필요한 컵 받침 수를 수 배열표에 칠해 보세요.'})));
  const card=h('div',{class:'card'});root.append(card);
  let k=3;const marked=new Set();
  const kSel=h('select',{class:'ans'},...[3,2,4,5,6,7,8,9,11,12].map(x=>h('option',{value:x},x+'개씩')));
  const tbl=h('div');const board=h('div',{class:'board'});const fb=h('div',{class:'fb'});
  function drawTable(){tbl.innerHTML=`<table class="t"><tr><th>친구 수</th>${[1,2,3,4,5,6].map(i=>`<td>${i}명</td>`).join('')}<td>…</td></tr><tr><th>컵 받침 수</th>${[1,2,3,4,5,6].map(i=>`<td>${k}×${i}=<b>${k*i}</b></td>`).join('')}<td>…</td></tr></table>`}
  function drawBoard(){board.innerHTML='';for(let n=1;n<=100;n++){const b=h('button',{class:marked.has(n)?'mk':'',onclick:()=>{marked.has(n)?marked.delete(n):marked.add(n);b.className=marked.has(n)?'mk':'';fb.className='fb'}},String(n));board.append(b)}}
  const check=h('button',{class:'btn',onclick:()=>{
    const truth=new Set([...Array(100).keys()].map(x=>x+1).filter(x=>x%k===0));
    let miss=0,err=0;[...board.children].forEach((b,i)=>{const n=i+1;b.classList.remove('miss','err');if(truth.has(n)&&!marked.has(n)){b.classList.add('miss');miss++}if(!truth.has(n)&&marked.has(n)){b.classList.add('err');err++}});
    if(!miss&&!err){fb.className='fb show good';fb.innerHTML=`완벽해요! 칠한 수 ${k}, ${2*k}, ${3*k}, …를 <b>${k}의 배수</b>라고 해요. 칠한 모양에서 어떤 규칙이 보이나요?`;doneExplore('multiple',cb)}
    else{fb.className='fb show bad';fb.innerHTML=`빠뜨린 수 ${miss}개(점선), 잘못 칠한 수 ${err}개(빨강)가 있어요. 다시 살펴보세요.`}
  }},'확인');
  const auto=h('button',{class:'btn ghost',onclick:()=>{for(let n=k;n<=100;n+=k)marked.add(n);drawBoard()}},'한 번에 칠하기');
  kSel.addEventListener('change',()=>{k=+kSel.value;marked.clear();drawTable();drawBoard();fb.className='fb'});
  card.append(h('div',{class:'row'},h('span',{class:'jua'},'한 명에게'),kSel),tbl,h('p',{class:'small'},'필요한 컵 받침 수를 아래 수 배열표에서 눌러 칠하세요.'),board,h('div',{class:'row',style:'margin-top:10px'},check,auto),fb);
  drawTable();drawBoard();
  const q=h('div',{class:'card',style:'margin-top:16px'});
  q.append(h('h3',{style:'margin:0 0 6px'},'생각해 보기'));
  q.append(renderProblem({id:'multiple-think1',q:'친구 수가 계속 늘어나면, 3의 배수는 모두 몇 개일까요?',fields:[{kind:'choice',options:['33개','100개','끝없이 많아요'],ans:2}],hints:['100보다 큰 3의 배수도 있을까요?'],sol:'3×1, 3×2, 3×3, …은 끝없이 계속되므로 배수는 셀 수 없이 많아요.'},'Q1'));
  q.append(renderProblem({id:'multiple-think2',q:'9의 배수 중 가장 작은 수는 무엇일까요?',fields:[{kind:'num',ans:9}],hints:['9를 1배 한 수는?'],sol:'9×1=9. 어떤 수의 가장 작은 배수는 자기 자신이에요.'},'Q2'));
  root.append(q);
  root.append(noteBox('multiple-1','2의 배수, 5의 배수, 10의 배수를 칠해 보세요. 일의 자리 숫자에 어떤 규칙이 있나요?'));
  return root;
};

/* ---------- 탐구 3: 약수와 배수의 관계 ---------- */
EXPLORE.relation=(L,cb)=>{
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🧩'),h('div',{html:'수를 <b>두 수의 곱</b>으로 나타내 보세요. 곱셈식 하나에서 약수와 배수를 모두 찾을 수 있어요.'})));
  const card=h('div',{class:'card'});root.append(card);
  let N=14;const pairs=new Set();
  const nSel=h('select',{class:'ans'},...[14,21,32,36,42,24,48].map(x=>h('option',{value:x},x)));
  const a=h('input',{class:'ans',type:'number',style:'width:80px'}),b=h('input',{class:'ans',type:'number',style:'width:80px'});
  const list=h('div');const fb=h('div',{class:'fb'});const sent=h('div');
  function draw(){
    list.innerHTML='';const all=M.divs(N).filter(x=>x*x<=N);
    [...pairs].map(Number).sort((p,q)=>p-q).forEach(x=>list.append(h('div',{class:'mono',html:`${N} = ${x} × ${N/x}`})));
    const got=[...pairs].map(Number);const ds=new Set();got.forEach(x=>{ds.add(x);ds.add(N/x)});const arr=[...ds].sort((p,q)=>p-q);
    sent.innerHTML=arr.length?`<div class="q-box"><b>그래서</b><br>${N}은(는) <span class="chip sky">${arr.join('</span><span class="chip sky">')}</span>의 <b>배수</b>예요.<br><span class="chip coral">${arr.join('</span><span class="chip coral">')}</span>은(는) ${N}의 <b>약수</b>예요.</div>`:'';
    if(all.every(x=>pairs.has(String(x)))){fb.className='fb show good';fb.innerHTML=`곱셈식을 모두 찾았어요! 곱셈식 속 수들이 바로 ${N}의 약수 전부예요.`;doneExplore('relation',cb)}
  }
  const add=h('button',{class:'btn',onclick:()=>{
    const x=+a.value,y=+b.value;
    if(x*y!==N){fb.className='fb show bad';fb.innerHTML=`${x} × ${y} = ${x*y}, ${N}이 아니에요.`;return}
    pairs.add(String(Math.min(x,y)));a.value='';b.value='';fb.className='fb';draw();
  }},'추가');
  nSel.addEventListener('change',()=>{N=+nSel.value;pairs.clear();fb.className='fb';draw()});
  card.append(h('div',{class:'row'},h('span',{class:'jua'},'수'),nSel),h('div',{class:'row',style:'margin:12px 0'},h('span',{class:'mono',id:'nn'},'= '),a,h('span',{class:'mono'},'×'),b,add),list,fb,sent);
  draw();
  root.append(noteBox('relation-1','곱셈식 <b>■ = ▲ × ●</b>에서 누가 누구의 약수이고, 누가 누구의 배수인지 설명해 보세요.'));
  return root;
};

/* ---------- 거꾸로 나눗셈 빌더 ---------- */
function ladderBuilder(a0,b0,mode){
  const box=h('div',{class:'card',style:'margin-top:16px'});
  let a=a0,b=b0,steps=[],x=a,y=b;
  const aIn=h('input',{class:'ans',type:'number',value:a,style:'width:80px'}),bIn=h('input',{class:'ans',type:'number',value:b,style:'width:80px'});
  const lad=h('div');const dIn=h('input',{class:'ans',type:'number',placeholder:'공약수',style:'width:100px'});
  const fb=h('div',{class:'fb'});const fin=h('div');
  function render(){
    lad.innerHTML='';const L=h('div',{class:'ladder'});
    let cx=a,cy=b;
    steps.forEach(d=>{L.append(h('div',{class:'lr'},h('div',{class:'d'},d+')'),h('div',{class:'cell'},h('span',{},String(cx)),h('span',{},String(cy)))));cx/=d;cy/=d});
    L.append(h('div',{class:'lr ghost'},h('div',{class:'d'},'?)'),h('div',{class:'cell'},h('span',{},String(cx)),h('span',{},String(cy)))));
    lad.append(L);x=cx;y=cy;
    fin.innerHTML='';
    if(M.gcd(x,y)===1&&steps.length){
      fb.className='fb show info';fb.innerHTML=`${x}와 ${y}의 공약수는 1뿐! 더 이상 나눌 수 없어요.`;
      const fields=mode==='gcd'?[{label:'최대공약수',kind:'num',ans:M.gcd(a,b)}]:mode==='lcm'?[{label:'최소공배수',kind:'num',ans:M.lcm(a,b)}]:[{label:'최대공약수',kind:'num',ans:M.gcd(a,b)},{label:'최소공배수',kind:'num',ans:M.lcm(a,b)}];
      fin.append(renderProblem({id:`${mode}-ladder-${a}-${b}`,q:`나눗셈 결과를 보고 ${a}와 ${b}의 ${mode==='gcd'?'최대공약수':mode==='lcm'?'최소공배수':'최대공약수와 최소공배수'}를 구하세요.`,fields,
        hints:mode==='gcd'?['왼쪽에 나눈 수들만 곱해요.']:['왼쪽에 나눈 수들과 맨 아래 몫을 모두 곱해요.'],
        sol:`왼쪽 수: ${steps.join(' × ')} = ${M.gcd(a,b)} ➜ 최대공약수<br>왼쪽 수와 마지막 몫: ${[...steps,x,y].join(' × ')} = ${M.lcm(a,b)} ➜ 최소공배수`},'✔'));
    }else if(M.gcd(x,y)===1&&!steps.length){fb.className='fb show info';fb.innerHTML='두 수의 공약수가 1뿐이에요. 최대공약수는 1, 최소공배수는 두 수의 곱이에요.'}
  }
  const go=h('button',{class:'btn',onclick:()=>{
    const d=+dIn.value;
    if(d<=1){fb.className='fb show bad';fb.innerHTML='1로 나누면 변하지 않아요. 1보다 큰 공약수를 찾아보세요.';return}
    if(x%d||y%d){fb.className='fb show bad';fb.innerHTML=`${d}(으)로 ${x%d?x:y}을(를) 나누면 나누어떨어지지 않아요. 두 수를 <b>모두</b> 나누어떨어지게 하는 수를 찾아요.`;return}
    if(M.gcd(x,y)===1){return}
    steps.push(d);dIn.value='';fb.className='fb';render();
  }},'나누기');
  dIn.addEventListener('keydown',e=>{if(e.key==='Enter')go.click()});
  const reset=h('button',{class:'btn ghost small',onclick:()=>{a=+aIn.value||12;b=+bIn.value||18;steps=[];fb.className='fb';render()}},'이 수로 시작');
  box.append(h('h3',{style:'margin:0'},'거꾸로 나눗셈 연습장'),h('p',{class:'small'},'두 수를 함께 나누어떨어지게 하는 수(공약수)를 직접 골라 나누어 보세요. 2, 3처럼 작은 수로 나누어도, 6처럼 한 번에 나누어도 괜찮아요.'),
    h('div',{class:'row'},aIn,bIn,reset),lad,h('div',{class:'row'},dIn,go),fb,fin);
  render();return box;
}

/* ---------- 탐구 4: 공약수 ---------- */
EXPLORE.gcd=(L,cb)=>{
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🍡'),h('div',{html:'블루베리와 청포도를 꼬치에 <b>남김없이 똑같이</b> 나누어 끼워요. 꼬치를 몇 개 만들 수 있을까요? 최대 몇 개일까요?'})));
  const card=h('div',{class:'card'});root.append(card);
  const presets=[[12,16],[18,24],[20,30],[24,36]];let [A,B]=presets[0];const ok=new Set();
  const pSel=h('select',{class:'ans',style:'width:auto'},...presets.map((p,i)=>h('option',{value:i},`블루베리 ${p[0]}, 청포도 ${p[1]}`)));
  const btns=h('div',{class:'row',style:'margin:10px 0'});const view=h('div',{class:'svgbox'});const res=h('div');const fb=h('div',{class:'fb'});
  function build(){btns.innerHTML='';ok.clear();fb.className='fb';view.innerHTML='<div class="small">꼬치 수를 눌러 보세요.</div>';
    for(let k=1;k<=Math.min(A,B);k++){const b=h('button',{class:'num-btn',onclick:()=>tryK(k,b)},String(k));btns.append(b)}draw()}
  function tryK(k,b){
    const pa=A%k===0,pb=B%k===0;const qa=Math.floor(A/k),qb=Math.floor(B/k);
    const W=Math.max(200,k*46+20),H=50+Math.max(qa+qb,4)*12;
    let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    for(let i=0;i<Math.min(k,24);i++){const x=20+i*46;svg+=`<line x1="${x+10}" y1="12" x2="${x+10}" y2="${H-6}" stroke="#B9875A" stroke-width="3"/>`;
      for(let j=0;j<qa;j++)svg+=`<circle cx="${x+10}" cy="${22+j*12}" r="6" fill="#3E5BD9"/>`;
      for(let j=0;j<qb;j++)svg+=`<circle cx="${x+10}" cy="${22+(qa+j)*12}" r="6" fill="#86C232"/>`;}
    svg+='</svg>';view.innerHTML=svg;
    view.append(h('div',{class:'mono',html:`블루베리 ${A} ÷ ${k} = ${qa}${A%k?` … <span style="color:#E5484D">${A%k}</span>`:''}   /   청포도 ${B} ÷ ${k} = ${qb}${B%k?` … <span style="color:#E5484D">${B%k}</span>`:''}`}));
    if(pa&&pb){b.className='num-btn ok';ok.add(k)}else b.className='num-btn no';
    draw();
  }
  function draw(){
    const da=M.divs(A),db=M.divs(B);
    res.innerHTML=`<div class="flex2"><div><div class="jua">${A}의 약수</div>${da.map(x=>`<span class="chip ${db.includes(x)&&ok.has(x)?'grape':'gray'}">${x}</span>`).join('')}</div><div><div class="jua">${B}의 약수</div>${db.map(x=>`<span class="chip ${da.includes(x)&&ok.has(x)?'grape':'gray'}">${x}</span>`).join('')}</div></div>`;
    const c=M.divs(M.gcd(A,B));
    if(c.every(x=>ok.has(x))){fb.className='fb show good';fb.innerHTML=`가능한 꼬치 수: ${c.join(', ')} ➜ 두 수의 <b>공약수</b>! 가장 많이 만들 수 있는 꼬치 수 ${M.gcd(A,B)}는 <b>최대공약수</b>예요. 그런데 ${c.join(', ')}은(는) ${M.gcd(A,B)}의 약수와 같지 않나요?`;doneExplore('gcd',cb)}
  }
  pSel.addEventListener('change',()=>{[A,B]=presets[+pSel.value];build()});
  card.append(h('div',{class:'row'},h('span',{class:'jua'},'과일'),pSel),h('div',{class:'small'},'꼬치 수'),btns,view,res,fb);
  build();

  // 정사각형 타일
  const t=h('div',{class:'card',style:'margin-top:16px'});root.append(t);
  const rp=[[12,8],[18,12],[15,9],[24,16]];let [W,H]=rp[0];
  const rSel=h('select',{class:'ans',style:'width:auto'},...rp.map((p,i)=>h('option',{value:i},`가로 ${p[0]}칸, 세로 ${p[1]}칸`)));
  const sIn=h('input',{type:'range',min:1,max:8,value:1,style:'width:220px'});const sv=h('span',{class:'jua'});const tb=h('div',{class:'svgbox'});const tf=h('div',{class:'small'});
  function tile(){const s=+sIn.value;sv.textContent=`정사각형 한 변: ${s}칸`;const u=Math.min(22,460/W);
    let svg=`<svg width="${W*u+20}" height="${H*u+20}"><rect x="10" y="10" width="${W*u}" height="${H*u}" fill="#FFF" stroke="#1F2A44" stroke-width="2"/>`;
    const fit=W%s===0&&H%s===0;
    for(let i=0;i*s<W;i++)for(let j=0;j*s<H;j++){const over=(i+1)*s>W||(j+1)*s>H;svg+=`<rect x="${10+i*s*u+1}" y="${10+j*s*u+1}" width="${s*u-2}" height="${s*u-2}" rx="3" fill="${over?'rgba(229,72,77,.18)':(fit?'#C7B4FB':'#FFE39A')}" stroke="${over?'#E5484D':'#8A5CF6'}" ${over?'stroke-dasharray="4 3"':''}/>`}
    svg+='</svg>';tb.innerHTML=svg;
    tf.innerHTML=fit?`✅ 한 변 ${s}칸 정사각형 ${W/s}×${H/s}=${W/s*H/s}개로 빈틈없이 덮였어요. ${s}는 ${W}와 ${H}의 공약수!`:`❌ 삐져나오는 부분(빨강)이 생겨요.`;
  }
  sIn.addEventListener('input',tile);rSel.addEventListener('change',()=>{[W,H]=rp[+rSel.value];sIn.max=Math.min(W,H);tile()});
  t.append(h('h3',{style:'margin:0'},'더 탐구하기: 가장 큰 정사각형 타일'),h('p',{class:'small'},'직사각형을 크기가 같은 정사각형으로 빈틈없이 덮으려면 한 변을 몇 칸으로 해야 할까요? 가장 큰 정사각형은?'),h('div',{class:'row'},rSel,sIn,sv),tb,tf);
  tile();
  root.append(ladderBuilder(24,42,'gcd'));
  root.append(noteBox('gcd-1','두 수의 공약수와 최대공약수 사이에는 어떤 관계가 있나요? 최대공약수만 알면 공약수를 모두 알 수 있을까요?'));
  return root;
};

/* ---------- 탐구 5: 공배수 ---------- */
EXPLORE.lcm=(L,cb)=>{
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🐸'),h('div',{html:'초록 개구리는 한 번에 <b>2칸</b>, 주황 개구리는 <b>3칸</b>씩 0에서 동시에 뛰어요. (방울토마토는 2일마다, 강낭콩은 3일마다 물을 주는 것과 같아요!) 두 개구리가 같이 밟는 칸은 어디일까요?'})));
  const card=h('div',{class:'card'});root.append(card);
  const presets=[[2,3],[4,6],[6,8],[5,7],[6,9]];let [A,B]=presets[0];let t=0;const MAX=60;
  const pSel=h('select',{class:'ans',style:'width:auto'},...presets.map((p,i)=>h('option',{value:i},`${p[0]}칸 / ${p[1]}칸`)));
  const pred=h('input',{class:'ans',type:'number',placeholder:'예상'});const predFb=h('div',{class:'fb'});
  const box=h('div',{class:'svgbox'});const info=h('div');const fb=h('div',{class:'fb'});
  function draw(){
    const W=MAX*15+40;let svg=`<svg width="${W}" height="120" viewBox="0 0 ${W} 120"><line x1="20" y1="60" x2="${W-10}" y2="60" stroke="#1F2A44" stroke-width="2"/>`;
    for(let i=0;i<=MAX;i++){const x=20+i*15;svg+=`<line x1="${x}" y1="55" x2="${x}" y2="65" stroke="#999"/>`;if(i%5===0)svg+=`<text x="${x}" y="84" font-size="11" text-anchor="middle" fill="#5B6478">${i}</text>`}
    const la=[],lb=[];for(let i=1;i<=t;i++){if(A*i<=MAX)la.push(A*i);if(B*i<=MAX)lb.push(B*i)}
    let pa=0;la.forEach(v=>{const x1=20+pa*15,x2=20+v*15;svg+=`<path d="M${x1} 55 Q ${(x1+x2)/2} ${30} ${x2} 55" fill="none" stroke="#2BB39A" stroke-width="2"/>`;pa=v});
    let pb=0;lb.forEach(v=>{const x1=20+pb*15,x2=20+v*15;svg+=`<path d="M${x1} 65 Q ${(x1+x2)/2} ${100} ${x2} 65" fill="none" stroke="#FF7A59" stroke-width="2"/>`;pb=v});
    la.filter(v=>lb.includes(v)).forEach(v=>{svg+=`<circle cx="${20+v*15}" cy="60" r="8" fill="#8A5CF6"/><text x="${20+v*15}" y="20" font-size="13" text-anchor="middle" fill="#8A5CF6" font-weight="bold">${v}</text>`});
    svg+=`<text x="${20+pa*15}" y="46" font-size="18" text-anchor="middle">🐸</text><text x="${20+pb*15}" y="112" font-size="18" text-anchor="middle">🐸</text></svg>`;
    box.innerHTML=svg;
    const both=la.filter(v=>lb.includes(v));
    info.innerHTML=`<div class="flex2"><div><span class="jua" style="color:#11705E">초록(${A}칸)</span> ${la.map(v=>`<span class="chip">${v}</span>`).join('')}</div><div><span class="jua" style="color:#B5442A">주황(${B}칸)</span> ${lb.map(v=>`<span class="chip coral">${v}</span>`).join('')}</div></div><div style="margin-top:6px"><span class="jua" style="color:#5B34C2">같이 밟은 칸</span> ${both.map(v=>`<span class="chip grape">${v}</span>`).join('')||'<span class="small">아직 없어요</span>'}</div>`;
    if(both.length>=3){fb.className='fb show good';fb.innerHTML=`같이 밟은 칸 ${both.join(', ')}, … 은 ${A}와 ${B}의 <b>공배수</b>! 처음 만나는 ${M.lcm(A,B)}가 <b>최소공배수</b>예요. 다른 공배수들은 ${M.lcm(A,B)}와 어떤 관계일까요?`;doneExplore('lcm',cb)}
    else fb.className='fb';
  }
  const jump=h('button',{class:'btn mint',onclick:()=>{if(t*Math.min(A,B)<MAX){t++;draw()}}},'함께 점프!');
  const all=h('button',{class:'btn ghost',onclick:()=>{t=Math.ceil(MAX/Math.min(A,B));draw()}},'끝까지');
  const reset=()=>{t=0;draw();predFb.className='fb'};
  pSel.addEventListener('change',()=>{[A,B]=presets[+pSel.value];reset()});
  const pBtn=h('button',{class:'btn small',onclick:()=>{const v=+pred.value;predFb.className='fb show '+(v===M.lcm(A,B)?'good':'info');predFb.innerHTML=v===M.lcm(A,B)?'예상이 맞는지 점프해서 확인해 보세요! (정답이에요 👀)':'점프해서 직접 확인해 보세요. 예상과 같나요?'}},'예상 저장');
  card.append(h('div',{class:'row'},h('span',{class:'jua'},'뛰는 칸 수'),pSel),
    h('div',{class:'q-box'},h('b',{},'먼저 예상! '),'두 개구리가 처음으로 같이 밟는 칸은? ',pred,' ',pBtn,predFb),
    box,h('div',{class:'row'},jump,all,h('button',{class:'btn ghost small',onclick:reset},'처음으로')),info,fb);
  draw();
  root.append(ladderBuilder(12,20,'lcm'));
  root.append(noteBox('lcm-1','두 수의 공배수와 최소공배수 사이에는 어떤 관계가 있나요? 최대공약수를 구할 때와 최소공배수를 구할 때 거꾸로 나눗셈에서 곱하는 수가 어떻게 다른가요?'));
  return root;
};

/* ---------- 6단계: 프로젝트 ---------- */
function exploreProject(L,cb){
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🐸'),h('div',{html:'맹꽁이 서식지 둘레(직사각형 72 m × 54 m)에 울타리를 치고 야간 조명을 달아요.<br><b>조건</b> ① 일정한 간격 ② 네 모퉁이에는 반드시 설치 ③ 가장 적은 개수'})));
  const card=h('div',{class:'card'});root.append(card);
  const A=72,B=54;
  const sIn=h('input',{type:'range',min:1,max:30,value:4,style:'width:260px'});const sv=h('span',{class:'jua'});const box=h('div',{class:'svgbox'});const fb=h('div',{class:'fb'});
  const tried=new Map();const tbl=h('div');
  function draw(){
    const s=+sIn.value;sv.textContent=`간격 ${s} m`;const u=6;const W=A*u+40,H=B*u+40;
    let svg=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="20" y="20" width="${A*u}" height="${B*u}" fill="#E7F6EC" stroke="#2C8C5A" stroke-width="3"/><text x="${20+A*u/2}" y="${20+B*u/2}" text-anchor="middle" font-size="40">🐸</text><text x="${20+A*u/2}" y="14" font-size="12" text-anchor="middle">72 m</text><text x="10" y="${20+B*u/2}" font-size="12" text-anchor="middle" transform="rotate(-90 10 ${20+B*u/2})">54 m</text>`;
    // 왼쪽 위 모퉁이에서 시작하여 둘레를 따라 s m마다
    const per=2*(A+B);const pts=[];for(let d=0;d<per;d+=s)pts.push(d);
    const pos=d=>{if(d<=A)return[d,0];d-=A;if(d<=B)return[A,d];d-=B;if(d<=A)return[A-d,B];d-=A;return[0,B-d]};
    pts.forEach(d=>{const [x,y]=pos(d);svg+=`<circle cx="${20+x*u}" cy="${20+y*u}" r="5" fill="#FFC23C" stroke="#9A6B00"/>`});
    const corners=[[0,0],[A,0],[A,B],[0,B]];const cornerOk=corners.map(([x,y])=>pts.some(d=>{const p=pos(d);return p[0]===x&&p[1]===y}));
    corners.forEach(([x,y],i)=>{svg+=`<circle cx="${20+x*u}" cy="${20+y*u}" r="11" fill="none" stroke="${cornerOk[i]?'#2BB39A':'#E5484D'}" stroke-width="3" ${cornerOk[i]?'':'stroke-dasharray="4 3"'}/>`});
    const evenEnd=per%s===0;svg+='</svg>';box.innerHTML=svg;
    const good=cornerOk.every(Boolean)&&evenEnd;
    tried.set(s,{n:pts.length,good});
    fb.className='fb show '+(good?'good':'bad');
    fb.innerHTML=good?`네 모퉁이 모두 조명이 있어요! 조명 ${pts.length}개`:`모퉁이(빨간 점선)에 조명이 없어요. ${s}는 72와 54를 모두 나누어떨어지게 하나요?`;
    tbl.innerHTML=`<table class="t"><tr><th>간격(m)</th>${[...tried.keys()].sort((a,b)=>a-b).map(k=>`<td>${k}</td>`).join('')}</tr><tr><th>조건 만족</th>${[...tried.keys()].sort((a,b)=>a-b).map(k=>`<td>${tried.get(k).good?'⭕ '+tried.get(k).n+'개':'✖'}</td>`).join('')}</tr></table>`;
  }
  sIn.addEventListener('input',draw);
  card.append(h('div',{class:'row'},'조명 간격',sIn,sv),box,fb,h('div',{class:'small'},'시도한 간격 기록'),tbl);
  draw();
  const q=h('div',{class:'card',style:'margin-top:16px'});root.append(q);
  q.append(h('h3',{style:'margin:0 0 8px'},'문제를 해결해요'));
  q.append(renderProblem({id:'project-a',q:'네 모퉁이에 반드시 설치하면서 <b>가장 적은 개수</b>로 설치하려면 조명을 몇 m 간격으로 설치해야 하나요?',fields:[{kind:'num',ans:18,unit:'m'}],hints:['간격으로 72와 54가 모두 나누어떨어져야 모퉁이에 조명이 와요 ➜ 공약수','개수가 가장 적으려면 간격은 가장 길어야 해요.'],sol:'72와 54의 최대공약수: 2)72 54 → 3)36 27 → 3)12 9 → 4 3 ➜ 2×3×3 = 18 (m)'},'Q1',{color:'#2C8C5A',onSolve:()=>doneExplore('project',cb)}));
  q.append(renderProblem({id:'project-b',q:'이때 필요한 조명은 모두 몇 개인가요?',fields:[{kind:'num',ans:14,unit:'개'}],hints:['울타리 둘레는 (72+54)×2 m예요.','둘레가 닫힌 모양이면 (조명 수) = (둘레) ÷ (간격)'],sol:'둘레 (72+54)×2 = 252 (m) ➜ 252 ÷ 18 = 14 (개)'},'Q2',{color:'#2C8C5A'}));
  root.append(noteBox('project-1','문제를 어떻게 해결했는지 친구에게 설명하듯 써 보세요. 왜 <b>최대</b>공약수를 썼나요?'));
  return root;
}
function conceptProject(L,cb){
  const root=h('div');
  root.append(h('div',{class:'concept'},h('h4',{},'언제 최대공약수? 언제 최소공배수?'),h('div',{html:`<table class="t" style="width:100%"><tr><th>최대공약수를 떠올려요</th><th>최소공배수를 떠올려요</th></tr><tr><td>남김없이 <b>똑같이 나누기</b><br>될 수 있는 대로 <b>많은</b> 사람/상자</td><td><b>동시에</b> 출발·도착·만남<br>다음번에 <b>처음으로 같아지는</b> 때</td></tr><tr><td>가장 <b>큰</b> 정사각형으로 <b>자르기</b><br>가장 <b>긴</b> 간격으로 <b>나누기</b></td><td>가장 <b>작은</b> 정사각형 <b>만들기(이어 붙이기)</b><br>두 간격이 <b>겹치는</b> 곳</td></tr></table>`})));
  const pr=[
    {id:'project-c1',q:'다음 상황에서 필요한 것은? <br>「사과 24개와 배 36개를 최대한 많은 바구니에 똑같이 나누어 담기」',fields:[{kind:'choice',options:['최대공약수','최소공배수'],ans:0}],sol:'똑같이 나누기 + 최대한 많은 ➜ 최대공약수'},
    {id:'project-c2',q:'「6분마다, 8분마다 출발하는 두 버스가 다음에 동시에 출발하는 시각」',fields:[{kind:'choice',options:['최대공약수','최소공배수'],ans:1}],sol:'동시에 ➜ 공배수, 다음번 처음 ➜ 최소공배수'},
    {id:'project-c3',q:'「가로 12 cm, 세로 8 cm 카드를 이어 붙여 가장 작은 정사각형 만들기」',fields:[{kind:'choice',options:['최대공약수','최소공배수'],ans:1}],sol:'이어 붙여서 만드는 정사각형의 한 변은 12와 8의 공배수, 가장 작은 것 ➜ 최소공배수 24 cm'},
    {id:'project-c4',q:'「가로 45 cm, 세로 30 cm 종이를 잘라 가장 큰 정사각형 여러 장 만들기」',fields:[{kind:'choice',options:['최대공약수','최소공배수'],ans:0}],sol:'잘라서 나누기 ➜ 공약수, 가장 큰 ➜ 최대공약수 15 cm'},
  ];
  let n=0;pr.forEach((p,i)=>root.append(renderProblem(p,'Q'+(i+1),{color:'#2C8C5A',onSolve:()=>{n++;if(pr.every(x=>S.solved[x.id])&&!S.concept.project){S.concept.project=1;save();toast('정리 별 ★ 획득!');logEvent('star',{tag:'정리 별',q:'project'});cb()}}})));
  return root;
}
function ownProject(L,cb){
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🛠️'),h('div',{html:'울타리 두 변의 길이를 바꾸어 <b>나만의 문제</b>를 만들고, 답을 구해 보세요. 앱이 답이 맞는지 확인해 줘요. 짝에게 문제를 내 봐도 좋아요!'})));
  const c=h('div',{class:'card'});root.append(c);
  const a=h('input',{class:'ans',type:'number',value:60}),b=h('input',{class:'ans',type:'number',value:48});
  const s=h('input',{class:'ans',type:'number'}),n=h('input',{class:'ans',type:'number'});const fb=h('div',{class:'fb'});const prob=h('div',{class:'q-box'});
  function upd(){prob.innerHTML=`<b>내가 만든 문제</b><br>두 변의 길이가 각각 ${a.value} m, ${b.value} m인 직사각형 모양의 울타리에 네 모퉁이를 포함하여 일정한 간격으로 가장 적은 개수의 조명을 설치하려고 합니다. 몇 m 간격으로 설치해야 하고, 조명은 모두 몇 개 필요할까요?`}
  a.addEventListener('input',upd);b.addEventListener('input',upd);upd();
  c.append(h('div',{class:'row'},'두 변',a,'m',b,'m'),prob,h('div',{class:'row'},'간격',s,'m  /  조명',n,'개',h('button',{class:'btn',onclick:()=>{
    const A=+a.value,B=+b.value;if(!(A>0&&B>0)){return}const g=M.gcd(A,B),cnt=2*(A+B)/g;
    const ok=+s.value===g&&+n.value===cnt;fb.className='fb show '+(ok?'good':'bad');
    fb.innerHTML=ok?'완벽해요! 문제를 만들고 해결까지 했어요. 🎉':(+s.value===g?`간격은 맞았어요! 조명 수를 다시 세어 보세요. 둘레는 (${A}+${B})×2 m예요.`:'간격을 다시 생각해 보세요. 두 길이를 모두 나누어떨어지게 하는 가장 큰 수는?');
    logEvent('attempt',{tag:'내가 만든 문제',q:`울타리 ${A} m × ${B} m`,ok:ok?'O':'X',answer:`${s.value} m / ${n.value}개`});
    if(ok){markSolved('project-own');cb()}
  }},'확인')),fb);
  root.append(noteBox('project-2','조명을 놓는 곳이 <b>일직선 길</b>(처음과 끝에 설치)이라면 조명 수 구하는 방법이 어떻게 달라질까요?'));
  return root;
}

/* ---------- 개념 정리 ---------- */
function renderConcept(L){
  const root=h('div');const C=CONCEPTS[L.key];
  const box=h('div',{class:'concept'});box.append(h('h4',{},'빈칸을 채워 개념을 완성해요'));
  const p=h('p',{style:'margin:0;line-height:2.4'});const blanks=[];
  C.text.split(/(\[[^\]]+\])/).forEach(part=>{
    if(part.startsWith('[')){const ans=part.slice(1,-1);const inp=h('input',{class:'blank'});inp.dataset.ans=ans;blanks.push(inp);p.append(inp)}else p.append(part);
  });
  const fb=h('div',{class:'fb'});
  const chk=h('button',{class:'btn',onclick:()=>{
    let all=true;blanks.forEach(b=>{const ok=b.value.replace(/\s/g,'')===b.dataset.ans.replace(/\s/g,'');b.className='blank '+(ok?'right':'wrong');all=all&&ok});
    fb.className='fb show '+(all?'good':'bad');fb.innerHTML=all?'개념 완성! 정리 별 ★':'빨간 칸을 다시 생각해 보세요. 탐구 활동에서 발견한 것을 떠올려요.';
    if(all&&!S.concept[L.key]){S.concept[L.key]=1;save();toast('정리 별 ★ 획득!');logEvent('star',{tag:'개념 별',q:L.key})}
  }},'확인');
  const peek=h('button',{class:'btn ghost small',onclick:()=>{blanks.forEach(b=>{b.placeholder=b.dataset.ans.slice(0,1)+'…'})}},'첫 글자 힌트');
  box.append(p,h('div',{class:'row',style:'margin-top:8px'},chk,peek),fb,h('div',{class:'small',style:'margin-top:10px',html:'📌 '+C.extra}));
  root.append(box);
  if(S.notes[L.key+'-1']) root.append(h('div',{class:'q-box'},h('b',{},'내가 탐구에서 쓴 발견'),h('div',{},S.notes[L.key+'-1'])));
  if(L.key==='gcd'||L.key==='lcm') root.append(ladderBuilder(L.key==='gcd'?36:18,L.key==='gcd'?60:30,'both'));
  return root;
}

/* ---------- 기본 문제 ---------- */
function renderBasics(L,cb){
  const root=h('div');const list=h('div');
  const info=h('div',{class:'small'});
  function gen(){list.innerHTML='';const gens=G[L.key];
    const order=M.shuffle(gens).concat(M.shuffle(gens)).slice(0,5);
    order.forEach((g,i)=>list.append(renderProblem(g(),i+1,{color:L.color,onSolve:()=>{upd();cb()}})));upd()}
  function upd(){const n=solvedCount(L.key+'-');info.innerHTML=`지금까지 이 단계에서 맞힌 문제: <b>${n}</b>개 ${n>=5?'· 기본 별 ★ 획득!':'(5개 맞히면 별 ★)'}`}
  root.append(h('div',{class:'row',style:'justify-content:space-between;margin-bottom:12px'},info,h('button',{class:'btn ghost small',onclick:gen},'🔄 새 문제 5개')));
  root.append(list);gen();
  root.append(gradeAllBar(()=>[...list.children],'기본 문제 '+L.title));
  return root;
}
function gradeAllBar(getCards,label){
  const out=h('div',{class:'fb'});
  const btn=h('button',{class:'btn coral',onclick:()=>{
    const cards=getCards();let n=0;cards.forEach(c=>{if(c.grade&&c.grade())n++});
    out.className='fb show '+(n===cards.length?'good':'info');
    out.innerHTML=`<b class="jua" style="font-size:20px">${n} / ${cards.length}</b> 맞았어요. `+(n===cards.length?'모두 맞혔어요! 🎉':'틀린 문제는 힌트를 보고 다시 도전해 보세요. 문제마다 있는 채점 버튼으로 하나씩 다시 확인할 수 있어요.');
    logEvent('score',{tag:'전체 채점',q:label,ok:n===cards.length?'O':'X',answer:`${n}/${cards.length}`});
  }},'📝 이 페이지 전체 채점');
  return h('div',{class:'card',style:'margin-top:8px'},h('div',{class:'row'},btn,h('span',{class:'small'},'다 풀었으면 한꺼번에 채점해 보세요. (문제마다 채점해도 돼요)')),out);
}

/* ---------- 오개념 탐정 ---------- */
function renderMiscon(L){
  const root=h('div');
  root.append(h('div',{class:'story'},h('div',{class:'who'},'🔍'),h('div',{html:'친구들이 문제를 풀었어요. 친구의 풀이가 맞는지, 틀렸다면 무엇이 잘못인지 찾아 주세요.'})));
  (MISCON[L.key]||[]).forEach((m,i)=>{
    const c=h('div',{class:'prob'});
    c.append(h('div',{html:`<span class="pn">탐정 ${i+1}</span><b>문제</b> ${m.q}`}),h('div',{class:'cond',html:`<b>${m.who}의 풀이</b><br>${m.ans}`}));
    const fb=h('div',{class:'fb'});const ch=h('div',{class:'choice'});
    m.opts.forEach((o,j)=>ch.append(h('button',{onclick:(e)=>{[...ch.children].forEach(x=>x.classList.remove('sel'));e.target.classList.add('sel');fb.className='fb show '+(j===m.right?'good':'bad');fb.innerHTML=(j===m.right?'명탐정! ':'다시 살펴보세요. ')+(j===m.right?m.why:'')}},o)));
    c.append(ch,fb);root.append(c);
  });
  return root;
}

/* ============================================================
   심화 유형 8가지
   ============================================================ */
const GAN=['갑','을','병','정','무','기','경','신','임','계'],JI=['자','축','인','묘','진','사','오','미','신','유','술','해'];
const TYPES=[
  {no:1,title:'조건에 알맞은 공배수의 개수',tip:'●의 배수도 되고 ▲의 배수도 되는 수 = 공배수 = 최소공배수의 배수. 범위가 "■부터 ★까지"라면 (1~★의 개수) − (1~(■−1)의 개수)로 세요.',
    main:{q:'120부터 360까지의 수 중에서 12의 배수도 되고 16의 배수도 되는 수는 모두 몇 개인가요?',
      steps:[{p:'12와 16의 최소공배수는?',ans:48},{p:'1부터 360까지의 수 중 48의 배수는 몇 개?',ans:7},{p:'1부터 119까지의 수 중 48의 배수는 몇 개?',ans:2},{p:'답: 모두 몇 개?',ans:5,unit:'개'}]},
    gen:()=>{let a,b,l;do{a=M.pick([4,6,8,9,10,12,14,15,18]);b=M.pick([6,8,9,10,12,15,20,21,24]);l=M.lcm(a,b)}while(a===b||l>70||l===Math.max(a,b));
      const lo=M.ri(5,15)*10,hi=lo+M.ri(20,40)*10;const c=M.multiplesIn(l,lo,hi);
      return {q:`${lo}부터 ${hi}까지의 수 중에서 ${a}의 배수도 되고 ${b}의 배수도 되는 수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:c,unit:'개'}],hints:[`${a}와 ${b}의 최소공배수를 구해요.`,`1~${hi}의 개수에서 1~${lo-1}의 개수를 빼요.`],sol:`최소공배수 ${l}<br>1~${hi}: ${Math.floor(hi/l)}개, 1~${lo-1}: ${Math.floor((lo-1)/l)}개 ➜ ${c}개`}},
    gen2:()=>{const a=M.pick([6,8,10,12]),b=M.pick([9,15,16,18,20]);const n=M.pick([200,300,400,500]);const l=M.lcm(a,b);const c=n-Math.floor(n/a)-Math.floor(n/b)+Math.floor(n/l);
      return {q:`1부터 ${n}까지의 수 중에서 ${a}의 배수도 아니고 ${b}의 배수도 아닌 수는 모두 몇 개인가요?`,fields:[{kind:'num',ans:c,unit:'개'}],hints:[`${a}의 배수 개수 + ${b}의 배수 개수를 빼면, 공배수는 두 번 빠져요.`,`그래서 공배수(최소공배수 ${l}의 배수) 개수를 한 번 더해 줘요.`],sol:`${a}의 배수 ${Math.floor(n/a)}개, ${b}의 배수 ${Math.floor(n/b)}개, ${l}의 배수 ${Math.floor(n/l)}개<br>${n} − ${Math.floor(n/a)} − ${Math.floor(n/b)} + ${Math.floor(n/l)} = ${c}`}}},
  {no:2,title:'나머지가 있을 때 어떤 수 구하기',tip:'■를 어떤 수로 나누면 ▲가 남는다 ➜ (■−▲)는 어떤 수로 나누어떨어진다. 어떤 수는 나머지보다 커야 해요!',
    main:{q:'137과 172를 어떤 수로 나누면 나머지가 각각 5와 4입니다. 어떤 수 중에서 가장 큰 수는?',
      steps:[{p:'137−5는?',ans:132},{p:'172−4는?',ans:168},{p:'132와 168의 최대공약수는?',ans:12},{p:'12는 나머지 5, 4보다 크나요? 그렇다면 답은?',ans:12}]},
    gen:()=>{let d,r1,r2,x,y;do{d=M.pick([6,7,8,9,11,12,13,14,15,16,18]);r1=M.ri(1,d-1);r2=M.ri(1,d-1);x=d*M.ri(5,14)+r1;y=d*M.ri(5,14)+r2}while(x===y||M.gcd(x-r1,y-r2)!==d);
      return {q:`${x}와 ${y}를 어떤 수로 나누면 나머지가 각각 ${r1}과(와) ${r2}입니다. 어떤 수 중에서 가장 큰 수는?`,fields:[{kind:'num',ans:d}],hints:[`${x}−${r1}과 ${y}−${r2}는 어떤 수로 나누어떨어져요.`],sol:`${x-r1}과 ${y-r2}의 최대공약수 ${d} (${d}>${Math.max(r1,r2)} ✔)`}},
    gen2:()=>{let d,k,r,x,y;do{d=M.pick([12,18,20,24,30,36]);r=M.ri(2,5);x=d*M.ri(3,9)+r;y=d*M.ri(3,9)+r}while(x===y||M.gcd(x-r,y-r)!==d);const ans=M.divs(d).filter(v=>v>r);
      return {q:`${x}와 ${y}를 어떤 수로 나누면 나머지가 모두 ${r}입니다. 어떤 수가 될 수 있는 수를 <b>모두</b> 구하세요.`,fields:[{kind:'set',ans}],hints:[`${x-r}와 ${y-r}의 공약수를 구해요.`,`나머지 ${r}보다 큰 수만 될 수 있어요!`],sol:`${x-r}와 ${y-r}의 최대공약수 ${d}의 약수: ${fmt(M.divs(d))}<br>그중 ${r}보다 큰 수: ${fmt(ans)}`}}},
  {no:3,title:'최대공약수의 활용',tip:'"될 수 있는 대로 많은 ○○에 남김없이 똑같이" ➜ 최대공약수가 ○○의 수예요.',
    main:{q:'귤 42개와 사과 70개를 될 수 있는 대로 많은 바구니에 남김없이 똑같이 나누어 담으려고 합니다. 한 바구니에 담는 귤과 사과 수의 차는?',
      steps:[{p:'바구니의 수(42와 70의 최대공약수)는?',ans:14},{p:'한 바구니의 귤은 몇 개?',ans:3},{p:'한 바구니의 사과는 몇 개?',ans:5},{p:'답: 차는 몇 개?',ans:2,unit:'개'}]},
    gen:()=>{let a,b,g;do{a=M.ri(24,96);b=M.ri(24,96);g=M.gcd(a,b)}while(a===b||g<6);
      return {q:`길이가 ${a} cm, ${b} cm인 두 끈을 각각 될 수 있는 대로 길게, 남김없이 똑같은 길이로 자르려고 합니다. 끈은 모두 몇 도막이 되나요?`,fields:[{kind:'num',ans:a/g+b/g,unit:'도막'}],hints:['한 도막의 길이 = 최대공약수','각 끈의 도막 수를 더해요.'],sol:`한 도막 ${g} cm ➜ ${a/g}+${b/g}=${a/g+b/g}(도막)`}},
    gen2:()=>{let a,b,c,g;do{a=M.pick([24,36,48,54,60,72]);b=M.pick([30,42,54,84,90,96,108,126]);c=M.pick([18,36,45,54,60,90]);g=M.gcd(M.gcd(a,b),c)}while(g<6||a===b||b===c||a===c);
      return {q:`과자 ${a}개, 사탕 ${b}개, 초콜릿 ${c}개를 최대한 많은 학생에게 남김없이 똑같이 나누어 주려고 합니다. 최대 몇 명에게 나누어 줄 수 있나요?`,fields:[{kind:'num',ans:g,unit:'명'}],hints:['세 수를 모두 나누어떨어지게 하는 가장 큰 수!','거꾸로 나눗셈을 세 수에 함께 해도 돼요.'],sol:`${a}, ${b}, ${c}의 최대공약수 ${g} ➜ ${g}명`}}},
  {no:4,title:'최소공배수의 활용',tip:'동시에 출발한 뒤 다시 동시에 출발하는 간격 = 최소공배수. 시각/날짜에 그 간격을 더해요.',
    main:{q:'어느 정류장에서 ㉮ 버스는 12분마다, ㉯ 버스는 18분마다 출발합니다. 오전 8시 20분에 동시에 출발했다면 다음번에 처음으로 동시에 출발하는 시각은?',
      steps:[{p:'12와 18의 최소공배수는?',ans:36},{p:'오전 8시 20분 + 36분 = 오전 8시 몇 분?',ans:56,unit:'분'}]},
    gen:()=>{let a,b,l;do{a=M.ri(3,8);b=M.ri(3,8);l=M.lcm(a,b)}while(a===b||l<12||l>30);const d=M.ri(1,20);let date=new Date(2026,2,d+l*2);
      return {q:`서연이는 ${a}일마다, 도윤이는 ${b}일마다 도서관에 갑니다. 3월 ${d}일에 둘이 함께 도서관에 갔다면, 그 이후 <b>두 번째로</b> 함께 가는 날은 몇 월 며칠인가요?`,fields:[{kind:'num',ans:date.getMonth()+1,unit:'월'},{kind:'num',ans:date.getDate(),unit:'일'}],hints:[`${l}일마다 함께 가요.`,'두 번째 ➜ 간격 × 2','3월은 31일까지 있어요.'],sol:`${a}와 ${b}의 최소공배수 ${l} ➜ ${l}×2=${l*2}일 후 ➜ 3월 ${d}일 + ${l*2}일 = ${date.getMonth()+1}월 ${date.getDate()}일`}},
    gen2:()=>{let L0,a,b,g;do{a=M.pick([8,9,10,12,15]);b=M.pick([6,10,12,15,18,20]);g=M.lcm(a,b);L0=g*M.ri(8,20)}while(a===b||g===Math.max(a,b)||g>60);const cnt=L0/g+1;
      return {q:`길이가 ${L0} m인 도로의 한쪽에 처음부터 끝까지 가로수는 ${a} m 간격으로, 가로등은 ${b} m 간격으로 세웁니다. 가로수와 가로등이 같은 자리에 오는 곳은 모두 몇 군데인가요? (처음과 끝 포함)`,fields:[{kind:'num',ans:cnt,unit:'군데'}],hints:['겹치는 간격 = 최소공배수','처음 자리(0 m)도 세어야 해요 ➜ (길이 ÷ 간격) + 1'],sol:`최소공배수 ${g} m ➜ ${L0}÷${g}+1 = ${cnt}(군데)`}}},
  {no:5,title:'직사각형과 정사각형',tip:'잘라서 가장 큰 정사각형 ➜ 최대공약수. 이어 붙여 가장 작은 정사각형 ➜ 최소공배수.',
    main:{q:'가로 84 cm, 세로 60 cm인 직사각형 벽에 크기가 같은 가장 큰 정사각형 타일을 빈틈없이 붙이려고 합니다. 타일은 모두 몇 장 필요한가요?',
      steps:[{p:'타일 한 변의 길이(84와 60의 최대공약수)는? (cm)',ans:12},{p:'가로로 몇 장?',ans:7},{p:'세로로 몇 장?',ans:5},{p:'답: 모두 몇 장?',ans:35,unit:'장'}]},
    gen:()=>{let a,b,l;do{a=M.pick([6,8,9,10,12,14,15]);b=M.pick([4,6,8,9,10,12,16]);l=M.lcm(a,b)}while(a===b||l===Math.max(a,b)||l>72);
      return {q:`가로 ${a} cm, 세로 ${b} cm인 직사각형 모양 카드를 빈틈없이 겹치지 않게 이어 붙여 가장 작은 정사각형을 만들려고 합니다. 카드는 모두 몇 장 필요한가요?`,fields:[{kind:'num',ans:(l/a)*(l/b),unit:'장'}],hints:['정사각형 한 변 = 최소공배수','(가로 장 수) × (세로 장 수)'],sol:`한 변 ${l} cm ➜ ${l/a} × ${l/b} = ${(l/a)*(l/b)}(장)`}},
    gen2:()=>{let a,b,g;do{a=M.pick([48,54,60,72,84,90,96]);b=M.pick([36,40,42,45,56,63,64,70]);g=M.gcd(a,b)}while(g<6);
      return {q:`가로 ${a} cm, 세로 ${b} cm인 종이를 남는 부분 없이 잘라서 크기가 같은 가장 큰 정사각형 여러 장으로 나누려고 합니다. 정사각형은 모두 몇 장 생기나요?`,fields:[{kind:'num',ans:(a/g)*(b/g),unit:'장'}],hints:['한 변 = 최대공약수'],sol:`한 변 ${g} cm ➜ ${a/g} × ${b/g} = ${(a/g)*(b/g)}(장)`}}},
  {no:6,title:'배수 판정하기',tip:'3의 배수: 각 자리 수의 합이 3의 배수 · 9의 배수: 각 자리 수의 합이 9의 배수 · 4의 배수: 끝 두 자리가 00이거나 4의 배수 · 5의 배수: 일의 자리 0 또는 5',
    main:{q:'네 자리 수 46□5는 3의 배수입니다. □ 안에 들어갈 수 있는 수를 모두 구하세요.',
      steps:[{p:'4+6+5는?',ans:15},{p:'15+□가 3의 배수가 되게 하는 □를 모두 쓰세요 (□는 0~9)',ans:[0,3,6,9],set:true}]},
    gen:()=>{const k=M.pick([3,9]);const a=M.ri(1,9),b=M.ri(0,9),c=M.ri(0,9);const ans=[...Array(10).keys()].filter(x=>(a+b+c+x)%k===0);
      return {q:`네 자리 수 ${a}${b}□${c}는 ${k}의 배수입니다. □ 안에 들어갈 수 있는 수를 모두 구하세요.`,fields:[{kind:'set',ans}],hints:[`${k}의 배수는 각 자리 수의 합이 ${k}의 배수예요.`,`${a}+${b}+${c}=${a+b+c}`],sol:`${a+b+c}+□가 ${k}의 배수 ➜ □ = ${fmt(ans)}`}},
    gen2:()=>{const a=M.ri(1,9),b=M.ri(0,9);const ans=[...Array(10).keys()].filter(x=>((b*10+x)%4===0)&&((a+b+x)%3===0));
      if(!ans.length) return TYPES[5].gen2();
      return {q:`세 자리 수 ${a}${b}□는 4의 배수이면서 3의 배수입니다. □ 안에 들어갈 수 있는 수를 모두 구하세요.`,fields:[{kind:'set',ans}],hints:['4의 배수: 끝 두 자리 수가 4의 배수',`3의 배수: ${a}+${b}+□가 3의 배수`],sol:`4의 배수 조건: ${b}□가 4의 배수 ➜ □ = ${[...Array(10).keys()].filter(x=>(b*10+x)%4===0).join(', ')}<br>그중 3의 배수 조건 만족: ${fmt(ans)}`}}},
  {no:7,title:'최대공약수와 최소공배수로 어떤 수 구하기',tip:'두 수 = 최대공약수 × ○, 최대공약수 × △ (○, △의 공약수는 1뿐) ➜ 최소공배수 = 최대공약수 × ○ × △',
    main:{q:'어떤 수 ㉮와 90의 최대공약수는 18이고 최소공배수는 270입니다. ㉮는?',
      steps:[{p:'90 = 18 × ?',ans:5},{p:'270 = 18 × 5 × ?',ans:3},{p:'답: ㉮ = 18 × 3 = ?',ans:54}]},
    gen:()=>{let g,p,q;do{g=M.pick([6,8,9,12,14,15,16]);p=M.ri(2,7);q=M.ri(2,7)}while(p===q||M.gcd(p,q)!==1);const known=g*p,ans=g*q,l=g*p*q;
      return {q:`${known}과(와) 어떤 수의 최대공약수는 ${g}이고 최소공배수는 ${l}입니다. 어떤 수를 구하세요.`,fields:[{kind:'num',ans}],hints:[`${known} = ${g} × ${p}`,`${l} = ${g} × ${p} × □`],sol:`${l} = ${g}×${p}×${q} ➜ 어떤 수 = ${g}×${q} = ${ans}`}},
    gen2:()=>{let g,p,q;do{g=M.pick([6,7,8,9,12,15]);p=M.ri(2,6);q=M.ri(3,9)}while(p>=q||M.gcd(p,q)!==1);const diff=g*(q-p),l=g*p*q;
      return {q:`어떤 두 수의 최대공약수는 ${g}, 최소공배수는 ${l}이고 두 수의 차는 ${diff}입니다. 두 수 중 <b>큰 수</b>를 구하세요.`,fields:[{kind:'num',ans:g*q}],hints:[`두 수를 ${g}×○, ${g}×△로 놓으면 ○×△ = ${l/g}`,`○와 △의 차는 ${q-p}`],sol:`○×△=${p*q}, △−○=${q-p}, ○와 △의 공약수는 1뿐 ➜ ○=${p}, △=${q} ➜ 큰 수 ${g}×${q}=${g*q}`}}},
  {no:8,title:'통합 교과: 십간십이지와 주기',tip:'십간(10개)과 십이지(12개)가 같은 짝으로 돌아오는 주기 = 10과 12의 최소공배수 = 60년 (환갑!)',
    main:{q:'1894년은 갑오년입니다(갑오개혁). 2034년은 무슨 해인가요?',
      steps:[{p:'10과 12의 최소공배수는? (같은 이름이 돌아오는 주기)',ans:60},{p:'1894 + 60 + 60 = ? (다시 갑오년)',ans:2014},{p:'2014년부터 2034년까지 몇 년 차이?',ans:20},{p:'갑에서 20번 넘어간 십간은?',ans:'갑',select:GAN},{p:'오에서 20번 넘어간 십이지는?',ans:'인',select:JI}]},
    gen:()=>{const y=M.ri(2027,2060);const g=GAN[((y-4)%10+10)%10],j=JI[((y-4)%12+12)%12];
      return {q:`2026년은 병오년입니다. ${y}년은 무슨 해인가요? (십간: 갑 을 병 정 무 기 경 신 임 계 / 십이지: 자 축 인 묘 진 사 오 미 신 유 술 해)`,fields:[{kind:'select',options:GAN,ans:g,label:'십간'},{kind:'select',options:JI,ans:j,label:'십이지'}],hints:[`${y}−2026 = ${y-2026}년 차이`,'십간은 10년마다, 십이지는 12년마다 돌아와요. 차이를 10, 12로 나눈 나머지만큼 넘겨 보세요.'],sol:`${y-2026}÷10 나머지 ${(y-2026)%10} ➜ 병에서 ${(y-2026)%10}칸 ➜ ${g}<br>${y-2026}÷12 나머지 ${(y-2026)%12} ➜ 오에서 ${(y-2026)%12}칸 ➜ ${j}<br>➜ ${g}${j}년`}},
    gen2:()=>{let a,b,l;do{a=M.pick([10,12,15,16,20]);b=M.pick([6,8,9,12,18,24]);l=M.lcm(a,b)}while(a===b||l>60||l===Math.max(a,b));const st=17*60+M.pick([5,10,15,20]);const from=st+M.pick([5,10,15]),to=19*60;
      let c=0;for(let t=st;t<=to;t+=l) if(t>=from)c++;
      const tt=x=>`오후 ${Math.floor(x/60)-12}시 ${x%60}분`;
      return {q:`정류장 전광판: 3318번 버스는 ${a}분 간격, 340번 버스는 ${b}분 간격으로 옵니다. 두 버스가 ${tt(st)}에 동시에 도착했다면, ${tt(from)}부터 오후 7시까지 두 버스가 동시에 도착하는 것은 모두 몇 번인가요?`,fields:[{kind:'num',ans:c,unit:'번'}],hints:[`동시에 도착하는 간격: ${a}와 ${b}의 최소공배수`,'시작 시각부터 차례로 더해 보며 범위 안의 시각만 세요.'],sol:`최소공배수 ${l}분 ➜ ${[...Array(10).keys()].map(i=>st+l*i).filter(t=>t>=from&&t<=to).map(tt).join(', ')} ➜ ${c}번`}}},
];

function renderChallenge(){
  app.append(h('section',{class:'lesson-head',style:'--c:var(--grape)'},h('div',{class:'kicker'},'심화 유형'),h('h1',{},'유형별로 생각하는 방법 익히기'),h('p',{},'대표 문제는 단계를 하나씩 해결하며 풀고, 유사 문제는 스스로! 문제는 누를 때마다 숫자가 바뀌어요.')));
  const g=h('div',{class:'grid g2'});const detail=h('div',{style:'margin-top:20px'});
  TYPES.forEach(T=>{const done=solvedCount(`ch-${T.no}-`);const c=h('div',{class:'card type-card',onclick:()=>{showType(T);detail.scrollIntoView({behavior:'smooth'})}});
    c.innerHTML=`<span class="tn">유형 ${T.no}</span><h4>${T.title}</h4><p>${T.tip.slice(0,52)}…</p><div class="small" style="margin-top:6px">해결: ${done}문제</div>`;g.append(c)});
  app.append(g,detail);
  function showType(T){
    detail.innerHTML='';
    detail.append(h('div',{class:'section-title'},h('h2',{},`유형 ${T.no}. ${T.title}`)));
    detail.append(h('div',{class:'concept'},h('h4',{},'💭 생각하기'),h('div',{},T.tip)));
    // 대표 문제 단계형
    const c=h('div',{class:'card'});detail.append(c);
    c.append(h('div',{class:'jua',style:'color:var(--grape);font-size:19px'},'대표 문제 — 단계별로 해결하기'),h('p',{html:T.main.q}));
    const stp=h('div',{class:'stepper'});c.append(stp);
    T.main.steps.forEach((s,i)=>{
      const st=h('div',{class:'st'+(i===0?' show':'')});
      let inp;
      if(s.select) inp=h('select',{class:'ans'},h('option',{value:''},'선택'),...s.select.map(o=>h('option',{value:o},o)));
      else inp=h('input',{class:'ans'+(s.set?' wide':''),placeholder:s.set?'예) 1, 2':''});
      const fb=h('span',{class:'small',style:'margin-left:8px'});
      const btn=h('button',{class:'btn small',onclick:()=>{
        let ok;if(s.select) ok=inp.value===s.ans;else if(s.set) ok=sameSet(parseNums(inp.value),s.ans);else{const v=parseNums(inp.value);ok=v.length===1&&v[0]===s.ans}
        inp.classList.toggle('right',ok);inp.classList.toggle('wrong',!ok);
        fb.textContent=ok?'✔ 좋아요!':'다시 계산해 보세요.';
        if(ok){if(stp.children[i+1])stp.children[i+1].classList.add('show');else{markSolved(`ch-${T.no}-main`);fb.textContent='🎉 대표 문제 해결!';logEvent('attempt',{tag:`심화 유형 ${T.no} 대표`,q:stripHtml(T.main.q),ok:'O'})}}
      }},'확인');
      inp.addEventListener('keydown',e=>{if(e.key==='Enter')btn.click()});
      st.append(h('div',{class:'sl'},`${i+1}단계`),h('div',{class:'row'},h('span',{},s.p),inp,s.unit?h('span',{},s.unit):'',btn,fb));
      stp.append(st);
    });
    // 유사 문제
    const sim=h('div',{style:'margin-top:16px'});detail.append(sim);
    function genSim(){sim.innerHTML='';sim.append(h('div',{class:'row',style:'justify-content:space-between;margin-bottom:10px'},h('h3',{style:'margin:0'},'유사 문제'),h('button',{class:'btn ghost small',onclick:genSim},'🔄 다른 숫자로')));
      [T.gen(),T.gen2()].forEach((p,i)=>{p.id=uid(`ch-${T.no}`);sim.append(renderProblem(p,`${T.no}-${i+1}`,{color:'var(--grape)'}))})}
    genSim();
  }
  showType(TYPES[0]);
}

/* ============================================================
   최상위 도전
   ============================================================ */
const TOP=[
  {q:'설명하는 어떤 수 ■를 구하세요.<div class="cond">가: ■는 54의 약수입니다.<br>나: ■의 약수를 모두 더하면 40입니다.</div>',fields:[{kind:'num',ans:27}],hints:['54의 약수를 모두 쓰고, 각각의 약수의 합을 구해 보세요.','약수의 합이 40보다 작은 수부터 확인해 보세요.'],sol:'54의 약수: 1, 2, 3, 6, 9, 18, 27, 54<br>27의 약수의 합: 1+3+9+27=40 ➜ ■=27'},
  {q:'어떤 두 수의 공배수 중에서 네 번째로 작은 공배수가 168일 때, 세 번째로 작은 공배수를 구하세요.',fields:[{kind:'num',ans:126}],hints:['네 번째로 작은 공배수 = 최소공배수 × 4'],sol:'최소공배수 = 168÷4 = 42 ➜ 세 번째: 42×3 = 126'},
  {q:'2, 3, 4, 6 중 어느 수로 나누어도 항상 1이 남는 수 중에서 가장 작은 세 자리 수를 구하세요.',fields:[{kind:'num',ans:109}],hints:['구하는 수에서 1을 빼면 2, 3, 4, 6의 공배수예요.','2, 3, 4, 6의 최소공배수는?'],sol:'2, 3, 4, 6의 최소공배수 12 ➜ 공배수 …, 96, 108, … ➜ 108+1 = 109'},
  {q:'합이 210인 두 수가 있습니다. 두 수의 최대공약수는 15, 최소공배수는 675입니다. 두 수를 구하세요.',fields:[{label:'작은 수',kind:'num',ans:75},{label:'큰 수',kind:'num',ans:135}],hints:['두 수를 15×○, 15×△로 놓아요. (○와 △의 공약수는 1뿐)','○+△ = 210÷15, ○×△ = 675÷15'],sol:'○+△=14, ○×△=45 ➜ ○=5, △=9 ➜ 75, 135'},
  {q:'160과 215를 어떤 수로 나누면 나머지가 각각 4와 7입니다. 어떤 수가 될 수 있는 수를 모두 구하세요.',fields:[{kind:'set',ans:[13,26,52]}],hints:['156과 208의 공약수를 구해요.','나누는 수는 나머지보다 커야 해요. (나머지 중 큰 것은 7)'],sol:'156과 208의 최대공약수 52 ➜ 공약수 1, 2, 4, 13, 26, 52 ➜ 7보다 큰 수: 13, 26, 52'},
  {q:'가로 6 cm, 세로 4 cm, 높이 10 cm인 직육면체 모양 상자를 같은 방향으로 빈틈없이 쌓아 가장 작은 정육면체를 만들려고 합니다. 상자는 몇 개 필요한가요?',fields:[{kind:'num',ans:900,unit:'개'}],hints:['정육면체 한 모서리 = 6, 4, 10의 최소공배수'],sol:'6, 4, 10의 최소공배수 60 ➜ (60÷6)×(60÷4)×(60÷10) = 10×15×6 = 900(개)'},
  {q:'네 자리 수 5□□0이 4의 배수도 되고 9의 배수도 되게 만들려고 합니다. 만들 수 있는 네 자리 수는 모두 몇 개인가요?',fields:[{kind:'num',ans:6,unit:'개'}],hints:['4의 배수: 끝 두 자리 □0이 4의 배수 ➜ 십의 자리는 짝수','9의 배수: 5+□+□ 가 9 또는 18'],sol:'(백,십) = (4,0), (2,2), (0,4), (9,4), (7,6), (5,8) ➜ 5400, 5220, 5040, 5940, 5760, 5580 ➜ 6개'},
  {q:'1부터 300까지의 수 중에서 6의 배수도 아니고 8의 배수도 아닌 수는 모두 몇 개인가요?',fields:[{kind:'num',ans:225,unit:'개'}],hints:['6의 배수 개수, 8의 배수 개수, 24의 배수 개수를 세요.','두 번 뺀 24의 배수를 한 번 더해 줘요.'],sol:'6의 배수 50개, 8의 배수 37개, 24의 배수 12개 ➜ 300−50−37+12 = 225'},
  {q:'약수가 3개뿐인 두 자리 수를 모두 구하세요.',fields:[{kind:'set',ans:[25,49]}],hints:['약수 3개 = 1, 가운데 하나, 자기 자신','가운데 수끼리 곱하면 자기 자신이 되어야 해요. 예) 9 = 3×3'],sol:'약수가 1, ○, ○×○ 꼴이어야 하고 ○는 약수가 2개인 수 ➜ 5×5=25, 7×7=49 (4×4=16은 약수가 5개)'},
  {q:'720의 약수 중에서 두 자리 수는 모두 몇 개인가요?',fields:[{kind:'num',ans:16,unit:'개'}],hints:['720을 두 수의 곱으로 나타내 짝을 찾아요.','10부터 99 사이에 있는 수만 세요.'],sol:'10, 12, 15, 16, 18, 20, 24, 30, 36, 40, 45, 48, 60, 72, 80, 90 ➜ 16개'},
  {q:'㉮ 조명은 4초 동안 켜졌다가 2초 동안 꺼지고, ㉯ 조명은 6초 동안 켜졌다가 3초 동안 꺼집니다. 두 조명이 오후 8시에 동시에 켜졌다면, 그 이후 <b>10번째로</b> 동시에 켜지는 시각은?',fields:[{label:'오후 8시',kind:'num',ans:3,unit:'분'},{kind:'num',ans:0,unit:'초'}],hints:['㉮는 6초마다, ㉯는 9초마다 켜져요.','6과 9의 최소공배수 × 10'],sol:'6과 9의 최소공배수 18초 ➜ 18×10 = 180초 = 3분 ➜ 오후 8시 3분 0초'},
  {q:'504의 약수 중에서 세 자리 수는 모두 몇 개인가요?',fields:[{kind:'num',ans:4,unit:'개'}],hints:['작은 약수를 찾으면 짝인 큰 약수가 나와요.','504÷○가 세 자리 수가 되려면 ○는 1부터 5 사이예요.'],sol:'504=1×504=2×252=3×168=4×126 ➜ 504, 252, 168, 126 ➜ 4개'},
];
function renderTop(){
  app.append(h('section',{class:'lesson-head',style:'--c:var(--ink)'},h('div',{class:'kicker'},'최상위 도전'),h('h1',{},'여러 개념을 엮어 생각하기'),h('p',{},'바로 풀이를 보지 말고, 힌트를 한 단계씩 열어 보세요. 막히면 앞의 심화 유형으로 돌아가도 좋아요.')));
  const tl=h('div');TOP.forEach((p,i)=>{p.id='top-'+(i+1);tl.append(renderProblem(p,i+1,{color:'var(--ink)'}))});
  app.append(tl,gradeAllBar(()=>[...tl.children],'최상위 도전'));
}

/* ============================================================
   서술형
   ============================================================ */
const ESSAY=[
  {title:'배수와 약수의 관계 이용하기',q:'48은 ■의 배수입니다. ■에 들어갈 수 있는 수 중에서 세 번째로 큰 수를 구하려고 합니다.',
    steps:[{p:'48과 ■의 관계를 약수와 배수로 설명해 보세요.',choice:['■는 48의 약수입니다.','■는 48의 배수입니다.'],ans:0,pt:2},{p:'■에 들어갈 수 있는 수를 모두 구하세요.',set:[1,2,3,4,6,8,12,16,24,48],pt:2},{p:'세 번째로 큰 수는?',num:16,pt:1}],
    model:'48이 ■의 배수이므로 ■는 48의 약수입니다. 48의 약수는 1, 2, 3, 4, 6, 8, 12, 16, 24, 48이므로 세 번째로 큰 수는 16입니다.'},
  {title:'약수의 합과 배수',q:'두 수 ㉠과 ㉡의 차를 구하려고 합니다.<div class="cond">㉠ 18의 모든 약수의 합 &nbsp; ㉡ 50에 가장 가까운 7의 배수</div>',
    steps:[{p:'㉠을 구하세요.',num:39,pt:2},{p:'㉡을 구하세요.',num:49,pt:2},{p:'㉠과 ㉡의 차는?',num:10,pt:2}],
    model:'18의 약수는 1, 2, 3, 6, 9, 18이므로 ㉠=1+2+3+6+9+18=39입니다. 50에 가까운 7의 배수는 49(차 1)와 56(차 6)이므로 ㉡=49입니다. 따라서 차는 49−39=10입니다.'},
  {title:'최소공배수로 공배수 개수 구하기',q:'200보다 작은 수 중에서 6과 10의 공배수는 모두 몇 개인지 최소공배수를 이용하여 구하려고 합니다.',
    steps:[{p:'6과 10의 최소공배수는?',num:30,pt:2},{p:'6과 10의 공배수를 200보다 작은 수까지 모두 쓰세요.',set:[30,60,90,120,150,180],pt:2},{p:'모두 몇 개?',num:6,pt:2}],
    model:'6과 10의 최소공배수는 30입니다. 공배수는 최소공배수의 배수이므로 30, 60, 90, 120, 150, 180이고, 200보다 작은 수는 모두 6개입니다.'},
  {title:'최대공약수의 활용',q:'사탕 72개와 초콜릿 54개를 최대한 많은 학생에게 남김없이 똑같이 나누어 주려고 합니다. 한 학생이 사탕과 초콜릿을 각각 몇 개씩 받을 수 있나요?',
    steps:[{p:'어떤 방법으로 학생 수를 구하나요?',choice:['72와 54의 최대공약수를 구합니다.','72와 54의 최소공배수를 구합니다.'],ans:0,pt:2},{p:'최대 몇 명에게 나누어 줄 수 있나요?',num:18,pt:2},{p:'한 학생이 받는 사탕 수는?',num:4,pt:1},{p:'한 학생이 받는 초콜릿 수는?',num:3,pt:1}],
    model:'남김없이 똑같이, 최대한 많은 학생에게 나누어 주므로 72와 54의 최대공약수를 구합니다. 2)72 54, 3)36 27, 3)12 9 → 4 3 이므로 최대공약수는 2×3×3=18입니다. 18명에게 나누어 주면 사탕은 72÷18=4(개), 초콜릿은 54÷18=3(개)씩 받습니다.'},
  {title:'최소공배수의 활용',q:'㉮ 시계는 12분마다, ㉯ 시계는 20분마다 알람이 울립니다. 오후 3시 40분에 동시에 울렸다면 바로 다음번에 동시에 울리는 시각은 오후 몇 시 몇 분인가요?',
    steps:[{p:'어떤 방법으로 구하나요?',choice:['12와 20의 최대공약수를 구합니다.','12와 20의 최소공배수를 구합니다.'],ans:1,pt:2},{p:'몇 분 후에 다시 동시에 울리나요?',num:60,pt:2},{p:'시각: 오후 몇 시? (분은 다음 칸)',num:4,pt:2},{p:'몇 분?',num:40,pt:1}],
    model:'두 알람이 다시 동시에 울리는 간격은 12와 20의 최소공배수입니다. 2)12 20, 2)6 10 → 3 5 이므로 최소공배수는 2×2×3×5=60입니다. 60분=1시간 후이므로 오후 3시 40분+1시간 = 오후 4시 40분입니다.'},
];
function renderEssay(){
  app.append(h('section',{class:'lesson-head',style:'--c:var(--mint)'},h('div',{class:'kicker'},'서술형·논술형'),h('h1',{},'생각을 글로 쓰기'),h('p',{},'단계를 해결하며 풀이의 뼈대를 세우고, 마지막에 내 풀이를 문장으로 써요. 모범 풀이와 비교해 스스로 점검해요.')));
  ESSAY.forEach((E,ei)=>{
    const c=h('div',{class:'prob',style:'--c:var(--mint)'});
    const total=M.sum(E.steps.map(s=>s.pt));let got=new Set();
    const score=h('span',{class:'tag'},`0 / ${total}점`);
    c.append(score,h('div',{html:`<span class="pn">${String(ei+1).padStart(2,'0')}</span><b class="jua">${E.title}</b><p>${E.q}</p>`}));
    E.steps.forEach((s,i)=>{
      const row=h('div',{class:'cond'});row.append(h('div',{html:`(${i+1}) ${s.p} <span class="small">[${s.pt}점]</span>`}));
      const fb=h('span',{class:'small',style:'margin-left:8px'});
      const done=()=>{got.add(i);const pts=M.sum([...got].map(j=>E.steps[j].pt));score.textContent=`${pts} / ${total}점`;fb.textContent='✔';if(got.size===E.steps.length){markSolved('essay-'+ei);toast('서술형 해결! 이제 풀이를 문장으로 써 보세요');logEvent('score',{tag:'서술형 단계',q:E.title,ok:'O',answer:`${total}/${total}점`})}};
      if(s.choice){const ch=h('div',{class:'choice'});s.choice.forEach((o,j)=>ch.append(h('button',{onclick:(e)=>{[...ch.children].forEach(x=>x.classList.remove('sel'));e.target.classList.add('sel');if(j===s.ans)done();else fb.textContent='다시 생각해 보세요.'}},o)));row.append(ch,fb)}
      else{const inp=h('input',{class:'ans'+(s.set?' wide':''),placeholder:s.set?'예) 1, 2, 3':''});const b=h('button',{class:'btn small',onclick:()=>{const v=parseNums(inp.value);const ok=s.set?sameSet(v,s.set):(v.length===1&&v[0]===s.num);inp.classList.toggle('right',ok);inp.classList.toggle('wrong',!ok);if(ok)done();else fb.textContent='다시 계산해 보세요.'}},'확인');row.append(h('div',{class:'row'},inp,b,fb))}
      c.append(row);
    });
    const ta=h('textarea',{class:'note',placeholder:'위의 단계를 이어서 하나의 풀이로 써 보세요. 왜 그렇게 했는지 이유도 함께!'});ta.value=S.notes['essay-'+ei]||'';ta.addEventListener('input',()=>{S.notes['essay-'+ei]=ta.value;save()});ta.addEventListener('change',()=>{if(ta.value.trim())logEvent('note',{tag:'서술형 풀이',q:E.title,answer:ta.value})});
    const model=h('div',{class:'solbox',html:`<b class="jua">모범 풀이</b><br>${E.model}<br><br><b class="jua">스스로 점검</b><br>☐ 무엇을 구해야 하는지(약수/배수, 최대공약수/최소공배수) 썼나요?<br>☐ 계산 과정이 보이나요?<br>☐ 답에 단위를 붙였나요?`});
    c.append(h('div',{class:'jua',style:'margin-top:10px'},'✏️ 나의 풀이 쓰기'),ta,h('div',{class:'acts'},h('button',{class:'btn ghost small',onclick:()=>{model.style.display='block'}},'모범 풀이와 비교하기')),model);
    app.append(c);
  });
}

/* ============================================================
   발견 노트
   ============================================================ */
function renderNotes(){
  app.append(h('section',{class:'lesson-head',style:'--c:var(--sun)'},h('div',{class:'kicker'},'발견 노트'),h('h1',{},'내가 찾은 규칙 모아 보기'),h('p',{},'탐구하며 쓴 글이 모여 있어요. 친구나 선생님께 보여 주고 이야기 나눠 보세요.')));
  const labels={'divisor-1':'1단계 약수','multiple-1':'2단계 배수','relation-1':'3단계 관계','gcd-1':'4단계 공약수','lcm-1':'5단계 공배수','project-1':'6단계 해결 과정','project-2':'6단계 더 생각하기'};
  ESSAY.forEach((E,i)=>labels['essay-'+i]='서술형 '+(i+1)+' · '+E.title);
  let any=false;const all=[];
  Object.entries(labels).forEach(([k,lab])=>{const v=(S.notes[k]||'').trim();if(v){any=true;all.push(`[${lab}]\n${v}`);app.append(h('div',{class:'q-box'},h('b',{},lab),h('div',{style:'white-space:pre-wrap'},v)))}});
  if(!any) app.append(h('div',{class:'card'},'아직 쓴 발견이 없어요. 탐구 활동의 ✏️ 칸에 생각을 써 보세요!'));
  else{const fb=h('span',{class:'small'});app.append(h('div',{class:'row',style:'margin-top:12px'},h('button',{class:'btn',onclick:()=>{navigator.clipboard.writeText(all.join('\n\n')).then(()=>fb.textContent='복사했어요! 학습지나 패들렛에 붙여 넣으세요.').catch(()=>fb.textContent='복사가 막혀 있어요. 직접 선택해서 복사해 주세요.')}},'📋 노트 전체 복사'),fb))}
  app.append(h('div',{class:'row',style:'margin-top:24px'},h('button',{class:'btn ghost small',onclick:(e)=>{if(e.target.dataset.c){S={explore:{},concept:{},solved:{},notes:{}};save();route()}else{e.target.dataset.c=1;e.target.textContent='정말 지울까요? 한 번 더 누르세요'}}},'기록 모두 지우기')));
}

updateWho();ensureStudent(route);flushLog();
