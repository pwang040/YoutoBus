'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    name: '',
    preferences: {}, // Placeholder for additional data fields
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      if (formData.role === 'consumer') {
        router.push('/cdash/profile');
      } else if (formData.role === 'vendor') {
        router.push('/vdash/profile');
      }
    } else {
      const data = await response.json();
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register and Complete Setup</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Basic Fields */}
        <input
          type="text"
          name="name"
          placeholder="Owner Name"
          value={formData.name}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          style={styles.input}
          required
        />

        {/* Additional Setup Fields */}
        <label>
          Select Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Select</option>
            <option value="consumer">Consumer</option>
            <option value="vendor">Vendor</option>
          </select>
        </label>

        {/* Add other fields for preferences as needed */}
        {/* Example: */}
        {/* <label>Preference:</label>
        <input
          type="text"
          name="preferences.example"
          placeholder="Enter preference"
          value={formData.preferences.example || ''}
          onChange={(e) => setFormData({
            ...formData,
            preferences: { ...formData.preferences, example: e.target.value }
          })}
          style={styles.input}
        /> */}

        <button type="submit" style={styles.button}>Complete Registration</button>
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
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#98d3b7',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default RegisterPage;
