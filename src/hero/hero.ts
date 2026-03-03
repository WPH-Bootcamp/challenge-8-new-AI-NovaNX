export type HeroProps = {
  title?: string;
  description?: string;
};

export type TmdbMovie = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  vote_average?: number;
  backdrop_path: string | null;
};

export type TmdbListResponse = {
  results: TmdbMovie[];
};

export type TmdbVideosResponse = {
  results: Array<{
    id: string;
    key: string;
    site: string;
    type: string;
    name: string;
  }>;
};

export function getTmdbImageUrl(path: string) {
  return `https://image.tmdb.org/t/p/original${path}`;
}
