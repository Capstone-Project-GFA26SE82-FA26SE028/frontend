import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authSessionSchema, type AuthSession } from './types'
export const authStorageKey = 'foodhub-staff-session-v1'
function readSession(): AuthSession | null {
  try {
    const session = authSessionSchema.parse(
      JSON.parse(sessionStorage.getItem(authStorageKey) || 'null'),
    )
    if (
      session.user.isActive &&
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
