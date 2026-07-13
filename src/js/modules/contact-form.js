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
  const validatePhone = () => phoneInput.value.replace(/\D/g, '').length >= 8;
  const validateConsent = () => !consentInput || consentInput.checked;

  async function handleSubmit() {
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
      phone: phoneInput.value.trim(),
      message: messageInput ? messageInput.value.trim() : '',
      website: websiteInput ? websiteInput.value : ''
    };

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
      errorMessage?.classList.remove('--visible');
    } catch (err) {
      errorMessage?.classList.add('--visible');
    } finally {
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

    submitBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }

  nameInput.addEventListener('input', () => clearError(nameInput));
  phoneInput.addEventListener('input', () => clearError(phoneInput));
  consentInput?.addEventListener('change', () => clearError(consentInput));
}
