export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const errorMessage = document.getElementById('form-error');
  const popupName = document.getElementById('popup-name');
  const submitBtn = document.querySelector('button[form="contact-form"]');

  let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');

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
  const validatePhone = () => phoneInput.value.replace(/\D/g, '').length >= 6;

  function handleSubmit() {
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

    if (!isValid) return;

    const formData = {
      id: Date.now(),
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    submissions.push(formData);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));

    if (popupName) popupName.textContent = formData.name;

    if (window.flsPopup) {
      try {
        window.flsPopup.open('success-popup');
      } catch (e) {}
    }
    console.log(submissions);
    form.reset();
    errorMessage?.classList.remove('--visible');
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
}
