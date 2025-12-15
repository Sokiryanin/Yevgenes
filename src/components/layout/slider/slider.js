import Swiper from 'swiper';

import { Navigation } from 'swiper/modules';

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

swiper = new Swiper('.mySwiper', {
  slidesPerView: 'auto',
  loop: true,
  // spaceBetween: 32,
  centeredSlides: true,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
});
