import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerCustomer } from '../api/authApi'

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: registerCustomer,
    retry: false,
    gcTime: 0,
    onSuccess: (message, input) => {
      toast.success(message)
      navigate('/login', { replace: true, state: { email: input.email } })
    },
  })
}
