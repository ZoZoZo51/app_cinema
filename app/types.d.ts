interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
};

interface WatchedMovie {
  id: number;
  movieId: number;
  title: string;
  watchedAt: Date;
  rating: number | null;
}

interface ToSeeMovie {
  id: number;
  movieId: number;
  title: string;
  releaseDate: string;
}

interface Tab {
  id: number
  title: string
  userOnly?: boolean
} 

interface TabProps {
  hidden: boolean
  refresh: boolean
  setRefresh: (refresh: boolean) => void
  currentMovieId: number | null
  setCurrentMovieId: (id: number | null) => void
  user?: boolean
}