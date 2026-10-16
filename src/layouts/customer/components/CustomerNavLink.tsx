import { NavLink } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'

type CustomerNavLinkProps = {
  to: string
  label: string
  icon: string
  mobileOnly?: boolean
}

export function CustomerNavLink({
  to,
  label,
  icon,
  mobileOnly = false,
}: CustomerNavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold transition-colors hover:text-brand md:h-20 md:flex-none md:flex-row md:rounded-none md:px-0 md:text-sm ${mobileOnly ? 'md:hidden' : ''} ${isActive ? 'bg-mint text-brand md:bg-transparent md:after:absolute md:after:right-0 md:after:bottom-0 md:after:left-0 md:after:h-0.5 md:after:bg-brand' : 'text-muted'}`
      }
    >
      <Icon name={icon} className="md:hidden" />
      {label}
    </NavLink>
  )
}
