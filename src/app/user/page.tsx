'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

    // 获取用户信息（这里假设有 /api/user 接口）
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>User Profile</h1>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
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
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: '1rem',
  },
  logoutButton: {
    marginTop: '1.5rem',
    padding: '0.6rem 1.2rem',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#e00',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
