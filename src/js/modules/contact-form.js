export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const errorMessage = document.getElementById('form-error');
  const popupName = document.getElementById('popup-name');

  let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');

  // Чекаємо поки завантажиться intlTelInput з CDN
  const initPhone = () => {
    if (!window.intlTelInput) {
      setTimeout(initPhone, 100);
      return;
    }

    const iti = window.intlTelInput(phoneInput, {
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
      loadUtils: () =>
        import('https://cdn.jsdelivr.net/npm/intl-tel-input@26.7.5/build/js/utils.js')
    });

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

    nameInput.addEventListener('input', () => clearError(nameInput));
    phoneInput.addEventListener('input', () => clearError(phoneInput));

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

      const formData = {
        id: Date.now(),
        name: nameInput.value.trim(),
        phone: iti.getNumber(),
        country: iti.getSelectedCountryData().name,
        timestamp: new Date().toISOString()
      };

      submissions.push(formData);
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));

      if (popupName) {
        popupName.textContent = formData.name;
      }

      if (window.flsPopup) {
        window.flsPopup.open('success-popup');
      }

      form.reset();
      iti.setNumber('');
      errorMessage?.classList.remove('--visible');

      console.log('✅ Submitted:', formData);
    });
  };

  initPhone();
}
