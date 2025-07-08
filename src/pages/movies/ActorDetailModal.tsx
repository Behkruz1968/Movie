import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

interface ActorDetailModalProps {
  actorId: number;
  onClose: () => void;
}

interface Actor {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  popularity: number;
}

interface MovieCredit {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

interface TvCredit {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string | null;
}

interface ExternalIds {
  imdb_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  facebook_id: string | null;
}

interface ProfileImage {
  file_path: string;
}

const ActorDetailModal: React.FC<ActorDetailModalProps> = ({ actorId, onClose }) => {
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [tvShows, setTvShows] = useState<TvCredit[]>([]);
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          actorRes,
          movieCreditsRes,
          tvCreditsRes,
          externalIdsRes,
          imagesRes,
        ] = await Promise.all([
          api.get<Actor>(`/person/${actorId}?language=ru-RU`),
          api.get<{ cast: MovieCredit[] }>(`/person/${actorId}/movie_credits?language=ru-RU`),
          api.get<{ cast: TvCredit[] }>(`/person/${actorId}/tv_credits?language=ru-RU`),
          api.get<ExternalIds>(`/person/${actorId}/external_ids`),
          api.get<{ profiles: ProfileImage[] }>(`/person/${actorId}/images`),
        ]);

        setActor(actorRes.data);

        setMovies(
          movieCreditsRes.data.cast
            .filter((m) => m.release_date)
            .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
            .slice(0, 8)
        );

        setTvShows(
          tvCreditsRes.data.cast
            .filter((tv) => tv.first_air_date)
            .sort((a, b) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime())
            .slice(0, 8)
        );

        setExternalIds(externalIdsRes.data);
        setImages(imagesRes.data.profiles);
      } catch {
        setError("Не удалось загрузить данные актёра");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actorId]);

  if (loading) return <div className="text-white p-4">Загрузка...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!actor) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 text-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-48 h-72 bg-zinc-700 rounded-lg overflow-hidden flex items-center justify-center">
            {actor.profile_path ? (
              <img
                src={IMAGE_URL + actor.profile_path}
                alt={actor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-lg">Нет фото</div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <h2 className="text-4xl font-bold">{actor.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300">
              {actor.birthday && (
                <p><span className="text-gray-400">🎂 Дата рождения:</span> {actor.birthday}</p>
              )}
              {actor.place_of_birth && (
                <p><span className="text-gray-400">🌍 Место:</span> {actor.place_of_birth}</p>
              )}
              <p><span className="text-gray-400">👤 Отрасль:</span> {actor.known_for_department}</p>
              <p><span className="text-gray-400">🔥 Популярность:</span> {actor.popularity.toFixed(1)}</p>
            </div>

            {/* Socials */}
            {externalIds && (
              <div className="flex gap-4 mt-2">
                {externalIds.imdb_id && (
                  <a href={`https://www.imdb.com/name/${externalIds.imdb_id}`} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">IMDb</a>
                )}
                {externalIds.instagram_id && (
                  <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer">
                    <InstagramOutlined className="text-2xl hover:text-pink-500" />
                  </a>
                )}
                {externalIds.twitter_id && (
                  <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer">
                    <TwitterOutlined className="text-2xl hover:text-blue-400" />
                  </a>
                )}
                {externalIds.facebook_id && (
                  <a href={`https://facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer">
                    <FacebookOutlined className="text-2xl hover:text-blue-600" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Биография</h3>
          <p className="text-sm text-gray-200 whitespace-pre-line max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 pr-2">
            {actor.biography || "Биография отсутствует."}
          </p>
        </div>

        {/* Movies */}
        {movies.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Фильмы</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => {
                    onClose();
                    navigate(`/movie/${movie.id}`);
                  }}
                  className="cursor-pointer bg-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {movie.poster_path ? (
                    <img
                      src={IMAGE_URL + movie.poster_path}
                      alt={movie.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400">
                      Нет постера
                    </div>
                  )}
                  <div className="p-2 text-sm text-center">
                    <p className="font-medium line-clamp-2">{movie.title}</p>
                    <p className="text-xs text-gray-400">{movie.release_date?.slice(0, 4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TV Shows */}
        {tvShows.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Сериалы</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tvShows.map((tv) => (
                <div
                  key={tv.id}
                  className="bg-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {tv.poster_path ? (
                    <img
                      src={IMAGE_URL + tv.poster_path}
                      alt={tv.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400">
                      Нет постера
                    </div>
                  )}
                  <div className="p-2 text-sm text-center">
                    <p className="font-medium line-clamp-2">{tv.name}</p>
                    <p className="text-xs text-gray-400">{tv.first_air_date?.slice(0, 4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Фотогалерея</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.slice(0, 10).map((img, idx) => (
                <img
                  key={idx}
                  src={IMAGE_URL + img.file_path}
                  alt="actor"
                  className="h-40 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorDetailModal;
