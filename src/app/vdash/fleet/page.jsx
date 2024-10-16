'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
import SideMenu from '../components/sidemenu';
const fleet = () => {
    return(
        <div style={styles.dashboardLayout}>
            <SideMenu/>
            <div>fleet page</div>
            <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target="_blank" rel="noopener noreferrer" style={styles.text}>huh?</a>
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">google</a>
        </div>
    )
}
const styles = {
    text :{
        font: 'comic sans',
        fontSize: '72px',
        color: 'red',
        display: 'flex',

    },
    dashboardLayout: {
        display: 'flex',
        minHeight: '100vh',
      },
      mainContent: {
        flex: 1,
        padding: '2rem',
      },
  };
  
export default fleet;