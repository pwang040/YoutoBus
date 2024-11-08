'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const FirstTimeSetupPage = () => {
  const { data: session, status, update } = useSession();
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!role) {
      setError('Please select a role.');
      return;
    }
  
    try {
      // Update the role in the database
      const response = await fetch('/api/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, role }),
      });
  
      if (response.ok) {
        // Refresh the session to reflect the updated role
        await update(); // Refresh session after role update
        
        // Redirect to the appropriate dashboard
        if (role === 'consumer') {
          router.push('/cdash/profile');
        } else if (role === 'vendor') {
          router.push('/vdash/profile');
        }
      } else {
        setError('An error occurred while completing the setup. Please try again.');
      }
    } catch (error) {
      console.error('Error updating the role:', error);
      setError('An error occurred while completing the setup. Please try again.');
    }
  };
  
  

  if (status === 'loading') return <p>Loading...</p>;

  // Redirect to the sign-in page if the user is not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div style={styles.container}>
      <h2>First-Time Setup</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Select Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select</option>
            <option value="consumer">Consumer</option>
            <option value="vendor">Vendor</option>
          </select>
        </label>
        <button type="submit" style={styles.button}>Complete Setup</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '20vh',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    marginTop: '1rem',
    borderRadius: '4px',
    backgroundColor: '#98d3b7', // Light green color for a pleasant touch
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default FirstTimeSetupPage;
