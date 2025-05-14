import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaClapperboard } from 'react-icons/fa6';

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
};

const MovieInfo = (props: TabProps) => {
  const getMovieDetails = async (id: string): Promise<MovieDetail | null> => {
    try {
      const res = await fetch(`/api/TMBD/movie-info?id=${id}`);

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const [movie, setMovie] = useState<MovieDetail | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await getMovieDetails(props.currentMovieId?.toString() || '');
      if (movie) {
        setMovie(movie);
      } else {
        setMovie(null);
      }
    };

    fetchMovie();
  }, [props.currentMovieId]);

  return (
    <div className={`${props.hidden ? 'hidden' : ''} max-w-3xl mx-auto mt-12 p-6 bg-white`}>
      {movie ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-sm text-gray-500 mb-6">Sortie le : {movie.release_date}</p>
          <div className="flex flex-col md:flex-row gap-6">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-md"
              />
            )}
            <div>
              <p className="mb-4 text-gray-700">{movie.overview || "Aucun résumé disponible"}</p>
              <p className="font-medium flex items-center gap-2">
                Note moyenne : {(movie.vote_average / 2).toFixed(1)}
                <FaClapperboard className="text-yellow-600" />
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-500">Erreur lors de la récupération du film</p>
      )}
    </div>
  );
}

export default MovieInfo;
