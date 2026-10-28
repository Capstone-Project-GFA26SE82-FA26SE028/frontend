import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../app/hooks'
import { store } from '../../../app/store'
import { executeKitchen } from './kitchenSlice'
import type { Command } from './types'
export function runKitchen(command: Command) {
  store.dispatch(executeKitchen({ command, now: Date.now() }))
  return !store.getState().kitchen.feedback?.error
}
export function useKitchen() {
  const state = useAppSelector((s) => s.kitchen)
  return {
    state,
    run: runKitchen,
    tickets: state.tickets.filter((t) =>
      state.recipes.some((r) => r.id === t.dishId && r.area === state.area),
    ),
  }
}
export function useClock() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(id)
  }, [])
  return now
}
export const clock = (n: number) =>
  new Date(n).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
export const dateTime = (n: number) => new Date(n).toLocaleString('en-US')
export const elapsed = (start: number, now: number) =>
  `${Math.max(0, Math.floor((now - start) / 60000))} min`
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
export const matches = (value: string, query: string) =>
  normalize(value).includes(normalize(query))
