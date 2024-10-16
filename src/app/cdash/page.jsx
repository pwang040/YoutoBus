'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'; // Next.js router
import SideMenu from './components/SideMenu'; // Import the side menu

const cdash = () => {
    const router = useRouter();
    
    return(
        <div>
            <SideMenu/>
        </div>
    )
}

export default cdash;