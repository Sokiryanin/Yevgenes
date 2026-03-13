import './footer.scss';

const span = document.querySelector('.footer__header-title span');

if (span) {
  const text = span.textContent;

  if (text.endsWith('?')) {
    span.innerHTML =
      text.slice(0, -1) + '<span class="footer__question-mark">?</span>';
  }
}
