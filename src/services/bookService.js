const API_URL = 'https://openlibrary.org'
const POPULAR_URL = `${API_URL}/subjects/fiction.json?limit=20`
const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ka&tl=en&dt=t&q='

export const TIMEOUT_MS = 15000

const SUBJECTS = [
  { key: 'fantasy', label: 'ფენტეზი' },
  { key: 'science_fiction', label: 'სამეცნიერო ფანტასტიკა' },
  { key: 'romance', label: 'რომანტიკა' },
  { key: 'mystery_and_detective_stories', label: 'დეტექტივი' },
  { key: 'adventure', label: 'თავგადასავალი' },
  { key: 'history', label: 'ისტორია' },
  { key: 'horror', label: 'საშინელებათა' },
  { key: 'poetry', label: 'პოეზია' },
  { key: 'humor', label: 'იუმორი' },
]

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

async function getJson(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(res.status)
  return res.json()
}

async function getBooks(url, signal) {
  const data = await getJson(url, signal)
  return (data.works ?? data.docs ?? []).map(toBook)
}

export function getPopularBooks(signal) {
  return getBooks(POPULAR_URL, signal)
}

export function pickRandomSubject() {
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]
  return { ...subject, offset: Math.floor(Math.random() * 5) * 20 }
}

export function getSubjectBooks(subject, signal) {
  return getBooks(`${API_URL}/subjects/${subject.key}.json?limit=20&offset=${subject.offset}`, signal)
}

export function searchBooks(searchBy, text, signal) {
  return getBooks(
    `${API_URL}/search.json?${searchBy}=${encodeURIComponent(text)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`,
    signal
  )
}

export async function getSuggestions(searchBy, text, signal) {
  const data = await getJson(
    `${API_URL}/search.json?${searchBy}=${encodeURIComponent(text)}&limit=10&fields=title,author_name`,
    signal
  )
  const values = (data.docs ?? [])
    .map((doc) => (searchBy === 'title' ? doc.title : doc.author_name?.[0]))
    .filter(Boolean)
  return [...new Set(values)].slice(0, 6)
}

export async function toEnglish(text) {
  const data = await getJson(TRANSLATE_URL + encodeURIComponent(text))
  return data[0].map((part) => part[0]).join('').trim()
}
