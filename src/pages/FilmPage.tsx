import { useParams } from 'react-router'
import { useFilm } from '../hooks/api.ts'

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
  if (totalMinutes <= 0) return ''

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

const FilmPage = () => {
  const params = useParams()
  const filmId = params.filmId ?? ''
  const { film, isLoading, error } = useFilm(filmId)

  if (!filmId) {
    return <div className="mx-auto my-10 max-w-7xl px-6 text-xl text-blue-900">Фильм не найден</div>
  }

  if (isLoading) {
    return (
      <div className="mx-auto my-10 max-w-7xl px-6 text-blue-900">
        <div className="rounded-3xl p-10 text-center text-xl font-semibold">Загрузка фильма...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto my-10 max-w-7xl px-6 text-blue-900">
        <div className="rounded-3xl border border-red-300 bg-red-50 p-8 text-lg text-red-700 shadow-md">Ошибка
          загрузки: {error}</div>
      </div>
    )
  }

  if (!film) {
    return <div className="mx-auto my-10 max-w-7xl px-6 text-xl text-blue-900">Фильм не найден</div>
  }

  const posterUrl = film.poster.previewUrl || film.poster.url || film.backdrop.previewUrl || film.backdrop.url
  const backdropUrl = film.backdrop.url || film.backdrop.previewUrl
  const primaryRating = film.rating.kp > 0 ? film.rating.kp : film.rating.imdb > 0 ? film.rating.imdb : null

  return (
    <div className="mx-auto my-8 flex w-full max-w-7xl flex-col gap-6 px-4 text-blue-900 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-blue-950 text-white shadow-2xl">
        {backdropUrl && (
          <img src={backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-5"
               aria-hidden="true" />
        )}

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[360px_1fr] lg:p-10">
          {posterUrl ? (
            <img src={posterUrl} alt={film.name} className="h-[520px] w-full rounded-2xl object-cover" />
          ) : (
            <div className="flex h-[520px] w-full items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
              <svg viewBox="0 0 24 24" className="h-24 w-24" fill="none" stroke="currentColor" strokeWidth="1.5"
                   aria-hidden="true">
                <circle cx="7" cy="7" r="2.5" />
                <circle cx="17" cy="7" r="2.5" />
                <rect x="3" y="10" width="18" height="10" rx="2" />
                <path d="M9 14h6M9 17h6" />
              </svg>
            </div>
          )}

          <div className="flex flex-col justify-between gap-7">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{film.name || film.alternativeName}</h1>
              {film.alternativeName && film.alternativeName !== film.name && (
                <p className="text-lg text-blue-100">{film.alternativeName}</p>
              )}
              <div className="flex flex-wrap gap-3 text-base">
                <span className="rounded-xl bg-amber-100 px-4 py-2 font-semibold text-amber-700">
                  Рейтинг: {primaryRating ? primaryRating.toFixed(1) : '—'}
                </span>
                {film.movieLength > 0 &&
                  <span className="rounded-xl bg-white/20 px-4 py-2">Длительность: {formatMovieLengthRu(film.movieLength)}</span>}
                <span className="rounded-xl bg-white/20 px-4 py-2">Год выхода: {film.year || '—'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-900">
                Добавить в избранное
              </button>
              <button type="button"
                      className="rounded-xl border border-white px-6 py-3 text-base font-semibold text-white">
                Добавить к сравнению
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-2xl font-semibold text-blue-900">Описание</h2>
        <p
          className="text-lg leading-relaxed text-slate-700">{film.description || film.shortDescription || 'Описание отсутствует'}</p>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-2xl font-semibold text-blue-900">Жанры</h2>
        <div className="flex flex-wrap gap-3">
          {film.genres.length > 0 ? (
            film.genres.map((genre) => (
              <span key={genre.name} className="rounded-full bg-blue-100 px-4 py-2 text-base font-medium text-blue-900">
                {genre.name}
              </span>
            ))
          ) : (
            <span className="text-lg text-slate-600">Жанры не указаны</span>
          )}
        </div>
      </section>
    </div>
  )
}

export default FilmPage