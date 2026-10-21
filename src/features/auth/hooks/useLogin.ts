import { useMutation } from '@tanstack/react-query'
import { login } from '../api/authApi'
import { toast } from 'react-toastify'
export function useLogin() {
  return useMutation({
    mutationFn: login,
    retry: false,
    gcTime: 0,
    onSuccess: () => {
      toast.success('Signed in successfully', { toastId: 'login-success' })
    },
  })
}
