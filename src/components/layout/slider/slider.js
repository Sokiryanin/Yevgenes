import Swiper from 'swiper';

// import { Navigation } from 'swiper/modules';

import 'swiper/css/bundle';

// // Ініціалізація слайдерів
// function initSliders() {
//   // Список слайдерів
//   // Перевіряємо, чи є слайдер на сторінці

//   if (document.querySelector('.project__slider')) {
//     new Swiper('.project__slider', {
//       slidesPerView: '3',
//       centeredSlides: true,
//       spaceBetween: 16,
//       loop: true
//     });
//   }
// }

// document.querySelector('[data-fls-slider]')
//   ? window.addEventListener('load', initSliders)
//   : null;

// -----------------------------------------------------------------

const swiper = new Swiper('.swiper', {
  grabCursor: true,
  slidesPerView: 3,
  centeredSlides: true,
  initialSlide: 2,
  speed: 900,
  parallax: true,
  spaceBetween: 30,
  mousewheel: {
    thresholdDelta: 50
  }
});
