interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
};

interface WatchedMovie {
  id: number;
  movieId: number;
  title: string;
  watchedAt: Date;
}

interface ToSeeMovie {
  id: number;
  movieId: number;
  title: string;
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
}