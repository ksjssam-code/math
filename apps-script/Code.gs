/**
 * 수학 탐구실 기록 수집 (구글 시트 > 확장 프로그램 > Apps Script)
 * 코드를 바꾼 뒤에는: 배포 > 배포 관리 > ✏️ 편집 > 버전: 새 버전 > 배포  (주소가 그대로 유지돼요)
 */
// 글 읽기 열쇠 (비밀번호에서 만든 값의 해시라 비밀번호를 알 수 없어요)
const READERS = {
  // __READERS__
};

const LOG = '기록', SUMMARY = '아이별 현황', WRITE = '아이 글', ACCESS = '접속 기록';
const LOG_HEAD = ['시각', '이름', '단원', '페이지', '종류', '구분', '문제/내용', '정답여부', '아이 답', '시도 횟수'];
const SUM_HEAD = ['이름', '마지막 접속', '푼 문제(정답)', '시도(전체)', '정답률', '별', '글 쓴 수', '최근 전체 채점', '오늘 기분'];
const WRITE_HEAD = ['시각', '이름', '종류', '주제', '아이 글', '엄마 답장', '답장 시각', 'ID'];
const ACCESS_HEAD = ['시각', '이름', '결과', '기기'];
const ACCESS_TYPES = ['security', 'login', 'visit'];
const WRITE_TYPES = ['note', 'letter', 'mood'];
const TYPE_KO = {attempt: '문제 채점', star: '별 획득', score: '점수'};

function hash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}
function authorized_(who, key) { return !!(who && key && READERS[who] && hash_(key) === READERS[who]); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents);
    const events = body.events || [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const access = events.filter(ev => ACCESS_TYPES.indexOf(ev.type) >= 0);
    if (access.length) {
      const sh = sheet_(ss, ACCESS, ACCESS_HEAD);
      const start = sh.getLastRow() + 1;
      const rows = access.map(ev => [new Date(ev.time), ev.name,
        ev.type === 'security' ? ev.tag : (ev.type === 'login' ? '이름 선택' : '접속'), ev.answer || '']);
      sh.getRange(start, 1, rows.length, ACCESS_HEAD.length).setValues(rows);
      rows.forEach((r, i) => { if (r[2] === '비밀번호 틀림') sh.getRange(start + i, 1, 1, ACCESS_HEAD.length).setBackground('#FFE5E6'); });
    }

    const writes = events.filter(ev => WRITE_TYPES.indexOf(ev.type) >= 0);
    if (writes.length) {
      const sh = sheet_(ss, WRITE, WRITE_HEAD);
      const rows = writes.map(ev => [new Date(ev.time), ev.name,
        ev.type === 'mood' ? '기분 ' + (ev.q || '') + ' ' + (ev.tag || '') : (ev.tag || '편지'),
        ev.type === 'mood' ? '' : (ev.type === 'note' ? (ev.q || '') : ''),
        String(ev.answer || ''), '', '', ev.id || '']);
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, WRITE_HEAD.length).setValues(rows);
    }

    const replies = events.filter(ev => ev.type === 'reply');
    if (replies.length && authorized_(body.who, body.key) && body.who === '엄마') {
      const sh = sheet_(ss, WRITE, WRITE_HEAD);
      const ids = sh.getRange(1, 8, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
      replies.forEach(ev => {
        const r = ids.indexOf(String(ev.id));
        if (r > 0) sh.getRange(r + 1, 6, 1, 2).setValues([[ev.answer || '', new Date(ev.time)]]);
      });
    }

    const study = events.filter(ev => ['attempt', 'star', 'score'].indexOf(ev.type) >= 0);
    if (study.length) {
      const sh = sheet_(ss, LOG, LOG_HEAD);
      const rows = study.map(ev => [new Date(ev.time), ev.name, ev.unit, ev.page, TYPE_KO[ev.type] || ev.type,
        ev.tag || '', ev.q || '', ev.ok || '', String(ev.answer || '').slice(0, 1000), ev.tries || '']);
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, LOG_HEAD.length).setValues(rows);
    }
    updateSummary_(ss, events);
    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}

// 아이 글 읽기: 엄마는 전체, 아이는 자기 글(답장 포함)
function doGet(e) {
  const p = e.parameter || {};
  if (!p.who) return ContentService.createTextOutput('수학 탐구실 기록 수집기가 작동 중이에요.');
  if (!authorized_(p.who, p.key)) return json_({ok: false, error: '권한 없음'});
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WRITE);
  if (!sh || sh.getLastRow() < 2) return json_({ok: true, rows: []});
  const data = sh.getRange(2, 1, sh.getLastRow() - 1, WRITE_HEAD.length).getValues();
  let rows = data.map(r => ({time: r[0], name: r[1], kind: r[2], topic: r[3], text: r[4], reply: r[5], replyTime: r[6], id: String(r[7])}));
  if (p.who !== '엄마') rows = rows.filter(r => r.name === p.who);
  rows = rows.filter(r => r.id).reverse().slice(0, 300);
  return json_({ok: true, rows: rows});
}

function sheet_(ss, name, head) {
  let sh = ss.getSheetByName(name);
  if (!sh && name === LOG) {
    const first = ss.getSheets()[0];
    if (first.getLastRow() <= 1) { first.clear(); first.setName(LOG); sh = first; }
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
    if (!ev.name || ev.name === '엄마' || ev.type === 'reply') return;
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
