import { useEffect, useState } from 'react';
import Image from 'next/image';

const ListAllFilms = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      console.log("before")
      const res = await fetch('/api/TMBD/all-movies');
      console.log("after")
      const data = await res.json() as Movie[];
      const uniqueMovies = data.filter((movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
      );
      setMovies(uniqueMovies);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700 animate-pulse">Chargement...</p>
    </div>
  );
  
  return (
    <div className="flex flex-wrap gap-4 justify-center">
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
              <button className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow">
                +
              </button>
          </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ListAllFilms