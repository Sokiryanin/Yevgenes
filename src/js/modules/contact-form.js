import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
// no-assets: без локальних flag-спрайтів — вони підключаються з CDN у
// footer.scss (--iti-path-flags-1x/2x), бо кастомний assetFileNames у
// vite.config.js не вміє обробляти зображення з node_modules.
import 'intl-tel-input/dist/css/intlTelInput-no-assets.css';
import { bodyLock, bodyUnlock } from '@js/common/functions.js';

// Визначення країни відвідувача за IP через Cloudflare (безкоштовно, без
// ключів і лімітів). Якщо не вдалось — фолбек на Україну.
async function detectCountryByIp() {
  try {
    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
    const text = await response.text();
    const match = text.match(/loc=([A-Z]{2})/);
    return match ? match[1].toLowerCase() : 'ua';
  } catch {
    return 'ua';
  }
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const consentInput = document.getElementById('consent');
  const websiteInput = document.getElementById('website');
  const errorMessage = document.getElementById('form-error');
  const popupName = document.getElementById('popup-name');
  const submitBtn = document.querySelector('button[form="contact-form"]');

  const phoneIti = intlTelInput(phoneInput, {
    initialCountry: '',
    initialCountryLookup: detectCountryByIp,
    countryOrder: ['ua', 'gb', 'de', 'pl', 'fr', 'it', 'es'],
    separateDialCode: true
  });

  // Перший "countrychange" — це асинхронний авто-визначений код за IP, а не
  // вибір користувача, тому число не чистимо. Будь-яка наступна зміна
  // прапорця — це вже свідомий вибір іншої країни, і стара введена
  // послідовність цифр (в іншому форматі) не має сенсу — тому очищуємо поле.
  let hasSetInitialCountry = false;
  phoneInput.addEventListener('countrychange', () => {
    if (!hasSetInitialCountry) {
      hasSetInitialCountry = true;
      return;
    }
    // setTimeout — щоб не чіпати номер синхронно всередині того ж виклику
    // бібліотеки, який обирає країну (інакше це заважає її власній логіці).
    setTimeout(() => phoneIti.setNumber(''), 0);
  });

  // Обхідний шлях для бага бібліотеки: внутрішня перевірка "чи список
  // відкрито" іноді плутається саме в момент кліку по країні в списку,
  // через що publichний closeCountrySelector() теж мовчки нічого не робить.
  // Тому ховаємо список напряму через DOM, не покладаючись на її стан.
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.iti__country')) return;
    setTimeout(() => {
      document
        .querySelectorAll('.iti__country-selector, .iti--fullscreen-popup')
        .forEach((el) => el.classList.add('iti__hide'));
      bodyUnlock(0);
    }, 0);
  });

  // Блокуємо скрол сторінки, поки відкрита модалка вибору країни (особливо
  // важливо на мобільних, де вона fullscreen).
  phoneInput.addEventListener('open:countryselector', () => bodyLock(0));
  phoneInput.addEventListener('close:countryselector', () => bodyUnlock(0));

  const showError = (input) => {
    input.classList.add('--form-error');
    errorMessage?.classList.add('--visible');
  };

  const clearError = (input) => {
    input.classList.remove('--form-error');
    if (!form.querySelector('.--form-error')) {
      errorMessage?.classList.remove('--visible');
    }
  };

  const validateName = () => nameInput.value.trim().length >= 2;
  const validatePhone = () => phoneInput.value.trim() !== '' && phoneIti.isValidNumber();
  const validateConsent = () => !consentInput || consentInput.checked;

  let isSubmitting = false;

  async function handleSubmit() {
    // Тимчасова діагностика — видалити після знаходження бага.
    console.trace('[contact-form] handleSubmit called, isSubmitting=' + isSubmitting);

    if (isSubmitting) return;

    let isValid = true;

    if (!validateName()) {
      showError(nameInput);
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (!validatePhone()) {
      showError(phoneInput);
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    if (!validateConsent()) {
      showError(consentInput);
      isValid = false;
    } else if (consentInput) {
      clearError(consentInput);
    }

    if (!isValid) return;

    const formData = {
      name: nameInput.value.trim(),
      phone: phoneIti.getNumber(),
      message: messageInput ? messageInput.value.trim() : '',
      website: websiteInput ? websiteInput.value : ''
    };

    isSubmitting = true;
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Request failed');

      if (popupName) popupName.textContent = formData.name;

      if (window.flsPopup) {
        try {
          window.flsPopup.open('success-popup');
        } catch (e) {}
      }

      form.reset();
      phoneIti.setNumber('');
      errorMessage?.classList.remove('--visible');
    } catch (err) {
      errorMessage?.classList.add('--visible');
    } finally {
      isSubmitting = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }

  nameInput.addEventListener('input', () => clearError(nameInput));
  phoneInput.addEventListener('input', () => clearError(phoneInput));
  consentInput?.addEventListener('change', () => clearError(consentInput));
}
