import BookCard from '../BookCard/BookCard'
import './BookSection.css'

function BookSection({
  eyebrow,
  title,
  action,
  books,
  loading,
  error,
  onRetry,
  emptyText,
  isFavorite,
  onToggleFavorite,
  sectionRef,
}) {
  return (
    <section className="books-section" ref={sectionRef}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {action}
      </div>

      {loading && <p className="status">იტვირთება...</p>}

      {error && (
        <div className="status error">
          <p>{error}</p>
          <button type="button" className="retry-btn" onClick={onRetry}>
            თავიდან ცდა
          </button>
        </div>
      )}

      {!loading && !error && books.length === 0 && <div className="status">{emptyText}</div>}

      {!loading && !error && books.length > 0 && (
        <div className="books-grid">
          {books.map((book, index) => (
            <BookCard
              key={book.id}
              priority={index < 5}
              book={book}
              isFavorite={isFavorite(book.id)}
              onToggleFavorite={() => onToggleFavorite(book)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default BookSection
