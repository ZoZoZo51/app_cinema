'use client';

import { useEffect, useState } from 'react';

const ListToSeeFilms = (props: TabProps) => {
  const [toseeMovies, setToSeeMovies] = useState<{
          releasedMovies: ToSeeMovie[],
          inTheatersMovies: ToSeeMovie[],
          upcomingMovies: ToSeeMovie[],
        }>({
          releasedMovies: [],
          inTheatersMovies: [],
          upcomingMovies: [],
        });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categorizeMovies = (movies: ToSeeMovie[]) => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];

    const alreadyOutMovies: ToSeeMovie[] = [];
    const thisWeekMovies: ToSeeMovie[]= [];
    const upcomingMovies: ToSeeMovie[] = [];

    movies.forEach(movie => {
      const releaseDateStr = new Date(movie.releaseDate).toISOString().split('T')[0];

      if (releaseDateStr < currentDate) {
        alreadyOutMovies.push(movie);
      } else if (releaseDateStr >= getWeekBefore(currentDate) && releaseDateStr <= getWeekAfter(currentDate)) {
        thisWeekMovies.push(movie);
      } else {
        upcomingMovies.push(movie);
      }
    });

    return { releasedMovies: alreadyOutMovies, inTheatersMovies: thisWeekMovies, upcomingMovies };
  };

  const getWeekAfter = (currentDate: string) => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() + 7);
    return current.toISOString().split('T')[0];
  };
  const getWeekBefore = (currentDate: string) => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() - 7);
    return current.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchToSeeFilms = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/user/tosee-movies/liste');
        if (!res.ok) throw new Error('Erreur lors de la récupération des films');
        const data = await res.json();

        const { releasedMovies, inTheatersMovies, upcomingMovies } = categorizeMovies(data);

        setToSeeMovies({
          releasedMovies,
          inTheatersMovies,
          upcomingMovies,
        });

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchToSeeFilms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.refresh]);

  if (loading) {
    return (
      <div className={`${props.hidden ? 'hidden' : ''} flex items-center justify-center min-h-screen`}>
        <p className="text-xl text-gray-700 animate-pulse">Chargement des films à voir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${props.hidden ? 'hidden' : ''} flex items-center justify-center min-h-screen`}>
        <p className="text-xl text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  return (<>
    <div className={`${props.hidden ? 'hidden' : ''} p-4 space-y-10`}>
      <div className="grid grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Films déjà sortis</h3>
          {toseeMovies.releasedMovies.length > 0 ? (
            toseeMovies.releasedMovies.map(({ id, title, releaseDate }) => (
              <div key={id} className="flex items-center gap-4">
                <span className="text-lg font-medium">{title} ({new Date(releaseDate).getFullYear()})</span>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Aucun film sorti récemment.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Films sorti en salle cette semaine</h3>
          {toseeMovies.inTheatersMovies.length > 0 ? (
            toseeMovies.inTheatersMovies.map(({ id, title }) => (
              <div key={id} className="flex items-center gap-4">
                <span className="text-lg font-medium">{title}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Aucun film en salle cette semaine.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Films à venir</h3>
          {toseeMovies.upcomingMovies.length > 0 ? (
            toseeMovies.upcomingMovies.map(({ id, title, releaseDate }) => (
              <div key={id} className="flex items-center gap-4">
                <span className="text-lg font-medium">{title} ({new Date(releaseDate).toLocaleDateString('fr-FR')})</span>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Aucun film à venir.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ListToSeeFilms;
