# 📊 구글 스프레드시트 결과 연동 가이드

홀랜드 직업적성검사 결과가 검사 완료 시 자동으로 구글 스프레드시트에 기록되도록 구현되어 있습니다.

---

## 1. 현재 설정된 기본 스프레드시트 연동
현재 `src/config.js`에 설정된 기본 웹 앱 URL을 통해 테스트 결과가 전송됩니다.
- 전송 데이터:
  - 검사자 이름 (`name`)
  - 최종 결과 유형 (`result` 예: `RI형 (실제형)`)
  - 1순위 유형 (`primary`)
  - 2순위 유형 (`secondary`)
  - RIASEC 각 유형별 점수 (`scores`: R, I, A, S, E, C)
  - 검사 일시 (`date`)

---

## 2. 나만의 구글 스프레드시트 새로 만드는 방법 (선택 사항)

자신만의 구글 스프레드시트로 결과를 직접 모으고 싶으시다면 아래 절차대로 2분 안에 연동하실 수 있습니다.

### 1단계: 구글 스프레드시트 생성
1. [Google 스프레드시트](https://sheets.google.com)에 접속하여 새 스프레드시트를 만듭니다.
2. (선택) 첫 행에 제목 열을 미리 만들어두셔도 되고, 아래 스크립트가 첫 제출 시 자동으로 생성해줍니다:
   - `일시`, `이름`, `결과 유형`, `1순위`, `2순위`, `R (현실형)`, `I (탐구형)`, `A (예술형)`, `S (사회형)`, `E (진취형)`, `C (관습형)`

### 2단계: 앱스 스크립트(Apps Script) 작성
1. 스프레드시트 상단 메뉴에서 **확장 프로그램** > **Apps Script**를 클릭합니다.
2. 편집기에 있는 기존 코드를 모두 지우고, 아래 코드를 복사해서 붙여넣습니다:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 시트가 비어있을 경우 헤더 자동 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '일시',
        '이름',
        '결과 유형',
        '1순위',
        '2순위',
        'R (현실형)',
        'I (탐구형)',
        'A (예술형)',
        'S (사회형)',
        'E (진취형)',
        'C (관습형)'
      ]);
    }
    
    var scores = data.scores || {};
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    
    sheet.appendRow([
      formattedDate,
      data.name || '익명',
      data.result || (data.primary + data.secondary + '형'),
      data.primary || '',
      data.secondary || '',
      scores.R !== undefined ? scores.R : (data.score_R || 0),
      scores.I !== undefined ? scores.I : (data.score_I || 0),
      scores.A !== undefined ? scores.A : (data.score_A || 0),
      scores.S !== undefined ? scores.S : (data.score_S || 0),
      scores.E !== undefined ? scores.E : (data.score_E || 0),
      scores.C !== undefined ? scores.C : (data.score_C || 0)
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("홀랜드 직업적성검사 웹 앱이 정상 동작 중입니다.");
}
```

3. 상단 💾 **저장** 버튼을 누릅니다.

### 3단계: 웹 앱 배포
1. 우측 상단의 파란색 **배포** > **새 배포** 버튼을 클릭합니다.
2. 유형 선택 톱니바퀴 아이콘을 누르고 **웹 앱**을 선택합니다.
3. 설정을 다음과 같이 지정합니다:
   - **설명**: `홀랜드 결과 연동`
   - **다음 사용자로 실행**: **나(사용자 이메일)**
   - **액세스 권한이 있는 사용자**: **모든 사용자(Anyone)**  *(매우 중요! 로그인 없이 제출되려면 모든 사용자로 설정해야 합니다)*
4. **배포**를 클릭하고 안내에 따라 Google 계정 액세스 권한을 승인합니다.
5. 배포 완료 후 나타나는 **웹 앱 URL** (`https://script.google.com/macros/s/.../exec`)을 복사합니다.

### 4단계: 프로젝트에 URL 적용
`src/config.js` 파일의 `GOOGLE_SCRIPT_URL` 값을 복사한 새 URL로 변경해주시면 즉시 적용됩니다!
```javascript
export const CONFIG = {
  PASSCODE: '5555',
  GOOGLE_SCRIPT_URL: '새로운_웹앱_URL'
};
```
