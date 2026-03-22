import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useFilm } from '../hooks/api.ts'
import { getComparedIds } from '../utils/compared.ts'

const getNounForm = (value: number, one: string, few: string, many: string) => {
  const absValue = Math.abs(value)
  const lastTwoDigits = absValue % 100
  const lastDigit = absValue % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return many
  if (lastDigit === 1) return one
  if (lastDigit >= 2 && lastDigit <= 4) return few
  return many
}

const formatMovieLengthRu = (totalMinutes: number) => {
  if (totalMinutes <= 0) return '—'

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${totalMinutes} ${getNounForm(totalMinutes, 'минута', 'минуты', 'минут')}`
  }

  const hoursPart = `${hours} ${getNounForm(hours, 'час', 'часа', 'часов')}`
  if (minutes === 0) return hoursPart

  const minutesPart = `${minutes} ${getNounForm(minutes, 'минута', 'минуты', 'минут')}`
  return `${hoursPart} ${minutesPart}`
}

const getPrimaryRating = (kp: number, imdb: number) => {
  if (kp > 0) return kp.toFixed(1)
  if (imdb > 0) return imdb.toFixed(1)
  return '—'
}

const ComparisonPage = () => {
  const navigate = useNavigate()
  const [comparedIds] = useState<number[]>(() => getComparedIds())
  const firstId = comparedIds[0]
  const secondId = comparedIds[1]

  const firstFilmState = useFilm(firstId ? String(firstId) : '')
  const secondFilmState = useFilm(secondId ? String(secondId) : '')

  const films = [firstFilmState, secondFilmState]
    .map((state, index) => ({
      film: state.film,
      isLoading: state.isLoading,
      error: state.error,
      id: comparedIds[index],
    }))
    .filter((item) => Boolean(item.id))

  return (
    <div className="mx-auto my-8 flex w-full max-w-7xl flex-col gap-6 px-4 text-blue-900 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-base font-medium text-blue-900 shadow-sm transition hover:cursor-pointer hover:bg-blue-50"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Вернуться назад
      </button>

      <section className="rounded-3xl bg-blue-950 p-8 text-white shadow-2xl sm:p-10">
        <h1 className="text-4xl font-semibold sm:text-5xl">Сравнение фильмов</h1>
        <p className="mt-3 text-lg text-blue-100">
          Можно сравнить до двух фильмов: название, год, рейтинг, жанры и длительность.
        </p>
      </section>

      {films.length === 0 ? (
        <section className="rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-lg text-slate-700">Вы еще не добавили фильмы в сравнение.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center rounded-xl bg-blue-900 px-5 py-3 text-base font-semibold text-white"
          >
            Перейти к фильмам
          </Link>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
              <tr className="bg-blue-50">
                <th className="w-56 border-b border-blue-100 px-4 py-4 text-left text-sm font-semibold text-blue-900">
                  Поле
                </th>
                {films.map((item, index) => (
                  <th key={item.id} className="min-w-64 border-b border-blue-100 px-4 py-4 text-left text-sm font-semibold text-blue-900">
                    {item.film?.name || item.film?.alternativeName || `Фильм ${index + 1}`}
                  </th>
                ))}
              </tr>
              </thead>

              <tbody>
              <tr>
                <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-700">Название</td>
                {films.map((item) => (
                  <td key={`name-${item.id}`} className="border-b border-slate-100 px-4 py-4 text-slate-700">
                    {item.isLoading ? 'Загрузка...' : item.error ? 'Ошибка загрузки' : (item.film?.name || item.film?.alternativeName || '—')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-700">Год</td>
                {films.map((item) => (
                  <td key={`year-${item.id}`} className="border-b border-slate-100 px-4 py-4 text-slate-700">
                    {item.isLoading ? 'Загрузка...' : item.error ? 'Ошибка загрузки' : (item.film?.year || '—')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-700">Рейтинг</td>
                {films.map((item) => (
                  <td key={`rating-${item.id}`} className="border-b border-slate-100 px-4 py-4 text-slate-700">
                    {item.isLoading || item.error || !item.film
                      ? (item.isLoading ? 'Загрузка...' : 'Ошибка загрузки')
                      : getPrimaryRating(item.film.rating.kp, item.film.rating.imdb)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border-b border-slate-100 px-4 py-4 font-medium text-slate-700">Жанры</td>
                {films.map((item) => (
                  <td key={`genres-${item.id}`} className="border-b border-slate-100 px-4 py-4 text-slate-700">
                    {item.isLoading
                      ? 'Загрузка...'
                      : item.error || !item.film
                        ? 'Ошибка загрузки'
                        : item.film.genres.length > 0
                          ? item.film.genres.map((genre) => genre.name).join(', ')
                          : '—'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-4 py-4 font-medium text-slate-700">Длительность</td>
                {films.map((item) => (
                  <td key={`length-${item.id}`} className="px-4 py-4 text-slate-700">
                    {item.isLoading
                      ? 'Загрузка...'
                      : item.error || !item.film
                        ? 'Ошибка загрузки'
                        : formatMovieLengthRu(item.film.movieLength)}
                  </td>
                ))}
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default ComparisonPage