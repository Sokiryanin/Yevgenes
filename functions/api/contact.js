export async function onRequestPost(context) {
  const { request, env, waitUntil } = context;

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

  const requiredDeliveries = [];

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const text =
      `New inquiry from yevgenes.dev\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Project: ${message || '-'}`;

    requiredDeliveries.push(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
      })
    );
  }

  if (env.GOOGLE_SCRIPT_URL) {
    // application/x-www-form-urlencoded, не JSON — POST з
    // Content-Type: application/json ламає внутрішній редирект Google Apps
    // Script (script.google.com -> script.googleusercontent.com), і запит
    // ніколи не доходить до doPost.
    //
    // Відповідь від Apps Script навмисно ігнорується: цей редирект-проксі
    // часто повертає помилкову відповідь навіть тоді, коли doPost вже
    // відпрацював і рядок дописано в таблицю — тож статус цієї відповіді
    // ненадійний і не повинен впливати на результат для відвідувача сайту.
    const params = new URLSearchParams({
      name,
      phone,
      message,
      timestamp: new Date().toISOString()
    });

    waitUntil(fetch(env.GOOGLE_SCRIPT_URL, { method: 'POST', body: params }).catch(() => {}));
  }

  const results = await Promise.allSettled(requiredDeliveries);
  const failed = results.some(
    (result) => result.status === 'rejected' || !result.value.ok
  );

  if (failed) {
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
