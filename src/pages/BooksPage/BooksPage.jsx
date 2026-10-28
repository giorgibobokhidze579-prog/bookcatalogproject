import { useMemo, useState } from 'react'
import BookSection from '../../components/BookSection/BookSection'
import { useBooks } from '../../hooks/useBooks'
import { getSubjectBooks, pickRandomSubject } from '../../services/bookService'
import './BooksPage.css'

function BooksPage({ isFavorite, onToggleFavorite }) {
  const [subject, setSubject] = useState(pickRandomSubject)

  const loadBooks = useMemo(() => (signal) => getSubjectBooks(subject, signal), [subject])
  const { books, loading, error, retry } = useBooks(loadBooks)

  return (
    <BookSection
      eyebrow="შემთხვევითი წიგნები"
      title={`ჟანრი: ${subject.label}`}
      action={
        <button
          type="button"
          className="shuffle-btn"
          onClick={() => setSubject(pickRandomSubject())}
          disabled={loading}
        >
          🔀 სხვა წიგნები
        </button>
      }
      books={books}
      loading={loading}
      error={error}
      onRetry={retry}
      emptyText="წიგნები ვერ მოიძებნა. სცადე „სხვა წიგნები“."
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  )
}

export default BooksPage
