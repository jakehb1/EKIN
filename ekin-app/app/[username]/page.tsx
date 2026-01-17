import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatWeek } from '@/lib/week';
import { prisma } from '@/lib/prisma';

async function getUserProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        title: true,
      },
    });

    if (!user) {
      return null;
    }

    const updates = await prisma.update.findMany({
      where: {
        userId: user.id,
        publishedAt: { not: null },
      },
      orderBy: {
        weekStart: 'desc',
      },
      select: {
        id: true,
        content: true,
        weekStart: true,
      },
    });

    return { user, updates };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getUserProfile(username);

  if (!data) {
    notFound();
  }

  const { user, updates } = data;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b-4 border-black pb-8">
          <div className="mb-4">
            <Link href="/" className="text-sm hover:underline">
              ← EKIN
            </Link>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-2">{user.name}</h1>
          {user.title && <p className="text-xl text-gray-600">{user.title}</p>}
          <p className="text-sm text-gray-500 mt-4">
            ekin.io/{user.username}
          </p>
        </header>

        <main>
          <h2 className="text-2xl font-bold mb-8">weekly history</h2>

          {updates.length === 0 ? (
            <div className="border-2 border-black p-12 text-center">
              <p className="text-xl">nothing yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {updates.map((update: any) => (
                <div key={update.id} className="border-2 border-black p-6">
                  <p className="text-sm font-bold mb-3">
                    {formatWeek(new Date(update.weekStart))}
                  </p>
                  <div className="space-y-3">
                    {update.content.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => (
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
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getUserProfile(username);

  if (!data) {
    return {
      title: 'User not found — EKIN',
    };
  }

  return {
    title: `${data.user.name} — EKIN`,
    description: `what ${data.user.name} got done`,
  };
}
