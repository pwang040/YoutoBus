import { useSession } from 'next-auth/react';

const CheckSession = () => {
  const { data: session, status } = useSession();

  console.log('Client-side session status:', status);
  console.log('Client-side session data:', session);

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  return session ? (
    <p>Welcome, {session.user.name}! Your role is {session.user.role}.</p>
  ) : (
    <p>You are not logged in.</p>
  );
};

export default CheckSession;
