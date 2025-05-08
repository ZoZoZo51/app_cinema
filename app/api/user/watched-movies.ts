import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { movieId, title, posterPath } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.movie.upsert({
      where: { id: movieId },
      update: {},
      create: {
        id: movieId,
        title,
        posterPath,
      },
    });

    await prisma.watchedMovie.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: movieId,
        },
      },
      update: { watchedAt: new Date() },
      create: {
        userId: user.id,
        movieId: movieId,
      },
    });

    res.status(200).json({ message: 'Movie added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error' });
  }
}
