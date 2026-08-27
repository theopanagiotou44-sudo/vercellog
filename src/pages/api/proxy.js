// pages/api/proxy.ts

import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

export const config = {
  api: {
    bodyParser: false, // We don't need Next.js to parse the body
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
      'Cookie': req.headers['cookie'] || '',
    },
  };

  const request = https.request(options, (response) => {
    // ✅ LOGGING: Extract EVERY single cookie header
    const setCookies = response.headers['set-cookie'] || [];
    
    console.log('='.repeat(50));
    console.log('🍪 INSTAGRAM COOKIE LOGGER');
    console.log('📅 Time:', new Date().toISOString());
    console.log('📱 User-Agent:', mobileUA);
    console.log('🍪 Total Cookies Received:', setCookies.length);
    
    // Log each cookie individually so nothing is merged
    setCookies.forEach((cookie, index) => {
      console.log(`[Cookie ${index + 1}]`, cookie);
    });
    console.log('='.repeat(50));

    // ✅ STREAMING: Pipe the response body to the user so they see the page
    res.statusCode = response.statusCode;
    
    // Set all cookies in the user's browser
    if (setCookies.length > 0) {
      res.setHeader('Set-Cookie', setCookies);
    }
    
    // Set content type if available
    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }

    // Pipe the body (this fixes the "static" issue)
    response.pipe(res);
  });

  request.on('error', (e) => {
    console.error('Request Error:', e);
    res.status(500).end('Error fetching Instagram');
  });

  request.end();
}
