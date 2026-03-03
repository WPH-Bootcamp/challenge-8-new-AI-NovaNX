import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PlayMobileIcon from "../assets/PlayMobile.svg";

import { api } from "../lib/api";

import {
  getTmdbImageUrl,
  type HeroProps,
  type TmdbListResponse,
  type TmdbVideosResponse,
} from "./hero";

export default function Hero({
  title = "The Gorge",
  description = "Two highly trained operatives grow close from a distance after being sent to guard opposite sides of a mysterious gorge. When an evil below emerges, they must work together to survive what lies within.",
}: HeroProps) {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["tmdb", "movie", "now_playing", "hero"],
    queryFn: async () => {
      const response = await api.get<TmdbListResponse>("/movie/now_playing", {
        params: { language: "en-US", page: 1 },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const movieWithBackdrop = data?.results?.find((m) => !!m.backdrop_path);
  const backdropUrl = movieWithBackdrop?.backdrop_path
    ? getTmdbImageUrl(movieWithBackdrop.backdrop_path)
    : null;

  const backdropAlt = movieWithBackdrop?.title || movieWithBackdrop?.name || "";

  const heroTitle =
    movieWithBackdrop?.title || movieWithBackdrop?.name || title;
  const heroDescription = movieWithBackdrop?.overview || description;
  const heroMovieId = movieWithBackdrop?.id;

  const isValidMovieId = Number.isFinite(heroMovieId) && (heroMovieId ?? 0) > 0;

  const { data: videos } = useQuery({
    queryKey: ["tmdb", "movie", "videos", heroMovieId],
    enabled: isValidMovieId,
    queryFn: async () => {
      const id = heroMovieId as number;
      const response = await api.get<TmdbVideosResponse>(
        `/movie/${id}/videos`,
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

  return (
    <main className="relative z-0 w-full">
      <section className="mt-0 overflow-hidden bg-white/5">
        <div className="relative">
          <div className="h-[392px] max-h-[392px] w-full bg-white/10 sm:h-auto sm:aspect-[16/12]">
            {backdropUrl ? (
              <img
                src={backdropUrl}
                alt={backdropAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/80" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
              <h1 className="font-bold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-display)] text-[length:var(--font-size-display-xs)] leading-[var(--line-height-display-xs)]">
                {heroTitle}
              </h1>
              <p className="mt-3 font-normal tracking-[0] text-[color:var(--Neutral-400,_#A4A7AE)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-sm)] leading-[var(--line-height-text-sm)]">
                {heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section className="mt-6">
          <div className="space-y-3 pt-2">
            {trailerHref ? (
              <a
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#961200] px-6 font-semibold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-sm)] leading-[var(--line-height-text-sm)]"
                href={trailerHref}
                target="_blank"
                rel="noreferrer"
              >
                Watch Trailer
                <span className="grid size-4.5 place-items-center">
                  <img
                    src={PlayMobileIcon}
                    alt=""
                    aria-hidden="true"
                    className="size-4.5"
                  />
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white/10 px-6 font-semibold tracking-[0] text-white/50 ring-1 ring-white/10 [font-family:var(--font-family-body)] text-[length:var(--font-size-text-sm)] leading-[var(--line-height-text-sm)]"
              >
                Watch Trailer
              </button>
            )}

            <a
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#0A0D1299] px-6 font-semibold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-sm)] leading-[var(--line-height-text-sm)] backdrop-blur-[40px] border border-[color:var(--Neutral-900,_#181D27)]"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!heroMovieId) return;
                navigate(`/movie/${heroMovieId}`);
              }}
            >
              See Detail
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
