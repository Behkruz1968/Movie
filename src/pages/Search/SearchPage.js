import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Input, Spin, Alert } from "antd";
import { IMAGE_URL } from "@/const";
import { api } from "@/api";
import { Link } from "react-router-dom";
const { Search } = Input;
const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    useEffect(() => {
        const storedHistory = localStorage.getItem("searchHistory");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);
    useEffect(() => {
        if (!query)
            return;
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
    const removeHistoryItem = (termToRemove) => {
        const updated = history.filter((term) => term !== termToRemove);
        setHistory(updated);
        localStorage.setItem("searchHistory", JSON.stringify(updated));
    };
    return (_jsxs("div", { className: "min-h-screen max-w-7xl mx-auto py-16 px-6 text-gray-900 dark:text-white transition-colors", children: [_jsx("h1", { className: "text-4xl font-bold mb-10 text-center", children: "\u041F\u043E\u0438\u0441\u043A \u0444\u0438\u043B\u044C\u043C\u0430" }), _jsx("div", { className: "max-w-3xl mx-auto mb-10", children: _jsx(Search, { placeholder: "\u041D\u0430\u0439\u0442\u0438 \u0444\u0438\u043B\u044C\u043C...", onSearch: (val) => setQuery(val), enterButton: " \u041F\u043E\u0438\u0441\u043A", size: "large", className: "w-full", allowClear: true }) }), loading && (_jsx("div", { className: "flex justify-center py-20", children: _jsx(Spin, { size: "large" }) })), error && (_jsx(Alert, { message: error, type: "error", showIcon: true, className: "mb-4 dark:bg-red-900 dark:text-white" })), !loading && query && (_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-semibold mb-6 text-center", children: ["\u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430: ", _jsx("span", { className: "text-blue-500", children: query })] }), _jsx("div", { className: "grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: movies.map((movie) => (_jsx(Link, { to: `/movie/${movie.id}`, children: _jsxs("div", { className: "bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 hover:scale-105", children: [_jsx("img", { src: movie.poster_path
                                            ? IMAGE_URL + movie.poster_path
                                            : "/placeholder-poster.png", alt: movie.title, className: "w-full h-[420px] object-cover" }), _jsxs("div", { className: "p-5", children: [_jsx("h3", { className: "text-xl font-bold mb-2 truncate", children: movie.title }), _jsx("p", { className: "text-base text-gray-600 dark:text-gray-400 line-clamp-3", children: movie.overview || "Tavsif mavjud emas..." }), _jsxs("div", { className: "mt-3 text-base text-yellow-500 font-medium", children: ["\u2605 ", movie.vote_average?.toFixed(1) || "0.0", " \u00B7", " ", movie.release_date?.split("-")[0] || "Noma'lum"] })] })] }) }, movie.id))) })] })), !loading && history.length > 0 && (_jsxs("div", { className: "mt-14", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-center", children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043F\u043E\u0438\u0441\u043A\u0438:" }), _jsx("div", { className: "flex flex-wrap justify-center gap-3", children: history.map((term, index) => (_jsxs("div", { className: "flex items-center bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-4 py-2 rounded-full cursor-pointer text-sm transition relative group", children: [_jsx("span", { onClick: () => setQuery(term), children: term }), _jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        removeHistoryItem(term);
                                    }, className: "ml-2 text-gray-600 dark:text-gray-300 group-hover:text-red-600 hover:scale-125 transition-transform duration-150", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C", children: "\u00D7" })] }, index))) })] }))] }));
};
export default SearchPage;
