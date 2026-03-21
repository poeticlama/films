import { Route, Routes } from 'react-router'
import FilmsPage from './pages/FilmsPage.tsx'
import FilmPage from './pages/FilmPage.tsx'

function App() {

  return (
    <Routes>
      <Route index element={<FilmsPage />} />
      <Route path="film/:filmId" element={<FilmPage />} />
    </Routes>
  )
}

export default App
