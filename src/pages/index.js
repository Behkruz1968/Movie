import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
const Layout = lazy(() => import("./layout/Layout"));
const Home = lazy(() => import("./home/Home"));
const Movies = lazy(() => import("../pages/movies/Movies"));
const SearchPage = lazy(() => import("../pages/Search/SearchPage"));
const MovieDetail = lazy(() => import("../pages/movies/Movidedetail"));
const Login = lazy(() => import("@/components/Login/Login"));
const MainRouter = () => {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "text-white text-center mt-10", children: "Yuklanmoqda..." }), children: useRoutes([
            {
                path: "/",
                element: _jsx(Layout, {}),
                children: [
                    { path: "", element: _jsx(Home, {}) },
                    { path: "movies", element: _jsx(Movies, {}) },
                    { path: "search", element: _jsx(SearchPage, {}) },
                    { path: "movie/:id", element: _jsx(MovieDetail, {}) },
                    { path: "login", element: _jsx(Login, {}) },
                ],
            },
        ]) }));
};
export default MainRouter;
