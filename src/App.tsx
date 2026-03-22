import { Route, Routes } from 'react-router'
import FilmsPage from './pages/FilmsPage.tsx'
import FilmPage from './pages/FilmPage.tsx'
import FavoriteFilmsPage from './pages/FavoriteFilmsPage.tsx'
import ComparisonPage from './pages/ComparisonPage.tsx'

function App() {

  return (
    <Routes>
      <Route index element={<FilmsPage />} />
      <Route path="film/:filmId" element={<FilmPage />} />
      <Route path="favorites" element={<FavoriteFilmsPage />} />
      <Route path="compare" element={<ComparisonPage />} />
    </Routes>
  )
}

export default App
