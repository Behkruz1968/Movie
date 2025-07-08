import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";
import MovieDetail from "@/pages/movies/Movidedetail";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const IMAGE_URL = "https://image.tmdb.org/t/p/w1280";

interface IMovie {
  backdrop_path: string;
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  adult: boolean;
}

const genreMap: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const bannedGenres = new Set(["Romance", "Drama", "History"]);

export default function MovieView() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2U0Y2M0YzA2YzcwN2I0ODcyMWVlY2ZjMjE5MGVmYyIsIm5iZiI6MTcyODg3NzQyNi4yLCJzdWIiOiI2NzBjOTM3MmIxNWQ5N2IxYTkzY2UwZjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.zZR_akio6SBvGWR4ThRbmrrWDuHZukkom4xo091rw8U",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.results.filter((movie: IMovie) => {
          const genres =
            movie.genre_ids?.map((id) => genreMap[id]) ||
            movie.genres?.map((g) => g.name) || [];
          return !genres.some((g) => bannedGenres.has(g));
        });
        setMovies(filtered.slice(0, 8));
      })
      .catch(() => setMovies([]));
  }, []);

  return (
    <div className="container mx-auto px-4 mt-6">
      <Swiper
        spaceBetween={0}
        centeredSlides
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        onSwiper={setThumbsSwiper}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mb-6 rounded-xl overflow-hidden"
        slidesPerView={1}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="relative">
            <img
              className="w-full h-[80vh] object-cover brightness-[.3]"
              src={IMAGE_URL + movie.backdrop_path}
              loading="lazy"
              alt={movie.title}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white text-center bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-md">{movie.title}</h1>
              <div className="mt-2 text-sm sm:text-base opacity-80 flex gap-2">
                <span>{movie.release_date?.slice(0, 4)}</span>
                <span>•</span>
                <span>{movie.original_language.toUpperCase()}</span>
                <span>•</span>
                <span>{movie.adult ? "18+" : "PG"}</span>
              </div>
              <button
                onClick={() => setSelectedMovieId(movie.id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition"
              >
                Watch Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        spaceBetween={10}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="mb-8"
        breakpoints={{
          0: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          768: { slidesPerView: 6 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="cursor-pointer">
            <img
              src={IMAGE_URL + movie.poster_path}
              alt={movie.title}
              className="w-full h-[90px] object-cover rounded-md border border-zinc-700 hover:opacity-90"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative cursor-pointer bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedMovieId(movie.id)}
          >
            <img
              src={IMAGE_URL + movie.backdrop_path}
              alt={movie.title}
              loading="lazy"
              className="w-full h-[360px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
              <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
              <div className="flex items-center gap-2 text-sm mt-1 text-yellow-400">
                ★ {movie.vote_average.toFixed(1)} · <span className="text-gray-300">{movie.release_date?.split("-")[0]}</span>
              </div>
              <p className="line-clamp-2 mt-1 text-sm text-gray-300">{movie.overview || "Tavsif yo'q"}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMovieId !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedMovieId(null)}
        >
          <div
            className="bg-zinc-900 rounded-lg max-w-4xl w-full p-4 overflow-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovieId(null)}
              className="text-white text-xl mb-2 float-right hover:text-red-500"
            >
              ×
            </button>
            <MovieDetail movieId={selectedMovieId} />
          </div>
        </div>
      )}
    </div>
  );
}