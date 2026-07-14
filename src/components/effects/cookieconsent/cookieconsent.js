import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './cookieconsent.scss';
import * as CookieConsent from 'vanilla-cookieconsent';

const GA_MEASUREMENT_ID = 'G-S1TPRS1STV';
let analyticsLoaded = false;

// Завантажує gtag.js і ініціалізує GA — лише один раз, і лише коли
// користувач реально дав згоду на аналітику.
function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

function manageServices(acceptedCategories) {
  const hasAnalytics = acceptedCategories.includes('analytics');
  // Офіційний opt-out прапорець GA — зупиняє збір навіть якщо скрипт уже
  // завантажений, на випадок якщо користувач відкликав згоду пізніше.
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = !hasAnalytics;
  if (hasAnalytics) loadAnalytics();
}

function cookieConsentInit() {
  const isUk = window.location.pathname.startsWith('/ua/');
  const privacyUrl = isUk ? '/ua/privacy.html' : '/privacy.html';

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom left',
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false
      }
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        enabled: false
      },
      marketing: {
        enabled: false
      }
    },

    onConsent: ({ cookie }) => manageServices(cookie.categories),
    onChange: ({ cookie }) => manageServices(cookie.categories),

    language: {
      default: isUk ? 'uk' : 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies',
            description:
              'We use necessary cookies to make this site work, and optional analytics/marketing cookies to understand how it is used. You can change your choice at any time.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage preferences',
            footer: `<a href="${privacyUrl}">Privacy Policy</a>`
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Necessary cookies',
                description:
                  'Required for the site to work properly (e.g. theme preference). Cannot be disabled.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Analytics cookies',
                description:
                  'Help us understand how visitors interact with the site so we can improve it.',
                linkedCategory: 'analytics'
              },
              {
                title: 'Marketing cookies',
                description:
                  'Used to measure and improve the effectiveness of advertising.',
                linkedCategory: 'marketing'
              },
              {
                title: 'More information',
                description: `See our <a href="${privacyUrl}">Privacy Policy</a> for details.`
              }
            ]
          }
        },
        uk: {
          consentModal: {
            title: 'Ми використовуємо cookie-файли',
            description:
              'Ми використовуємо необхідні cookie-файли для роботи сайту та опційні аналітичні/маркетингові — щоб розуміти, як ним користуються. Ви можете змінити свій вибір у будь-який момент.',
            acceptAllBtn: 'Прийняти всі',
            acceptNecessaryBtn: 'Відхилити всі',
            showPreferencesBtn: 'Налаштувати',
            footer: `<a href="${privacyUrl}">Політика конфіденційності</a>`
          },
          preferencesModal: {
            title: 'Налаштування cookie-файлів',
            acceptAllBtn: 'Прийняти всі',
            acceptNecessaryBtn: 'Відхилити всі',
            savePreferencesBtn: 'Зберегти налаштування',
            closeIconLabel: 'Закрити',
            sections: [
              {
                title: 'Необхідні cookie-файли',
                description:
                  'Потрібні для коректної роботи сайту (наприклад, збереження теми). Їх не можна вимкнути.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Аналітичні cookie-файли',
                description:
                  'Допомагають зрозуміти, як відвідувачі користуються сайтом, щоб ми могли його покращити.',
                linkedCategory: 'analytics'
              },
              {
                title: 'Маркетингові cookie-файли',
                description:
                  'Використовуються для вимірювання та підвищення ефективності реклами.',
                linkedCategory: 'marketing'
              },
              {
                title: 'Детальніше',
                description: `Деталі — у нашій <a href="${privacyUrl}">Політиці конфіденційності</a>.`
              }
            ]
          }
        }
      }
    }
  });
}

document.querySelector('[data-fls-cookieconsent]')
  ? window.addEventListener('load', cookieConsentInit)
  : null;
