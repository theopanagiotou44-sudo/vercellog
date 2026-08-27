// pages/api/proxy.js

import https from 'https';

export default async function handler(req, res) {
  // ✅ Mobile Device Spoofing
  const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
  
  try {
    // 1. Prepare the request to Instagram
    const options = {
      hostname: 'www.instagram.com',
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': mobileUA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cookie': req.headers['cookie'] || '' // Send existing cookies to Instagram
      }
    };

    // 2. Make the request
    const request = https.request(options, (response) => {
      // ✅ Extract ALL Cookies
      const setCookies = response.headers['set-cookie'] || [];
      const cookies = [];
      
      // Parse each Set-Cookie header
      setCookies.forEach(cookie => {
        // Extract the name and value (ignore path, domain, etc. for logging)
        const parts = cookie.split(';');
        const nameValue = parts[0].trim();
        cookies.push(nameValue);
      });

      // ✅ Log ALL Cookies
      console.log('======================');
      console.log('🍪 FULL COOKIE LOGGER');
      console.log('📅 Time:', new Date().toISOString());
      console.log('📱 User-Agent:', mobileUA);
      console.log('🍪 Total Cookies Logged:', cookies.length);
      cookies.forEach((c, index) => {
        console.log(`[${index}] ${c}`);
      });
      console.log('======================');

      // 3. Stream the response to the user
      res.setHeader('Content-Type', response.headers['content-type'] || 'text/html; charset=utf-8');
      
      // Set all cookies in the response
      if (setCookies.length > 0) {
        setCookies.forEach(c => res.setHeader('Set-Cookie', c));
      }
      
      res.statusCode = response.statusCode;
      response.pipe(res);
    });

    // Handle errors
    request.on('error', (e) => {
      console.error('Request Error:', e);
      res.status(500).type('text/html').send(`
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>Instagram (Direct)</h1>
            <p>Error: ${e.message}</p>
            <p>Check Vercel Logs for details.</p>
          </body>
        </html>
      `);
    });

    request.end();

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).type('text/html').send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Instagram (Direct)</h1>
          <p>Error: ${error.message}</p>
        </body>
      </html>
    `);
  }
}
