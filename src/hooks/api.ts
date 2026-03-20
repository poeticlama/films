import { useEffect, useState } from 'react'
import type { Film } from '../types.ts'

type FilmsResponse = {
  docs?: unknown[]
}

const EMPTY_IMAGE = ''

const asObject = (value: unknown): Record<string, unknown> => {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

const asString = (value: unknown): string => {
  return typeof value === 'string' ? value : ''
}

const asNumber = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

const asBoolean = (value: unknown): boolean => {
  return typeof value === 'boolean' ? value : false
}

const asNames = (value: unknown): Film['names'] => {
  const source = Array.isArray(value)
    ? asObject(value[0])
    : asObject(value)

  return {
    name: asString(source.name),
    language: asString(source.language),
    type: asString(source.type),
  }
}

const asCountryList = (value: unknown): Film['countries'] => {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const obj = asObject(item)
    return {
      name: asString(obj.name),
    }
  })
}

const asGenreList = (value: unknown): Film['genres'] => {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const obj = asObject(item)
    return {
      name: asString(obj.name),
    }
  })
}

const asImage = (value: unknown): Film['poster'] => {
  const obj = asObject(value)

  return {
    url: asString(obj.url) || EMPTY_IMAGE,
    previewUrl: asString(obj.previewUrl) || EMPTY_IMAGE,
  }
}

const asRatingBlock = (value: unknown): Film['rating'] => {
  const obj = asObject(value)

  return {
    kp: asNumber(obj.kp),
    imdb: asNumber(obj.imdb),
    tmdb: asNumber(obj.tmdb),
    filmCritics: asNumber(obj.filmCritics),
    russianFilmCritics: asNumber(obj.russianFilmCritics),
    await: asNumber(obj.await),
  }
}

const serializeFilm = (value: unknown): Film => {
  const obj = asObject(value)

  return {
    id: asNumber(obj.id),
    alternativeName: asString(obj.alternativeName),
    backdrop: asImage(obj.backdrop),
    countries: asCountryList(obj.countries),
    description: asString(obj.description),
    genres: asGenreList(obj.genres),
    isSeries: asBoolean(obj.isSeries),
    movieLength: asNumber(obj.movieLength),
    name: asString(obj.name),
    poster: asImage(obj.poster),
    rating: asRatingBlock(obj.rating),
    ticketsOnSale: asBoolean(obj.ticketsOnSale),
    type: asString(obj.type),
    typeNumber: asNumber(obj.typeNumber),
    votes: asRatingBlock(obj.votes),
    year: asNumber(obj.year),
    names: asNames(obj.names),
  }
}

export const useFilms = () => {
  const [films, setFilms] = useState<Film[]>([])

  useEffect(() => {
    fetch('https://api.poiskkino.dev/v1.5/movie', {
      headers: {
        'X-API-KEY': import.meta.env.VITE_API_KEY,
      }
    }).then((response) => response.json())
      .then((res: FilmsResponse) => {
        const docs = Array.isArray(res.docs) ? res.docs : []
        const serializedFilms = docs.map(serializeFilm)

        setFilms((films) => [...films, ...serializedFilms])
      })
  }, [])

  return films
}