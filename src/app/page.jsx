'use client';
import { useRouter } from 'next/navigation'; // Next.js router

export default function Home() {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/auth/signin');
  };

  return (
    <div style={styles.container}>
      <div style={styles.text}>Welcome to YouToBus Prototype by Patrick Wang</div>
      <button onClick={handleClick} style={styles.button}>Sign In</button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#556B2F', // Dark olive green background
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#d4a017', // Dark yellow color for text
    textAlign: 'center',
  },
  text: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    color: '#fff',
    backgroundColor: '#d4a017', // Match dark yellow color for consistency
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};
