import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
    }}>
      <div style={{
        background: '#111114',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        padding: '48px 36px',
        minWidth: '370px',
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{
            fontSize: '2.7rem',
            fontWeight: 700,
            color: '#bfc2c7',
            letterSpacing: '1px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{ color: '#3ec6ff', fontWeight: 900, fontSize: '3.2rem', marginRight: 2 }}>A</span>natomous
          </span>
        </div>
        <h2 style={{
          marginBottom: '28px',
          color: '#e5e7eb',
          fontWeight: 600,
          fontSize: '2rem',
          letterSpacing: '1px',
        }}>
          Log In
        </h2>
        <div style={{ width: '100%' }}>
          <SignIn
            appearance={{
              elements: {
                card: {
                  background: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                  padding: 0,
                },
                formButtonPrimary: {
                  background: 'linear-gradient(90deg, #3ec6ff 0%, #005bea 100%)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  marginTop: '8px',
                },
                headerTitle: {
                  display: 'none',
                },
                socialButtonsBlockButton: {
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  margin: '8px 0',
                },
                dividerRow: {
                  margin: '24px 0',
                },
                footerAction: {
                  color: '#3ec6ff',
                  fontWeight: 500,
                },
                formFieldInput: {
                  background: '#23272f',
                  color: '#e5e7eb',
                  border: '1px solid #23272f',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '12px',
                },
                formFieldLabel: {
                  color: '#bfc2c7',
                  fontWeight: 500,
                  fontSize: '1rem',
                  marginBottom: '4px',
                },
                formFieldInputShowPasswordButton: {
                  color: '#bfc2c7',
                },
                formFieldInput__password: {
                  letterSpacing: '2px',
                },
                formFieldAction: {
                  color: '#3ec6ff',
                  fontWeight: 500,
                  fontSize: '0.98rem',
                },
                identityPreviewText: {
                  color: '#bfc2c7',
                },
                formFieldCheckbox: {
                  accentColor: '#3ec6ff',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
