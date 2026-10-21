import { useAppSelector } from '../../../app/hooks'
export function AdminSidebarProfile({
  collapsed = false,
}: {
  collapsed?: boolean
}) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const displayName = user?.fullName || user?.userName || 'Tài khoản'
  return (
    <div
      aria-label="Hồ sơ quản trị viên"
      className={`flex min-h-[92px] shrink-0 items-center gap-3 border-t border-white/10 ${collapsed ? 'justify-center px-2' : 'px-5'}`}
    >
      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-lg font-semibold text-emerald-100 ring-1 ring-inset ring-emerald-300/20">
        {displayName.slice(0, 1).toUpperCase()}
        {collapsed && (
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-[#00382d] bg-emerald-400"
          />
        )}
      </span>
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-white">
              {displayName}
            </p>
            <p className="mt-0.5 text-sm text-emerald-100/65">
              Quản trị nhà hàng
            </p>
          </div>
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/15"
          />
        </>
      )}
    </div>
  )
}
