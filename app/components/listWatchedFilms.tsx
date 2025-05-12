import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';

interface Props {
  active: boolean;
}

const ListWatchedFilms = (props: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      setLoading(true);
      const res = await fetch('/api/user/get-watched-movies');
      const data = await res.json();
      setMovies(data.movies);
      setLoading(false);
    };

    fetchWatchedMovies();
  }, []);

  const handleAddToSeeMovie = async (movie: Movie) => {
    const res = await fetch('/api/user/tosee-movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
      }),
    });

    const result = await res.json();
    if (res.ok)
      alert(`✅ ${movie.title} ajouté à votre liste de films à voir !`);
    else
      alert(`Erreur : ${result.error}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700 animate-pulse">Chargement...</p>
    </div>
  );

  return (
    <div className={`flex flex-col items-center ${props.active ? '' : 'hidden'}`}>
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {movies.map((movie) => (
          <div key={movie.id} className="pt-2 flex flex-col items-center w-[200px]">
            <h2 className="flex items-center text-center text-lg font-semibold mb-2 line-clamp-2 h-14">{movie.title}</h2>
            {movie.poster_path && (
              <div className="relative inline-block">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
                />
                <button onClick={() => handleAddToSeeMovie(movie)} className="absolute bottom-2 left-2 bg-blue-500 hover:bg-blue-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow">
                  <FaEye />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListWatchedFilms;
