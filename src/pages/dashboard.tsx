import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getCookie, setCookie } from '@/bin/cookie';
import { getUser } from '@/actions/profile';
import { AuthService } from '@/services/auth.service';
// import { UserService } from '@/services/user.service';
import { AddTransactionForm } from '@/components';
// import { getTransactions } from '@/actions/data';
import { Transaction, TransactionType } from '@/models';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userIdBd, setUserIdBd] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>();
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie('token');
      console.log("[dashboard.tsx] reading token from cookie", token);
      if (!token) {
        router.push('/');
        return;
      }

        setToken(token);

      console.log("[dashboard.tsx] veryfing token", token);

      const userId = AuthService.verifySession(token);
      if (userId === null) {
        console.log("[dashboard.tsx] no user id found");
        router.push('/');
        return;
      }

      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      router.push('/');
      return;
    }

    setToken(token);

    const fetchTransactions = async () => {
        const queryParams = new URLSearchParams({
            token,
        });

      const response = await fetch(`/api/transactions?${queryParams.toString()}`);
      if (response.ok) {
        const transactionsData = await response.json();
        setTransactions(transactionsData);
      } else {
        console.error('Failed to fetch transactions:', response.statusText);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    const queryParams = new URLSearchParams({
        token,
    });

    const response = await fetch(`/api/transactions?${queryParams.toString()}`);
    if (response.ok) {
      const transactionsData = await response.json();
      setTransactions(transactionsData);
    } else {
      console.error('Failed to fetch transactions:', response.statusText);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-800 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li><Link href="/profile" className="text-blue-400 hover:underline">Profile</Link></li>
          <li><Link href="/goals" className="text-blue-400 hover:underline">Goals</Link></li>
          <li><Link href="/budget" className="text-blue-400 hover:underline">Budget</Link></li>
          <li><Link href="/transactions" className="text-blue-400 hover:underline">Transactions</Link></li>
          <li><Link href="/" className="text-blue-400 hover:underline" onClick={()=> {setCookie('token', "")}}>Log out</Link></li>
        </ul>
      </nav>
      <h2 className="text-xl font-semibold mb-2">Add Transaction</h2>
      <div className="max-w-md mx-auto">
        <AddTransactionForm onAddTransaction={handleAddTransaction} token={token}/>
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-2">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="border p-2 rounded bg-gray-700">
            <div className="flex justify-between">
              <span>{transaction.date.toString().split('T')[0]}</span>
              <span className={transaction.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}>
                 R$ {transaction.amount}</span>
            </div>
            <div className="text-gray-300">{transaction.category} - {transaction.description}</div>
          </li>
        )).reverse()}
      </ul>
    </div>
  );
}

