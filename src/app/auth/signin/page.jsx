"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Signin = () => {
  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email: username,
      password,
    });

    if (result && result.ok) {
      if (username === 'client') {
        router.push('/cdash/profile');
      } else if (username === 'vendor') {
        router.push('/vdash/profile');
      }
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    router.push('/auth/register');
  };

  const handleReset = (e) => {
    e.preventDefault();
    router.push('/auth/reset_password');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <button onClick={() => signIn('google', { callbackUrl: '/auth/after_auth'})} style={styles.oauthButton}>Sign in with Google</button>
        <h2>Or Sign in with Email</h2>

        {error && <p style={styles.error}>{error}</p>}
        
        <form>
          <label>Username</label><br/>
          <input 
            type="text" 
            id="username" 
            name="username" 
            onChange={(e) => setUser(e.target.value)}
            style={styles.input}
          /><br/>
          
          <label>Password</label><br/>
          <input 
            type="password" 
            id="password" 
            name="password" 
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          /><br/>
          
          <button onClick={handleLogin} style={styles.button}>Log In</button> 
        </form>
        
        <button onClick={handleRegister} style={styles.button}>Register</button>
        <button onClick={handleReset} style={styles.button}>Reset Password</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f5f3',
  },
  formContainer: {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    margin: '0.5rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#98d3b7',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  oauthButton: {
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4285F4', // Google blue
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
};

export default Signin;
