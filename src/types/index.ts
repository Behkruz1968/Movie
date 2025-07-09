export interface IMovie {
  overview: string;
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];  // ✅ Add this line
  original_language: string; // ✅ if you're using this too
  adult: boolean; // ✅ if using movie.adult
}
export interface IGenre {
  id: number;
  name: string;
}