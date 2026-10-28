import { useEffect, useState } from 'react'
import { getSuggestions, hasGeorgian, toEnglish } from '../../services/bookService'
import './SearchBar.css'

function Highlight({ text, part }) {
  const index = part ? text.toLowerCase().indexOf(part.toLowerCase()) : -1
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + part.length)}</mark>
      {text.slice(index + part.length)}
    </>
  )
}

function SearchBar({ onSearch, onClear, loading }) {
  const [query, setQuery] = useState('')
  const [searchBy, setSearchBy] = useState('title')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const showList = open && query.trim() !== '' && suggestions.length > 0

  useEffect(() => {
    const text = query.trim()
    if (!text) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const english = hasGeorgian(text) ? await toEnglish(text) : text
        const list = await getSuggestions(searchBy, english, controller.signal)
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

  function search(text) {
    setOpen(false)
    setActive(-1)
    if (text) onSearch(text, searchBy)
  }

  function handleChange(value) {
    setQuery(value)
    setOpen(true)
    setActive(-1)
    if (!value.trim()) onClear()
  }

  function pick(value) {
    setQuery(value)
    search(value)
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
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault()
        search(query.trim())
      }}
    >
      <select
        className="search-by"
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        aria-label="ძიების ტიპი"
      >
        <option value="title">სათაური</option>
        <option value="author">ავტორი</option>
      </select>
      <input
        type="search"
        placeholder={
          searchBy === 'title' ? 'შეიყვანე წიგნის სათაური...' : 'შეიყვანე ავტორის სახელი...'
        }
        aria-label="წიგნის ან ავტორის ძიება"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls="book-suggestions"
        autoComplete="off"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
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
  )
}

export default SearchBar
