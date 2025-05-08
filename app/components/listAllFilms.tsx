import { useEffect, useState } from 'react';
import Image from 'next/image';

const ListAllFilms = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const res = await fetch(`/api/TMBD/all-movies?page=${currentPage}`);
      const data = await res.json() as {results: Movie[], totalPages: number}
      const uniqueMovies = data.results.filter((movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
      );
      setMovies(uniqueMovies);
      setTotalPages(data.totalPages);

      setLoading(false);
    };
    fetchMovies();
  }, [currentPage]);


  const handleAddMovie = async (movie: Movie) => {
    const res = await fetch('/api/user/watched-movies', {
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

    if (res.ok)
      alert(`✅ Film "${movie.title}" ajouté à votre liste de films vus !`);
  };
  

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700 animate-pulse">Chargement...</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
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
                <button onClick={() => handleAddMovie(movie)} className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow">
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-lg font-medium">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ListAllFilms;
