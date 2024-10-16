import React from 'react';
import { useRouter } from 'next/navigation';

const SideMenu = () => {
  const router = useRouter();

  return (
    <div style={styles.menuContainer}>
      <button style={styles.menuItem} onClick={() => router.push('/vdash/profile')}>
        Profile
      </button>
      <button style={styles.menuItem} onClick={() => router.push('/vdash/fleet')}>
        Fleet
      </button>
      <button style={styles.menuItem} onClick={() => router.push('/vdash/documents')}>
        Documents
      </button>
      <button style={styles.menuItem} onClick={() => router.push('/vdash/settings')}>
        Settings
      </button>
      <button style={styles.menuItem} onClick={() => router.push('/login')}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  menuContainer: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    borderRight: '1px solid #dee2e6',
  },
  menuItem: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    margin: '0.5rem 0',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
  },
};

export default SideMenu;