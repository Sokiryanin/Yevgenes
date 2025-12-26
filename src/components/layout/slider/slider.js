import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

// Ініціалізація слайдерів
function initSliders() {
  if (document.querySelector('.project__slider')) {
    new Swiper('.project__slider', {
      modules: [Navigation, Pagination],
      slidesPerView: 'auto',
      centeredSlides: true,
      grabCursor: true,
      spaceBetween: -11,
      speed: 800,
      loop: true,

      // Пагінація

      pagination: {
        el: '.project__bullets',
        clickable: true
      },

      // Кнопки "вліво/вправо"
      navigation: {
        prevEl: '.project__arrow--left',
        nextEl: '.project__arrow--right'
      },

      on: {}
    });
  }
}
document.querySelector('[data-fls-slider]')
  ? window.addEventListener('load', initSliders)
  : null;
