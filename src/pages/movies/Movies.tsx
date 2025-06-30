import React, { useEffect, useState } from "react";
import { Pagination, Spin, Alert, Select, Modal, ConfigProvider, theme as antdTheme } from "antd";
import MovieDetail from "@/pages/movies/Movidedetail"; // Путь под себя поправь
import MovieView from "@/components/movie-view/MovieView"; // Ниже дам код MovieView

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

interface IGenre {
  id: number;
  name: string;
}

interface IMovie {
  id: number;
  title: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  release_date: string;
  overview: string;
  genres?: IGenre[];
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const isDark =
    typeof window !== "undefined" &&
    document.body.classList.contains("dark");

  // Получаем жанры
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en-US", {
      headers: {
        Authorization: "Bearer YOUR_TMDB_BEARER_TOKEN_HERE",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGenres(data.genres);
      })
      .catch(() => {
        setGenres([]);
      });
  }, []);

  // Получаем фильмы
  useEffect(() => {
    setLoading(true);
    setError(null);

    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";

    fetch(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}${genreParam}`,
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2U0Y2M0YzA2YzcwN2I0ODcyMWVlY2ZjMjE5MGVmYyIsIm5iZiI6MTcyODg3NzQyNi4yLCJzdWIiOiI2NzBjOTM3MmIxNWQ5N2IxYTkzY2UwZjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.zZR_akio6SBvGWR4ThRbmrrWDuHZukkom4xo091rw8U"

        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки фильмов");
        return res.json();
      })
      .then((data) => {
        setMovies(data.results);
        setTotalResults(data.total_results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, selectedGenre]);

  const genreOptions = genres.map((g) => ({
    label: g.name,
    value: g.id,
  }));

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: "#e50914" },
      }}
    >
      <div
        className={`min-h-screen px-4 py-6 max-w-[1280px] mx-auto ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
            className="mb-6"
          />
        )}

        <div className="flex justify-between items-center flex-wrap gap-4 mb-6 border-b pb-4 border-gray-300 dark:border-white/20">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            🍿 <span>Фильмы</span>
          </h2>

          <Select
            placeholder="Выберите жанр"
            className="w-[250px]"
            onChange={(value) => {
              setSelectedGenre(value as number);
              setPage(1);
            }}
            allowClear
            options={genreOptions}
            value={selectedGenre ?? undefined}
            loading={genres.length === 0}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <MovieView data={movies} onMovieClick={(id) => setSelectedMovieId(id)} />

            {totalResults > 20 && (
              <div className="flex justify-center mt-10">
                <Pagination
                  total={totalResults}
                  current={page}
                  onChange={(p) => setPage(p)}
                  pageSize={20}
                  showSizeChanger={false}
                  showQuickJumper
                  responsive
                />
              </div>
            )}
          </>
        )}

        <Modal
          open={selectedMovieId !== null}
          onCancel={() => setSelectedMovieId(null)}
          footer={null}
          width={900}
          destroyOnClose
          centered
          bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          {selectedMovieId !== null && <MovieDetail movieId={selectedMovieId} />}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default MoviesPage;
