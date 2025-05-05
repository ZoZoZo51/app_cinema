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
      const data = await res.json();
      setMovies(data);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {movies.map((movie) => (
        <div key={movie.id} className="pt-2 flex flex-col items-center w-[200px]">
          <h2 className="flex items-center text-center text-lg font-semibold mb-2 line-clamp-2 h-14">{movie.title}</h2>
          {movie.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
              className="rounded-lg shadow-md"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ListAllFilms