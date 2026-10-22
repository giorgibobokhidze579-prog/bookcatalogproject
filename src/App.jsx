import { useEffect, useState } from 'react'
import './App.css'

const API_URL =
  'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=20'

/* =========================================
   1. კომპონენტების შექმნა
   ========================================= */

// ახალი: theme და onToggleTheme
function Header({ favoritesCount, showFavorites, onToggleView, theme, onToggleTheme }) {
  return (
    <header className="header">
      <a className="logo" href="/">
        Book<span>Finder</span>
      </a>

      <nav>
        <a href="#home">მთავარი</a>
        <a href="#books">წიგნები</a>
        <button className="nav-favorites" onClick={onToggleView}>
          {showFavorites ? 'ყველა წიგნი' : `♥ რჩეულები (${favoritesCount})`}
        </button>
        {/* ახალი: დღე / ღამე ღილაკი */}
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

function Hero() {
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

      <form className="search-form">
        <input
          type="search"
          placeholder="შეიყვანე წიგნის ან ავტორის სახელი..."
          aria-label="წიგნის ან ავტორის ძიება"
        />
        <button type="button">ძიება</button>
      </form>
    </section>
  )
}

function BookCard({ book, isFavorite, onToggleFavorite }) {
  // ბარათის საკუთარი მდგომარეობა — აღწერის გახსნა/დახურვა
  const [showDetails, setShowDetails] = useState(false)

  const info = book.volumeInfo
  const cover = info.imageLinks?.thumbnail?.replace('http:', 'https:')

  return (
    <article className="book-card">
      <div className="cover-wrap">
        {cover ? (
          <img src={cover} alt={info.title} />
        ) : (
          <div className="no-cover">📖</div>
        )}
        <button className="fav-btn" onClick={onToggleFavorite}>
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <h3>{info.title}</h3>
      <p>{info.authors?.join(', ') ?? 'უცნობი ავტორი'}</p>

      <button className="details-btn" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'დამალვა' : 'მეტის ნახვა'}
      </button>

      {showDetails && (
        <p className="description">
          {info.description?.slice(0, 200) ?? 'აღწერა არ არის.'}
          {info.description?.length > 200 && '...'}
        </p>
      )}
    </article>
  )
}

function BookList({ books, favorites, onToggleFavorite, emptyText }) {
  if (books.length === 0) return <p className="status">{emptyText}</p>

  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favorites.includes(book.id)}
          onToggleFavorite={() => onToggleFavorite(book.id)}
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
  /* 2. მდგომარეობის მართვა (state) */
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)

  // ახალი: დღე / ღამე
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') ?? 'light'
    } catch {
      return 'light'
    }
  })

  // ახალი: თემის გამოყენება და შენახვა
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // storage unavailable
    }
  }, [theme])

  // წიგნების ჩატვირთვა გვერდის გახსნისას
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(res.status)
        const data = await res.json()
        setBooks(data.items ?? [])
      } catch {
        setError('წიგნების ჩატვირთვა ვერ მოხერხდა')
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [])

  /* 3. ინტერაქტიულობა */

  // რჩეულებში დამატება / წაშლა
  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  // ყველა წიგნი ↔ მხოლოდ რჩეულები
  function toggleView() {
    setShowFavorites(!showFavorites)
  }

  // ახალი: დღე ↔ ღამე
  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const visibleBooks = showFavorites
    ? books.filter((book) => favorites.includes(book.id))
    : books

  return (
    <div className="app">
      {/* ახალი: theme და onToggleTheme */}
      <Header
        favoritesCount={favorites.length}
        showFavorites={showFavorites}
        onToggleView={toggleView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        <Hero />

        <section className="books-section" id="books">
          <div className="section-heading">
            <div>
              <p className="eyebrow">წიგნების კოლექცია</p>
              <h2>{showFavorites ? 'რჩეული წიგნები' : 'პოპულარული წიგნები'}</h2>
            </div>
          </div>

          {loading && <p className="status">იტვირთება...</p>}
          {error && <p className="status error">{error}</p>}

          {!loading && !error && (
            <BookList
              books={visibleBooks}
              favorites={favorites}
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