import FilmCard from '../components/FilmCard.tsx'
import { useFilm } from '../hooks/api.ts'
import { useNavigate } from 'react-router'
import { getFavoriteIds } from '../utils/favorites.ts'

type FavoriteFilmCardLoaderProps = {
  filmId: number
}

const FavoriteFilmCardLoader = ({ filmId }: FavoriteFilmCardLoaderProps) => {
  const { film, isLoading, error } = useFilm(String(filmId))

  if (isLoading) {
    return (
      <div className="flex h-[460px] w-72 items-center justify-center rounded-2xl bg-white px-4 text-center text-slate-600 shadow-lg">
        Загрузка фильма...
      </div>
    )
  }

  if (error || !film) {
    return (
      <div className="flex h-[460px] w-72 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 text-center text-red-700 shadow-lg">
        Не удалось загрузить фильм
      </div>
    )
  }

  return (
    <FilmCard
      film={{
        id: film.id,
        name: film.name,
        alternativeName: film.alternativeName,
        year: film.year,
        poster: film.poster,
        backdrop: film.backdrop,
        rating: film.rating,
      }}
    />
  )
}

const FavoriteFilmsPage = () => {
  const navigate = useNavigate()
  const favoriteIds = getFavoriteIds()

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
        <h1 className="text-4xl font-semibold sm:text-5xl">Избранные фильмы</h1>
        <p className="mt-3 text-lg text-blue-100">Список фильмов, которые вы добавили в избранное.</p>
      </section>

      <section className="rounded-3xl">
        {favoriteIds.length === 0 ? (
          <p className="text-lg text-slate-700">Пока нет избранных фильмов.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {favoriteIds.map((id) => (
              <FavoriteFilmCardLoader key={id} filmId={id} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default FavoriteFilmsPage