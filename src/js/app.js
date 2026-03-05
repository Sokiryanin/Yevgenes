// // Підключення функціоналу "Чортоги Фрілансера"
// import {
//   addTouchAttr,
//   addLoadedAttr,
//   isMobile,
//   FLS
// } from '@js/common/functions.js';

// // Десь на початку файлу (імпорти)
// import { initContactForm } from './modules/contact-form.js';

// // В кінці файлу або після DOMContentLoaded
// initContactForm();
// addLoadedAttr();

// Підключення функціоналу "Чортоги Фрілансера"
import {
  addTouchAttr,
  addLoadedAttr,
  isMobile,
  FLS
} from '@js/common/functions.js';

// Імпорт модуля форми
import { initContactForm } from './modules/contact-form.js';

// Після повного завантаження
window.addEventListener('load', () => {
  initContactForm();
});

addLoadedAttr();
