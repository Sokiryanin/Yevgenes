// // ============================================
// // Модуль перекладача
// // (c) YevGenes
// //
// // Забезпечує динамічну зміну мови сайту
// // без перезавантаження сторінки
// // ============================================

// class Translator {
//   /**
//    * Конструктор класу Translator
//    * Ініціалізує початкові значення
//    */
//   constructor() {
//     // Поточна мова: беремо з localStorage або 'en' за замовчуванням
//     this.currentLang = localStorage.getItem('lang') || 'en';

//     // Об'єкт з перекладами (заповнюється після завантаження JSON)
//     this.translations = {};

//     // Мова за замовчуванням (fallback)
//     this.defaultLang = 'en';
//   }

//   /**
//    * Ініціалізація перекладача
//    * Завантажує переклади та оновлює DOM
//    * Викликається один раз при завантаженні сторінки
//    */
//   async init() {
//     // Завантажуємо JSON файл з перекладами
//     await this.loadTranslations(this.currentLang);

//     // Оновлюємо всі елементи з data-i18n атрибутами
//     this.updateDOM();

//     // Встановлюємо атрибут lang на <html>
//     document.documentElement.lang = this.currentLang;
//   }

//   /**
//    * Завантаження JSON файлу з перекладами
//    * @param {string} lang - Код мови ('en', 'ua')
//    */
//   async loadTranslations(lang) {
//     try {
//       // Робимо запит до JSON файлу
//       const response = await fetch(`/locales/${lang}.json`);

//       // Перевіряємо чи запит успішний
//       if (!response.ok) throw new Error('Failed to load');

//       // Парсимо JSON та зберігаємо в this.translations
//       this.translations = await response.json();

//       // Оновлюємо поточну мову
//       this.currentLang = lang;
//     } catch (error) {
//       // Якщо не вдалося завантажити — пробуємо мову за замовчуванням
//       console.warn(
//         `⚠️ Failed to load ${lang}.json, falling back to ${this.defaultLang}`
//       );

//       // Уникаємо нескінченного циклу
//       if (lang !== this.defaultLang) {
//         await this.loadTranslations(this.defaultLang);
//       }
//     }
//   }

//   /**
//    * Перемикання мови
//    * Викликається при кліку на кнопку перемикача
//    * @param {string} lang - Код нової мови ('en', 'ua')
//    */
//   async switchLang(lang) {
//     // Якщо мова та сама — нічого не робимо
//     if (lang === this.currentLang) return;

//     // Завантажуємо нові переклади
//     await this.loadTranslations(lang);

//     // Зберігаємо вибір в localStorage
//     localStorage.setItem('lang', lang);

//     // Оновлюємо атрибут lang на <html>
//     document.documentElement.lang = lang;

//     // Оновлюємо всі тексти на сторінці
//     this.updateDOM();

//     console.log('🌐 Language switched to:', lang.toUpperCase());
//   }

//   /**
//    * Оновлення DOM елементів
//    * Знаходить всі елементи з data-i18n атрибутами
//    * та замінює їх текст на переклад
//    */
//   updateDOM() {
//     // Текст
//     document.querySelectorAll('[data-i18n]').forEach((el) => {
//       const text = this.t(el.dataset.i18n);
//       if (text) el.textContent = text;
//     });

//     // HTML (для складної розмітки)
//     document.querySelectorAll('[data-i18n-html]').forEach((el) => {
//       const html = this.t(el.dataset.i18nHtml);
//       if (html) el.innerHTML = html;
//     });

//     // Placeholder
//     document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
//       const text = this.t(el.dataset.i18nPlaceholder);
//       if (text) el.placeholder = text;
//     });
//   }

//   /**
//    * Отримання перекладу за ключем
//    * Підтримує вкладені ключі через крапку
//    * @param {string} key - Ключ перекладу, наприклад "nav.projects"
//    * @returns {string|undefined} - Переклад або undefined
//    *
//    * Приклад:
//    *   this.translations = { nav: { projects: "Проєкти" } }
//    *   this.get("nav.projects") → "Проєкти"
//    */
//   get(key) {
//     // "nav.projects" → ["nav", "projects"]
//     // Потім поступово заглиблюємось: obj.nav → obj.nav.projects
//     return key.split('.').reduce((obj, k) => obj?.[k], this.translations);
//   }

