import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { movieId } = await req.json();

  if (!movieId) {
    return NextResponse.json({ error: 'Missing movieId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const deletedWatchedMovie = await prisma.watchedMovie.deleteMany({
      where: {
        userId: user.id,
        movieId: movieId,
      },
    });

    if (deletedWatchedMovie.count === 0) {
      return NextResponse.json({ error: 'Movie not found in the watched list' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Movie removed from watched list' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
