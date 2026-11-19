/**
 * 수학 탐구실 (구글 시트 > 확장 프로그램 > Apps Script)
 * 코드를 바꾼 뒤에는: 배포 > 배포 관리 > ✏️ 편집 > 버전: 새 버전 > 배포  (주소가 그대로 유지돼요)
 * 비밀번호는 시트의 '비밀번호' 탭에서 바꿔요. 바꾸면 아이 기기에서 다시 비밀번호를 물어요.
 */
const LOG = '기록', SUMMARY = '아이별 현황', WRITE = '아이 글', ACCESS = '접속 기록', PW = '비밀번호';
const LOG_HEAD = ['시각', '이름', '단원', '페이지', '종류', '구분', '문제/내용', '정답여부', '아이 답', '시도 횟수'];
const SUM_HEAD = ['이름', '마지막 접속', '푼 문제(정답)', '시도(전체)', '정답률', '별', '글 쓴 수', '최근 전체 채점', '오늘 기분'];
const WRITE_HEAD = ['시각', '이름', '종류', '주제', '아이 글', '엄마 답장', '답장 시각', 'ID'];
const ACCESS_HEAD = ['시각', '이름', '결과', '기기'];
const PW_HEAD = ['이름', '비밀번호', '설명'];
const PEOPLE = [['서윤', '', '서윤이 비밀번호'], ['서현', '', '서현이 비밀번호'], ['엄마', '', '엄마 모드 비밀번호 (아이들이 모르게)']];
const ACCESS_TYPES = ['login', 'visit'];
const WRITE_TYPES = ['note', 'letter', 'mood'];
const TYPE_KO = {attempt: '문제 채점', star: '별 획득', score: '점수'};
const MAX_FAILS = 5, LOCK_SEC = 600;

