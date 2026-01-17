'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(username, email, password, name, title || undefined);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">EKIN</h1>
        <p className="text-xl mb-12">join</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2">
              username <span className="text-gray-500">(lowercase, your public url)</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              pattern="[a-z0-9_-]+"
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
              placeholder="jakehbradley"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
              placeholder="Jake Bradley"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm mb-2">
              title <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
              placeholder="Product Engineer"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-black text-white px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-6 py-4 text-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'creating account...' : 'sign up'}
          </button>
        </form>

        <p className="mt-8 text-sm">
          already have an account?{' '}
          <Link href="/login" className="underline hover:no-underline">
            log in
          </Link>
        </p>
      </div>
    </div>
  );
}
