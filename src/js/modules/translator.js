// ============================================
// Модуль перекладача
// (c) YevGenes
//
// Забезпечує динамічну зміну мови сайту
// без перезавантаження сторінки
// ============================================

class Translator {
  /**
   * Конструктор класу Translator
   * Ініціалізує початкові значення
   */
  constructor() {
    // Поточна мова: беремо з localStorage або 'en' за замовчуванням
    this.currentLang = localStorage.getItem('lang') || 'en';

    // Об'єкт з перекладами (заповнюється після завантаження JSON)
    this.translations = {};

    // Мова за замовчуванням (fallback)
    this.defaultLang = 'en';
  }

  /**
   * Ініціалізація перекладача
   * Завантажує переклади та оновлює DOM
   * Викликається один раз при завантаженні сторінки
   */
  async init() {
    // Завантажуємо JSON файл з перекладами
    await this.loadTranslations(this.currentLang);

    // Оновлюємо всі елементи з data-i18n атрибутами
    this.updateDOM();

    // Встановлюємо атрибут lang на <html>
    document.documentElement.lang = this.currentLang;
  }

  /**
   * Завантаження JSON файлу з перекладами
   * @param {string} lang - Код мови ('en', 'ua')
   */
  async loadTranslations(lang) {
    try {
      // Робимо запит до JSON файлу
      const response = await fetch(`/locales/${lang}.json`);

      // Перевіряємо чи запит успішний
      if (!response.ok) throw new Error('Failed to load');

      // Парсимо JSON та зберігаємо в this.translations
      this.translations = await response.json();

      // Оновлюємо поточну мову
      this.currentLang = lang;
    } catch (error) {
      // Якщо не вдалося завантажити — пробуємо мову за замовчуванням
      console.warn(
        `⚠️ Failed to load ${lang}.json, falling back to ${this.defaultLang}`
      );

      // Уникаємо нескінченного циклу
      if (lang !== this.defaultLang) {
        await this.loadTranslations(this.defaultLang);
      }
    }
  }

  /**
   * Перемикання мови
   * Викликається при кліку на кнопку перемикача
   * @param {string} lang - Код нової мови ('en', 'ua')
   */
  async switchLang(lang) {
    // Якщо мова та сама — нічого не робимо
    if (lang === this.currentLang) return;

    // Завантажуємо нові переклади
    await this.loadTranslations(lang);

    // Зберігаємо вибір в localStorage
    localStorage.setItem('lang', lang);

    // Оновлюємо атрибут lang на <html>
    document.documentElement.lang = lang;

    // Оновлюємо всі тексти на сторінці
    this.updateDOM();

    console.log('🌐 Language switched to:', lang.toUpperCase());
  }

  /**
   * Оновлення DOM елементів
   * Знаходить всі елементи з data-i18n атрибутами
   * та замінює їх текст на переклад
   */
  updateDOM() {
    // ----- Текстовий контент -----
    // Шукаємо всі елементи з data-i18n="ключ.перекладу"
    // Наприклад: <span data-i18n="nav.projects">Projects</span>
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n; // Отримуємо ключ: "nav.projects"
      const text = this.get(key); // Отримуємо переклад: "Проєкти"
      if (text) el.textContent = text; // Замінюємо текст елемента
    });

    // ----- Placeholder для інпутів -----
    // Наприклад: <input data-i18n-placeholder="form.name">

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const text = this.get(key);
      if (text) el.placeholder = text;
    });

    // ----- Aria-label для доступності -----
    // Наприклад: <button data-i18n-aria="buttons.submit">

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.dataset.i18nAria;
      const text = this.get(key);
      if (text) el.setAttribute('aria-label', text);
    });
  }

  /**
   * Отримання перекладу за ключем
   * Підтримує вкладені ключі через крапку
   * @param {string} key - Ключ перекладу, наприклад "nav.projects"
   * @returns {string|undefined} - Переклад або undefined
   *
   * Приклад:
   *   this.translations = { nav: { projects: "Проєкти" } }
   *   this.get("nav.projects") → "Проєкти"
   */
  get(key) {
    // "nav.projects" → ["nav", "projects"]
    // Потім поступово заглиблюємось: obj.nav → obj.nav.projects
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations);
  }

  /**
   * Короткий метод для отримання перекладу
   * Зручний для використання в інших модулях
   * @param {string} key - Ключ перекладу
   * @returns {string} - Переклад або сам ключ (якщо не знайдено)
   *
   * Приклад:
   *   translator.t("nav.projects") → "Проєкти"
   *   translator.t("unknown.key") → "unknown.key"
   */
  t(key) {
    return this.get(key) || key;
  }
}

// ============================================
// Експорт
// ============================================

// Створюємо єдиний екземпляр (singleton)
// Це гарантує, що всюди використовується один і той самий об'єкт
export const translator = new Translator();

/**
 * Функція ініціалізації перекладача
 * Викликається в app.js при завантаженні сторінки
 *
 * Приклад використання:
 *   import { initTranslator } from './modules/translator.js';
 *   await initTranslator();
 */
export async function initTranslator() {
  // Ініціалізуємо перекладач
  await translator.init();

  // Слухаємо подію langSwitch від кнопки перемикача
  // Коли користувач натискає кнопку — викликається switchLang
  document.addEventListener('langSwitch', async (e) => {
    await translator.switchLang(e.detail.lang);
  });
}
