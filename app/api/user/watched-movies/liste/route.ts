import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Utilisateur non connecté' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        watchedMovies: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const movies = user.watchedMovies.map((wm) => wm.movie);

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Erreur lors de la récupération des films vus:', error);
    return NextResponse.json({ error: 'Erreur interne lors de la récupération des films' }, { status: 500 });
  }
}
