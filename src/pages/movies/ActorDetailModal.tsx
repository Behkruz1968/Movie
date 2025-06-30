import React, { useEffect, useState } from "react";

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
}

interface MovieCredit {
  id: number;
  title: string;
  release_date: string;
}

const API_KEY = "YOUR_API_KEY_HERE"; // Бу ерга калитингни қўй!

const ActorDetailModal: React.FC<ActorDetailModalProps> = ({ actorId, onClose }) => {
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActorDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const [actorRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=ru-RU`),
          fetch(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}&language=ru-RU`),
        ]);

        if (!actorRes.ok) throw new Error("Ошибка загрузки актёра");
        if (!creditsRes.ok) throw new Error("Ошибка загрузки фильмов");

        const actorData = await actorRes.json();
        const creditsData = await creditsRes.json();

        setActor(actorData);
        setMovies(
          creditsData.cast
            .sort((a: MovieCredit, b: MovieCredit) => {
              if (!a.release_date) return 1;
              if (!b.release_date) return -1;
              return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
            })
            .slice(0, 10) // Охирги 10 фильмни оламиз
        );
      } catch (e) {
        setError("Не удалось загрузить данные актёра");
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [actorId]);

  if (loading) return <div className="text-white p-4">Загрузка данных актёра...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!actor) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-white text-2xl font-bold mb-4 float-right hover:text-red-600"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="flex gap-6">
          {actor.profile_path ? (
            <img
              src={IMAGE_URL + actor.profile_path}
              alt={actor.name}
              className="w-40 rounded-lg object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-40 h-60 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              Нет фото
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{actor.name}</h2>
            {actor.birthday && <p><b>Дата рождения:</b> {actor.birthday}</p>}
            {actor.place_of_birth && <p><b>Место рождения:</b> {actor.place_of_birth}</p>}

            <h3 className="mt-4 font-semibold text-xl">Биография</h3>
            <p className="text-gray-300 whitespace-pre-line max-h-40 overflow-y-auto">{actor.biography || "Биография отсутствует."}</p>

            <h3 className="mt-6 font-semibold text-xl">Последние фильмы</h3>
            <ul className="list-disc list-inside max-h-48 overflow-y-auto text-gray-300">
              {movies.length === 0 && <li>Нет информации о фильмах</li>}
              {movies.map((movie) => (
                <li key={movie.id}>
                  {movie.title} ({movie.release_date ? movie.release_date.slice(0, 4) : "----"})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetailModal;
