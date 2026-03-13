import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

function initSliders() {
  if (document.querySelector('.project__slider')) {
    new Swiper('.project__slider', {
      modules: [Navigation, Pagination],

      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      speed: 600,
      spaceBetween: 8,

      // effect: 'coverflow',
      // coverflowEffect: {
      //   rotate: 30,
      //   slideShadows: false
      // },

      pagination: {
        el: '.project__bullets',
        clickable: true
      },

      navigation: {
        prevEl: '.project__arrow--left',
        nextEl: '.project__arrow--right'
      },

      breakpoints: {
        768: {
          spaceBetween: 24
        },
        992: {
          spaceBetween: 24
        }
      }
    });
  }
}

document.querySelector('[data-fls-slider]')
  ? window.addEventListener('load', initSliders)
  : null;
