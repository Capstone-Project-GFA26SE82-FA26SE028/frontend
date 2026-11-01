import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/authApi'
import { Icon } from '../../../components/Icon/Icon'
export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  return (
    <button
      disabled={pending}
      className={
        compact
          ? 'flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50'
          : 'w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50'
      }
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
      {compact && <Icon name="logout" size={16} />}
      {pending ? 'Đang đăng xuất…' : 'Đăng xuất'}
    </button>
  )
}
