import { useEffect, useState } from 'react'

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favorites')) ?? []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch {
      return
    }
  }, [favorites])

  function toggleFavorite(book) {
    setFavorites((prev) =>
      prev.some((f) => f.id === book.id)
        ? prev.filter((f) => f.id !== book.id)
        : [...prev, book]
    )
  }

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  return { favorites, toggleFavorite, isFavorite }
}