/** 처음 한 번 ▶ 실행: '비밀번호' 탭을 만들어요. 그다음 시트에서 비밀번호를 적어 주세요. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  pwSheet_(ss);
  [LOG, WRITE, SUMMARY, ACCESS].forEach(n => sheet_(ss, n, {기록: LOG_HEAD, '아이 글': WRITE_HEAD, '아이별 현황': SUM_HEAD, '접속 기록': ACCESS_HEAD}[n]));
}

function pwSheet_(ss) {
  let sh = ss.getSheetByName(PW);
  if (!sh) {
    sh = ss.insertSheet(PW, 0);
    sh.getRange(1, 1, 1, 3).setValues([PW_HEAD]).setFontWeight('bold').setBackground('#FFE5E6');
    sh.getRange(2, 1, PEOPLE.length, 3).setValues(PEOPLE);
    sh.getRange('B:B').setNumberFormat('@');   // 0107 처럼 0으로 시작해도 그대로
    sh.setFrozenRows(1);
    sh.setColumnWidth(3, 260);
  }
  return sh;
}
function passwordOf_(ss, who) {
  const sh = pwSheet_(ss);
  const data = sh.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]).trim() === who) {
      const v = data[r][1];
      if (v === '' || v === null) return '';
      return typeof v === 'number' ? String(v) : String(v).trim();
    }
  }
  return null;
}
function samePw_(stored, given) {
  if (!stored) return false;
  if (stored === given) return true;
  return /^\d+$/.test(stored) && /^\d+$/.test(given) && Number(stored) === Number(given);   // 0이 사라진 경우까지
}
function salt_() {
  const p = PropertiesService.getScriptProperties();
  let s = p.getProperty('SALT');
  if (!s) { s = Utilities.getUuid(); p.setProperty('SALT', s); }
  return s;
}
function hash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}
function tokenFor_(who, pw) { return hash_('tok|' + who + '|' + String(Number(pw) || pw) + '|' + salt_()); }
function validToken_(ss, who, token) {
  const pw = passwordOf_(ss, who);
  return !!(pw && token && tokenFor_(who, pw) === token);
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function access_(ss, who, result, device) {
  const sh = sheet_(ss, ACCESS, ACCESS_HEAD);
  const r = sh.getLastRow() + 1;
  sh.getRange(r, 1, 1, 4).setValues([[new Date(), who, result, device || '']]);
  if (/틀림|잠김|없는/.test(result)) sh.getRange(r, 1, 1, 4).setBackground('#FFE5E6');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (body.action) return json_(action_(ss, body));
    record_(ss, body.events || []);
    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}

function action_(ss, b) {
  const who = String(b.who || '');
  if (b.action === 'login') {
    const cache = CacheService.getScriptCache();
    const fk = 'fail-' + who;
    const fails = Number(cache.get(fk) || 0);
    if (fails >= MAX_FAILS) { access_(ss, who, '잠김 (여러 번 틀림)', b.device); return {ok: false, error: '여러 번 틀려서 10분 동안 잠겼어요.'}; }
    const pw = passwordOf_(ss, who);
    if (pw === null) { access_(ss, who, '없는 이름', b.device); return {ok: false, error: '등록되지 않은 이름이에요.'}; }
    if (pw === '') return {ok: false, error: '아직 비밀번호가 없어요. 엄마에게 말해 주세요.'};
    if (!samePw_(pw, String(b.pw || '').trim())) {
      cache.put(fk, String(fails + 1), LOCK_SEC);
      access_(ss, who, '비밀번호 틀림', b.device);
      return {ok: false, error: `비밀번호가 달라요. (${fails + 1}/${MAX_FAILS})`};
    }
    cache.remove(fk);
    access_(ss, who, '비밀번호 통과', b.device);
    return {ok: true, token: tokenFor_(who, pw)};
  }
  if (!validToken_(ss, who, b.token)) return {ok: false, invalid: true, error: '다시 로그인해 주세요.'};
  if (b.action === 'check') return {ok: true};
  if (b.action === 'list') {
    const sh = ss.getSheetByName(WRITE);
    if (!sh || sh.getLastRow() < 2) return {ok: true, rows: []};
    const data = sh.getRange(2, 1, sh.getLastRow() - 1, WRITE_HEAD.length).getValues();
    let rows = data.map(r => ({time: r[0], name: r[1], kind: r[2], topic: r[3], text: r[4], reply: r[5], replyTime: r[6], id: String(r[7])}));
    if (who !== '엄마') rows = rows.filter(r => r.name === who);
    return {ok: true, rows: rows.filter(r => r.id).reverse().slice(0, 300)};
  }
  if (b.action === 'reply') {
    if (who !== '엄마') return {ok: false, error: '엄마만 답장할 수 있어요.'};
    const sh = sheet_(ss, WRITE, WRITE_HEAD);
    const ids = sh.getRange(1, 8, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    const r = ids.indexOf(String(b.id));
    if (r < 1) return {ok: false, error: '글을 찾지 못했어요.'};
    sh.getRange(r + 1, 6, 1, 2).setValues([[String(b.text || ''), new Date()]]);
    return {ok: true};
  }
  return {ok: false, error: '알 수 없는 요청'};
}

function record_(ss, events) {
  const access = events.filter(ev => ACCESS_TYPES.indexOf(ev.type) >= 0);
  if (access.length) {
    const sh = sheet_(ss, ACCESS, ACCESS_HEAD);
    const rows = access.map(ev => [new Date(ev.time), ev.name, ev.type === 'login' ? '이름 선택' : '접속', ev.answer || '']);
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, ACCESS_HEAD.length).setValues(rows);
  }
  const writes = events.filter(ev => WRITE_TYPES.indexOf(ev.type) >= 0);
  if (writes.length) {
    const sh = sheet_(ss, WRITE, WRITE_HEAD);
    const rows = writes.map(ev => [new Date(ev.time), ev.name,
      ev.type === 'mood' ? '기분 ' + (ev.q || '') + ' ' + (ev.tag || '') : (ev.tag || '편지'),
      ev.type === 'note' ? (ev.q || '') : '', String(ev.answer || ''), '', '', ev.id || '']);
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, WRITE_HEAD.length).setValues(rows);
  }
  const study = events.filter(ev => ['attempt', 'star', 'score'].indexOf(ev.type) >= 0);
  if (study.length) {
    const sh = sheet_(ss, LOG, LOG_HEAD);
    const rows = study.map(ev => [new Date(ev.time), ev.name, ev.unit, ev.page, TYPE_KO[ev.type] || ev.type,
      ev.tag || '', ev.q || '', ev.ok || '', String(ev.answer || '').slice(0, 1000), ev.tries || '']);
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, LOG_HEAD.length).setValues(rows);
  }
  updateSummary_(ss, events);
}

function doGet() { return ContentService.createTextOutput('수학 탐구실 기록 수집기가 작동 중이에요.'); }

function sheet_(ss, name, head) {
  let sh = ss.getSheetByName(name);
  if (!sh && name === LOG) {
    const first = ss.getSheets().filter(s => s.getName() !== PW)[0];
    if (first && first.getLastRow() <= 1) { first.clear(); first.setName(LOG); sh = first; }
  }
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(head);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#FFF2CF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function updateSummary_(ss, events) {
  const sh = sheet_(ss, SUMMARY, SUM_HEAD);
  const data = sh.getDataRange().getValues();
  const index = {};
  for (let r = 1; r < data.length; r++) index[data[r][0]] = r;
  events.forEach(ev => {
    if (!ev.name || ev.name === '엄마') return;
    let r = index[ev.name];
    if (r === undefined) { data.push([ev.name, '', 0, 0, '', 0, 0, '', '']); r = data.length - 1; index[ev.name] = r; }
    const row = data[r];
    row[1] = new Date(ev.time);
    if (ev.type === 'attempt') { row[3] = Number(row[3]) + 1; if (ev.ok === 'O') row[2] = Number(row[2]) + 1; }
    if (ev.type === 'star') row[5] = Number(row[5]) + 1;
    if (ev.type === 'note' || ev.type === 'letter') row[6] = Number(row[6]) + 1;
    if (ev.type === 'score' && ev.tag === '전체 채점') row[7] = ev.q + ' ' + ev.answer;
    if (ev.type === 'mood') row[8] = (ev.q || '') + ' ' + (ev.tag || '');
    row[4] = row[3] ? Math.round(row[2] / row[3] * 100) + '%' : '';
  });
  const body = data.slice(1);
  if (body.length) sh.getRange(2, 1, body.length, SUM_HEAD.length).setValues(body);
}
