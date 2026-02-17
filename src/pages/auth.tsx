import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        padding: '40px 32px',
        minWidth: '340px',
        maxWidth: '90vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          marginBottom: '24px',
          color: '#764ba2',
          fontWeight: 700,
          fontSize: '2rem',
          letterSpacing: '1px',
        }}>
          Вхід до акаунту
        </h2>
        <SignIn appearance={{
          elements: {
            card: { boxShadow: 'none', border: 'none' },
            formButtonPrimary: { background: '#764ba2', borderRadius: '8px' },
          },
        }} />
      </div>
    </div>
  );
}
