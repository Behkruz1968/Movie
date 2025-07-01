// MoviesPage.tsx
import React, { useEffect, useState } from "react";
import { Pagination, Select, Spin } from "antd";
import MovieDetail from "@/pages/movies/Movidedetail";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

interface IMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
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
  10751: "Family",
  14: "Fantasy",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",

  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const bannedGenres = new Set(["Romance", "Drama", "History"]);

const MovieView: React.FC<{
  data: IMovie[];
  onMovieClick?: (id: number) => void;
}> = ({ data, onMovieClick }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
      {data.map((movie) => (
        <div
          key={movie.id}
          onClick={() => onMovieClick?.(movie.id)}
          className="group relative cursor-pointer bg-zinc-900 dark:bg-zinc-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300"
        >
          {movie.poster_path && (
            <img
              src={IMAGE_URL + movie.poster_path}
              alt={movie.title}
              loading="lazy"
              className="w-full h-[370px] object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white">
            <h3 className="text-lg font-semibold truncate" title={movie.title}>
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-sm mt-1 text-yellow-400">
              ★ {movie.vote_average.toFixed(1)} ·{' '}
              <span className="text-gray-300">
                {movie.release_date?.split("-")[0] || "----"}
              </span>
            </div>
            <p className="line-clamp-2 mt-1 text-sm text-gray-300">
              {movie.overview || "Tavsif mavjud emas..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const MoviesPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&with_genres=${selectedGenre}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2U0Y2M0YzA2YzcwN2I0ODcyMWVlY2ZjMjE5MGVmYyIsIm5iZiI6MTcyODg3NzQyNi4yLCJzdWIiOiI2NzBjOTM3MmIxNWQ5N2IxYTkzY2UwZjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.zZR_akio6SBvGWR4ThRbmrrWDuHZukkom4xo091rw8U`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.results.filter((movie: IMovie) => {
          const genres = movie.genre_ids?.map((id) => genreMap[id]) || [];
          return !genres.some((g) => bannedGenres.has(g));
        });
        setMovies(filtered);
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch(() => {
        setMovies([]);
        setLoading(false);
      });
  }, [page, selectedGenre]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">🎬 Mashhur kinolar</h2>
        <Select
          placeholder="Janr tanlang"
          className="w-[200px]"
          onChange={(value) => {
            setSelectedGenre(value);
            setPage(1);
          }}
          allowClear
          options={Object.entries(genreMap).map(([id, name]) => ({
            value: Number(id),
            label: name,
          }))}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <MovieView data={movies} onMovieClick={setSelectedMovieId} />
      )}

      <div className="flex justify-center mt-10">
        <Pagination
          current={page}
          total={totalPages * 10}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
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
};

export default MoviesPage;
