import { useEffect, useState } from 'react'
import { TIMEOUT_MS } from '../services/bookService'

const ERROR_TEXT = 'წიგნების ჩატვირთვა ვერ მოხერხდა. შეამოწმე ინტერნეტი და სცადე თავიდან.'

// loadBooks: (signal) => Promise<books>. როცა ეს ფუნქცია იცვლება, წიგნები თავიდან იტვირთება
export function useBooks(loadBooks) {
  const [result, setResult] = useState({ loader: null, attempt: 0, books: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    loadBooks(controller.signal)
      .then((books) => {
        if (!cancelled) setResult({ loader: loadBooks, attempt, books, error: null })
      })
      .catch(() => {
        if (!cancelled) setResult({ loader: loadBooks, attempt, books: [], error: ERROR_TEXT })
      })
      .finally(() => clearTimeout(timer))

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [loadBooks, attempt])

  const loading = result.loader !== loadBooks || result.attempt !== attempt

  return {
    books: loading ? [] : result.books,
    loading,
    error: loading ? null : result.error,
    retry: () => setAttempt((a) => a + 1),
  }
}
