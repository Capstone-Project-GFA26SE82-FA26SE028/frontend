import { Link } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { adminHref } from '../navigation'
export function AdminNavLink({
  id,
  label,
  icon,
  active,
  collapsed,
  onNavigate,
}: {
  id: string
  label: string
  icon: string
  active: boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  const classes = `flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition lg:min-h-10 ${active ? 'bg-[#0b694a] font-semibold text-white' : 'text-white/85 hover:bg-white/10'} ${collapsed ? 'justify-center' : ''}`
  const body = (
    <>
      <Icon name={icon} size={17} className="shrink-0" />
      <span className={collapsed ? 'sr-only' : 'whitespace-nowrap'}>
        {label}
      </span>
    </>
  )
  return (
    <Link
      to={adminHref(id)}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-current={active ? 'location' : undefined}
      className={classes}
    >
      {body}
    </Link>
  )
}
