import './Header.css'

function Header({ page, favoritesCount, theme, onToggleTheme, onHomeClick }) {
  const linkProps = (name) => (page === name ? { 'aria-current': 'page' } : {})

  return (
    <header className="header">
      <a className="logo" href="#/" onClick={onHomeClick}>
        Book<span>Finder</span>
      </a>

      <nav>
        <a href="#/" className="nav-home" onClick={onHomeClick} {...linkProps('home')}>
          მთავარი
        </a>
        <a href="#/books" {...linkProps('books')}>
          წიგნები
        </a>
        <a href="#/favorites" className="nav-favorites" {...linkProps('favorites')}>
          ♥ რჩეულები ({favoritesCount})
        </a>
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

export default Header
