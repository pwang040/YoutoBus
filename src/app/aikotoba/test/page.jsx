'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
const test = () => {
    return(
        <div>
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
        "flex-direction" : 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
  };
  
export default test;