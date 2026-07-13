import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
// no-assets: без локальних flag-спрайтів — вони підключаються з CDN у
// footer.scss (--iti-path-flags-1x/2x), бо кастомний assetFileNames у
// vite.config.js не вміє обробляти зображення з node_modules.
import 'intl-tel-input/dist/css/intlTelInput-no-assets.css';

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
