'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>loading...</p>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl">
        <h1 className="text-7xl md:text-9xl font-bold mb-8">EKIN</h1>
        <p className="text-3xl md:text-4xl mb-4">JUST DO IT</p>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl">
          a simple weekly tool. no extra fluff.<br />
          its about what you got done, on a weekly basis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="bg-black text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 transition-colors text-center"
          >
            join →
          </Link>
          <Link
            href="/login"
            className="border-2 border-black px-8 py-4 text-lg font-bold hover:bg-black hover:text-white transition-colors text-center"
          >
            log in
          </Link>
        </div>

        <div className="mt-16 border-t-2 border-black pt-8">
          <p className="text-sm text-gray-600 mb-4">how it works:</p>
          <ol className="list-decimal list-inside space-y-2 text-lg">
            <li>write what you did this week</li>
            <li>publish it</li>
            <li>let your team or boss see it (whoever is more important)</li>
            <li>go about your day knowing WHAT YOU GOT DONE</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
