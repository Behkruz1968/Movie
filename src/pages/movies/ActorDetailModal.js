import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { InstagramOutlined, TwitterOutlined, FacebookOutlined, } from "@ant-design/icons";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const ActorDetailModal = ({ actorId, onClose }) => {
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [images, setImages] = useState([]);
    const [externalIds, setExternalIds] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [actorRes, movieCreditsRes, tvCreditsRes, externalIdsRes, imagesRes,] = await Promise.all([
                    api.get(`/person/${actorId}?language=ru-RU`),
                    api.get(`/person/${actorId}/movie_credits?language=ru-RU`),
                    api.get(`/person/${actorId}/tv_credits?language=ru-RU`),
                    api.get(`/person/${actorId}/external_ids`),
                    api.get(`/person/${actorId}/images`),
                ]);
                setActor(actorRes.data);
                setMovies(movieCreditsRes.data.cast
                    .filter((m) => m.release_date)
                    .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
                    .slice(0, 8));
                setTvShows(tvCreditsRes.data.cast
                    .filter((tv) => tv.first_air_date)
                    .sort((a, b) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime())
                    .slice(0, 8));
                setExternalIds(externalIdsRes.data);
                setImages(imagesRes.data.profiles);
            }
            catch {
                setError("Не удалось загрузить данные актёра");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [actorId]);
    if (loading)
        return _jsx("div", { className: "text-white p-4", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    if (error)
        return _jsx("div", { className: "text-red-500 p-4", children: error });
    if (!actor)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "relative bg-zinc-900 text-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500", children: "\u00D7" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsx("div", { className: "w-48 h-72 bg-zinc-700 rounded-lg overflow-hidden flex items-center justify-center", children: actor.profile_path ? (_jsx("img", { src: IMAGE_URL + actor.profile_path, alt: actor.name, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "text-gray-400 text-lg", children: "\u041D\u0435\u0442 \u0444\u043E\u0442\u043E" })) }), _jsxs("div", { className: "flex-1 space-y-3", children: [_jsx("h2", { className: "text-4xl font-bold", children: actor.name }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300", children: [actor.birthday && (_jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "\uD83C\uDF82 \u0414\u0430\u0442\u0430 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F:" }), " ", actor.birthday] })), actor.place_of_birth && (_jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "\uD83C\uDF0D \u041C\u0435\u0441\u0442\u043E:" }), " ", actor.place_of_birth] })), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "\uD83D\uDC64 \u041E\u0442\u0440\u0430\u0441\u043B\u044C:" }), " ", actor.known_for_department] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "\uD83D\uDD25 \u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C:" }), " ", actor.popularity.toFixed(1)] })] }), externalIds && (_jsxs("div", { className: "flex gap-4 mt-2", children: [externalIds.imdb_id && (_jsx("a", { href: `https://www.imdb.com/name/${externalIds.imdb_id}`, target: "_blank", rel: "noopener noreferrer", className: "hover:text-yellow-400", children: "IMDb" })), externalIds.instagram_id && (_jsx("a", { href: `https://instagram.com/${externalIds.instagram_id}`, target: "_blank", rel: "noopener noreferrer", children: _jsx(InstagramOutlined, { className: "text-2xl hover:text-pink-500" }) })), externalIds.twitter_id && (_jsx("a", { href: `https://twitter.com/${externalIds.twitter_id}`, target: "_blank", rel: "noopener noreferrer", children: _jsx(TwitterOutlined, { className: "text-2xl hover:text-blue-400" }) })), externalIds.facebook_id && (_jsx("a", { href: `https://facebook.com/${externalIds.facebook_id}`, target: "_blank", rel: "noopener noreferrer", children: _jsx(FacebookOutlined, { className: "text-2xl hover:text-blue-600" }) }))] }))] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "\u0411\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u044F" }), _jsx("p", { className: "text-sm text-gray-200 whitespace-pre-line max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 pr-2", children: actor.biography || "Биография отсутствует." })] }), movies.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-3", children: "\u0424\u0438\u043B\u044C\u043C\u044B" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: movies.map((movie) => (_jsxs("div", { onClick: () => {
                                    onClose();
                                    navigate(`/movie/${movie.id}`);
                                }, className: "cursor-pointer bg-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition", children: [movie.poster_path ? (_jsx("img", { src: IMAGE_URL + movie.poster_path, alt: movie.title, className: "w-full h-40 object-cover" })) : (_jsx("div", { className: "w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400", children: "\u041D\u0435\u0442 \u043F\u043E\u0441\u0442\u0435\u0440\u0430" })), _jsxs("div", { className: "p-2 text-sm text-center", children: [_jsx("p", { className: "font-medium line-clamp-2", children: movie.title }), _jsx("p", { className: "text-xs text-gray-400", children: movie.release_date?.slice(0, 4) })] })] }, movie.id))) })] })), tvShows.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-3", children: "\u0421\u0435\u0440\u0438\u0430\u043B\u044B" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: tvShows.map((tv) => (_jsxs("div", { className: "bg-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition", children: [tv.poster_path ? (_jsx("img", { src: IMAGE_URL + tv.poster_path, alt: tv.name, className: "w-full h-40 object-cover" })) : (_jsx("div", { className: "w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400", children: "\u041D\u0435\u0442 \u043F\u043E\u0441\u0442\u0435\u0440\u0430" })), _jsxs("div", { className: "p-2 text-sm text-center", children: [_jsx("p", { className: "font-medium line-clamp-2", children: tv.name }), _jsx("p", { className: "text-xs text-gray-400", children: tv.first_air_date?.slice(0, 4) })] })] }, tv.id))) })] })), images.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-semibold mb-3", children: "\u0424\u043E\u0442\u043E\u0433\u0430\u043B\u0435\u0440\u0435\u044F" }), _jsx("div", { className: "flex gap-3 overflow-x-auto pb-2", children: images.slice(0, 10).map((img, idx) => (_jsx("img", { src: IMAGE_URL + img.file_path, alt: "actor", className: "h-40 rounded-lg object-cover flex-shrink-0" }, idx))) })] }))] }) }));
};
export default ActorDetailModal;
