'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {Input} from '@/components/atoms/Input/Input';
import Button from '@/components/atoms/Button/Button';
import {Label} from '@/components/atoms/Label/Label';
import ErrorMessage from '@/components/atoms/ErrorMessage/ErrorMessage';
import Card from '@/components/atoms/Card/Card';
import Title from '@/components/atoms/Title/Title';
import TextLink from '@/components/atoms/TextLink/TextLink';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.access_token);
      // 同时设置cookie，有效期7天
      document.cookie = `token=${data.access_token}; path=/; max-age=${60*60*24*7}`;
      router.push('/');
    } else {
      setError(data.message || 'Login failed');
    }
  }

  function goToRegister() {
    router.push('/register');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card>
        <Title>Welcome Back</Title>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          <Button type="submit">Login</Button>
          <ErrorMessage message={error} />
        </form>
        <div className="mt-6 text-sm text-gray-600 flex justify-center items-center">
          <span>Don't have an account?</span>
          <TextLink onClick={goToRegister}>Register</TextLink>
        </div>
      </Card>
    </div>
  );
}
