export interface IMovie{
    overview: string
    id: number,
    title: string,
    backdrop_path: string,
    poster_path: string,
    vote_average: number,
    release_date:string
}

export interface IGenre {
    id: number,
    name: string
}