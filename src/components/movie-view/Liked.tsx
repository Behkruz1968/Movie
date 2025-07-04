import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface LikedContextType {
  likedMovies: any[];
  toggleLike: (movie: any) => void;
}

export const LikedContext = createContext<LikedContextType>({
  likedMovies: [],
  toggleLike: () => {},
});

interface Props {
  children: ReactNode;
}

export const LikedProvider: React.FC<Props> = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("liked");
    if (saved) {
      setLikedMovies(JSON.parse(saved));
    }
  }, []);

  const toggleLike = (movie: any) => {
    const exists = likedMovies.some((m) => m.id === movie.id);
    const updated = exists
      ? likedMovies.filter((m) => m.id !== movie.id)
      : [...likedMovies, movie];
    setLikedMovies(updated);
    localStorage.setItem("liked", JSON.stringify(updated));
  };

  return (
    <LikedContext.Provider value={{ likedMovies, toggleLike }}>
      {children}
    </LikedContext.Provider>
  );
};
