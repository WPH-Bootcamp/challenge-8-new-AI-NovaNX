import Header from "./header/header.tsx";
import Hero from "./hero/hero.tsx";
import NewRelease from "./newRelease/newRelease.tsx";
import TrendingNow from "./TrendingNow/TrendingNow.tsx";
import Footer from "./footer/footer.tsx";
import SearchPage from "./search/search.tsx";
import MovieDetailPage from "./detail/detail.tsx";
import FavoritesPage from "./favorites/favorites.tsx";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-950 to-black text-white">
            <Header />
            <Hero />

            <div className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6">
              <TrendingNow />
            </div>

            <div className="mx-auto mt-7 w-full max-w-6xl px-4 sm:px-6">
              <NewRelease />
            </div>

            <div className="mt-[45px]">
              <Footer />
            </div>
          </div>
        }
      />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/movie/:movieId" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default App;
