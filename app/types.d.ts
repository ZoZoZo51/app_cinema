interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
};

interface Tab {
  id: number
  title: string
  userOnly?: boolean
} 