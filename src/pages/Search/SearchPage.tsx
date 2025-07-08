import React, { useEffect, useState } from "react";
import { Input, Spin, Alert } from "antd";
import { IMAGE_URL } from "@/const";
import { api } from "@/api";
import { Link } from "react-router-dom";

const { Search } = Input;

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);


  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    if (!query) return;

    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .get("search/movie", {
          params: { query, language: "en-US" },
        })
        .then((res) => {
          setMovies(res.data.results);
          const updatedHistory = [query, ...history.filter(q => q !== query)].slice(0, 10);
          setHistory(updatedHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
          setLoading(false);
        })
        .catch(() => {
          setError("Qidiruvda xatolik yuz berdi");
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);


  const removeHistoryItem = (termToRemove: string) => {
    const updated = history.filter((term) => term !== termToRemove);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-16 px-6 text-gray-900 dark:text-white transition-colors">
      <h1 className="text-4xl font-bold mb-10 text-center">Поиск фильма</h1>

      <div className="max-w-3xl mx-auto mb-10">
        <Search
          placeholder="Найти фильм..."
          onSearch={(val) => setQuery(val)}
          enterButton=" Поиск"
          size="large"
          className="w-full"
          allowClear
        />
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      )}

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-4 dark:bg-red-900 dark:text-white"
        />
      )}

      {!loading && query && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            результаты поиска: <span className="text-blue-500">{query}</span>
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 hover:scale-105">
                  <img
                    src={
                      movie.poster_path
                        ? IMAGE_URL + movie.poster_path
                        : "/placeholder-poster.png"
                    }
                    alt={movie.title}
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-3">
                      {movie.overview || "Tavsif mavjud emas..."}
                    </p>
                    <div className="mt-3 text-base text-yellow-500 font-medium">
                      ★ {movie.vote_average?.toFixed(1) || "0.0"} ·{" "}
                      {movie.release_date?.split("-")[0] || "Noma'lum"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Последние поиски:
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {history.map((term, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-4 py-2 rounded-full cursor-pointer text-sm transition relative group"
              >
                <span onClick={() => setQuery(term)}>{term}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHistoryItem(term);
                  }}
                  className="ml-2 text-gray-600 dark:text-gray-300 group-hover:text-red-600 hover:scale-125 transition-transform duration-150"
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
