// pages/api/proxy.js

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ✅ Mobile User Agent
  const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";

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
      'Cookie': req.headers.cookie || ''
    },
  };

  try {
    const https = require('https');

    const request = https.request(options, (response) => {
      // ✅ LOG EVERY COOKIE
      const cookies = response.headers['set-cookie'] || [];
      
      console.log('🍪 LOG START');
      console.log('📅 Time:', new Date().toISOString());
      console.log('📱 UA:', mobileUA);
      console.log('🍪 Total Cookies:', cookies.length);
      
      cookies.forEach((cookie, i) => {
        console.log(`[Cookie ${i + 1}]`, cookie);
      });
      console.log('🍪 LOG END');

      // ✅ STREAM THE RESPONSE (Fixes the "static" page)
      res.statusCode = response.statusCode;
      
      // Set all cookies for the user's browser
      if (cookies.length > 0) {
        res.setHeader('Set-Cookie', cookies);
      }
      
      if (response.headers['content-type']) {
        res.setHeader('Content-Type', response.headers['content-type']);
      }

      // Pipe the body so the user sees the real Instagram page
      response.pipe(res);
    });

    request.on('error', (e) => {
      console.error('Request Error:', e);
      res.status(500).end('Error');
    });

    request.end();

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).end('Server Error');
  }
}
