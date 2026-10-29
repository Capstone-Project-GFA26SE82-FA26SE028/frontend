import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthSession } from './types/types'
export const authStorageKey = 'foodhub-staff-session-v1'
function readSession(): AuthSession | null {
  try {
    const session = JSON.parse(
      sessionStorage.getItem(authStorageKey) || 'null',
    ) as AuthSession | null
    if (
      session?.user?.isActive &&
      typeof session.accessToken === 'string' &&
      !!session.accessToken &&
      typeof session.refreshToken === 'string' &&
      !!session.refreshToken &&
      typeof session.sessionId === 'string' &&
      !!session.sessionId &&
      typeof session.user.userId === 'string' &&
      typeof session.user.roleId === 'string' &&
      Number.isFinite(Date.parse(session.expiresAt)) &&
      Date.parse(session.sessionExpiresAt) > Date.now()
    )
      return session
    sessionStorage.removeItem(authStorageKey)
  } catch {
    /* Missing or invalid saved session. */
  }
  return null
}
const session = readSession()
const initialState: {
  session: AuthSession | null
  status: 'checking' | 'authenticated' | 'anonymous' | 'error'
  error: string | null
} = {
  session,
  status: session ? 'checking' : 'anonymous',
  error: null,
}
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionReceived(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload
      state.status = 'authenticated'
      state.error = null
    },
    signedOut(state) {
      state.session = null
      state.status = 'anonymous'
      state.error = null
    },
    sessionChecking(state) {
      state.status = 'checking'
      state.error = null
    },
    sessionCheckFailed(state, action: PayloadAction<string>) {
      state.status = 'error'
      state.error = action.payload
    },
  },
})
export const {
  sessionReceived,
  signedOut,
  sessionChecking,
  sessionCheckFailed,
} = slice.actions
export default slice.reducer
