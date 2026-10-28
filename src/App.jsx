import { useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
import BooksPage from './pages/BooksPage/BooksPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import { usePage } from './hooks/usePage'
import { useFavorites } from './hooks/useFavorites'
import { useTheme } from './hooks/useTheme'

function App() {
  const page = usePage()
  const { theme, toggleTheme } = useTheme()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [homeKey, setHomeKey] = useState(0)

  const favoriteProps = { isFavorite, onToggleFavorite: toggleFavorite }

  return (
    <div className="app">
      <Header
        page={page}
        favoritesCount={favorites.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onHomeClick={() => setHomeKey((k) => k + 1)}
      />

      <main>
        {page === 'home' && <HomePage key={homeKey} {...favoriteProps} />}
        {page === 'books' && <BooksPage {...favoriteProps} />}
        {page === 'favorites' && <FavoritesPage favorites={favorites} {...favoriteProps} />}
      </main>

      <Footer />
    </div>
  )
}

export default App
