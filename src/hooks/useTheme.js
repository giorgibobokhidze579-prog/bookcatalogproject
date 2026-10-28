import { useEffect, useState } from 'react'

function readTheme() {
  try {
    return localStorage.getItem('theme') ?? 'light'
  } catch {
    return 'light'
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      return
    }
  }, [theme])

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
