import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Header from "../header/header.tsx";
import calendarMobile from "../assets/CalendarMobile.svg";
import playMobile from "../assets/PlayMobile.svg";
import heartEmpty from "../assets/HeartMobile.svg";
import heartFilled from "../assets/HeartFilledMobile.svg";
import star from "../assets/StarBlock.svg";
import videoIcon from "../assets/Video.svg";
import emojiHappy from "../assets/emoji-happy.svg";
import headerMobileIcon from "../assets/headerMobile.svg";
import { api } from "../lib/api";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../favorites/favorites";
import {
  formatReleaseDateLongId,
  formatRuntime,
  getTmdbImageUrl,
  type TmdbCreditsResponse,
  type TmdbMovieDetails,
  type TmdbVideosResponse,
} from "./detail";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);

  const id = Number(movieId);
  const isValidId = Number.isFinite(id) && id > 0;

  useEffect(() => {
    if (!isValidId) {
      setFavorited(false);
      return;
    }
    setFavorited(isFavorite(id));
  }, [id, isValidId]);

  const onFavoriteClick = () => {
    if (!details) return;

    if (favorited) {
      removeFavorite(details.id);
      setFavorited(false);
      toast("Removed from favorites");
      return;
    }

    addFavorite({
      id: details.id,
      title: details.title,
      overview: details.overview ?? "",
      poster_path: details.poster_path,
      vote_average: details.vote_average ?? 0,
      release_date: details.release_date,
      trailer_key: trailer?.key ?? null,
    });

    setFavorited(true);
    toast("Added to favorites");
    navigate("/favorites");
  };

  const favoriteIcon = favorited ? heartFilled : heartEmpty;

  const { data: details } = useQuery({
    queryKey: ["tmdb", "movie", "details", id],
    enabled: isValidId,
    queryFn: async () => {
      const response = await api.get<TmdbMovieDetails>(`/movie/${id}`, {
        params: { language: "en-US" },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: credits } = useQuery({
    queryKey: ["tmdb", "movie", "credits", id],
    enabled: isValidId,
    queryFn: async () => {
      const response = await api.get<TmdbCreditsResponse>(
        `/movie/${id}/credits`,
        {
          params: { language: "en-US" },
        }
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: videos } = useQuery({
    queryKey: ["tmdb", "movie", "videos", id],
    enabled: isValidId,
    queryFn: async () => {
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

  const posterUrl = details?.poster_path
    ? getTmdbImageUrl(details.poster_path)
    : null;
  const backdropUrl = details?.backdrop_path
    ? getTmdbImageUrl(details.backdrop_path)
    : null;

  const primaryGenre = details?.genres?.[0]?.name ?? "-";
  const primaryGenreWordCount = primaryGenre
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const isPrimaryGenreLong = primaryGenreWordCount > 1;

  const trailerHref = trailer?.key
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  const cast = (credits?.cast ?? []).slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="w-full pb-12">
        <section className="mt-0">
          <div className="relative h-[345px] max-h-[345px] w-full bg-white/10">
            {backdropUrl ? (
              <img
                src={backdropUrl}
                alt={details?.title ?? "Movie"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/30 to-black" />

            {posterUrl ? (
              <img
                src={posterUrl}
                alt={details?.title ?? "Movie"}
                loading="lazy"
                className="absolute bottom-[-48px] left-[15.75px] z-10 h-[171px] w-[116px] bg-white/10 object-cover"
              />
            ) : (
              <div className="absolute bottom-[-48px] left-[15.75px] z-10 h-[171px] w-[116px] bg-white/10" />
            )}

            <div className="absolute bottom-4 left-[147.75px] right-[15.75px] z-10 bg-transparent">
              <h1 className="text-xl font-bold leading-7 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]">
                {details?.title ?? ""}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm font-normal leading-5 tracking-normal text-white [font-family:var(--font-family-body)]">
                <img
                  src={calendarMobile}
                  alt=""
                  aria-hidden="true"
                  className="block size-5 shrink-0"
                />
                <span className="text-white">
                  {formatReleaseDateLongId(details?.release_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto -mt-[123px] w-full max-w-6xl px-4 pb-6 sm:px-6">
            <div className="h-[171px]" aria-hidden="true" />

            <div className="mt-5 flex items-center gap-3">
              {trailerHref ? (
                <a
                  className="inline-flex h-[44px] w-[301px] items-center justify-center gap-2 rounded-full bg-[#961200] p-2 text-sm font-semibold leading-5 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]"
                  href={trailerHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Trailer
                  <span className="grid size-[18px] place-items-center rounded-full">
                    <img
                      src={playMobile}
                      alt=""
                      aria-hidden="true"
                      className="block size-[18px]"
                    />
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-[44px] w-[301px] items-center justify-center gap-2 rounded-full bg-white/10 p-2 text-sm font-semibold leading-5 tracking-normal text-white/50 ring-1 ring-white/10 [font-family:var(--font-family-body)]"
                >
                  Watch Trailer
                </button>
              )}

              <button
                type="button"
                aria-label={
                  favorited ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={favorited}
                disabled={!details}
                onClick={onFavoriteClick}
                className="flex size-[44px] items-center justify-center rounded-full border border-[#181D27] bg-[#0A0D1299] p-[10px] text-white backdrop-blur-[40px] disabled:opacity-50"
              >
                <img
                  src={favoriteIcon}
                  alt=""
                  aria-hidden="true"
                  className="block size-6"
                />
              </button>
            </div>

            <div className="mt-6 mx-auto flex w-full max-w-[360px] items-stretch justify-center gap-3">
              <div className="flex h-[120px] min-w-0 flex-1 flex-col items-center justify-start rounded-2xl border border-[#252B37] bg-black pt-4">
                <img
                  src={star}
                  alt=""
                  aria-hidden="true"
                  className="block size-[24px]"
                />
                <p className="mt-3 text-center text-xs font-normal leading-4 tracking-normal text-[#D5D7DA] [font-family:var(--font-family-body)]">
                  Rating
                </p>
                <p className="mt-2 text-center text-lg font-semibold leading-7 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]">
                  {Number.isFinite(details?.vote_average)
                    ? `${details!.vote_average.toFixed(1)}/10`
                    : "-"}
                </p>
              </div>

              <div className="flex h-[120px] min-w-0 flex-1 flex-col items-center justify-start rounded-2xl border border-[#252B37] bg-black pt-4">
                <img
                  src={videoIcon}
                  alt=""
                  aria-hidden="true"
                  className="block size-6"
                />
                <p className="mt-3 text-center text-xs font-normal leading-4 tracking-normal text-[#D5D7DA] [font-family:var(--font-family-body)]">
                  Genre
                </p>
                <p
                  className={`mt-2 px-2 text-center font-semibold leading-7 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)] ${
                    isPrimaryGenreLong
                      ? "text-[14.4px] leading-[14px] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] break-words overflow-hidden"
                      : "text-lg truncate"
                  }`}
                >
                  {primaryGenre}
                </p>
              </div>

              <div className="flex h-[120px] min-w-0 flex-1 flex-col items-center justify-start rounded-2xl border border-[#252B37] bg-black pt-4">
                <img
                  src={emojiHappy}
                  alt=""
                  aria-hidden="true"
                  className="block size-6"
                />
                <p className="mt-3 text-center text-xs font-normal leading-4 tracking-normal text-[#D5D7DA] [font-family:var(--font-family-body)]">
                  Age Limit
                </p>
                <p className="mt-2 text-center text-lg font-semibold leading-7 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]">
                  13
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <section className="mt-0">
            <h2 className="text-xl font-bold leading-7 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]">
              Overview
            </h2>
            <p className="mt-[9px] text-sm font-normal leading-5 tracking-normal text-[#A4A7AE] [font-family:var(--font-family-body)]">
              {details?.overview ?? ""}
            </p>

            <div className="mt-4 flex items-center gap-3 text-sm text-white/70 [font-family:var(--font-family-body)]">
              <span className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {formatRuntime(details?.runtime)}
              </span>
            </div>
          </section>

          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold leading-7 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]">
                Cast & Crew
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              {cast.map((person) => {
                const avatarUrl = person.profile_path
                  ? getTmdbImageUrl(person.profile_path)
                  : null;

                return (
                  <div key={person.id} className="flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={person.name}
                        loading="lazy"
                        className="w-[55px] h-[84px] rounded-md bg-white/10 object-cover"
                      />
                    ) : (
                      <div className="w-[55px] h-[84px] rounded-md bg-white/10" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold leading-5 tracking-normal text-(--Neutral-25) [font-family:var(--font-family-body)]">
                        {person.name}
                      </p>
                      <p className="truncate text-sm font-normal leading-5 tracking-normal text-[#A4A7AE] [font-family:var(--font-family-body)]">
                        {person.character ?? "-"}
                      </p>
                    </div>
                  </div>
                );
              })}

              {cast.length === 0 ? (
                <p className="text-sm text-white/60 [font-family:var(--font-family-body)]">
                  Data empty
                </p>
              ) : null}
            </div>
          </section>

          <div className="mt-12 w-screen border-t-[1px] border-[#252B37] relative left-1/2 -ml-[50vw]" />

          <footer className="mt-0 max-h-30">
            <div className="flex items-center gap-4">
              <img
                src={headerMobileIcon}
                alt=""
                aria-hidden="true"
                className="block h-7 w-7 mt-[25.5px]"
              />

              <span className="mt-[25.5px] text-center text-[19.91px] font-semibold leading-[24.89px] tracking-[-0.04em] text-(--Neutral-25) [font-family:var(--font-family-display)]">
                Movie
              </span>
            </div>

            <p className="mt-12 text-xs font-normal leading-4 tracking-normal text-[#535862] [font-family:var(--font-family-body)]">
              Copyright ©2025 Movie Explorer
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
