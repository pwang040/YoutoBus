"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
const Navbar = () => {
    const router = useRouter();
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <h1 style={styles.title}>Youtobus</h1>
      </div>
      <div style={styles.menu}>
        <button style={styles.button} onClick={()=> {router.push('/login');}}>Login</button>
        <button style={styles.button} onClick={()=> {router.push('/cdash');}}>Dashboard</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#28a745', // Green theme color
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    color: '#fff',
  },
  title: {
    fontSize: '1.5rem',
    margin: 0,
    color: '#fff',
  },
  menu: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    backgroundColor: '#fff',
    color: '#28a745',
    border: '1px solid #28a745',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#218838', // Darker green on hover
    color: '#fff',
  }
};

export default Navbar;
