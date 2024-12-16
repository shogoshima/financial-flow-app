import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        console.log("[login.tsx] logou!")
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/`;
      console.log("[login.tsx] novo token gerado:", data.token);
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Login</h1>
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto border rounded-lg p-4 shadow-md bg-gray-700">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Login
      </button>
    </form>
    </div>
    </div>
  );
}