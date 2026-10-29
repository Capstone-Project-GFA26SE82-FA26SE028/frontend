import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { initialUsersState } from './data/mockUsers'
import type { UsersState, AdminUser } from './types/types'
export function userRuleError(state: UsersState, user: AdminUser): string {
  if (
    state.users.some(
      (u) =>
        u.id !== user.id && u.email.toLowerCase() === user.email.toLowerCase(),
    )
  )
    return 'Email này đã được sử dụng.'
  const previous = state.users.find((u) => u.id === user.id)
  if (
    previous?.active &&
    previous.role === 'Admin' &&
    (!user.active || user.role !== 'Admin') &&
    !state.users.some((u) => u.id !== user.id && u.active && u.role === 'Admin')
  )
    return 'Không thể khóa hoặc đổi vai trò của Admin đang hoạt động cuối cùng.'
  if (
    user.role !== 'Admin' &&
    !state.restaurants.some((r) => r.id === user.restaurantId)
  )
    return 'Vui lòng chọn nhà hàng hợp lệ.'
  return ''
}

const slice = createSlice({
  name: 'admin',
  initialState: initialUsersState,
  reducers: {
    saveUser(state, { payload }: PayloadAction<{ user: AdminUser }>) {
      if (userRuleError(state, payload.user)) return
      const index = state.users.findIndex((u) => u.id === payload.user.id)
      if (index >= 0) state.users[index] = payload.user
      else state.users.unshift(payload.user)
    },
  },
})
export const { saveUser } = slice.actions
export default slice.reducer
