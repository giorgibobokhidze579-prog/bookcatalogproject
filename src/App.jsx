import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_URL = 'https://openlibrary.org'
const POPULAR_URL = `${API_URL}/subjects/fiction.json?limit=20`
const POPULAR_HEADING = 'პოპულარული წიგნები'
const TIMEOUT_MS = 15000

const hasGeorgian = (text) => /[\u10A0-\u10FF]/.test(text)

function toBook(item) {
  const coverId = item.cover_id ?? item.cover_i
  return {
    id: item.key,
    title: item.title,
    author:
      item.authors?.map((a) => a.name).join(', ') ??
      item.author_name?.join(', ') ??
      'უცნობი ავტორი',
    year: item.first_publish_year,
    subjects: (item.subject ?? []).slice(0, 3).join(', '),
    cover: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null,
    link: `https://openlibrary.org${item.key}`,
  }
}

async function fetchBooks(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  return (data.works ?? data.docs ?? []).map(toBook)
}

async function toEnglish(text) {
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ka&tl=en&dt=t&q=${encodeURIComponent(text)}`
  )
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  return data[0].map((part) => part[0]).join('').trim()
}

function searchUrl(searchBy, query) {
  return `${API_URL}/search.json?${searchBy}=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`
}

function Header({ favoritesCount, showFavorites, onToggleView, theme, onToggleTheme, onShowBooks }) {
  return (
    <header className="header">
      <a className="logo" href="/">
        Book<span>Finder</span>
      </a>

      <nav>
        <a href="#home" onClick={onShowBooks}>მთავარი</a>
        <a href="#books" onClick={onShowBooks}>წიგნები</a>
        <button className="nav-favorites" onClick={onToggleView}>
          {showFavorites ? 'ყველა წიგნი' : `♥ რჩეულები (${favoritesCount})`}
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'დღის რეჟიმი' : 'ღამის რეჟიმი'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}

function Hero({ query, onQueryChange, searchBy, onSearchByChange, onSearch, loading }) {
  return (
    <section className="hero" id="home">
      <div className="book-anim" aria-hidden="true">
        <div className="book-page left"></div>
        <div className="book-page right"></div>
        <div className="book-flip f1"></div>
        <div className="book-flip f2"></div>
        <div className="book-flip f3"></div>
      </div>

      <p className="eyebrow">შენი შემდეგი საყვარელი წიგნი აქ არის</p>

      <h1>
        აღმოაჩინე შენი <span>შემდეგი წიგნი.</span>
      </h1>

      <p className="hero-description">
        მოძებნე წიგნები, აღმოაჩინე ავტორები
        და იპოვე ახალი ისტორიები.
      </p>

      <form className="search-form" onSubmit={onSearch}>
        <select
          className="search-by"
          value={searchBy}
          onChange={(e) => onSearchByChange(e.target.value)}
          aria-label="ძიების ტიპი"
        >
          <option value="title">სათაური</option>
          <option value="author">ავტორი</option>
        </select>
        <input
          type="search"
          placeholder={
            searchBy === 'title'
              ? 'შეიყვანე წიგნის სათაური...'
              : 'შეიყვანე ავტორის სახელი...'
          }
          aria-label="წიგნის ან ავტორის ძიება"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'იძებნება...' : 'ძიება'}
        </button>
      </form>
    </section>
  )
}

function BookCard({ book, isFavorite, onToggleFavorite }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <article className="book-card">
      <div className="cover">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            width="180"
            height="270"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="no-cover">
            📖<span>ყდა არ არის</span>
          </div>
        )}
        <button
          className={isFavorite ? 'fav-btn active' : 'fav-btn'}
          aria-label={isFavorite ? 'რჩეულებიდან წაშლა' : 'რჩეულებში დამატება'}
          onClick={onToggleFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>

        <button className="details-btn" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'დამალვა' : 'მეტის ნახვა'}
        </button>

        {showDetails && (
          <p className="description">
            {book.subjects ? `ჟანრი: ${book.subjects}` : 'დამატებითი ინფორმაცია არ არის.'}
          </p>
        )}

        {book.year && <span className="year">{book.year}</span>}
        <a className="book-link" href={book.link} target="_blank" rel="noreferrer">
          დეტალურად →
        </a>
      </div>
    </article>
  )
}

function BookList({ books, isFavorite, onToggleFavorite, emptyText }) {
  if (books.length === 0) return <p className="status">{emptyText}</p>

  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={isFavorite(book.id)}
          onToggleFavorite={() => onToggleFavorite(book)}
        />
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <a className="logo" href="/">
        Book<span>Finder</span>
      </a>
      <p>იპოვე შენი შემდეგი საყვარელი წიგნი.</p>
    </footer>
  )
}

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

  async function handleSearch(e) {
    e.preventDefault()
    const text = query.trim()
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
          onQueryChange={setQuery}
          searchBy={searchBy}
          onSearchByChange={setSearchBy}
          onSearch={handleSearch}
          loading={loading}
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