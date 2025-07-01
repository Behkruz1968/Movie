// src/router/MainRouter.tsx
import { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Layout = lazy(() => import("./layout/Layout"));
const Home = lazy(() => import("./home/Home"));
const Movies = lazy(() => import("../pages/movies/Movies"));
const SearchPage = lazy(() => import("../pages/Search/SearchPage"));
const MovieDetail = lazy(() => import("../pages/movies/Movidedetail"));

const MainRouter = () => {
  return useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/movies", element: <Movies /> },
        { path: "/search", element: <SearchPage /> },
        { path: "/movie/:id", element: <MovieDetail/> },
      ],
    },
  ]);
};

export default MainRouter;
