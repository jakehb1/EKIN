import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { getWeekStart } from '@/lib/week';

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// GET /api/updates?week=YYYY-MM-DD or GET all team updates for current week
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekParam = searchParams.get('week');

    const weekStart = weekParam ? new Date(weekParam) : getWeekStart();

    // Get all updates for this week from all users
    const updates = await prisma.update.findMany({
      where: {
        weekStart,
        publishedAt: { not: null },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            title: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Get updates error:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/updates - Create or update a weekly update
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { content, publish } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: 'content must be 280 characters or less' },
        { status: 400 }
      );
    }

    const weekStart = getWeekStart();

    // Upsert the update
    const update = await prisma.update.upsert({
      where: {
        userId_weekStart: {
          userId,
          weekStart,
        },
      },
      update: {
        content,
        publishedAt: publish ? new Date() : undefined,
      },
      create: {
        userId,
        weekStart,
        content,
        publishedAt: publish ? new Date() : null,
      },
    });

    return NextResponse.json({ update });
  } catch (error) {
    console.error('Create/update error:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
