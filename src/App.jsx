import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://openlibrary.org'
const POPULAR_URL = `${API_URL}/subjects/fiction.json?limit=20`

/* =========================================
   API — მონაცემების ასინქრონული მიღება
   ========================================= */

// API-ს პასუხს ვაქცევთ ჩვენს ფორმატად
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

async function fetchBooks(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  return (data.works ?? data.docs ?? []).map(toBook)
}

function searchUrl(searchBy, query) {
  // searchBy: 'title' — სათაურით, 'author' — ავტორით
  return `${API_URL}/search.json?${searchBy}=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`
}

/* =========================================
   კომპონენტები
   ========================================= */

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
  // ბარათის საკუთარი მდგომარეობა — დამატებითი ინფორმაციის გახსნა/დახურვა
  const [showDetails, setShowDetails] = useState(false)

  return (
    <article className="book-card">
      <div className="cover">
        {book.cover ? (
          <img src={book.cover} alt={book.title} loading="lazy" />
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

/* =========================================
   მთავარი კომპონენტი
   ========================================= */

function App() {
  // წიგნები და ჩატვირთვა
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [heading, setHeading] = useState('პოპულარული წიგნები')

  // ძიება
  const [query, setQuery] = useState('')
  const [searchBy, setSearchBy] = useState('title')

  // რჩეულები
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)

  // დღე / ღამე
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
      // storage unavailable
    }
  }, [theme])

  // წიგნების ჩატვირთვა API-დან (ასინქრონულად)
  async function loadBooks(url, newHeading) {
    setLoading(true)
    setError(null)
    setShowFavorites(false)
    try {
      const result = await fetchBooks(url)
      setBooks(result)
      setHeading(newHeading)
    } catch {
      setError('წიგნების ჩატვირთვა ვერ მოხერხდა')
    } finally {
      setLoading(false)
    }
  }

  // გვერდის გახსნისას — პოპულარული წიგნები
  useEffect(() => {
    loadBooks(POPULAR_URL, 'პოპულარული წიგნები')
  }, [])

  // ძიება სათაურით ან ავტორით
  function handleSearch(e) {
    e.preventDefault()
    const text = query.trim()
    if (!text) return
    loadBooks(searchUrl(searchBy, text), `ძიების შედეგები: "${text}"`)
    document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })
  }

  // რჩეულებში დამატება / წაშლა
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

  // "მთავარი" / "წიგნები" — ძიების გასუფთავება და პოპულარული წიგნების ჩვენება
  function showBooks() {
    setShowFavorites(false)
    setQuery('')
    if (heading !== 'პოპულარული წიგნები') {
      loadBooks(POPULAR_URL, 'პოპულარული წიგნები')
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
          {!showFavorites && error && <p className="status error">{error}</p>}

          {(showFavorites || (!loading && !error)) && (
            <BookList
              books={visibleBooks}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              emptyText={
                showFavorites ? 'რჩეულებში ჯერ არაფერია.' : 'წიგნები ვერ მოიძებნა.'
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