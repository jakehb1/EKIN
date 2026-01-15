import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        title: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'user not found' },
        { status: 404 }
      );
    }

    // Get all published updates for this user, ordered by week
    const updates = await prisma.update.findMany({
      where: {
        userId: user.id,
        publishedAt: { not: null },
      },
      orderBy: { weekStart: 'desc' },
    });

    return NextResponse.json({
      user,
      updates,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
