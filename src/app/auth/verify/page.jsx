'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const VerifyPage = () => {
  const { data: session, status } = useSession();
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleResend = async () => {
    if (cooldown || status !== 'authenticated' || !session?.user?.email) return;

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, resend: true }) // Use session email here
      });

      if (response.ok) {
        console.log('Verification email resent');
        startCooldown();
      } else {
        console.error('Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startCooldown = () => {
    setCooldown(true);
    setCountdown(60);

    const intervalId = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(intervalId);
          setCooldown(false); // Re-enable button
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status !== 'authenticated') return <p>Please sign in to verify your email.</p>;

  return (
    <div style={styles.container}>
      <img src="/email-icon.png" alt="Email icon" style={styles.image} />
      <h2>Verify Your Email</h2>
      <p>Please check your email inbox for a verification link.</p>
      <p>If you didn’t receive the email, click below to resend it.</p>
      
      <button 
        onClick={handleResend} 
        style={{ 
          ...styles.button, 
          backgroundColor: cooldown ? '#d3d3d3' : '#4285F4', 
          cursor: cooldown ? 'not-allowed' : 'pointer' 
        }}
        disabled={cooldown}
      >
        {cooldown ? `Resend available in ${countdown}s` : 'Resend Verification Email'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  image: {
    width: '100px',
    height: '100px',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default VerifyPage;