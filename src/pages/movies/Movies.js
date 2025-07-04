import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Pagination, Select, Skeleton } from "antd";
import MovieDetail from "./Movidedetail";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const genreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 10751: "Family", 14: "Fantasy", 27: "Horror", 10402: "Music",
    9648: "Mystery", 878: "Science Fiction", 10770: "TV Movie", 53: "Thriller",
    10752: "War", 37: "Western"
};
const bannedGenres = new Set(["Romance", "Drama", "History"]);
const generateYearRanges = () => {
    const currentYear = new Date().getFullYear();
    const ranges = [];
    for (let end = currentYear; end > 1950; end -= 5) {
        const start = end - 5;
        ranges.push({ label: `${start} - ${end}`, value: `${start}-${end}` });
    }
    return ranges;
};
const MovieView = ({ data, onMovieClick }) => (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8", children: data.map((movie) => (_jsxs("div", { onClick: () => onMovieClick?.(movie.id), className: "group relative cursor-pointer bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-700", children: [movie.poster_path && (_jsx("img", { src: IMAGE_URL + movie.poster_path, alt: movie.title, loading: "lazy", className: "w-full h-[370px] object-cover group-hover:scale-105 transition-transform duration-300" })), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white", children: [_jsx("h3", { className: "text-lg font-bold truncate", title: movie.title, children: movie.title }), _jsxs("div", { className: "flex items-center gap-2 text-sm mt-1 text-yellow-400", children: ["\u2605 ", movie.vote_average.toFixed(1), " \u00B7", " ", _jsx("span", { className: "text-gray-300", children: movie.release_date?.split("-")[0] || "----" })] }), _jsx("p", { className: "line-clamp-2 mt-1 text-sm text-gray-300", children: movie.overview || "Tavsif mavjud emas..." })] })] }, movie.id))) }));
const MoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedYearRange, setSelectedYearRange] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    useEffect(() => {
        setLoading(true);
        let url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc`;
        if (selectedGenre)
            url += `&with_genres=${selectedGenre}`;
        if (selectedYearRange) {
            const [start, end] = selectedYearRange.split("-");
            url += `&primary_release_date.gte=${start}-01-01&primary_release_date.lte=${end}-12-31`;
        }
        fetch(url, {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2U0Y2M0YzA2YzcwN2I0ODcyMWVlY2ZjMjE5MGVmYyIsIm5iZiI6MTcyODg3NzQyNi4yLCJzdWIiOiI2NzBjOTM3MmIxNWQ5N2IxYTkzY2UwZjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.zZR_akio6SBvGWR4ThRbmrrWDuHZukkom4xo091rw8U`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            const filtered = (data.results || []).filter((movie) => {
                const genres = movie.genre_ids
                    ?.map((id) => genreMap[id])
                    .filter(Boolean);
                return !genres?.some((g) => bannedGenres.has(g));
            });
            setMovies(filtered);
            setTotalResults(data.total_results || 0);
            setLoading(false);
        })
            .catch(() => {
            setMovies([]);
            setTotalResults(0);
            setLoading(false);
        });
    }, [page, selectedGenre, selectedYearRange]);
    return (_jsxs("div", { className: "container mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent", children: "\u0417\u043D\u0430\u043C\u0435\u043D\u0438\u0442\u044B\u0435 \u0444\u0438\u043B\u044C\u043C\u044B" }), _jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [_jsx(Select, { placeholder: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0436\u0430\u043D\u0440", className: "w-full sm:w-[200px]", onChange: (value) => {
                                    setSelectedGenre(value);
                                    setPage(1);
                                }, allowClear: true, options: Object.entries(genreMap).map(([id, name]) => ({
                                    value: Number(id),
                                    label: name,
                                })) }), _jsx(Select, { placeholder: "\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D", className: "w-full sm:w-[160px]", onChange: (value) => {
                                    setSelectedYearRange(value);
                                    setPage(1);
                                }, allowClear: true, options: generateYearRanges() })] })] }), loading ? (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8", children: Array.from({ length: 8 }).map((_, index) => (_jsxs("div", { className: "bg-zinc-900 rounded-xl overflow-hidden shadow-md border border-zinc-700 p-2", children: [_jsx(Skeleton.Image, { style: { width: "100%", height: 370 }, active: true }), _jsx("div", { className: "mt-2 px-2", children: _jsx(Skeleton, { active: true, title: false, paragraph: { rows: 3 } }) })] }, index))) })) : movies.length === 0 ? (_jsx("div", { className: "text-center text-gray-400 mt-10", children: "Film topilmadi." })) : (_jsx(MovieView, { data: movies, onMovieClick: setSelectedMovieId })), _jsx("div", { className: "flex justify-center mt-10", children: _jsx(Pagination, { current: page, total: totalResults, onChange: (p) => setPage(p), pageSize: 20, showSizeChanger: false }) }), selectedMovieId !== null && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50", onClick: () => setSelectedMovieId(null), children: _jsxs("div", { className: "bg-zinc-900 rounded-lg max-w-4xl w-full mx-4 p-4 overflow-auto max-h-[90vh] relative", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { onClick: () => setSelectedMovieId(null), className: "absolute top-2 right-4 text-white text-3xl hover:text-red-500", children: "\u00D7" }), _jsx(MovieDetail, { movieId: selectedMovieId })] }) }))] }));
};
export default MoviesPage;
