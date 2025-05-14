import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('id');
    const accessToken = process.env.TMBD_ACCESS_TOKEN;

    if (!movieId) {
      return NextResponse.json({ error: 'Erreur film ID' }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Erreur token TMDB' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=fr-FR`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Échec de la récupération du film' }, { status: response.status });
    }

    const movie = await response.json();

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Erreur lors de la récupération du film :', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
