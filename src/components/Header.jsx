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

export default Header
