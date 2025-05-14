import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'Paramètre "query" requis.' }, { status: 400 });
  }

  const accessToken = process.env.TMBD_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ error: 'TMDB access token manquant.' }, { status: 500 });
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  };

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR&include_adult=false`,
      options
    );

    if (!res.ok) {
      throw new Error(`Erreur TMDB: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json({ results: data.results, totalResults: data.total_results });
  } catch (err) {
    console.error('Erreur lors de la recherche TMDB :', err);
    return NextResponse.json({ error: 'Erreur serveur lors de la recherche.' }, { status: 500 });
  }
}
