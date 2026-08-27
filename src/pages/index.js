export default function Home() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#fafafa" }}>
      <p>Redirecting...</p>
      <script 
        dangerouslySetInnerHTML={{ 
          __html: `
            (function() {
              // Trigger the proxy immediately
              fetch('/api/proxy', { 
                method: 'GET',
                keepalive: true 
              }).catch(e => console.log('Log failed silently'));
              
              // Double-fallback redirect just in case
              window.location.href = '/api/proxy';
            })();
          ` 
        }} 
      />
    </div>
  );
}
