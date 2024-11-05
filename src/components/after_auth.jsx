'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AfterAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !redirected) {
      if (session.user.role === 'vendor') {
        setRedirected(true);
        router.push('/vdash');
      } else if (session.user.role === 'consumer') {
        setRedirected(true);
        router.push('/cdash');
      } else {
        setRedirected(true);
        router.push('/auth/first-time-setup');
      }
    }
  }, [status, session, router, redirected]);

  return <p>Loading...</p>;
};

export default AfterAuth;
