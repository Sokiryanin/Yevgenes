// Модуль перемикача мови
// (c) YevGenes

export function initLangSwitch() {
  const btn = document.getElementById('lang-switch');
  if (!btn) return;

  // Визначаємо поточну мову з URL
  const isUk = window.location.pathname.startsWith('/ua/');

  // Стан кнопки
  btn.classList.toggle('--uk', isUk);

  // Клік — переходимо на іншу мову
  btn.addEventListener('click', () => {
    if (isUk) {
      // Зараз UA — переходимо на EN
      window.location.href = '/';
    } else {
      // Зараз EN — переходимо на UA
      window.location.href = '/ua/';
    }
  });
}
