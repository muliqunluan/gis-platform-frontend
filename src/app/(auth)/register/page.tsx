'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {Input} from '@/components/atoms/Input/Input';
import Button from '@/components/atoms/Button/Button';
import Card from '@/components/atoms/Card/Card';
import Title from '@/components/atoms/Title/Title';
import ErrorMessage from '@/components/atoms/ErrorMessage/ErrorMessage';
import TextLink from '@/components/atoms/TextLink/TextLink';
import { API_BASE_URL } from '@/lib/api/config';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/login');
    } else {
      setError(data.message || 'Registration failed');
    }
  }

  function goToLogin() {
    router.push('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card>
        <Title>Create an Account</Title>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 text-left">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <Button type="submit">Register</Button>
          <ErrorMessage message={error} />
        </form>
        <div className="mt-6 text-sm text-gray-600 flex justify-center items-center">
          <span>Already have an account?</span>
          <TextLink onClick={goToLogin}>Login</TextLink>
        </div>
      </Card>
    </div>
  );
}
