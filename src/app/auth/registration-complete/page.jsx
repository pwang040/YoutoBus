// src/app/auth/registration-complete/page.jsx

'use client';
import { useRouter } from 'next/navigation';

const RegistrationComplete = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Registration Complete!</h2>
      <p>Your account has been created. Please sign in to continue.</p>
      <button
        onClick={() => router.push('/auth/signin')}
        style={{
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          borderRadius: '4px',
          backgroundColor: '#98d3b7',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Go to Sign In
      </button>
    </div>
  );
};

export default RegistrationComplete;
