import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkAuth } from '@/actions/auth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Define an async function within useEffect
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth();
      setIsAuthenticated(isAuthenticated);
    };

    // Call the async function
    checkAuthentication();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Personal Finances</h1>
      {isAuthenticated ? (
        <Link href="/dashboard">Go to Dashboard</Link>
      ) : (
        <>
        <Link href="/login">Login</Link>

        <Link href="/signup">Signup</Link>

        </>
      )}
    </div>
  );
}