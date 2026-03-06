// Модуль перемикача мови
// (c) YevGenes

export function initLangSwitch() {
  const btn = document.getElementById('lang-switch');
  if (!btn) return;

  let currentLang = localStorage.getItem('lang') || 'en';

  const update = () => {
    btn.classList.toggle('--uk', currentLang === 'ua');
    document.documentElement.lang = currentLang;
  };

  update();

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ua' : 'en';
    localStorage.setItem('lang', currentLang);
    update();

    // Відправляємо подію для i18n
    document.dispatchEvent(
      new CustomEvent('langSwitch', {
        detail: { lang: currentLang }
      })
    );
  });
}
