// Google Apps Script — приймає заявки з форми та дописує їх рядком у таблицю.
//
// Налаштування:
// 1. Створіть Google Sheet (або відкрийте існуючий).
// 2. Extensions -> Apps Script.
// 3. Видаліть код-заглушку, вставте вміст цього файлу, збережіть (Ctrl+S).
// 4. Deploy -> New deployment -> шестерня "Select type" -> Web app.
//    - Execute as: Me
//    - Who has access: Anyone (обов'язково "Anyone", інакше сервер
//      не зможе постити без вашого Google-акаунту)
// 5. Deploy -> дозвольте доступ (попередження "Google hasn't verified this
//    app" — це нормально для власного скрипта: Advanced -> Go to (назва
//    проєкту) -> Allow).
// 6. Скопіюйте "Web app URL" (закінчується на /exec) — це значення для
//    GOOGLE_SCRIPT_URL у змінних середовища Vercel (Project -> Settings ->
//    Environment Variables).
//
// Важливо: якщо потім зміните код тут, для оновлення живого URL треба
// Manage deployments -> Edit (олівець) -> New version -> Deploy.
//
// Дані приймаються як application/x-www-form-urlencoded (e.parameter), а не
// JSON — POST з Content-Type: application/json ламає внутрішній редирект
// Google Apps Script (script.google.com -> script.googleusercontent.com) і
// запит взагалі не доходить до doPost.

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Message']);
  }

  sheet.appendRow([
    e.parameter.timestamp || new Date().toISOString(),
    toSafeCell(e.parameter.name || ''),
    toSafeCell(e.parameter.phone || ''),
    toSafeCell(e.parameter.message || '')
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Google Sheets намагається трактувати значення, що починаються з
// + - = @ (наприклад, міжнародний номер телефону "+1 415-555-2671") як
// формулу, і показує помилку замість тексту. Апостроф на початку примусово
// робить значення текстом і сам не відображається в клітинці.
function toSafeCell(value) {
  return /^[+\-=@]/.test(value) ? "'" + value : value;
}
