import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import ArrowLeftIcon from "../assets/ArrowLeft.svg";
import ArrowRightIcon from "../assets/ArrowRight.svg";
import StarBlockIcon from "../assets/StarBlock.svg";

import { api } from "../lib/api";
import { getTmdbImageUrl } from "../hero/hero";

import type { TrendingNowListResponse } from "./trendingNow";

export default function TrendingNow() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data } = useQuery({
    queryKey: ["tmdb", "trending", "movie", "day", "trending-now"],
    queryFn: async () => {
      const response = await api.get<TrendingNowListResponse>(
        "/trending/movie/day",
        {
          params: { language: "en-US", page: 1 },
        }
      );
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const safeMovies = useMemo(() => (data?.results ?? []).slice(0, 10), [data]);

  const handleNext = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  const handlePrev = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  return (
    <section>
      <div className="flex items-center">
        <h2 className="font-bold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-display)] text-[length:var(--font-size-display-xs)] leading-[var(--line-height-display-xs)]">
          Trending Now
        </h2>
      </div>

      <div className="relative mt-6">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-[-11px] top-[111px] z-10 grid size-12 place-items-center rounded-full bg-[#0A0D1299] text-white backdrop-blur-[40px] border border-[color:var(--Neutral-900,_#181D27)] sm:left-[-19px]"
        >
          <img
            src={ArrowLeftIcon}
            alt=""
            aria-hidden="true"
            className="block size-5"
          />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-[-11px] top-[111px] z-10 grid size-12 place-items-center rounded-full bg-[#0A0D1299] text-white backdrop-blur-[40px] border border-[color:var(--Neutral-900,_#181D27)] sm:right-[-19px]"
        >
          <img
            src={ArrowRightIcon}
            alt=""
            aria-hidden="true"
            className="block size-5"
          />
        </button>

        <div
          ref={containerRef}
          className="flex snap-x snap-mandatory gap-[15.5px] overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
        >
          {safeMovies.map((m, idx) => {
            const title = m.title || m.name || "";
            const posterPath = m.poster_path || m.backdrop_path;
            const posterUrl = posterPath ? getTmdbImageUrl(posterPath) : null;

            return (
              <div
                key={m.id}
                className="flex-none snap-start basis-[calc((100%-15.5px)/2)] text-left md:basis-[200px]"
              >
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

                    <div className="absolute left-3 top-3 grid size-10 place-items-center rounded-full bg-[#0A0D1299] text-sm font-semibold text-[color:var(--Neutral-25,_#FDFDFD)] backdrop-blur-[40px]">
                      {idx + 1}
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className="mt-4 block w-full text-left truncate font-semibold tracking-[0] text-[color:var(--Neutral-25,_#FDFDFD)] [font-family:var(--font-family-body)] text-[length:var(--font-size-text-md)] leading-[var(--line-height-text-md)]"
                >
                  {title}
                </button>

                <div className="mt-3 flex items-center gap-2">
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
      </div>
    </section>
  );
}
