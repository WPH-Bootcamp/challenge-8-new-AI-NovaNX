import type { HeaderProps } from "./header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoSmall from "../assets/headerMobile.svg";
import searchMobile from "../assets/SearchMobile.svg";
import menuMobile from "../assets/MenuMobile.svg";
import closeSearchDesktop from "../assets/CloseSearchDesktop.svg";

export default function Header({ title = "Movie" }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  const goHome = () => {
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const goFavorites = () => {
    setIsMobileMenuOpen(false);
    navigate("/favorites");
  };

  const isHomeActive = location.pathname === "/";
  const isFavoritesActive = location.pathname === "/favorites";

  useEffect(() => {
    if (location.pathname !== "/search") return;
    const q = new URLSearchParams(location.search).get("q") ?? "";
    setDesktopQuery(q);
  }, [location.pathname, location.search]);

  const submitDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = desktopQuery.trim();
    if (!q) {
      navigate("/search");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header
        className={`app-header fixed inset-x-0 top-0 z-[9999] h-16 max-h-16 border-b transition-colors ${
          isScrolled
            ? "border-[#252B37] bg-[#0A0D1299] backdrop-blur-[40px]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <img
              src={logoSmall}
              alt="Logo"
              className="block h-[21.82px] w-[23.33px]"
            />
            <span className="text-center text-[19.91px] font-semibold leading-[24.89px] tracking-[-0.04em] text-[color:var(--Neutral-25)] [font-family:var(--font-family-display)]">
              {title}
            </span>
          </div>

          <nav className="hidden items-center gap-10 text-sm text-white/70 md:flex">
            <button
              type="button"
              onClick={goHome}
              className={isHomeActive ? "text-white" : "text-white/70"}
            >
              Home
            </button>
            <button
              type="button"
              onClick={goFavorites}
              className={isFavoritesActive ? "text-white" : "text-white/70"}
            >
              Favorites
            </button>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              aria-label="Search"
              className="grid size-6 place-items-center rounded-xl text-white/80"
              onClick={() => navigate("/search")}
            >
              <img
                src={searchMobile}
                alt=""
                aria-hidden="true"
                className="block size-6"
              />
            </button>
            <button
              type="button"
              aria-label="Menu"
              className="grid size-6 place-items-center text-white/80"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <img
                src={menuMobile}
                alt=""
                aria-hidden="true"
                className="block size-6"
              />
            </button>
          </div>

          <form
            className="hidden w-[240px] md:block"
            role="search"
            onSubmit={submitDesktopSearch}
          >
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/50">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>
              <input
                className="search-clear-input w-full rounded-xl bg-white/10 px-10 py-2.5 pr-10 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
                placeholder="Search Movie"
                type="search"
                aria-label="Search movie"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
              />

              {desktopQuery.length > 0 ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-2 grid w-9 place-items-center rounded-lg text-white/60 hover:text-white"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setDesktopQuery("")}
                >
                  <img
                    src={closeSearchDesktop}
                    alt=""
                    aria-hidden="true"
                    className="block size-5"
                  />
                </button>
              ) : null}
            </label>
          </form>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          className="fixed inset-0 z-[10000] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 pt-6 sm:px-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={logoSmall}
                  alt="Logo"
                  className="block h-[21.82px] w-[23.33px]"
                />
                <span className="text-center text-[19.91px] font-semibold leading-[24.89px] tracking-[-0.04em] text-[color:var(--Neutral-25)] [font-family:var(--font-family-display)]">
                  {title}
                </span>
              </div>

              <button
                type="button"
                aria-label="Close menu"
                className="grid size-10 place-items-center text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-8 [font-family:var(--font-family-body)]">
              <button
                type="button"
                onClick={goHome}
                className={
                  isHomeActive
                    ? "w-full text-left text-base font-normal leading-6 tracking-normal text-white"
                    : "w-full text-left text-base font-normal leading-6 tracking-normal text-white/70"
                }
              >
                Home
              </button>
              <button
                type="button"
                onClick={goFavorites}
                className={
                  isFavoritesActive
                    ? "w-full text-left text-base font-normal leading-6 tracking-normal text-white"
                    : "w-full text-left text-base font-normal leading-6 tracking-normal text-white/70"
                }
              >
                Favorites
              </button>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
