// export function initContactForm() {
//   const form = document.getElementById('contact-form');
//   if (!form) {
//     console.log('❌ Form not found');
//     return;
//   }
//   console.log('✅ Form found');

//   const nameInput = document.getElementById('name');
//   const phoneInput = document.getElementById('phone');
//   const errorMessage = document.getElementById('form-error');
//   const popupName = document.getElementById('popup-name');

//   let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');

//   // Чекаємо поки завантажиться intlTelInput з CDN
//   const initPhone = () => {
//     if (!window.intlTelInput) {
//       setTimeout(initPhone, 100);
//       return;
//     }

//     const iti = window.intlTelInput(phoneInput, {
//       initialCountry: 'auto',
//       geoIpLookup: (success) => {
//         fetch('https://api.country.is/')
//           .then((res) => res.json())
//           .then((data) => success(data.country))
//           .catch(() => success('UA'));
//       },
//       countryOrder: ['ua', 'pl', 'es', 'de'],
//       separateDialCode: true,
//       strictMode: false,
//       formatAsYouType: true,
//       loadUtils: () =>
//         import('https://cdn.jsdelivr.net/npm/intl-tel-input@26.7.5/build/js/utils.js')
//     });

//     const validateName = () => nameInput.value.trim().length >= 2;
//     const validatePhone = () => iti.isValidNumber();

//     const showError = (input) => {
//       input.classList.add('--form-error');
//       errorMessage?.classList.add('--visible');
//     };

//     const clearError = (input) => {
//       input.classList.remove('--form-error');
//       if (!form.querySelector('.--form-error')) {
//         errorMessage?.classList.remove('--visible');
//       }
//     };

//     nameInput.addEventListener('input', () => clearError(nameInput));
//     phoneInput.addEventListener('input', () => clearError(phoneInput));

//     form.addEventListener('submit', (e) => {
//       console.log('🔥 Submit triggered');
//       e.preventDefault();
//       e.stopPropagation();

//       let isValid = true;

//       if (!validateName()) {
//         showError(nameInput);
//         isValid = false;
//       }

//       if (!validatePhone()) {
//         showError(phoneInput);
//         isValid = false;
//       }

//       if (!isValid) return;

//       const formData = {
//         id: Date.now(),
//         name: nameInput.value.trim(),
//         phone: iti.getNumber(),
//         country: iti.getSelectedCountryData().name,
//         timestamp: new Date().toISOString()
//       };

//       submissions.push(formData);
//       localStorage.setItem('formSubmissions', JSON.stringify(submissions));

//       if (popupName) {
//         popupName.textContent = formData.name;
//       }

//       if (window.flsPopup) {
//         window.flsPopup.open('success-popup');
//       }

//       form.reset();
//       iti.setNumber('');
//       errorMessage?.classList.remove('--visible');

//       console.log('✅ Submitted:', formData);
//     });
//   };

//   initPhone();
// }

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) {
    console.log('❌ Form not found');
    return;
  }
  console.log('✅ Form found');

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const errorMessage = document.getElementById('form-error');
  const popupName = document.getElementById('popup-name');

  let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  let iti = null; // Зберігаємо посилання на iti

  // ============================================
  // ВАЖЛИВО: Submit listener ЗОВНІ initPhone!
  // ============================================
  form.addEventListener('submit', (e) => {
    console.log('🔥 Submit triggered');
    e.preventDefault();
    e.stopPropagation();
    console.log('🛑 Default prevented');

    let isValid = true;

    // Валідація імені
    if (nameInput.value.trim().length < 2) {
      showError(nameInput);
      isValid = false;
      console.log('❌ Name invalid');
    }

    // Валідація телефону (з перевіркою чи iti існує)
    if (iti) {
      if (!iti.isValidNumber()) {
        showError(phoneInput);
        isValid = false;
        console.log('❌ Phone invalid (iti)');
      }
    } else {
      // Fallback якщо iti не завантажився
      if (phoneInput.value.trim().length < 6) {
        showError(phoneInput);
        isValid = false;
        console.log('❌ Phone invalid (fallback)');
      }
    }

    if (!isValid) {
      console.log('❌ Form invalid, stopping');
      return;
    }

    console.log('✅ Form valid, processing...');

    const formData = {
      id: Date.now(),
      name: nameInput.value.trim(),
      phone: iti ? iti.getNumber() : phoneInput.value.trim(),
      country: iti ? iti.getSelectedCountryData().name : 'Unknown',
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
    if (iti) iti.setNumber('');
    errorMessage?.classList.remove('--visible');

    console.log('✅ Submitted:', formData);
  });

  console.log('✅ Submit listener added');

  // ============================================
  // Функції помилок
  // ============================================
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

  // ============================================
  // Ініціалізація intl-tel-input (окремо)
  // ============================================
  const initPhone = () => {
    if (!window.intlTelInput) {
      console.log('⏳ Waiting for intlTelInput...');
      setTimeout(initPhone, 100);
      return;
    }

    console.log('✅ intlTelInput loaded, initializing...');

    try {
      iti = window.intlTelInput(phoneInput, {
        initialCountry: 'ua',
        geoIpLookup: (success, failure) => {
          fetch('https://api.country.is/')
            .then((res) => res.json())
            .then((data) => success(data.country))
            .catch(() => success('UA'));
        },
        countryOrder: ['ua', 'pl', 'es', 'de'],
        separateDialCode: true,
        strictMode: false,
        formatAsYouType: true,
        useFullscreenPopup: true,
        loadUtils: () =>
          import('https://cdn.jsdelivr.net/npm/intl-tel-input@26.7.5/build/js/utils.js')
      });

      console.log('✅ intlTelInput initialized');
    } catch (error) {
      console.log('❌ intlTelInput error:', error);
    }
  };

  initPhone();
}
