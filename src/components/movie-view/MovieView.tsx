// MoviesPage.tsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import type { Swiper as SwiperCore } from 'swiper';

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import MovieDetail from "@/pages/movies/Movidedetail";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

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
}

const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const bannedGenres = new Set(["Romance", "Drama", "History"]);

interface MovieViewProps {
  data: IMovie[];
  onMovieClick?: (id: number) => void;
}

const MovieView: React.FC<MovieViewProps> = ({ data, onMovieClick }) => {
  const filteredData = data.filter((movie) => {
    let genres: string[] = [];
    if (Array.isArray(movie.genre_ids)) {
      genres = movie.genre_ids.map((id) => genreMap[id]).filter(Boolean);
    } else if (Array.isArray(movie.genres)) {
      genres = movie.genres.map((g) => g.name);
    }
    return !genres.some((g) => bannedGenres.has(g));
  });

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
      {filteredData.map((movie) => {
        let genresText = "Janr ma’lumotlari yo‘q";
        if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
          genresText = movie.genre_ids
            .map((id) => genreMap[id] || "Noma’lum janr")
            .join(", ");
        } else if (Array.isArray(movie.genres) && movie.genres.length > 0) {
          genresText = movie.genres.map((g) => g.name).join(", ");
        }

        return (
          <div
            key={movie.id}
            className="group relative cursor-pointer bg-zinc-900 dark:bg-zinc-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300"
            onClick={() => onMovieClick && onMovieClick(movie.id)}
          >
            <img
              src={IMAGE_URL + movie.poster_path}
              alt={movie.title}
              loading="lazy"
              className="w-96 h-[370px] object-cover group-hover:opacity-90 transition-opacity duration-300"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white">
              <h3 className="text-lg font-semibold truncate" title={movie.title}>
                {movie.title}
              </h3>

              <div className="flex items-center gap-2 text-sm mt-1 text-yellow-400">
                ★ {movie.vote_average.toFixed(1)} ·{" "}
                <span className="text-gray-300">
                  {movie.release_date ? movie.release_date.split("-")[0] : "----"}
                </span>
              </div>

              <div className="mt-1 text-xs text-gray-400">{genresText}</div>

              <p className="line-clamp-2 mt-1 text-sm text-gray-300">
                {movie.overview || "Tavsif mavjud emas..."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", {
      headers: {
        Authorization:
          "Bearer <YOUR_API_KEY>",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.results.filter((movie: IMovie) => {
          let genres: string[] = [];
          if (Array.isArray(movie.genre_ids)) {
            genres = movie.genre_ids.map((id) => genreMap[id]).filter(Boolean);
          } else if (Array.isArray(movie.genres)) {
            genres = movie.genres.map((g) => g.name);
          }
          return !genres.some((g) => bannedGenres.has(g));
        });
        setMovies(filtered.slice(0, 8));
      })
      .catch(() => {
        setMovies([]);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Swiper
        style={{
          height: "320px",
        }}
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="mySwiper2 mb-6"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <img
              src={IMAGE_URL + movie.backdrop_path}
              alt={movie.title}
              className="w-full h-[320px] object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mb-6"
        style={{ height: "86px", width: "900px" }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <img
              src={IMAGE_URL + movie.poster_path}
              alt={movie.title}
              className="w-full h-[80px] object-cover rounded-lg cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <MovieView
        data={movies}
        onMovieClick={(id: number) => setSelectedMovieId(id)}
      />

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
              aria-label="Close modal"
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
