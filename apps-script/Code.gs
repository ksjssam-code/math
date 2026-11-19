/**
 * 수학 탐구실 기록 수집 (구글 시트 > 확장 프로그램 > Apps Script 에 붙여 넣기)
 * 배포 > 새 배포 > 유형: 웹 앱 > 실행: 나 / 액세스 권한: 모든 사용자 > 배포
 */
const LOG = '기록', SUMMARY = '아이별 현황', HEART = '마음 우체통', ACCESS = '접속 기록';
const LOG_HEAD = ['시각', '이름', '단원', '페이지', '종류', '구분', '문제/내용', '정답여부', '아이 답', '시도 횟수'];
const SUM_HEAD = ['이름', '마지막 접속', '푼 문제(정답)', '시도(전체)', '정답률', '별', '발견 노트·서술', '최근 전체 채점', '오늘 기분'];
const HEART_HEAD = ['시각', '이름', '종류', '내용'];
const ACCESS_HEAD = ['시각', '이름', '결과', '기기'];
const ACCESS_TYPES = ['security', 'login', 'visit'];
const TYPE_KO = {login: '접속', attempt: '문제 채점', star: '별 획득', note: '글쓰기', score: '점수', mood: '기분', letter: '우체통'};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const events = (JSON.parse(e.postData.contents).events) || [];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const access = events.filter(ev => ACCESS_TYPES.indexOf(ev.type) >= 0);
    const study = events.filter(ev => ev.type !== 'letter' && ev.type !== 'mood' && ACCESS_TYPES.indexOf(ev.type) < 0);
    if (access.length) {
      const as = sheet_(ss, ACCESS, ACCESS_HEAD);
      const start = as.getLastRow() + 1;
      const rows = access.map(ev => [new Date(ev.time), ev.name,
        ev.type === 'security' ? ev.tag : (ev.type === 'login' ? '이름 선택' : '접속'), ev.answer || '']);
      as.getRange(start, 1, rows.length, ACCESS_HEAD.length).setValues(rows);
      rows.forEach((r, i) => { if (r[2] === '비밀번호 틀림') as.getRange(start + i, 1, 1, ACCESS_HEAD.length).setBackground('#FFE5E6'); });
    }
    const heart = events.filter(ev => ev.type === 'letter' || ev.type === 'mood');
    if (study.length) {
      const log = sheet_(ss, LOG, LOG_HEAD);
      const rows = study.map(ev => [new Date(ev.time), ev.name, ev.unit, ev.page, TYPE_KO[ev.type] || ev.type,
        ev.tag || '', ev.q || '', ev.ok || '', String(ev.answer || '').slice(0, 1000), ev.tries || '']);
      log.getRange(log.getLastRow() + 1, 1, rows.length, LOG_HEAD.length).setValues(rows);
    }
    if (heart.length) {
      const hs = sheet_(ss, HEART, HEART_HEAD);
      const rows = heart.map(ev => [new Date(ev.time), ev.name,
        ev.type === 'mood' ? '기분 ' + (ev.q || '') + ' ' + (ev.tag || '') : (ev.tag || '편지'), String(ev.answer || '')]);
      hs.getRange(hs.getLastRow() + 1, 1, rows.length, HEART_HEAD.length).setValues(rows).setWrap(true);
    }
    updateSummary_(ss, events);
    return ContentService.createTextOutput(JSON.stringify({ok: true}));
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: String(err)}));
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return ContentService.createTextOutput('수학 탐구실 기록 수집기가 작동 중이에요.'); }

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
    if (!ev.name) return;
    let r = index[ev.name];
    if (r === undefined) { data.push([ev.name, '', 0, 0, '', 0, 0, '', '']); r = data.length - 1; index[ev.name] = r; }
    const row = data[r];
    row[1] = new Date(ev.time);
    if (ev.type === 'attempt') { row[3] = Number(row[3]) + 1; if (ev.ok === 'O') row[2] = Number(row[2]) + 1; }
    if (ev.type === 'star') row[5] = Number(row[5]) + 1;
    if (ev.type === 'note') row[6] = Number(row[6]) + 1;
    if (ev.type === 'score' && ev.tag === '전체 채점') row[7] = ev.q + ' ' + ev.answer;
    if (ev.type === 'mood') row[8] = (ev.q || '') + ' ' + (ev.tag || '');
    row[4] = row[3] ? Math.round(row[2] / row[3] * 100) + '%' : '';
  });
  const body = data.slice(1);
  if (body.length) sh.getRange(2, 1, body.length, SUM_HEAD.length).setValues(body);
}
