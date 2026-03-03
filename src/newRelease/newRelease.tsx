import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import StarBlockIcon from "../assets/StarBlock.svg";

import { api } from "../lib/api";
import { getTmdbImageUrl } from "../hero/hero";

import type { NewReleaseListResponse } from "./newRelease";

export default function NewRelease() {
  const navigate = useNavigate();
  const [isMdUp, setIsMdUp] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 768px)").matches;
  });
  const [pagesShown, setPagesShown] = useState(1);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const onChange = () => setIsMdUp(media.matches);
    onChange();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const { data } = useQuery({
    queryKey: ["tmdb", "movie", "now_playing", "new-release"],
    queryFn: async () => {
      const response = await api.get<NewReleaseListResponse>(
        "/movie/now_playing",
        {
          params: { language: "en-US", page: 1 },
        }
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const movies = useMemo(() => data?.results ?? [], [data]);

  const itemsPerRow = isMdUp ? 4 : 2;
  const pageSize = itemsPerRow * 4;
  const visibleCount = pagesShown * pageSize;
  const visibleMovies = useMemo(
    () => movies.slice(0, visibleCount),
    [movies, visibleCount]
  );

  const hasMore = movies.length > visibleCount;
  const lastVisibleRowNumber = Math.ceil(visibleMovies.length / itemsPerRow);

  return (
    <section>
      <div className="flex items-center">
        <h2 className="font-bold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-display)] text-[length:var(--font-size-display-xs)] leading-[var(--line-height-display-xs)]">
          New Release
        </h2>
      </div>

      <div className="relative mt-6">
        <div className="grid grid-cols-2 gap-[15.5px] md:grid-cols-4">
          {visibleMovies.map((m, idx) => {
            const title = m.title || m.name || "";
            const posterPath = m.poster_path || m.backdrop_path;
            const posterUrl = posterPath ? getTmdbImageUrl(posterPath) : null;
            const rowNumber = Math.floor(idx / itemsPerRow) + 1;
            const shouldBlurText =
              hasMore && rowNumber === lastVisibleRowNumber;

            return (
              <div key={m.id} className="text-left">
                <div className="relative h-[266px] w-full overflow-hidden rounded-md bg-white/5">
                  <button
                    type="button"
                    onClick={() => navigate(`/movie/${m.id}`)}
                    className="block h-full w-full"
                    aria-label={`Open ${title || "movie"}`}
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className={`mt-4 block w-full truncate text-left font-semibold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-md)] leading-[var(--line-height-text-md)] ${
                    shouldBlurText ? "blur-[6px] opacity-60" : ""
                  }`}
                >
                  {title}
                </button>

                <div
                  className={`mt-2 flex items-center gap-2 ${
                    shouldBlurText ? "blur-[6px] opacity-60" : ""
                  }`}
                >
                  <img
                    src={StarBlockIcon}
                    alt=""
                    aria-hidden="true"
                    className="block size-[18px]"
                  />
                  <span className="font-normal tracking-[0] text-[color:var(--Neutral-400,_#A4A7AE)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-sm)] leading-[var(--line-height-text-sm)]">
                    {Number.isFinite(m.vote_average)
                      ? `${m.vote_average!.toFixed(1)}/10`
                      : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-[73px] flex justify-center">
            <button
              type="button"
              onClick={() => setPagesShown((p) => p + 1)}
              className="pointer-events-auto h-11 rounded-full bg-[#0A0D1299] px-6 font-semibold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-sm)] leading-[var(--line-height-text-sm)] backdrop-blur-[40px] border border-[color:var(--Neutral-900,_#181D27)]"
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
