import { useState } from 'react'
import type { ItemViewMode } from '../types/catalog'

const storageKey = 'manager-menu-items-view'

export function useItemViewMode() {
  const [view, setView] = useState<ItemViewMode>(() => {
    try {
      return localStorage.getItem(storageKey) === 'card' ? 'card' : 'list'
    } catch {
      return 'list'
    }
  })

  const changeView = (next: ItemViewMode) => {
    setView(next)
    try {
      localStorage.setItem(storageKey, next)
    } catch {
      // Keep the selected view usable when storage is unavailable.
    }
  }

  return { view, changeView }
}
