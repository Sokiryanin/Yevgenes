import {
  addTouchAttr,
  addLoadedAttr,
  isMobile,
  FLS
} from '@js/common/functions.js';

// Імпорт додаткових модулів
import { initContactForm } from './modules/contact-form.js';
import { initLangSwitch } from './modules/langSwitch.js';

// Ініціалізація після завантаження
window.addEventListener('load', () => {
  initLangSwitch();

  initContactForm();
});

addLoadedAttr();
