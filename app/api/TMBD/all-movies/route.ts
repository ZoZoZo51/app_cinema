import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.TMBD_ACCESS_TOKEN;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    let allMovies: Movie[] = [];

    for (let page = 1; page <= 10; page++) {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}`, options);
      if (!response.ok) {
        throw new Error(`Erreur API TMDB`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        allMovies = [...allMovies, ...data.results];
      }
    }

    allMovies.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(allMovies);
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des films' }, { status: 500 });
  }
}
