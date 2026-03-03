export type TmdbMovieSearchResult = {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type TmdbSearchResponse = {
  results: TmdbMovieSearchResult[];
};

export function getTmdbImageUrl(path: string) {
  return `https://image.tmdb.org/t/p/original${path}`;
}
