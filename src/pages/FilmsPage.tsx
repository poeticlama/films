import { useMemo } from 'react'
import FilmCard from '../components/FilmCard.tsx'
import { type FilmsQueryParams, useFilms } from '../hooks/api.ts'
import { Link, useSearchParams } from 'react-router'

const GENRE_OPTIONS = [
  'драма',
  'комедия',
  'боевик',
  'триллер',
  'ужасы',
  'мелодрама',
  'фантастика',
  'мультфильм',
]

const getQueryValue = (searchParams: URLSearchParams, key: string, legacyKey?: string) => {
  const value = searchParams.get(key)
  if (value !== null) return value
  if (!legacyKey) return ''

  return searchParams.get(legacyKey) ?? ''
}

const FilmsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawGenre = getQueryValue(searchParams, 'genre', 'genres.name')
  const genre = GENRE_OPTIONS.includes(rawGenre) ? rawGenre : ''
  const rating = getQueryValue(searchParams, 'rating', 'rating.kp')
  const year = getQueryValue(searchParams, 'year')

  const setFilterParam = (key: string, value: string, legacyKey?: string) => {
    const nextParams = new URLSearchParams(searchParams)
    const trimmedValue = value.trim()

    if (trimmedValue === '') {
      nextParams.delete(key)
      if (legacyKey) nextParams.delete(legacyKey)
    } else {
      nextParams.set(key, trimmedValue)
      if (legacyKey) nextParams.delete(legacyKey)
    }

    setSearchParams(nextParams, { replace: true })
  }

  const filters = useMemo<FilmsQueryParams>(() => {
    const params: FilmsQueryParams = {}

    if (genre.trim() !== '') {
      params['genres.name'] = [genre]
    }

    if (rating.trim() !== '') {
      params['rating.kp'] = [rating]
    }

    if (year.trim() !== '') {
      params.year = [year]
    }

    return params
  }, [genre, rating, year])

  const {films, ref} = useFilms(filters)

  return (
    <div className="mx-auto my-10 flex max-w-7xl flex-col items-center gap-10 px-6 text-blue-900">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Очень классные фильмы</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5" width="8" height="14" rx="2" />
              <rect x="13" y="5" width="8" height="14" rx="2" />
            </svg>
            Сравнение
          </Link>
          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12.7 21.35a.72.72 0 0 1-.4.11.74.74 0 0 1-.4-.11C8.14 19.1 3 15.27 3 10.5a4.5 4.5 0 0 1 8.1-2.7 4.5 4.5 0 0 1 8.1 2.7c0 4.77-5.14 8.6-8.9 10.85Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Избранное
          </Link>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-blue-950 text-white p-4 shadow-xl sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Жанр
          <div className="relative">
            <select
              value={genre}
              onChange={(event) => setFilterParam('genre', event.target.value, 'genres.name')}
              className="h-11 w-full appearance-none rounded-xl border bg-white border-blue-500 px-3 pr-10 text-blue-900 outline-none transition"
            >
              <option value="">Все жанры</option>
              {GENRE_OPTIONS.map((genreOption) => (
                <option key={genreOption} value={genreOption}>{genreOption}</option>
              ))}
            </select>

            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-white">
          Рейтинг КП
          <input
            value={rating}
            onChange={(event) => setFilterParam('rating', event.target.value, 'rating.kp')}
            className="h-11 rounded-xl border border-blue-500 text-blue-900 bg-white px-3 outline-none transition"
            placeholder="например: 7.2-10"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-white">
          Год выхода
          <input
            value={year}
            onChange={(event) => setFilterParam('year', event.target.value)}
            className="h-11 rounded-xl border border-blue-500 text-blue-900 bg-white px-3 outline-none transition"
            placeholder="например: 2020-2024"
          />
        </label>
      </div>

      <div className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {films.map((film) => (<FilmCard key={film.id} film={film} />))}
      </div>
      <div className="flex justify-center my-5" ref={ref}>Загрузка...</div>
    </div>
  )
}

export default FilmsPage