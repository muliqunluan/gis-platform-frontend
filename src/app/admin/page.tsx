// pages/admin.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserRoleChangeForm from '../../components/UserRoleChangeForm';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const decodedToken = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    console.log(decodedToken)
    setUser(decodedToken);

    if (!decodedToken.roles?.includes('admin')) {
  router.push('/');
}
 else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      <UserRoleChangeForm/>
    </div>
  );
}
