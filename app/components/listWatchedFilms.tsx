'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Import de la locale française
import { FaClapperboard } from 'react-icons/fa6';

dayjs.locale('fr'); // Application de la locale française

const ListWatchedFilms = (props: TabProps) => {
  const [groupedMovies, setGroupedMovies] = useState<Record<string, WatchedMovie[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/user/watched-movies/liste');
        if (!res.ok) throw new Error('Erreur lors de la récupération des films');
        const data = await res.json();

        const grouped: Record<string, WatchedMovie[]> = {};
        data.forEach((movie: WatchedMovie) => {
          const date = dayjs(movie.watchedAt).format('YYYY-MM-DD');
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(movie);
        });

        setGroupedMovies(grouped);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [props.refresh]);

  if (loading) {
    return (
      <div className={`${props.hidden ? 'hidden' : ''} flex items-center justify-center min-h-screen`}>
        <p className="text-xl text-gray-700 animate-pulse">Chargement des films vus...</p>
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

  const sortedDates = Object.keys(groupedMovies).sort((a, b) => (dayjs(b).isAfter(dayjs(a)) ? 1 : -1));

  return (
    <div className={`${props.hidden ? 'hidden' : ''} p-4 space-y-10`}>
      {sortedDates.length > 0 ? sortedDates.map((date) => (
        <div key={date}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vu le {dayjs(date).format('DD MMMM YYYY')} : </h2>
          <ul className="space-y-4">
            {groupedMovies[date].map(({ id, title, rating }) => (
              <li key={id} className="flex items-center gap-4">
                <span className="text-lg font-bold">
                  {title}
                  {rating && (
                    <span className="ml-2 inline-flex items-center space-x-1">
                      ({[...Array(5)].map((_, i) => (
                        <FaClapperboard
                          key={i}
                          className={`w-5 h-5 ${i < rating ? 'text-yellow-600' : 'text-gray-400'}`}
                        />
                      ))})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700">Aucun film vu pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default ListWatchedFilms;
