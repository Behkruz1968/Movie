import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect } from "react";
export const LikedContext = createContext({
    likedMovies: [],
    toggleLike: () => { },
});
export const LikedProvider = ({ children }) => {
    const [likedMovies, setLikedMovies] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem("liked");
        if (saved) {
            setLikedMovies(JSON.parse(saved));
        }
    }, []);
    const toggleLike = (movie) => {
        const exists = likedMovies.some((m) => m.id === movie.id);
        const updated = exists
            ? likedMovies.filter((m) => m.id !== movie.id)
            : [...likedMovies, movie];
        setLikedMovies(updated);
        localStorage.setItem("liked", JSON.stringify(updated));
    };
    return (_jsx(LikedContext.Provider, { value: { likedMovies, toggleLike }, children: children }));
};
