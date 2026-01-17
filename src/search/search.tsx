import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import arrowSearchMobile from "../assets/ArrowSearchMobile.svg";
import searchMovieMobile from "../assets/SearchMovieMobile.svg";
import heartEmpty from "../assets/HeartMobile.svg";
import heartFilled from "../assets/HeartFilledMobile.svg";

import { api } from "../lib/api";
import { getTmdbImageUrl, type TmdbSearchResponse } from "./search";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../favorites/favorites";
import type { TmdbVideosResponse } from "../detail/detail";

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [favorited, setFavorited] = useState(false);

  const handleBack = () => {
    // If the user landed on /search directly (no meaningful app history),
    // navigating -1 can lead outside the app; fallback to home.
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const { data } = useQuery({
    queryKey: ["tmdb", "search", "movie", deferredQuery],
    enabled: deferredQuery.trim().length > 0,
    queryFn: async () => {
      const response = await api.get<TmdbSearchResponse>("/search/movie", {
        params: {
          query: deferredQuery,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
      });
      return response.data;
    },
    staleTime: 60 * 1000,
  });

  const firstMovieWithImage = data?.results?.find(
    (m) => !!(m.poster_path || m.backdrop_path)
  );

  const firstMovieId = firstMovieWithImage?.id;

  const { data: videos } = useQuery({
    queryKey: ["tmdb", "movie", "videos", firstMovieId],
    enabled: Number.isFinite(firstMovieId) && (firstMovieId ?? 0) > 0,
    queryFn: async () => {
      const response = await api.get<TmdbVideosResponse>(
        `/movie/${firstMovieId}/videos`,
        {
          params: { language: "en-US" },
        }
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const trailer = useMemo(() => {
    const items = videos?.results ?? [];
    return (
      items.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      items.find((v) => v.site === "YouTube") ||
      null
    );
  }, [videos]);

  const trailerHref = trailer?.key
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  useEffect(() => {
    if (!firstMovieWithImage) {
      setFavorited(false);
      return;
    }
    setFavorited(isFavorite(firstMovieWithImage.id));
  }, [firstMovieWithImage?.id]);

  const onFavoriteClick = () => {
    if (!firstMovieWithImage) return;

    if (favorited) {
      removeFavorite(firstMovieWithImage.id);
      setFavorited(false);
      toast("Removed from favorites");
      return;
    }

    addFavorite({
      id: firstMovieWithImage.id,
      title: firstMovieWithImage.title,
      overview: firstMovieWithImage.overview ?? "",
      poster_path: firstMovieWithImage.poster_path,
      vote_average: firstMovieWithImage.vote_average ?? 0,
      trailer_key: trailer?.key ?? null,
    });

    setFavorited(true);
    toast("Added to favorites");
  };

  const favoriteIcon = favorited ? heartFilled : heartEmpty;

  const firstMovieImageUrl = firstMovieWithImage
    ? getTmdbImageUrl(
        firstMovieWithImage.poster_path || firstMovieWithImage.backdrop_path!
      )
    : null;

  useEffect(() => {
    // After clicking the search icon and navigating here, focus the input
    // so mobile browsers open the on-screen keyboard.
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 h-16">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            aria-label="Back"
            onClick={handleBack}
            className="grid size-10 place-items-center text-white/80"
          >
            <img
              src={arrowSearchMobile}
              alt=""
              aria-hidden="true"
              className="block size-6"
            />
          </button>

          <label className="relative w-full">
            <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-white/50">
              <img
                src={searchMovieMobile}
                alt=""
                aria-hidden="true"
                className="block size-5"
              />
            </span>
            <input
              ref={inputRef}
              autoFocus
              type="search"
              placeholder="Search Movie"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="relative z-0 h-11 max-h-11 w-full rounded-xl border border-(--Neutral-800) bg-white/10 backdrop-blur-2xl pl-10 pr-4 text-sm font-normal leading-5 tracking-normal text-white placeholder:font-normal placeholder:text-white/40 outline-none [font-family:var(--font-family-body)]"
            />
          </label>
        </div>
      </header>

      {firstMovieWithImage && firstMovieImageUrl ? (
        <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6">
          <section className="flex gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <img
              src={firstMovieImageUrl}
              alt={firstMovieWithImage.title}
              loading="lazy"
              className="aspect-2/3 w-26 shrink-0 rounded-2xl bg-white/5 object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold leading-snug text-white">
                {firstMovieWithImage.title}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-4 text-yellow-400"
                  fill="currentColor"
                >
                  <path d="M12 17.3l-5.6 3 1.1-6.3L2.9 9.6l6.3-.9L12 3l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3Z" />
                </svg>
                <span className="text-white">
                  {Number.isFinite(firstMovieWithImage.vote_average)
                    ? `${firstMovieWithImage.vote_average.toFixed(1)}/10`
                    : "-"}
                </span>
              </div>

              <p className="mt-2 max-h-10 overflow-hidden text-sm leading-5 text-white/60">
                {firstMovieWithImage.overview}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <a
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white"
                  href={trailerHref ?? undefined}
                  target={trailerHref ? "_blank" : undefined}
                  rel={trailerHref ? "noreferrer" : undefined}
                  aria-disabled={!trailerHref}
                  onClick={(e) => {
                    if (!trailerHref) e.preventDefault();
                  }}
                >
                  Watch Trailer
                  <span className="grid size-6 place-items-center rounded-full bg-white/20">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-4"
                      fill="currentColor"
                    >
                      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                    </svg>
                  </span>
                </a>

                <button
                  type="button"
                  aria-label={
                    favorited ? "Remove from favorites" : "Add to favorites"
                  }
                  aria-pressed={favorited}
                  onClick={onFavoriteClick}
                  className="grid size-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15"
                >
                  <img
                    src={favoriteIcon}
                    alt=""
                    aria-hidden="true"
                    className="block size-6"
                  />
                </button>
              </div>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
