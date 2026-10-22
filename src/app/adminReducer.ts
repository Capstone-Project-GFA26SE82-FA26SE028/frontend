import type { UnknownAction } from '@reduxjs/toolkit'
import usersReducer, {
  saveUser,
  userRuleError,
} from '../features/admin/users/usersSlice'
import { usersStorageSchema } from '../features/admin/users/schemas/userSchema'
import { initialUsersState } from '../features/admin/users/data/mockUsers'
import type { UsersState } from '../features/admin/users/types'

// Keep the stored snapshot and selectors compatible while features own their code.
export const adminStorageKey = 'foodhub-admin-preview-v1'
type AdminState = UsersState & { revision: 1 }
function load(): AdminState {
  try {
    const raw = JSON.parse(localStorage.getItem(adminStorageKey) || 'null')
    const users = usersStorageSchema.safeParse(raw)
    if (users.success && raw?.revision === 1)
      return { ...users.data, revision: 1 }
  } catch {
    /* Use preview data when storage is unavailable. */
  }
  return { ...initialUsersState, revision: 1 }
}
const initialState = load()
export default function adminReducer(
  state: AdminState = initialState,
  action: UnknownAction,
): AdminState {
  // Reject invalid preview account mutations before updating state.
  if (saveUser.match(action) && userRuleError(state, action.payload.user))
    return state
  const previousUsers = { users: state.users, restaurants: state.restaurants }
  const users = usersReducer(previousUsers, action)
  if (users === previousUsers) return state
  return { ...users, revision: 1 }
}
