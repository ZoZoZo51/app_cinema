import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaClapperboard } from 'react-icons/fa6';

const ListAllFilms = (props: TabProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [toSeeMovies, setToSeeMovies] = useState<ToSeeMovie[]>([]);

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

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      const res = await fetch('/api/user/watched-movies/liste');
      const data = await res.json();
      setWatchedMovies(data);
    };

    const fetchToSeeMovies = async () => {
      const res = await fetch('/api/user/tosee-movies/liste');
      const data = await res.json();
      setToSeeMovies(data);
    };

    fetchWatchedMovies();
    fetchToSeeMovies();
  }, [props.refresh]);

  const isWatched = (movieId: number) => {
    if (!('length' in watchedMovies) || watchedMovies.length === 0) return false;
    return watchedMovies.some((watchedMovie) => watchedMovie.id === movieId);
  }

  const isToSee = (movieId: number) => {
    if (!('length' in toSeeMovies) || toSeeMovies.length === 0) return false;
    return toSeeMovies.some((toSeeMovie) => toSeeMovie.id === movieId);
  }

  const handleWatchedMovie = async (movie: Movie, remove?: boolean) => {
    const res = await fetch(remove ? '/api/user/watched-movies/delete' : '/api/user/watched-movies', {
      method: remove ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        release_date: movie.release_date,
      }),
    });
    
    const result = await res.json();
    if (res.ok) {
      alert(`${remove ? '❌' : '✅'} ${movie.title} ${remove ? 'retiré de' : 'ajouté à'} votre liste de films vus !`);
      props.setRefresh(!props.refresh);
    } else {
      alert(`Erreur : ${result.error}`);
    }
  };

  const handleToSeeMovie = async (movie: Movie, remove?: boolean) => {
    const res = await fetch(remove ? '/api/user/tosee-movies/delete' : '/api/user/tosee-movies', {
      method: remove ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        release_date: movie.release_date,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert(`👍 ${movie.title} ${remove ? 'retiré' : 'ajouté'} à votre liste de films à voir !`);
      props.setRefresh(!props.refresh);
    } else {
      alert(`Erreur : ${result.error}`);
    }
  };

  if (loading) return (
    <div className={`${props.hidden ? 'hidden' : ''} flex items-center justify-center min-h-screen`}>
      <p className="text-xl text-gray-700 animate-pulse">Chargement...</p>
    </div>
  );

  return (
    <div className={`${props.hidden ? 'hidden' : ''} flex flex-col items-center`}>
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
                  onClick={() => {
                    props.setCurrentMovieId(movie.id);
                    props.setRefresh(!props.refresh);
                  }}
                />
                {props.user && (<>
                  {isWatched(movie.id) ? (
                    <button
                      onClick={() => handleWatchedMovie(movie, true)}
                      className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow"
                    >
                      X
                    </button>
                  ) : (
                    <button
                      onClick={() => handleWatchedMovie(movie)}
                      className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow"
                    >
                      +
                    </button>
                  )}

                  {isToSee(movie.id) ? (
                    <button
                      onClick={() => handleToSeeMovie(movie, true)}
                      className="absolute bottom-2 left-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow"
                    >
                      <FaEyeSlash />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToSeeMovie(movie)}
                      className="absolute bottom-2 left-2 bg-blue-500 hover:bg-blue-600 text-white rounded w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer shadow"
                    >
                      <FaEye />
                    </button>
                  )}
                </>)}
              </div>)}

              {movie.vote_count > 0 ? <div className="flex items-center mt-2 flex-col">
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaClapperboard
                      key={i}
                      className={`w-6 h-6 mr-1 ${i < Math.round(movie.vote_average / 2) ? "text-yellow-600" : "text-gray-700"}`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm font-bold text-black">({(movie.vote_average / 2).toFixed(1)})</span>
              </div> : <div className="flex items-center mt-2">
                <span className="ml-1 text-sm font-bold text-black italic">Pas de note</span>
              </div>}
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
