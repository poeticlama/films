import { useEffect, useRef, useState } from 'react'
import type { Film } from '../types.ts'
import { useIntersectionObserver } from '@siberiacancode/reactuse'

type QueryParamValue = string | string[] | null | undefined
export type FilmsQueryParams = Record<string, QueryParamValue>

type FilmsResponse = {
  docs?: unknown[]
  next: string | null
  'limit': number
  'prev': string | null
  'hasNext': boolean
  'hasPrev': boolean
}

const BASE_URL = 'https://api.poiskkino.dev/v1.5/movie?limit=50&sortField=rating.kp&sortType=-1'

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
  if (Array.isArray(value)) {
    const source = value
      .map((item) => asObject(item))
      .find((item) => asString(item.name) !== '')

    if (source) {
      return {
        name: asString(source.name),
        language: asString(source.language),
        type: asString(source.type),
      }
    }
  }

  const source = asObject(value)
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

export const useFilms = (params?: FilmsQueryParams) => {
  const [films, setFilms] = useState<Film[]>([])
  const [next, setNext] = useState<string | null>(null)
  const [nextTrigger, setNextTrigger] = useState<string | null>(null)

  const { ref } = useIntersectionObserver<HTMLDivElement>({
    threshold: 1,
    onChange: (entry) => {
      if (entry[0].isIntersecting) setNextTrigger(next);
    },
  });

  const filterQueryParams = new URLSearchParams()

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .forEach((item) => filterQueryParams.append(key, item))
      return
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim()
      if (trimmedValue !== '') {
        filterQueryParams.append(key, trimmedValue)
      }
    }
  })

  const filtersQueryString = filterQueryParams.toString()
  const previousFiltersQueryRef = useRef(filtersQueryString)
  const didFiltersChange = previousFiltersQueryRef.current !== filtersQueryString

  if (didFiltersChange) {
    previousFiltersQueryRef.current = filtersQueryString
  }

  useEffect(() => {
    setNext(null)
    setNextTrigger(null)
  }, [filtersQueryString])

  const queryParams = new URLSearchParams(filtersQueryString)

  if (nextTrigger && !didFiltersChange) queryParams.append('next', nextTrigger)
  const queryString = queryParams.toString()
  const apiUrl = queryString ? `${BASE_URL}&${queryString}` : BASE_URL

  useEffect(() => {
    const controller = new AbortController()
    if (nextTrigger !== next) setFilms([])

    fetch(`${apiUrl}`, {
      signal: controller.signal,
      headers: {
        'X-API-KEY': import.meta.env.VITE_API_KEY,
      },
    }).then((response) => response.json())
      .then((res: FilmsResponse) => {
        const docs = Array.isArray(res.docs) ? res.docs : []
        const serializedFilms = docs.map(serializeFilm)
        if (nextTrigger !== next) {
          setFilms(serializedFilms)
        } else {
          setFilms((prevFilms) => [...prevFilms, ...serializedFilms])
        }

        if (res.hasNext) {
          setNext(res.next as string)
        } else {
          setNext(null)
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        throw error
      })

    return () => controller.abort()
  }, [apiUrl])

  return {films, ref}
}