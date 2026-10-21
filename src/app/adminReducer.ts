import type { UnknownAction } from '@reduxjs/toolkit'
import usersReducer, {
  saveUser,
  userRuleError,
} from '../features/admin/users/usersSlice'
import activityReducer from '../features/admin/activity/activitySlice'
import { usersStorageSchema } from '../features/admin/users/schemas/userSchema'
import { activityStorageSchema } from '../features/admin/activity/schemas'
import { initialUsersState } from '../features/admin/users/data/mockUsers'
import type { UsersState } from '../features/admin/users/types'
import type { AuditEntry } from '../features/admin/activity/types'

// Keep the stored snapshot and selectors compatible while features own their code.
export const adminStorageKey = 'foodhub-admin-preview-v1'
type AdminState = UsersState & { audit: AuditEntry[]; revision: 1 }
function load(): AdminState {
  try {
    const raw = JSON.parse(localStorage.getItem(adminStorageKey) || 'null')
    const users = usersStorageSchema.safeParse(raw)
    const activity = activityStorageSchema.safeParse(raw?.audit)
    if (users.success && activity.success && raw?.revision === 1)
      return { ...users.data, audit: activity.data, revision: 1 }
  } catch {
    /* Use preview data when storage is unavailable. */
  }
  return { ...initialUsersState, audit: [], revision: 1 }
}
const initialState = load()
export default function adminReducer(
  state: AdminState = initialState,
  action: UnknownAction,
): AdminState {
  // Reject invalid account mutations before either reducer writes data or history.
  if (saveUser.match(action) && userRuleError(state, action.payload.user))
    return state
  const previousUsers = { users: state.users, restaurants: state.restaurants }
  const users = usersReducer(previousUsers, action)
  const audit = activityReducer(state.audit, action)
  if (users === previousUsers && audit === state.audit) return state
  return { ...users, audit, revision: 1 }
}
