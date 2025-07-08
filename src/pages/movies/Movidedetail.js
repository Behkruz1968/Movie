import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { IMAGE_URL } from "@/const";
import { api } from "@/api";
import ActorDetailModal from "./ActorDetailModal";
import { UserOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
const MovieDetail = ({ movieId }) => {
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [images, setImages] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedActorId, setSelectedActorId] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [{ data: movieData }, { data: imagesData }, { data: recommendedData }] = await Promise.all([
                    api.get(`movie/${movieId}`, {
                        params: {
                            language: "ru-RU",
                            append_to_response: "videos,credits",
                        },
                    }),
                    api.get(`movie/${movieId}/images`),
                    api.get(`movie/${movieId}/recommendations`),
                ]);
                setMovie(movieData);
                setCredits(movieData.credits);
                const backdropUrls = imagesData.backdrops.slice(0, 5).map((img) => IMAGE_URL + img.file_path);
                setImages(backdropUrls);
                setRecommendations(recommendedData.results.slice(0, 10));
            }
            catch {
                setError("Не удалось загрузить данные о фильме");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [movieId]);
    if (loading)
        return _jsx("p", { className: "text-white", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0444\u0438\u043B\u044C\u043C\u0430..." });
    if (error)
        return (_jsxs("div", { className: "text-red-500 text-center", children: [error, _jsx("button", { onClick: () => window.location.reload(), className: "ml-4 bg-red-600 px-4 py-1 rounded", children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C" })] }));
    if (!movie)
        return null;
    const allCast = credits?.cast.sort((a, b) => a.order - b.order) || [];
    const trailer = movie.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6 text-white bg-zinc-900 rounded-xl shadow-xl", children: [images.length > 0 && (_jsx(Swiper, { spaceBetween: 10, slidesPerView: 1, loop: true, className: "mb-6 rounded-lg overflow-hidden", children: images.map((imgUrl, index) => (_jsx(SwiperSlide, { children: _jsx("img", { src: imgUrl, alt: `Backdrop ${index}`, className: "w-full max-h-[400px] object-cover", loading: "lazy" }) }, index))) })), _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx("img", { src: movie.poster_path ? IMAGE_URL + movie.poster_path : "/placeholder-poster.png", alt: movie.title, className: "w-full md:w-64 rounded-lg object-cover shadow" }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: movie.title }), movie.tagline && _jsxs("p", { className: "italic text-gray-400 mb-4", children: ["\"", movie.tagline, "\""] }), _jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-gray-300 mb-4", children: [_jsxs("span", { children: ["\u2B50 ", movie.vote_average.toFixed(1)] }), _jsxs("span", { children: [movie.runtime, " \u043C\u0438\u043D"] }), _jsx("span", { children: movie.release_date }), _jsx("span", { children: movie.status })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "\u0416\u0430\u043D\u0440\u044B:" }), _jsx("div", { className: "flex gap-2 flex-wrap", children: movie.genres.map((g) => (_jsx("span", { className: "bg-red-600 px-3 py-1 rounded-full text-sm font-medium", children: g.name }, g.id))) })] }), _jsx("p", { className: "text-gray-300 whitespace-pre-line leading-relaxed", children: movie.overview }), movie.homepage && (_jsx("a", { href: movie.homepage, target: "_blank", rel: "noopener noreferrer", className: "inline-block mt-6 px-4 py-2 bg-red-700 hover:bg-red-800 rounded", children: "\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0430\u0439\u0442" }))] })] }), trailer && (_jsxs("div", { className: "mt-10", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "\u0422\u0440\u0435\u0439\u043B\u0435\u0440" }), _jsx("div", { className: "aspect-video", children: _jsx("iframe", { src: `https://www.youtube.com/embed/${trailer.key}`, title: "\u0422\u0440\u0435\u0439\u043B\u0435\u0440 \u0444\u0438\u043B\u044C\u043C\u0430", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, className: "w-full h-full rounded-lg" }) })] })), _jsxs("div", { className: "mt-10", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "A\u043A\u0442\u0451\u0440\u044B" }), _jsx(Swiper, { spaceBetween: 16, slidesPerView: 2, breakpoints: {
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                            1280: { slidesPerView: 6 },
                        }, className: "pb-4", children: allCast.map((actor) => (_jsx(SwiperSlide, { children: _jsxs("div", { className: "cursor-pointer text-center group hover:scale-105 transition", onClick: () => setSelectedActorId(actor.id), children: [actor.profile_path ? (_jsx("img", { src: IMAGE_URL + actor.profile_path, alt: actor.name, className: "w-full h-48 object-cover rounded-xl mb-2" })) : (_jsx("div", { className: "w-full h-48 flex items-center justify-center bg-zinc-700 rounded-xl text-3xl text-white", children: _jsx(UserOutlined, {}) })), _jsx("div", { className: "text-white text-sm font-medium truncate", children: actor.name }), _jsx("div", { className: "text-xs text-gray-400 truncate", children: actor.character })] }) }, actor.cast_id))) })] }), recommendations.length > 0 && (_jsxs("div", { className: "mt-12", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Tavsiya etilgan filmlar" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: recommendations.map((rec) => (_jsx(Link, { to: `/movie/${rec.id}`, children: _jsxs("div", { className: "bg-zinc-800 rounded-lg overflow-hidden hover:scale-105 transition shadow group", children: [_jsx("img", { src: rec.poster_path ? IMAGE_URL + rec.poster_path : "/placeholder-poster.png", alt: rec.title, className: "w-full h-[280px] object-cover" }), _jsx("div", { className: "p-2 text-white text-center text-sm font-medium truncate group-hover:text-red-400", children: rec.title })] }) }, rec.id))) })] })), selectedActorId && _jsx(ActorDetailModal, { actorId: selectedActorId, onClose: () => setSelectedActorId(null) })] }));
};
export default MovieDetail;
