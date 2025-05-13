import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log("THEEEEEEEEEEEEEEEEEEEEERE");
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('id');
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  console.log("ID ??? ", movieId);

  if (!movieId || !accessToken) {
    return NextResponse.json({ error: 'Missing movie ID or access token' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });
    console.log("👉 API: /get-movie called with ID:", movieId);

    if (!response.ok) {
      return NextResponse.json({ error: `TMDB error: ${response.statusText}` }, { status: response.status });
    }

    const movie = await response.json();

    return NextResponse.json(movie);
  } catch (error) {
    console.error('TMDB fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}
