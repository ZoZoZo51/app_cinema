import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  const { movieId, title, release_date } = data;
  if (!movieId || !title || !release_date) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.movie.upsert({
      where: { id: movieId },
      update: {
        releaseDate: new Date(release_date),
      },
      create: {
        id: movieId,
        title,
        releaseDate: new Date(release_date),
      },
    });

    await prisma.toSeeMovie.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: movieId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        movieId: movieId,
        releaseDate: new Date(release_date),
      },
    });

    return NextResponse.json({ message: 'Movie added to the ToSee list' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
