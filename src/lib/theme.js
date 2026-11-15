import { useSyncExternalStore } from 'react'

// Dark mode = the "dark" class on <html>. Dark is the default; the choice is remembered.
const STORAGE_KEY = 'bifrost-web:theme'
const listeners = new Set()

const getTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function apply(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function initTheme() {
  let saved = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: keep the default.
  }
  apply(saved === 'light' ? 'light' : 'dark')
}

export function setTheme(theme) {
  apply(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // The choice just won't be remembered.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// React hook: re-renders when the theme changes.
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  return { theme, setTheme }
}
