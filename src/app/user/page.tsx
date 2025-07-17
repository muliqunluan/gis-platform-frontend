'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/atoms/Card/Card';
import Button from '@/components/atoms/Button/Button';
import Title from '@/components/atoms/Title/Title';
import {Spinner} from '@/components/atoms/Spinner/Spinner';

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 获取用户信息接口未实现
    fetch('http://localhost:3001/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  if (loading) return <Spinner />;

  return (
    <div style={styles.container}>
      <Card>
        <Title>User Profile</Title>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
        <Button onClick={handleLogout}>Logout</Button>
      </Card>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
};
