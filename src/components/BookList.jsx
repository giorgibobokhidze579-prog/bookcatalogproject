import BookCard from './BookCard'

function BookList({ books, isFavorite, onToggleFavorite, emptyText }) {
  if (books.length === 0) return <p className="status">{emptyText}</p>

  return (
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
  )
}

export default BookList
