import React, { useEffect, useState } from "react";
import { IMAGE_URL } from "@/const";
import { api } from "@/api";

interface CastMember {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
  order: number;
}

interface MovieCredits {
  id: number;
  cast: CastMember[];
}

interface Genre {
  id: number;
  name: string;
}

interface MovieFullDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genres: Genre[];
  runtime: number; // фильм узунлиги дақиқада
  homepage: string | null;
  status: string; // Released, Post Production ва ҳоказо
  tagline: string | null;
}

interface MovieDetailProps {
  movieId: number;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<MovieFullDetail | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Фильм ҳақида тўлиқ маълумот
        const movieRes = await api.get<MovieFullDetail>(`movie/${movieId}`, {
          params: { language: "ru-RU" },
        });

        // Актёрлар рўйхати
        const creditsRes = await api.get<MovieCredits>(`movie/${movieId}/credits`, {
          params: { language: "ru-RU" },
        });

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch {
        setError("Не удалось загрузить данные о фильме");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading) return <p>Загрузка данных фильма...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return null;

  // Кастни order бўйича саралаш ва 6 тага қисқартириш
  const mainCast = credits?.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 6) || [];

  return (
    <div className="max-w-4xl mx-auto p-4 text-white bg-zinc-900 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Постер */}
        <img
          src={movie.poster_path ? IMAGE_URL + movie.poster_path : "/placeholder-poster.png"}
          alt={movie.title}
          className="w-full md:w-64 rounded-lg object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          {movie.tagline && <p className="italic text-gray-400 mt-1">"{movie.tagline}"</p>}

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-300">
            <span>Рейтинг: ⭐ {movie.vote_average.toFixed(1)}</span>
            <span>Время: {movie.runtime} мин</span>
            <span>Дата выхода: {movie.release_date}</span>
            <span>Статус: {movie.status}</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Жанры:</h2>
            <div className="flex gap-2 flex-wrap">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 text-gray-300 whitespace-pre-line">{movie.overview}</p>

          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-red-700 rounded hover:bg-red-800"
            >
              Официальный сайт
            </a>
          )}
        </div>
      </div>

      {/* Актёры */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Основные роли</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {mainCast.map((actor) => (
            <div key={actor.cast_id} className="flex flex-col items-center w-24 text-center">
              <img
                src={
                  actor.profile_path
                    ? IMAGE_URL + actor.profile_path
                    : "/placeholder-profile.png"
                }
                alt={actor.name}
                className="rounded-lg w-24 h-32 object-cover mb-2"
                loading="lazy"
              />
              <div className="font-semibold text-sm">{actor.name}</div>
              <div className="text-xs text-gray-400">{actor.character}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
