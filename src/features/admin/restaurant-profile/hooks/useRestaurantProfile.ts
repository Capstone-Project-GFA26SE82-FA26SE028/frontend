import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  profileStorageKey,
  profileStateSchema,
  replaceProfile,
} from '../../restaurant-profile/profileSlice'
import type { Profile } from '../schema'
export function useRestaurantProfile() {
  const profile = useAppSelector((s) => s.adminProfile)
  const state = { profile }
  const dispatch = useAppDispatch()
  function commit(next: typeof state) {
    const parsed = profileStateSchema.safeParse(next.profile)
    if (!parsed.success)
      return parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(parsed.data))
    } catch {
      return 'Không thể lưu trên trình duyệt. Kiểm tra dung lượng lưu trữ.'
    }
    dispatch(replaceProfile(parsed.data))
    return ''
  }
  function saveProfile(profile: Profile) {
    return commit({ ...state, profile })
  }
  return { state, saveProfile }
}
