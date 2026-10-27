import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TableSession } from './types/types'
const storageKey = 'foodhub.customer.table-session'
function restore(): TableSession | null {
  try {
    return JSON.parse(
      sessionStorage.getItem(storageKey) || 'null',
    ) as TableSession | null
  } catch {
    return null
  }
}
export function rememberTable(session: TableSession) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(session))
  } catch {
    /* In-memory access still works. */
  }
}
const slice = createSlice({
  name: 'customerSession',
  initialState: { table: restore() },
  reducers: {
    enterSession(state, action: PayloadAction<TableSession>) {
      state.table = action.payload
    },
    leaveSession(state) {
      state.table = null
    },
  },
})
export const { enterSession, leaveSession } = slice.actions
export default slice.reducer
