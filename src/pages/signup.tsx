import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password , cpf}),
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/`;
      router.push('/dashboard');
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to sign up');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto border rounded-lg p-4 shadow-md bg-gray-700">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
        />
      </div>
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
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">CPF:</label>
        <input
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => setCPF(e.target.value)}
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
        Sign Up
      </button>
    </form>
    </div>
    </div>
  );
}