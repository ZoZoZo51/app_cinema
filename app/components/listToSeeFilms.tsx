'use client';

import { useEffect, useState } from 'react';

const ListToSeeFilms = (props: TabProps) => {
  const [toseeMovies, setToSeeMovies] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToSeeFilms = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/user/tosee-movies/liste');
        if (!res.ok) throw new Error('Erreur lors de la récupération des films');
        const data = await res.json();

        setToSeeMovies(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchToSeeFilms();
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

    return (
    <div className={`${props.hidden ? 'hidden' : ''} p-4 space-y-10`}>
      {toseeMovies.length > 0 ? toseeMovies.map(({ id, title }) => (
        <div key={id} className="flex items-center gap-4">
          <span className="text-lg font-medium">{title}</span>
        </div>
      )) : (
        <p className="text-gray-700">Aucun film enregistré dans votre liste de Films à regarder</p>
      )}
    </div>
  );
};

export default ListToSeeFilms;
