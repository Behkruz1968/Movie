
import React from "react";
import MovieView from "@/components/movie-view/MovieView";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <MovieView />
    </div>
  );
};

export default React.memo(Home);
