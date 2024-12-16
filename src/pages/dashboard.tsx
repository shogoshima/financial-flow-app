import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getCookie } from '@/bin/cookie';
import { getUser } from '@/actions/profile';
import { AuthService } from '@/services/auth.service';
// import { UserService } from '@/services/user.service';
import { AddTransactionForm } from '@/components';
// import { getTransactions } from '@/actions/data';
import { Transaction } from '@/models';

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

      // fetch userId using token
    //   const userPayload = await fetch(`/api/auth/${token}`);
    //   if (userPayload.ok) {
    //     const user = await userPayload.json();
    //     console.log("[dashboard.tsx] user", user);
    //     setUserIdBd(user.userId);
    //   } else {
    //     console.log("[dashboard.tsx] no user found");
    //     router.push('/');
    //   }
      
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
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <nav>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/goals">Goals</Link></li>
          <li><Link href="/budget">Budget</Link></li>
          <li><Link href="/transactions">Transactions</Link></li>
        </ul>
      </nav>

      <h2>Add Transaction</h2>
      <AddTransactionForm onAddTransaction={handleAddTransaction} token={token} />
      <h2>Transactions</h2>
      <ul>
        {transactions?.map((transaction) => (
          <li key={transaction.id}>
            - {transaction.date}: {transaction.type} - {transaction.amount} ({transaction.category}) - {transaction.description}
          </li>
        ))}
      </ul>
    </div>
  );
}