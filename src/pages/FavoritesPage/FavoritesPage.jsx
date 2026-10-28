import BookSection from '../../components/BookSection/BookSection'
import './FavoritesPage.css'

function FavoritesPage({ favorites, isFavorite, onToggleFavorite }) {
  return (
    <BookSection
      eyebrow="შენი კოლექცია"
      title={`რჩეული წიგნები (${favorites.length})`}
      books={favorites}
      loading={false}
      error={null}
      emptyText={
        <div className="favorites-empty">
          <span aria-hidden="true">♡</span>
          <p>რჩეულებში ჯერ არაფერია.</p>
          <p>
            დააჭირე ♡ წიგნის ბარათზე <a href="#/">მთავარზე</a> ან <a href="#/books">წიგნებში</a>.
          </p>
        </div>
      }
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  )
}

export default FavoritesPage
