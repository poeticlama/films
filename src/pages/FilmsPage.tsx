import FilmCard from '../components/FilmCard.tsx'
import { useFilms } from '../hooks/api.ts'

const FilmsPage = () => {
  const films = useFilms()

  return (
    <div className="mx-auto my-10 flex max-w-7xl flex-col items-center gap-10 px-6 text-blue-900">
      <h1 className="text-3xl font-semibold">Очень классные фильмы</h1>
      <div className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {films.map((film) => (<FilmCard key={film.id} film={film} />))}
      </div>
    </div>
  )
}

export default FilmsPage