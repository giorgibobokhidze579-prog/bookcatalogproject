import { useEffect, useState } from 'react'

const PAGES = { '#/books': 'books', '#/favorites': 'favorites' }

const pageFromHash = () => PAGES[window.location.hash] ?? 'home'

// გვერდები მისამართის # ნაწილით: #/ — მთავარი, #/books — წიგნები, #/favorites — რჩეულები
export function usePage() {
  const [page, setPage] = useState(pageFromHash)

  useEffect(() => {
    function onHashChange() {
      setPage(pageFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return page
}
