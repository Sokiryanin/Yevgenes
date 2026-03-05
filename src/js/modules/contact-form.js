// Підключення intl-tel-input
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const errorMessage = document.getElementById('form-error');
  const popupName = document.getElementById('popup-name');

  // Збережені дані
  let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');

  // Ініціалізація intl-tel-input
  const iti = intlTelInput(phoneInput, {
    initialCountry: 'auto',
    geoIpLookup: (success) => {
      fetch('https://api.country.is/')
        .then((res) => res.json())
        .then((data) => success(data.country))
        .catch(() => success('UA'));
    },
    countryOrder: ['ua', 'pl', 'es', 'de'],
    separateDialCode: true,
    strictMode: true,
    formatAsYouType: true,
    loadUtils: () => import('intl-tel-input/build/js/utils.js')
  });

  // Валідація
  const validateName = () => nameInput.value.trim().length >= 2;
  const validatePhone = () => iti.isValidNumber();

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

  // Очищення помилок при вводі
  nameInput.addEventListener('input', () => clearError(nameInput));
  phoneInput.addEventListener('input', () => clearError(phoneInput));

  // Сабміт
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    if (!validateName()) {
      showError(nameInput);
      isValid = false;
    }

    if (!validatePhone()) {
      showError(phoneInput);
      isValid = false;
    }

    if (!isValid) return;

    // Дані форми
    const formData = {
      id: Date.now(),
      name: nameInput.value.trim(),
      phone: iti.getNumber(),
      country: iti.getSelectedCountryData().name,
      timestamp: new Date().toISOString()
    };

    // Зберігаємо в localStorage
    submissions.push(formData);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));

    // Оновлюємо ім'я в попапі
    if (popupName) {
      popupName.textContent = formData.name;
    }

    // Відкриваємо попап ← ВИПРАВЛЕНО
    if (window.flsPopup) {
      window.flsPopup.open('success-popup');
    }

    // Очищуємо форму
    form.reset();
    iti.setNumber('');
    errorMessage?.classList.remove('--visible');

    console.log('✅ Submitted:', formData);
  });
}
