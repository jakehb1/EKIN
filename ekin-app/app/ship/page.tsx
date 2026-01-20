'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { formatWeek, getWeekStart } from '@/lib/week';

const MAX_CHARS = 280;

export default function ShipPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      fetchCurrentUpdate();
    }
  }, [token]);

  const fetchCurrentUpdate = async () => {
    try {
      const res = await fetch('/api/updates/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.update) {
          const lines = data.update.content.split('\n');
          setItems(lines.length > 0 ? lines : ['', '', '']);
        }
      }
    } catch (error) {
      console.error('Failed to fetch update:', error);
    }
  };

  const saveDraft = async () => {
    const content = items.filter(item => item.trim()).join('\n');
    if (!content.trim()) return;

    try {
      setSavingDraft(true);
      setError('');

      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          publish: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'failed to save draft');
      }

      setSuccess('draft saved');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to save');
    } finally {
      setSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    const content = items.filter(item => item.trim()).join('\n');

    if (!content.trim()) {
      setError('write something first');
      return;
    }

    if (content.length > MAX_CHARS) {
      setError(`too long — ${MAX_CHARS} chars max`);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          publish: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'failed to publish');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to publish');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save draft
  useEffect(() => {
    if (items.every(item => !item.trim())) return;

    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [items]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>loading...</p>
      </div>
    );
  }

  const totalContent = items.filter(item => item.trim()).join('\n');
  const charsLeft = MAX_CHARS - totalContent.length;
  const isOverLimit = charsLeft < 0;

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItem = () => {
    if (items.length < 5) {
      setItems([...items, '']);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <Link href="/dashboard" className="text-lg hover:opacity-50 transition-opacity">
            ← back
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-2">post update</h1>
          <p className="text-lg">JUST DO IT</p>
          <div className="mt-4 border-t-2 border-black pt-4">
            <p className="text-sm text-gray-600">posting for:</p>
            <p className="text-xl font-bold">{formatWeek(getWeekStart())}</p>
          </div>
        </header>

        <main>
          <div className="mb-4">
            <label className="block text-sm mb-2">
              what you got done this week <span className="text-gray-500">(up to 5 things, {MAX_CHARS} chars total)</span>
            </label>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className={`flex-1 px-4 py-3 border-2 focus:outline-none focus:ring-0 text-lg ${
                      isOverLimit ? 'border-red-600' : 'border-black'
                    }`}
                    placeholder={`Thing ${index + 1}`}
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {items.length < 5 && (
              <button
                onClick={addItem}
                className="mt-3 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm"
                type="button"
              >
                + add another
              </button>
            )}
            <div className="flex justify-between items-center mt-2">
              <p
                className={`text-sm ${
                  isOverLimit
                    ? 'text-red-600 font-bold'
                    : charsLeft < 50
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {isOverLimit ? `${Math.abs(charsLeft)} chars over limit` : `${charsLeft} chars left`}
              </p>
              {savingDraft && <p className="text-sm text-gray-500">saving...</p>}
              {success && <p className="text-sm text-gray-600">{success}</p>}
            </div>
          </div>

          {error && (
            <div className="bg-black text-white px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePublish}
              disabled={loading || isOverLimit || items.every(item => !item.trim())}
              className="bg-black text-white px-8 py-4 text-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              {loading ? 'publishing...' : 'publish'}
            </button>

            <Link
              href="/dashboard"
              className="border-2 border-black px-8 py-4 text-lg font-bold hover:bg-black hover:text-white transition-colors inline-block text-center touch-manipulation"
            >
              cancel
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            drafts auto-save. you can edit this until sunday midnight.
          </p>
        </main>
      </div>
    </div>
  );
}
