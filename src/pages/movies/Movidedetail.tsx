import React, { useEffect, useState } from "react";
import { IMAGE_URL } from "@/const";
import { api } from "@/api";
import ActorDetailModal from "./ActorDetailModal";
import { UserOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useParams } from "react-router-dom";


interface CastMember {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
  order: number;
  id: number;
}

interface VideoItem {
  key: string;
  type: string;
  site: string;
  name: string;
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
  runtime: number;
  homepage: string | null;
  status: string;
  tagline: string | null;
  videos?: {
    results: VideoItem[];
  };
}

interface MovieImages {
  backdrops: { file_path: string }[];
}

interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string | null;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const movieId = Number(id);
  const [movie, setMovie] = useState<MovieFullDetail | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [{ data: movieData }, { data: imagesData }, { data: recommendedData }] = await Promise.all([
          api.get<MovieFullDetail & { credits: MovieCredits }>(`movie/${movieId}`, {
            params: {
              language: "ru-RU",
              append_to_response: "videos,credits",
            },
          }),
          api.get<MovieImages>(`movie/${movieId}/images`),
          api.get<{ results: RecommendedMovie[] }>(`movie/${movieId}/recommendations`),
        ]);

        setMovie(movieData);
        setCredits(movieData.credits);
        const backdropUrls = imagesData.backdrops.slice(0, 5).map((img) => IMAGE_URL + img.file_path);
        setImages(backdropUrls);
        setRecommendations(recommendedData.results.slice(0, 10));
      } catch {
        setError("Не удалось загрузить данные о фильме");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading) return <p className="text-white">Загрузка данных фильма...</p>;
  if (error)
    return (
      <div className="text-red-500 text-center">
        {error}
        <button onClick={() => window.location.reload()} className="ml-4 bg-red-600 px-4 py-1 rounded">
          Повторить
        </button>
      </div>
    );
  if (!movie) return null;

  const allCast = credits?.cast.sort((a, b) => a.order - b.order) || [];
  const trailer = movie.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return (
    <div className="max-w-6xl mx-auto p-6 text-white bg-zinc-900 rounded-xl shadow-xl">
      {images.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1} loop className="mb-6 rounded-lg overflow-hidden">
          {images.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <img src={imgUrl} alt={`Backdrop ${index}`} className="w-full max-h-[400px] object-cover" loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={movie.poster_path ? IMAGE_URL + movie.poster_path : "/placeholder-poster.png"}
          alt={movie.title}
          className="w-full md:w-64 rounded-lg object-cover shadow"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && <p className="italic text-gray-400 mb-4">"{movie.tagline}"</p>}

          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-4">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.runtime} мин</span>
            <span>{movie.release_date}</span>
            <span>{movie.status}</span>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Жанры:</h2>
            <div className="flex gap-2 flex-wrap">
              {movie.genres.map((g) => (
                <span key={g.id} className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-300 whitespace-pre-line leading-relaxed">{movie.overview}</p>

          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-4 py-2 bg-red-700 hover:bg-red-800 rounded"
            >
              Официальный сайт
            </a>
          )}
        </div>
      </div>

      {trailer && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Трейлер</h2>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Трейлер фильма"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Aктёры</h2>
        <Swiper
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="pb-4"
        >
          {allCast.map((actor) => (
            <SwiperSlide key={actor.cast_id}>
              <div className="cursor-pointer text-center group hover:scale-105 transition" onClick={() => setSelectedActorId(actor.id)}>
                {actor.profile_path ? (
                  <img src={IMAGE_URL + actor.profile_path} alt={actor.name} className="w-full h-48 object-cover rounded-xl mb-2" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-zinc-700 rounded-xl text-3xl text-white">
                    <UserOutlined />
                  </div>
                )}
                <div className="text-white text-sm font-medium truncate">{actor.name}</div>
                <div className="text-xs text-gray-400 truncate">{actor.character}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Tavsiya etilgan filmlar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((rec) => (
              <Link to={`/movie/${rec.id}`} key={rec.id}>
                <div className="bg-zinc-800 rounded-lg overflow-hidden hover:scale-105 transition shadow group">
                  <img
                    src={rec.poster_path ? IMAGE_URL + rec.poster_path : "/placeholder-poster.png"}
                    alt={rec.title}
                    className="w-full h-[280px] object-cover"
                  />
                  <div className="p-2 text-white text-center text-sm font-medium truncate group-hover:text-red-400">
                    {rec.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {selectedActorId && <ActorDetailModal actorId={selectedActorId} onClose={() => setSelectedActorId(null)} />}
    </div>
  );
};

export default MovieDetail;
