import {
  addTouchAttr,
  addLoadedAttr,
  isMobile,
  FLS
} from '@js/common/functions.js';

// Імпорт додаткових модулів
import { initContactForm } from './modules/contact-form.js';
import { initLangSwitch } from './modules/langSwitch.js';
import { initTranslator } from './modules/translator.js';

// Ініціалізація після завантаження
window.addEventListener('load', async () => {
  // 1. Спочатку кнопка перемикача (синхронно)
  initLangSwitch();

  // 2. Потім перекладач (асинхронно — чекаємо JSON)
  await initTranslator();

  // 3. Потім форма
  initContactForm();
});
addLoadedAttr();
