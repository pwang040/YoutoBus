'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AfterAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to be fully loaded

    if (status === 'authenticated') {
      if (session.user.role === 'vendor') {
        router.push('/vdash/profile');
      } else if (session.user.role === 'consumer') {
        router.push('/cdash/profile');
      } else {
        router.push('/auth/first-time-setup'); // Redirect to first-time setup if needed
      }
    } else {
      router.push('/auth/signin'); // Redirect to sign-in if not authenticated
    }
  }, [status, session, router]);

  return <p>Loading...</p>;
};

export default AfterAuth;
