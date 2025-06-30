import { useMovie } from '@/api/hooks/useMovie'
import React from 'react'
import MovieView from '@/components/movie-view/MovieView'

const Home = () => {
  const {getMovies} = useMovie()
  const {data} = getMovies({page: 1, without_genres: "18,36,27,10749"})
  return (
    <div>
      {/* <Carousel/> */}
      <MovieView data={data?.results?.slice(0, 10)}/>
    </div>
  )
}

export default React.memo(Home)