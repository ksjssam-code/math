/* ===== 엄마 설정 =====
   sheetUrl : 구글 시트 Apps Script '웹 앱' 주소. 기록·비밀번호 확인·답장이 모두 여기로 가요.
   readAloud: 1학년 화면의 🔊 읽어 주기. false 면 꺼져요 (읽기 연습). 다시 켜려면 true
   kids, mom: 이름과 아이콘만 적어요. 비밀번호는 구글 시트의 '비밀번호' 탭에서 정하고 바꿔요.
              (이름을 바꾸면 시트 '비밀번호' 탭의 이름도 똑같이 바꿔 주세요.) */
window.MATHLAB_CONFIG = {
  readAloud: false,
  sheetUrl: "https://script.google.com/macros/s/AKfycbxuwBjBGaWzDGx16LM0V6M1flht6k44hAfXpTvrdxvc5_1DXy7q9N95pcPRf19YzE_c6g/exec",
  kids: [
    {name: "서윤", emoji: "🐰", color: "var(--coral)"},
    {name: "서현", emoji: "🐻", color: "var(--sky)"}
  ],
  mom: {name: "엄마", emoji: "👩"}
};
