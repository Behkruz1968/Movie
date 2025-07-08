import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import MovieView from "@/components/movie-view/MovieView";
const Home = () => {
    return (_jsx("div", { className: "min-h-screen bg-black text-white", children: _jsx(MovieView, {}) }));
};
export default React.memo(Home);