//   /**
//    * Короткий метод для отримання перекладу
//    * Зручний для використання в інших модулях
//    * @param {string} key - Ключ перекладу
//    * @returns {string} - Переклад або сам ключ (якщо не знайдено)
//    *
//    * Приклад:
//    *   translator.t("nav.projects") → "Проєкти"
//    *   translator.t("unknown.key") → "unknown.key"
//    */
//   t(key) {
//     return this.get(key) || key;
//   }
// }

// // ============================================
// // Експорт
// // ============================================

// // Створюємо єдиний екземпляр (singleton)
// // Це гарантує, що всюди використовується один і той самий об'єкт
// export const translator = new Translator();

// /**
//  * Функція ініціалізації перекладача
//  * Викликається в app.js при завантаженні сторінки
//  *
//  * Приклад використання:
//  *   import { initTranslator } from './modules/translator.js';
//  *   await initTranslator();
//  */
// export async function initTranslator() {
//   // Ініціалізуємо перекладач
//   await translator.init();

//   // Слухаємо подію langSwitch від кнопки перемикача
//   // Коли користувач натискає кнопку — викликається switchLang
//   document.addEventListener('langSwitch', async (e) => {
//     await translator.switchLang(e.detail.lang);
//   });
// }

// ============================================
// Модуль перекладача (без JSON, на об'єкті)
// (c) YevGenes
// ============================================

const translations = {
  en: {
    nav: {
      projects: 'Projects',
      services: 'Services',
      contact: 'Contact'
    },
    hero: {
      subtitle: '{TAILORED TO YOUR NEEDS}',
      titleTop: 'Development of',
      word1: 'CUSTOM',
      word2: 'WEBSITE',
      bottom: 'from scratch'
    },
    project: {
      projectLabel: '{Development}',
      projectTitleFirst: 'Services Landing',
      projectTitleSecond: 'Multipage site',
      projectTitleThird: 'Water Tracker',
      projectVisit: 'Visit site'
    },
    services: {
      title: 'What <span>we </span>can <span>do?</span>',
      design: {
        label: '{Thoughtful}',
        title: 'Web design',
        text: 'Designing clear, simple, and intuitive interfaces that provide a convenient user experience.'
      },
      development: {
        label: '{Reliable}',
        title: 'Development',
        text: 'Custom web development solutions that meet your business needs and are based on best practices.'
      },
      advertising: {
        label: '{Effective}',
        title: 'Advertising',
        text: 'Proven Google Ads and SEO strategies that improve your online performance and deliver fast and long-lasting results.'
      }
    },
    skills: {
      store: 'Online-stores',
      app: 'Web App',
      landing: 'Landing Page',
      card: 'Business Card',
      portfolio: 'Portfolio',
      blog: 'Blog',
      info: 'Informational'
    },
    cta: {
      title: 'Ready <span>to discuss?</span>',
      text: "Let's talk about how we can create a website that not only looks great, but also drives real growth for your business.",
      formTitle: 'Fill the form <span>to discuss the project</span>'
    },
    form: {
      name: 'Your name',
      phone: 'Phone',
      submit: 'Submit',
      error: 'You must fill in the highlighted fields to submit'
    },
    popup: {
      title: 'Thank you,',
      text: 'We will contact you shortly to discuss the details of the project.'
    },
    footer: {
      phone: '{Phone}',
      telegram: '{Telegram}',
      email: '{Email}'
    }
  },

  ua: {
    nav: {
      projects: 'Проєкти',
      services: 'Послуги',
      contact: 'Контакти'
    },
    hero: {
      subtitle: '{ПІД ВАШІ ПОТРЕБИ}',
      titleTop: 'Розробка',
      word1: 'КАСТОМ',
      word2: 'ВЕБСАЙТІВ',
      bottom: 'з нуля'
    },
    project: {
      projectLabel: '{Розробка}',
      projectTitleFirst: 'Сервіс Лендінг',
      projectTitleSecond: 'Лендінг дизайнера',
      projectTitleThird: 'Водний Трекер',
      projectVisit: 'Перейти'
    },
    services: {
      title: 'Що <span>ми </span>робимо<span>?</span>',
      design: {
        label: '{Продуманий}',
        title: 'Веб-дизайн',
        text: 'Зрозумілих, простих та зручних інтерфейсів для комфортного використання вашими клієнтами.'
      },
      development: {
        label: '{Надійну}',
        title: 'Розробку',
        text: 'Індивідуальних рішень для задоволення потреб вашого бізнесу. Базується на найкращих практиках.'
      },
      advertising: {
        label: '{Ефективну}',
        title: 'Рекламу',
        text: 'Google Ads та SEO для покращення вашої ефективності в інтернеті, швидких та тривалих результатів.'
      }
    },
    skills: {
      store: 'Онлайн-магазини',
      app: 'Веб-додатки',
      landing: 'Лендінги',
      card: 'Сайт-візитівки',
      portfolio: 'Портфоліо',
      blog: 'Блоги',
      info: 'Інформаційні'
    },
    cta: {
      title: 'Готові <span>обговорити?</span>',
      text: 'Давайте поговоримо про те, як ми можемо створити сайт, який не тільки виглядає чудово, але й забезпечує реальне зростання вашого бізнесу.',
      formTitle: 'Заповніть форму <span>щоб обговорити проєкт</span>'
    },
    form: {
      name: "Ваше ім'я",
      phone: 'Телефон',
      submit: 'Надіслати',
      error: 'Заповніть виділені поля для відправки'
    },
    popup: {
      title: 'Дякуємо,',
      text: "Ми зв'яжемося з вами найближчим часом для обговорення деталей проєкту."
    },
    footer: {
      phone: '{Телефон}',
      telegram: '{Телеграм}',
      email: '{Пошта}'
    }
  }
};

