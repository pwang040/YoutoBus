'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
import SideMenu from '../components/sidemenu';
const profile = () => {
    return(
        <div style={styles.dashboardLayout}>
            <SideMenu/>
            <div>Consumer profile page</div>
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
  
export default profile;