import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../app/hooks'
import { store } from '../../../app/store'
import { clearSession, updateSessionUser } from '../../auth/api/authApi'
import { getProfile, updateProfile, changePassword } from '../api/profileApi'

export function useProfile() {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const sessionId = useAppSelector((state) => state.auth.session?.sessionId)
  const client = useQueryClient()
  const navigate = useNavigate()
  const sameSession = () =>
    store.getState().auth.session?.sessionId === sessionId &&
    store.getState().auth.session?.user.userId === userId
  const profile = useQuery({
    queryKey: ['profile', userId],
    queryFn: ({ signal }) => getProfile(signal),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const save = useMutation({
    mutationFn: updateProfile,
    retry: false,
    gcTime: 0,
    onSuccess: (saved) => {
      if (!sameSession()) return
      client.setQueryData(['profile', userId], saved)
      updateSessionUser(saved)
      void client.invalidateQueries({ queryKey: ['users'] })
      toast.success('Đã cập nhật hồ sơ cá nhân.')
    },
  })
  const password = useMutation({
    mutationFn: changePassword,
    retry: false,
    gcTime: 0,
    onSuccess: () => {
      if (!sameSession()) return
      clearSession()
      toast.success('Đã đổi mật khẩu. Vui lòng đăng nhập lại.')
      navigate('/login', { replace: true })
    },
  })
  return { profile, save, password }
}
