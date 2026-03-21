type GenreFilterProps = {
  selectedGenres: string[]
  onChange: (nextGenres: string[]) => void
}

export const GENRE_OPTIONS = [
  'драма',
  'комедия',
  'боевик',
  'триллер',
  'ужасы',
  'мелодрама',
  'фантастика',
  'мультфильм',
]

const normalizeGenres = (values: string[]) => {
  const uniqueGenres = Array.from(new Set(values.map((value) => value.trim())))
  return uniqueGenres.filter((value) => GENRE_OPTIONS.includes(value))
}

export const readGenresFromQuery = (searchParams: URLSearchParams) => {
  const modernValues = searchParams.getAll('genre')
  const legacyValues = searchParams.getAll('genres.name')
  const sourceValues = modernValues.length > 0 ? modernValues : legacyValues

  return normalizeGenres(sourceValues)
}

const GenreFilter = ({ selectedGenres, onChange }: GenreFilterProps) => {
  const safeSelectedGenres = normalizeGenres(selectedGenres)

  const toggleGenre = (genre: string) => {
    if (safeSelectedGenres.includes(genre)) {
      onChange(safeSelectedGenres.filter((selectedGenre) => selectedGenre !== genre))
      return
    }

    onChange([...safeSelectedGenres, genre])
  }

  const selectedCount = safeSelectedGenres.length

  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-white">
      <div className="flex items-center justify-between gap-3">
        <span>Жанры</span>
        {selectedCount > 0 && (
          <button
            type="button"
            className="rounded-lg bg-white/20 px-2 py-1 text-xs font-medium hover:bg-white/30"
            onClick={() => onChange([])}
          >
            Сбросить ({selectedCount})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl bg-white/5 p-2">
        {GENRE_OPTIONS.map((genre) => {
          const isSelected = safeSelectedGenres.includes(genre)

          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={isSelected
                ? 'rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-900'
                : 'rounded-lg border border-white/40 px-3 py-2 text-xs font-medium text-white hover:bg-white/10'}
            >
              {genre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GenreFilter

