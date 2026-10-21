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
            'You have signed out of this browser. We could not confirm that your server session was revoked.'
        }
        navigate('/login', { replace: true, state: { warning } })
      }}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
