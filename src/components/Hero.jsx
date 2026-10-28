import { useState } from 'react'
import Highlight from './Highlight'

function Hero({
  query,
  onQueryChange,
  searchBy,
  onSearchByChange,
  onSearch,
  loading,
  suggestions,
  onPickSuggestion,
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const showList = open && query.trim() !== '' && suggestions.length > 0

  function pick(value) {
    setOpen(false)
    setActive(-1)
    onPickSuggestion(value)
  }

  function handleKeyDown(e) {
    if (!showList) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      pick(suggestions[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

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

      <form
        className="search-form"
        onSubmit={(e) => {
          setOpen(false)
          onSearch(e)
        }}
      >
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
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls="book-suggestions"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'იძებნება...' : 'ძიება'}
        </button>

        {showList && (
          <ul className="suggestions" id="book-suggestions" role="listbox">
            {suggestions.map((item, i) => (
              <li
                key={item}
                role="option"
                aria-selected={i === active}
                className={i === active ? 'active' : ''}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item)}
              >
                <span className="suggestion-icon" aria-hidden="true">
                  {searchBy === 'title' ? '📖' : '✍️'}
                </span>
                <span className="suggestion-text">
                  <Highlight text={item} part={query.trim()} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </form>
    </section>
  )
}

export default Hero
