export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  tagline?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  runtime?: number;
  genres?: TmdbGenre[];
};

export type TmdbCreditsResponse = {
  cast: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job?: string;
    department?: string;
    profile_path: string | null;
  }>;
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

export function formatRuntime(runtime?: number) {
  if (!runtime || runtime <= 0) return "-";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatReleaseDate(date?: string) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  // dd/mm/yyyy to match common mobile mock formatting
  return parsed.toLocaleDateString("en-GB");
}

export function formatReleaseDateLongId(date?: string) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
