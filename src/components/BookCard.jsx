import { useState } from 'react'

function BookCard({ book, isFavorite, onToggleFavorite, priority }) {
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
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
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

export default BookCard
