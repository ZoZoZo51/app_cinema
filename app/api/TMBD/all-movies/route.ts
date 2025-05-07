import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appPage = parseInt(searchParams.get('page') || '1', 10);
    const accessToken = process.env.TMBD_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('TMDB access token manquant');
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    let allMovies: Movie[] = [];
    let totalPagesAPI = 0;

    // Calcul des pages API à charger pour cette page app
    const startPage = (appPage - 1) * 5 + 1;
    const endPage = startPage + 4;

    for (let page = startPage; page <= endPage; page++) {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}`, options);

      if (!response.ok) {
        throw new Error(`Erreur API TMDB sur la page ${page}`);
      }

      const data = await response.json();

      if (page === startPage) {
        totalPagesAPI = data.total_pages;
      }

      if (data.results && data.results.length > 0) {
        allMovies = [...allMovies, ...data.results];
      }
    }

    const totalPagesApp = Math.floor((totalPagesAPI + 4) / 5);

    return NextResponse.json({ results: allMovies, totalPages: totalPagesApp });
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des films' }, { status: 500 });
  }
}