class Translator {
  constructor() {
    this.currentLang = null;
    this.defaultLang = 'en';
  }

  /**
   * Ініціалізація — визначає мову та оновлює DOM
   */
  init() {
    this.currentLang = this.detectLanguage();
    this.updateDOM();
    document.documentElement.lang = this.currentLang;
    this.updateSwitchButton();
  }

  /**
   * Визначення мови
   * Пріоритет: localStorage → мова браузера
   */
  detectLanguage() {
    // 1. Перевіряємо localStorage
    const saved = localStorage.getItem('lang');
    if (saved && translations[saved]) {
      return saved;
    }

    // 2. Перевіряємо мову браузера
    const browserLang = navigator.language.toLowerCase();

    // Українська або російська → ua
    if (browserLang.startsWith('uk') || browserLang.startsWith('ru')) {
      localStorage.setItem('lang', 'ua');
      return 'ua';
    }

    // Всі інші → en
    localStorage.setItem('lang', this.defaultLang);
    return this.defaultLang;
  }

  /**
   * Оновлення стану кнопки перемикача
   */
  updateSwitchButton() {
    const btn = document.getElementById('lang-switch');
    if (btn) {
      btn.classList.toggle('--ua', this.currentLang === 'ua');
    }
  }

  /**
   * Перемикання мови
   */
  switchLang(lang) {
    if (lang === this.currentLang) return;
    if (!translations[lang]) return;

    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    this.updateDOM();
    this.updateSwitchButton();

    console.log('🌐 Language:', lang.toUpperCase());
  }

  /**
   * Оновлення всіх елементів з data-i18n атрибутами
   */

  updateDOM() {
    // Текст (textContent)
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const text = this.t(el.dataset.i18n);
      if (text) el.textContent = text;
    });

    // HTML (innerHTML) — для елементів зі <span> всередині
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const html = this.t(el.dataset.i18nHtml);
      if (html) el.innerHTML = html;
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const text = this.t(el.dataset.i18nPlaceholder);
      if (text) el.placeholder = text;
    });
  }

  /**
   * Отримання перекладу за ключем
   * @param {string} key - "nav.projects" → translations.ua.nav.projects
   */
  t(key) {
    const result = key
      .split('.')
      .reduce((obj, k) => obj?.[k], translations[this.currentLang]);
    return result || key;
  }
}

// Singleton
export const translator = new Translator();

/**
 * Функція ініціалізації
 */
export function initTranslator() {
  translator.init();

  // Слухаємо подію від кнопки перемикача
  document.addEventListener('langSwitch', (e) => {
    translator.switchLang(e.detail.lang);
  });
}
