import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  POPULAR_URL,
  POPULAR_HEADING,
  TIMEOUT_MS,
  hasGeorgian,
  fetchBooks,
  toEnglish,
  fetchSuggestions,
  searchUrl,
} from './api/books'
import Header from './components/Header'
import Hero from './components/Hero'
import BookList from './components/BookList'
import Footer from './components/Footer'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [heading, setHeading] = useState(POPULAR_HEADING)
  const [lastQuery, setLastQuery] = useState('')

  const requestId = useRef(0)
  const lastRequest = useRef({ url: POPULAR_URL, heading: POPULAR_HEADING })

  const [query, setQuery] = useState('')
  const [searchBy, setSearchBy] = useState('title')
  const [suggestions, setSuggestions] = useState([])

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) ?? []
    } catch {
      return []
    }
  })
  const [showFavorites, setShowFavorites] = useState(false)

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') ?? 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      return
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch {
      return
    }
  }, [favorites])

  async function loadBooks(url, newHeading, searchText = '') {
    const id = ++requestId.current
    lastRequest.current = { url, heading: newHeading, searchText }
    setLoading(true)
    setError(null)
    setShowFavorites(false)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const result = await fetchBooks(url, controller.signal)
      if (id !== requestId.current) return
      setBooks(result)
      setHeading(newHeading)
      setLastQuery(searchText)
    } catch {
      if (id !== requestId.current) return
      setError('წიგნების ჩატვირთვა ვერ მოხერხდა. შეამოწმე ინტერნეტი და სცადე თავიდან.')
    } finally {
      clearTimeout(timer)
      if (id === requestId.current) setLoading(false)
    }
  }

  function retry() {
    const { url, heading: lastHeading, searchText } = lastRequest.current
    loadBooks(url, lastHeading, searchText)
  }

  useEffect(() => {
    loadBooks(POPULAR_URL, POPULAR_HEADING)
  }, [])

  useEffect(() => {
    const text = query.trim()
    if (!text) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const english = hasGeorgian(text) ? await toEnglish(text) : text
        const list = await fetchSuggestions(searchBy, english, controller.signal)
        setSuggestions(list)
      } catch {
        return
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, searchBy])

  function handleQueryChange(value) {
    setQuery(value)
    if (!value.trim() && heading !== POPULAR_HEADING) {
      loadBooks(POPULAR_URL, POPULAR_HEADING)
    }
  }

  function pickSuggestion(value) {
    setQuery(value)
    runSearch(value)
  }

  function handleSearch(e) {
    e.preventDefault()
    runSearch(query.trim())
  }

  async function runSearch(text) {
    if (!text) return
    document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })

    let english = text
    if (hasGeorgian(text)) {
      try {
        english = await toEnglish(text)
      } catch {
        english = text
      }
    }

    const resultsHeading =
      english === text
        ? `ძიების შედეგები: "${text}"`
        : `ძიების შედეგები: "${text}" → "${english}"`
    loadBooks(searchUrl(searchBy, english), resultsHeading, text)
  }

  function toggleFavorite(book) {
    setFavorites((prev) =>
      prev.some((f) => f.id === book.id)
        ? prev.filter((f) => f.id !== book.id)
        : [...prev, book]
    )
  }

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  function toggleView() {
    setShowFavorites(!showFavorites)
  }

  function showBooks() {
    setShowFavorites(false)
    setQuery('')
    if (heading !== POPULAR_HEADING || error) {
      loadBooks(POPULAR_URL, POPULAR_HEADING)
    }
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const visibleBooks = showFavorites ? favorites : books

  return (
    <div className="app">
      <Header
        favoritesCount={favorites.length}
        showFavorites={showFavorites}
        onToggleView={toggleView}
        theme={theme}
        onToggleTheme={toggleTheme}
        onShowBooks={showBooks}
      />

      <main>
        <Hero
          query={query}
          onQueryChange={handleQueryChange}
          searchBy={searchBy}
          onSearchByChange={setSearchBy}
          onSearch={handleSearch}
          loading={loading}
          suggestions={suggestions}
          onPickSuggestion={pickSuggestion}
        />

        <section className="books-section" id="books">
          <div className="section-heading">
            <div>
              <p className="eyebrow">წიგნების კოლექცია</p>
              <h2>{showFavorites ? 'რჩეული წიგნები' : heading}</h2>
            </div>
          </div>

          {!showFavorites && loading && <p className="status">იტვირთება...</p>}
          {!showFavorites && error && (
            <div className="status error">
              <p>{error}</p>
              <button type="button" className="retry-btn" onClick={retry}>
                თავიდან ცდა
              </button>
            </div>
          )}

          {(showFavorites || (!loading && !error)) && (
            <BookList
              books={visibleBooks}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              emptyText={
                showFavorites
                  ? 'რჩეულებში ჯერ არაფერია.'
                  : hasGeorgian(lastQuery)
                    ? 'წიგნები ვერ მოიძებნა. სცადე ინგლისურად, მაგ.: Harry Potter'
                    : 'წიგნები ვერ მოიძებნა.'
              }
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
