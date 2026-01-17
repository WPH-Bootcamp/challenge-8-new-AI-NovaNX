export type FavoriteMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  trailer_key?: string | null;
  added_at: string;
};

const STORAGE_KEY = "movie-explorer:favorites:v1";

function safeParseFavorites(raw: string | null): FavoriteMovie[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is FavoriteMovie => {
        if (!item || typeof item !== "object") return false;
        const anyItem = item as Record<string, unknown>;
        return (
          typeof anyItem.id === "number" &&
          typeof anyItem.title === "string" &&
          typeof anyItem.overview === "string" &&
          (anyItem.poster_path === null ||
            typeof anyItem.poster_path === "string") &&
          typeof anyItem.vote_average === "number" &&
          typeof anyItem.added_at === "string"
        );
      })
      .sort((a, b) => (a.added_at < b.added_at ? 1 : -1));
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteMovie[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors (private mode, quota, etc)
  }
}

export function getFavorites(): FavoriteMovie[] {
  if (typeof window === "undefined") return [];
  return safeParseFavorites(localStorage.getItem(STORAGE_KEY));
}

export function isFavorite(movieId: number): boolean {
  return getFavorites().some((m) => m.id === movieId);
}

export function addFavorite(
  movie: Omit<FavoriteMovie, "added_at">
): FavoriteMovie[] {
  const current = getFavorites();
  const next: FavoriteMovie[] = [
    { ...movie, added_at: new Date().toISOString() },
    ...current.filter((m) => m.id !== movie.id),
  ];
  writeFavorites(next);
  return next;
}

export function removeFavorite(movieId: number): FavoriteMovie[] {
  const current = getFavorites();
  const next = current.filter((m) => m.id !== movieId);
  writeFavorites(next);
  return next;
}

export function toggleFavorite(movie: Omit<FavoriteMovie, "added_at">): {
  favorites: FavoriteMovie[];
  isNowFavorite: boolean;
} {
  const current = getFavorites();
  const exists = current.some((m) => m.id === movie.id);
  if (exists) {
    return { favorites: removeFavorite(movie.id), isNowFavorite: false };
  }
  return { favorites: addFavorite(movie), isNowFavorite: true };
}
