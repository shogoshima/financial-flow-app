import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getCookie } from '@/bin/cookie';
import { getUser } from '@/actions/profile';
import { AuthService } from '@/services/auth.service';
// import { UserService } from '@/services/user.service';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userIdBd, setUserIdBd] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie('token');
      console.log("[dashboard.tsx] reading token from cookie", token);
      if (!token) {
        router.push('/');
        return;
      }

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
    </div>
  );
}