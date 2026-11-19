/* ===== 엄마 설정 =====
   sheetUrl : 구글 시트 Apps Script '웹 앱' 주소 (https://script.google.com/macros/s/.../exec). 비워 두면 기록을 보내지 않아요.
   mom      : 엄마 모드 (아이 화면 미리보기 + 아이 글 보기·답장). passHash 가 비어 있으면 엄마 버튼이 보이지 않아요.
   kids     : 공부하는 아이들. passHash 는 아이별 비밀번호를 SHA-256으로 바꾼 값
              (비밀번호 자체는 여기에 쓰지 않아요). 비워 두면 비밀번호 없이 들어와요. */
window.MATHLAB_CONFIG = {
  sheetUrl: "https://script.google.com/macros/s/AKfycbxuwBjBGaWzDGx16LM0V6M1flht6k44hAfXpTvrdxvc5_1DXy7q9N95pcPRf19YzE_c6g/exec",
  kids: [
    {name: "서윤", emoji: "🐰", color: "var(--coral)", passHash: ""},
    {name: "서현", emoji: "🐻", color: "var(--sky)", passHash: ""}
  ],
  mom: {name: "엄마", emoji: "👩", passHash: ""}
};
