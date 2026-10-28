import { useMemo, useRef, useState } from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import BookSection from '../../components/BookSection/BookSection'
import { useBooks } from '../../hooks/useBooks'
import { getPopularBooks, hasGeorgian, searchBooks, toEnglish } from '../../services/bookService'
import './HomePage.css'

function HomePage({ isFavorite, onToggleFavorite }) {
  const [search, setSearch] = useState(null)
  const sectionRef = useRef(null)

  const loadBooks = useMemo(
    () =>
      search
        ? (signal) => searchBooks(search.searchBy, search.english, signal)
        : getPopularBooks,
    [search]
  )
  const { books, loading, error, retry } = useBooks(loadBooks)

  async function handleSearch(text, searchBy) {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    let english = text
    if (hasGeorgian(text)) {
      try {
        english = await toEnglish(text)
      } catch {
        english = text
      }
    }
    setSearch({ text, english, searchBy })
  }

  let title = 'პოპულარული წიგნები'
  if (search) {
    title =
      search.english === search.text
        ? `ძიების შედეგები: "${search.text}"`
        : `ძიების შედეგები: "${search.text}" → "${search.english}"`
  }

  return (
    <>
      <section className="hero">
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

        <SearchBar onSearch={handleSearch} onClear={() => setSearch(null)} loading={loading} />
      </section>

      <BookSection
        sectionRef={sectionRef}
        eyebrow="წიგნების კოლექცია"
        title={title}
        books={books}
        loading={loading}
        error={error}
        onRetry={retry}
        emptyText={
          search && hasGeorgian(search.text)
            ? 'წიგნები ვერ მოიძებნა. სცადე ინგლისურად, მაგ.: Harry Potter'
            : 'წიგნები ვერ მოიძებნა.'
        }
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  )
}

export default HomePage
