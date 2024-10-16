'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
const notFound = () => {
    return(
        <div>
            <div style={styles.text}>404 not found, check your link and try again</div>
        </div>
    )
}
const styles = {
    text :{
        font: 'comic sans',
        fontSize: '72px',
        color: 'red',
        display: 'flex',
        "flex-direction" : 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
  };
  
export default notFound;