import React from 'react';
import Navbar from '../components/navbar'; // Import your Navbar component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Navbar />  */}
        {/* This will be rendered on all pages */}
        <main>{children}</main> {/* This renders the specific page content */}
      </body>
    </html>
  );
}
