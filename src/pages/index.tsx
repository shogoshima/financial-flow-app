import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkAuth } from '@/actions/auth';
import './index.css';
import './../styles/globals.css';
import { setCookie } from '@/bin/cookie';

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
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Personal Finances</h1>
        {isAuthenticated ? (
          <>
          <div className='flex flex-col justify-center self-center items-center gap-2'>
            <Link href="/dashboard">
              <div className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
              </div>
            </Link>
            <Link href="/" onClick={() => {
              setCookie('token', '');
              window.location.reload();
            }}>
              <div className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Log out
              </div>
            </Link>
          </div>
        </>
        ) : (
          <div className="space-x-4">
            <Link href="/login">
              <div className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Login
              </div>
            </Link>
            <Link href="/signup">
              <div className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Signup
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}