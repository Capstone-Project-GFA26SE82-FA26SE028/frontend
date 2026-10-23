import { useAppSelector } from '../../../app/hooks'
import { LogoutButton } from '../../../features/auth/components/LogoutButton'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { Modal } from '../../../components/Modal/Modal'


export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const displayName = user?.fullName || user?.userName || 'Account'
  const { pathname } = useLocation()
  const pageNames: Record<string, string> = {
    overview: 'Overview',
    users: 'User accounts',
    roles: 'Roles & permissions',
    sessions: 'Login sessions',
    'restaurants': 'Restaurants',
    areas: 'Restaurant areas',
    tables: 'Tables',
    'tax-fees': 'VAT & service charges',
    'payment-methods': 'Payment methods',
    activity: 'Activity log',
    health: 'System monitoring',
  }
  const pageName = pageNames[pathname.split('/')[2] || 'overview'] || 'Overview'
  const profileRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [panel, setPanel] = useState<
    'notifications' | 'profile' | 'messages' | null
  >(null)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && profileOpen) {
        setProfileOpen(false)
        profileButtonRef.current?.focus()
      }
    }
    const outside = (e: PointerEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false)
    }
    window.addEventListener('keydown', handler)
    document.addEventListener('pointerdown', outside)
    return () => {
      window.removeEventListener('keydown', handler)
      document.removeEventListener('pointerdown', outside)
    }
  }, [profileOpen])
  return (
    <>
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white px-3 py-2 sm:gap-3 sm:px-5 lg:h-[68px] lg:flex-nowrap lg:py-0">
        <button
          aria-label="Toggle navigation"
          onClick={onMenu}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Icon name="menu" size={20} />
        </button>
        <div className="min-w-0 flex-1 max-[400px]:basis-[calc(100%-56px)]">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm leading-5"
          >
            <Link to="/admin" className="text-slate-400 hover:text-emerald-700">
              FoodHub
            </Link>
            <Icon name="chevron" size={12} className="text-slate-400" />
            <span aria-current="page" className="font-medium text-emerald-700">
              {pageName}
            </span>
          </nav>
          <p className="truncate text-base font-semibold tracking-tight text-[#253754] leading-5">
            Restaurant administration
          </p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            aria-label="Notifications"
            onClick={() => {
              setProfileOpen(false)
              setPanel('notifications')
            }}
            className="relative flex size-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon name="bell" size={21} />
          </button>
          <button
            aria-label="Support messages"
            title="Support messages"
            onClick={() => {
              setProfileOpen(false)
              setPanel('messages')
            }}
            className="relative flex size-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon name="message" size={21} />
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 size-2 rounded-full bg-sky-500 ring-2 ring-white"
            />
          </button>
          <button
            aria-label="Dark mode — unavailable"
            title="Dark mode — unavailable"
            disabled
            className="flex size-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon name="moon" size={21} />
          </button>
          <div
            ref={profileRef}
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setProfileOpen(false)
            }}
          >
            <button
              ref={profileButtonRef}
              aria-label="Open account menu"
              aria-expanded={profileOpen}
              aria-controls="admin-profile-dropdown"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex min-h-11 items-center gap-2 rounded-xl px-1.5 text-slate-600 transition-colors hover:bg-slate-50 sm:gap-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-base font-semibold sm:block">
                {displayName}
              </span>
              <Icon
                name="chevron"
                size={14}
                className={`text-slate-400 transition-transform ${profileOpen ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
            {profileOpen && (
              <div
                id="admin-profile-dropdown"
                className="absolute top-[calc(100%+8px)] right-0 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_40px_#18352a14]"
              >
                <div className="border-b border-slate-100 px-5 py-4">
                  <p className="text-base font-semibold text-[#344760]">
                    {displayName}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false)
                      setPanel('profile')
                    }}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-base text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <Icon name="users" size={17} />
                    Account details
                  </button>
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {panel && (
        <Modal
          title={
            panel === 'profile'
              ? 'Administrator account'
              : panel === 'messages'
                ? 'Support messages'
                : 'Notifications'
          }
          closeLabel="Close"
          onClose={() => setPanel(null)}
        >
          <div className="p-6">
            {panel === 'messages' ? (
              <div className="py-5 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon name="message" size={27} />
                </span>
                <p className="mt-4 text-lg font-semibold">
                  No conversations yet
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Support conversations will appear here when messaging is connected.
                </p>
              </div>
            ) : panel === 'profile' ? (
              <>
                <p className="font-semibold">{displayName}</p>
                <p className="mt-3 text-base leading-6 text-slate-500">
                  {user?.email} · Restaurant administration
                </p>
              </>
            ) : (
              <>
                <p className="py-4 text-sm text-slate-500">
                  No new notifications.
                </p>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
