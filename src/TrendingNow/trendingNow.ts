export type TrendingNowMovie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
};

export type TrendingNowListResponse = {
  results: TrendingNowMovie[];
};
