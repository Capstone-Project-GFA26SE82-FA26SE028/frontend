import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/authApi'
export function LogoutButton() {
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  return (
    <button
      disabled={pending}
      className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
      onClick={async () => {
        setPending(true)
        let warning: string | undefined
        try {
          await logout()
        } catch {
          warning =
            'Bạn đã đăng xuất khỏi trình duyệt này. Chưa thể xác nhận phiên đăng nhập trên máy chủ đã kết thúc.'
        }
        navigate('/login', { replace: true, state: { warning } })
      }}
    >
      {pending ? 'Đang đăng xuất…' : 'Đăng xuất'}
    </button>
  )
}
