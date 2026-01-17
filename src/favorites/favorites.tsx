import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Header from "../header/header.tsx";
import Footer from "../footer/footer.tsx";
import playMobile from "../assets/PlayMobile.svg";
import starBlock from "../assets/StarBlock.svg";
import heartFilled from "../assets/HeartFilledMobile.svg";
import emptyFavoritesImg from "../assets/DirectorBoardMobile.svg";
import { getTmdbImageUrl } from "../detail/detail";
import { getFavorites, removeFavorite, type FavoriteMovie } from "./favorites";

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    setItems(getFavorites());

    const onStorage = (e: StorageEvent) => {
      if (e.key && !e.key.startsWith("movie-explorer:favorites")) return;
      setItems(getFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hasItems = items.length > 0;

  const content = useMemo(() => {
    if (!hasItems) {
      return (
        <section className="mt-10 flex flex-col items-center text-center">
          <img
            src={emptyFavoritesImg}
            alt=""
            aria-hidden="true"
            className="w-[240px] max-w-full"
          />

          <h2 className="mt-6 text-2xl font-semibold text-white">Data Empty</h2>
          <p className="mt-3 max-w-[320px] text-sm leading-5 text-white/60">
            You don't have a favorite movie yet
          </p>

          <Link
            to="/"
            className="mt-10 inline-flex h-[56px] w-full max-w-[320px] items-center justify-center rounded-full bg-[#961200] px-6 text-base font-semibold text-white"
          >
            Explore Movie
          </Link>
        </section>
      );
    }

    return (
      <>
        {/* Mobile layout */}
        <div className="mt-6 space-y-5 md:hidden">
          {items.map((movie) => {
            const posterUrl = movie.poster_path
              ? getTmdbImageUrl(movie.poster_path)
              : null;
            const trailerHref = movie.trailer_key
              ? `https://www.youtube.com/watch?v=${movie.trailer_key}`
              : null;

            return (
              <div key={movie.id} className="border-b border-[#252B37] pb-5">
                <div className="flex gap-4">
                  <Link
                    to={`/movie/${movie.id}`}
                    className="shrink-0"
                    aria-label={`Open ${movie.title}`}
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        loading="lazy"
                        className="h-[120px] w-[86px] rounded-xl bg-white/10 object-cover"
                      />
                    ) : (
                      <div className="h-[120px] w-[86px] rounded-xl bg-white/10" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link to={`/movie/${movie.id}`} className="block">
                      <h2 className="line-clamp-2 text-lg font-bold leading-6 text-white">
                        {movie.title}
                      </h2>
                    </Link>

                    <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                      <img
                        src={starBlock}
                        alt=""
                        aria-hidden="true"
                        className="block size-5"
                      />
                      <span>
                        {Number.isFinite(movie.vote_average)
                          ? `${movie.vote_average.toFixed(1)}/10`
                          : "-"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/50">
                      {movie.overview}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      {trailerHref ? (
                        <a
                          className="inline-flex h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#961200] px-6 text-sm font-semibold text-white"
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
                        <Link
                          to={`/movie/${movie.id}`}
                          className="inline-flex h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-sm font-semibold text-white/80 ring-1 ring-white/10"
                        >
                          Open Detail
                        </Link>
                      )}

                      <button
                        type="button"
                        aria-label="Remove from favorites"
                        className="flex size-[44px] items-center justify-center rounded-full border border-[#181D27] bg-[#0A0D1299] p-[10px] backdrop-blur-[40px]"
                        onClick={() => {
                          setItems(removeFavorite(movie.id));
                          toast("Removed from favorites");
                        }}
                      >
                        <img
                          src={heartFilled}
                          alt=""
                          aria-hidden="true"
                          className="block size-6"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / LG layout (match screenshot) */}
        <div className="mt-10 hidden space-y-10 md:block">
          {items.map((movie) => {
            const posterUrl = movie.poster_path
              ? getTmdbImageUrl(movie.poster_path)
              : null;
            const trailerHref = movie.trailer_key
              ? `https://www.youtube.com/watch?v=${movie.trailer_key}`
              : null;

            return (
              <section
                key={movie.id}
                className="flex items-start justify-between gap-8"
              >
                <div className="flex min-w-0 gap-8">
                  <Link
                    to={`/movie/${movie.id}`}
                    className="shrink-0"
                    aria-label={`Open ${movie.title}`}
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        loading="lazy"
                        className="h-[260px] w-[180px] rounded-3xl bg-white/5 object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="h-[260px] w-[180px] rounded-3xl bg-white/5 ring-1 ring-white/10" />
                    )}
                  </Link>

                  <div className="min-w-0 pt-3">
                    <Link to={`/movie/${movie.id}`} className="block">
                      <h2 className="text-3xl font-bold leading-tight text-white">
                        {movie.title}
                      </h2>
                    </Link>

                    <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="size-4 text-yellow-400"
                        fill="currentColor"
                      >
                        <path d="M12 17.3l-5.6 3 1.1-6.3L2.9 9.6l6.3-.9L12 3l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3Z" />
                      </svg>
                      <span className="text-white">
                        {Number.isFinite(movie.vote_average)
                          ? `${movie.vote_average.toFixed(1)}/10`
                          : "-"}
                      </span>
                    </div>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-white/60 line-clamp-3">
                      {movie.overview}
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                      {trailerHref ? (
                        <a
                          className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#961200] px-6 text-sm font-semibold text-white"
                          href={trailerHref}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Watch Trailer
                          <span className="grid size-7 place-items-center rounded-full bg-white/20">
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
                      ) : (
                        <Link
                          to={`/movie/${movie.id}`}
                          className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-white/10 px-6 text-sm font-semibold text-white/80 ring-1 ring-white/10"
                        >
                          Open Detail
                          <span className="grid size-7 place-items-center rounded-full bg-white/10">
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="size-4"
                              fill="currentColor"
                            >
                              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                            </svg>
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Remove from favorites"
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-[#181D27] bg-[#0A0D1299] backdrop-blur-[40px]"
                  onClick={() => {
                    setItems(removeFavorite(movie.id));
                    toast("Removed from favorites");
                  }}
                >
                  <img
                    src={heartFilled}
                    alt=""
                    aria-hidden="true"
                    className="block size-6"
                  />
                </button>
              </section>
            );
          })}
        </div>
      </>
    );
  }, [hasItems, items]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="Favorites" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-20 sm:px-6 md:pt-24">
        <h1 className="text-3xl font-bold md:text-4xl">Favorites</h1>
        {content}
      </main>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}
