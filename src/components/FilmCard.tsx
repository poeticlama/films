import type { Film } from '../types.ts'

type FilmPageProps = {
  film: Film
}

const FilmCard = ({ film }: FilmPageProps) => {
  const posterUrl = film.poster.previewUrl || film.poster.url || film.backdrop.previewUrl
  const primaryRating = film.rating.kp > 0 ? film.rating.kp : film.rating.imdb > 0 ? film.rating.imdb : null

  return (
    <article className="w-72 overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:-translate-y-1">
      {posterUrl ? (
        <img src={posterUrl} alt={film.name} className="h-96 w-full object-cover" />
      ) : (
        <div className="flex h-96 w-full items-center justify-center bg-slate-200 text-slate-500"
             aria-label="Poster is not available">
          <svg
            viewBox="0 0 24 24"
            className="h-20 w-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="2.5" />
            <circle cx="17" cy="7" r="2.5" />
            <rect x="3" y="10" width="18" height="10" rx="2" />
            <path d="M9 14h6M9 17h6" />
          </svg>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <h2
            className="truncate text-lg font-semibold text-slate-800">{film.name || film.alternativeName || film.names.name}</h2>
          <p className="text-sm text-slate-500">{film.year || ''}</p>
        </div>

        {(primaryRating && <div className="rounded-lg bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-700">
          {primaryRating.toFixed(1)}
        </div>)}
      </div>
    </article>
  )
}

export default FilmCard