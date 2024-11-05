'use client'
import { useSession } from 'next-auth/react';

const SessionCheck = () => {
  const { data: session, status } = useSession();

  console.log('Client-side session status:', status);
  console.log('Client-side session data:', session);

  return (
    <div>
      {status === 'authenticated' ? (
        <p>Welcome, {session.user.name}!</p>
      ) : (
        <p>Loading session...</p>
      )}
    </div>
  );
};

export default SessionCheck;
