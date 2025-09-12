'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/atoms/Card/Card';
import Button from '@/components/atoms/Button/Button';
import Title from '@/components/atoms/Title/Title';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { API_BASE_URL } from '@/lib/api/config';

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

    try {
      // 使用您提供的有效方法解码Token
      const decodedToken = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
      console.log(decodedToken)
      const userId = decodedToken.sub; // 假设载荷中的用户ID字段是 'id'

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      // 使用新的接口和从Token中获取的用户ID来请求用户信息
      fetch(`${API_BASE_URL}/api/user-profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch user profile');
          }
          return res.json();
        })
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          //localStorage.removeItem('token');
          //router.push('/login');
        });
    } catch (error) {
      console.error('Token validation or data fetching failed:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
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
        {/* 您可以根据新接口返回的数据结构，在这里展示更多信息 */}
        <p><strong>Roles:</strong> {user?.roles?.map((r: any) => r.role.name).join(', ') || 'N/A'}</p>
        <p><strong>Groups:</strong> {user?.userGroups?.map((g: any) => g.group.name).join(', ') || 'N/A'}</p>
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
