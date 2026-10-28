export const API_URL = 'https://openlibrary.org'
export const POPULAR_URL = `${API_URL}/subjects/fiction.json?limit=20`
export const POPULAR_HEADING = 'პოპულარული წიგნები'
export const TIMEOUT_MS = 15000

export const hasGeorgian = (text) => /[Ⴀ-ჿ]/.test(text)

function toBook(item) {
  const coverId = item.cover_id ?? item.cover_i
  return {
    id: item.key,
    title: item.title,
    author:
      item.authors?.map((a) => a.name).join(', ') ??
      item.author_name?.join(', ') ??
      'უცნობი ავტორი',
    year: item.first_publish_year,
    subjects: (item.subject ?? []).slice(0, 3).join(', '),
    cover: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null,
    link: `https://openlibrary.org${item.key}`,
  }
}

export async function fetchBooks(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  return (data.works ?? data.docs ?? []).map(toBook)
}

export async function toEnglish(text) {
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ka&tl=en&dt=t&q=${encodeURIComponent(text)}`
  )
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  return data[0].map((part) => part[0]).join('').trim()
}

export async function fetchSuggestions(searchBy, text, signal) {
  const res = await fetch(
    `${API_URL}/search.json?${searchBy}=${encodeURIComponent(text)}&limit=10&fields=title,author_name`,
    { signal }
  )
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  const values = (data.docs ?? [])
    .map((doc) => (searchBy === 'title' ? doc.title : doc.author_name?.[0]))
    .filter(Boolean)
  return [...new Set(values)].slice(0, 6)
}

export function searchUrl(searchBy, query) {
  return `${API_URL}/search.json?${searchBy}=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`
}
