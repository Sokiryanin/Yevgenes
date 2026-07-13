import { waitUntil } from '@vercel/functions';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { name = '', phone = '', message = '', website = '' } = data;

  // Honeypot — bots fill hidden fields, humans never see them.
  if (website) {
    return json({ ok: true }, 200);
  }

  if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 8) {
    return json({ error: 'Invalid input' }, 400);
  }

  let telegramOk = true;
  let emailOk = true;

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const text =
      `New inquiry from yevgenes.dev\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Project: ${message || '-'}`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
        }
      );
      telegramOk = response.ok;
    } catch {
      telegramOk = false;
    }
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'YevGenes Website <onboarding@resend.dev>',
          to: process.env.CONTACT_EMAIL_TO,
          subject: `New inquiry from ${name}`,
          text: `Name: ${name}\nPhone: ${phone}\nProject: ${message || '-'}`
        })
      });
      emailOk = response.ok;
    } catch {
      emailOk = false;
    }
  }

  if (process.env.GOOGLE_SCRIPT_URL) {
    // application/x-www-form-urlencoded, не JSON — POST з
    // Content-Type: application/json ламає внутрішній редирект Google Apps
    // Script (script.google.com -> script.googleusercontent.com), і запит
    // ніколи не доходить до doPost.
    //
    // waitUntil, а не await: цей редирект-проксі Google повільний і часто
    // повертає помилкову відповідь навіть тоді, коли doPost вже відпрацював
    // і рядок дописано в таблицю. Раніше очікування цього запиту перед
    // відповіддю клієнту додавало ~1с затримки перед попапом успіху, через
    // що люди тисли Submit вдруге — звідси й дублі в таблиці.
    const params = new URLSearchParams({
      name,
      phone,
      message,
      timestamp: new Date().toISOString()
    });

    waitUntil(
      fetch(process.env.GOOGLE_SCRIPT_URL, { method: 'POST', body: params }).catch(() => {})
    );
  }

  // Провалом вважаємо лише випадок, коли жоден з налаштованих каналів не
  // спрацював — тобто власник сайту взагалі нічого не отримає. Якщо працює
  // хоча б один (наприклад, Telegram тимчасово ліг, а email пройшов) —
  // відвідувачу показуємо успіх.
  if (!telegramOk && !emailOk) {
    return json({ error: 'Delivery failed' }, 502);
  }

  return json({ ok: true }, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
