'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  function goToUser() {
    router.push('/user');
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Home Page</h1>
        <p>Welcome! You are logged in.</p>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={goToUser}>Go to Profile</button>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
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
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  button: {
    padding: '0.6rem 1.2rem',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '0.6rem 1.2rem',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#e00',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
