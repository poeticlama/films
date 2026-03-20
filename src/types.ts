export type Film = {
  id: number
  alternativeName: string
  backdrop: {
    url: string
    previewUrl: string
  }
  countries: FilmCountry[]
  description: string
  genres: FilmGenre[]
  isSeries: boolean
  movieLength: number
  name: string
  poster: {
    url: string,
    previewUrl: string
  }
  rating: {
    kp: number
    imdb: number
    tmdb: number
    filmCritics: number
    russianFilmCritics: number
    await: number
  }
  ticketsOnSale: boolean
  type: string
  typeNumber: number
  votes: {
    kp: number
    imdb: number
    tmdb: number
    filmCritics: number
    russianFilmCritics: number
    await: number
  }
  year: number
  names: FilmName
}

type FilmCountry = {
  name: string
}

type FilmGenre = {
  name: string
}

type FilmName = {
  name: string
  language: string
  type: string
}