'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { getWeekStart, formatWeek, getPreviousWeek, getNextWeek, isCurrentWeek } from '@/lib/week';

interface Update {
  id: string;
  content: string;
  publishedAt: string | null;
  weekStart: string;
  user: {
    id: string;
    username: string;
    name: string;
    title?: string | null;
  };
}

export default function DashboardPage() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      fetchUpdates();
    }
  }, [token, weekStart]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/updates?week=${weekStart.toISOString().split('T')[0]}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUpdates(data.updates);
      }
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setWeekStart(getPreviousWeek(weekStart));
  };

  const handleNextWeek = () => {
    if (!isCurrentWeek(weekStart)) {
      setWeekStart(getNextWeek(weekStart));
    }
  };

  const handleCurrentWeek = () => {
    setWeekStart(getWeekStart());
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">EKIN</h1>
            <p className="text-lg">JUST DO IT</p>
          </div>
          <div className="text-right">
            <Link href={`/${user.username}`} className="text-sm underline hover:no-underline mb-2 block">
              my profile
            </Link>
            <button
              onClick={logout}
              className="text-sm underline hover:no-underline"
            >
              log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {isCurrentWeek(weekStart) && (
          <div className="mb-12">
            <Link
              href="/ship"
              className="inline-block bg-black text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 transition-colors"
            >
              post update
            </Link>
          </div>
        )}

        {loading ? (
          <p>loading updates...</p>
        ) : updates.length === 0 ? (
          <div className="border-2 border-black p-12 text-center">
            <p className="text-xl">nothing yet this week</p>
          </div>
        ) : (
          <div className="space-y-8">
            {updates.map((update) => (
              <div key={update.id} className="border-2 border-black p-6">
                <div className="mb-4">
                  <Link
                    href={`/${update.user.username}`}
                    className="text-xl font-bold hover:underline"
                  >
                    {update.user.name}
                  </Link>
                  {update.user.title && (
                    <p className="text-sm text-gray-600">{update.user.title}</p>
                  )}
                </div>
                <div className="space-y-3">
                  {update.content.split('\n').filter(item => item.trim()).map((item, index) => (
                    <div key={index} className="border-2 border-black p-4 bg-white">
                      <p className="text-lg leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
