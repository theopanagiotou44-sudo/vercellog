export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting...</p>
      <script dangerouslySetInnerHTML={{ __html: `window.location.href = '/api/proxy';` }} />
    </div>
  );
}
