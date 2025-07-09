import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import MovieDetail from "../pages/movies/Movidedetail";
const Layout = lazy(() => import("./layout/Layout"));
const Home = lazy(() => import("./home/Home"));
const Movies = lazy(() => import("../pages/movies/Movies"));
const SearchPage = lazy(() => import("../pages/Search/SearchPage"));

const Login = lazy(() => import("@/components/Login/Login"));

const MainRouter = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "movies", element: <Movies /> },
        { path: "search", element: <SearchPage /> },
        { path: "movie/:id", element: <MovieDetail/>},
        { path: "login", element: <Login /> },
      ],
    },
  ]);

  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Yuklanmoqda...</div>}>
      {routes}
    </Suspense>
  );
};

export default MainRouter;
