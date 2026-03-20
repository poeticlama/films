import { Route, Routes } from 'react-router'
import FilmsPage from './pages/FilmsPage.tsx'

function App() {

  return (
    <Routes>
      <Route index element={<FilmsPage />} />
    </Routes>
  )
}

export default App
