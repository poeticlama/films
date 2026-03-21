import { useMemo } from 'react'
import FilmCard from '../components/FilmCard.tsx'
import GenreFilter, { readGenresFromQuery } from '../components/GenreFilter.tsx'
import { type FilmsQueryParams, useFilms } from '../hooks/api.ts'
import { useSearchParams } from 'react-router'

const getQueryValue = (searchParams: URLSearchParams, key: string, legacyKey?: string) => {
  const value = searchParams.get(key)
  if (value !== null) return value
  if (!legacyKey) return ''

  return searchParams.get(legacyKey) ?? ''
}

const FilmsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const genres = useMemo(() => readGenresFromQuery(searchParams), [searchParams])
  const rating = getQueryValue(searchParams, 'rating', 'rating.kp')
  const year = getQueryValue(searchParams, 'year')

  const setGenreFilter = (nextGenres: string[]) => {
    const nextParams = new URLSearchParams(searchParams)

    nextParams.delete('genre')
    nextParams.delete('genres.name')
    nextGenres.forEach((genre) => nextParams.append('genre', genre))

    setSearchParams(nextParams, { replace: true })
  }

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

    if (genres.length > 0) {
      params['genres.name'] = genres
    }

    if (rating.trim() !== '') {
      params['rating.kp'] = [rating]
    }

    if (year.trim() !== '') {
      params.year = [year]
    }

    return params
  }, [genres, rating, year])

  const {films, ref} = useFilms(filters)

  return (
    <div className="mx-auto my-10 flex max-w-7xl flex-col items-center gap-10 px-6 text-blue-900">
      <h1 className="text-3xl font-semibold">Очень классные фильмы</h1>

      <div className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-blue-950 p-4 text-white shadow-xl sm:grid-cols-3">
        <GenreFilter selectedGenres={genres} onChange={setGenreFilter} />

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