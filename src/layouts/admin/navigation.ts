type AdminNavigationItem = {
  id: string
  label: string
  icon: string
}
export const adminNavigation: {
  title: string
  items: AdminNavigationItem[]
}[] = [
  { title: '', items: [{ id: 'overview', label: 'Overview', icon: 'home' }] },
  {
    title: 'ACCOUNT MANAGEMENT',
    items: [
      { id: 'users', label: 'User accounts', icon: 'users' },
      { id: 'roles', label: 'Roles & permissions', icon: 'shield' },
      {
        id: 'sessions',
        label: 'Login sessions',
        icon: 'monitor',
      },
    ],
  },
  {
    title: 'RESTAURANT MANAGEMENT',
    items: [
      {
        id: 'restaurants',
        label: 'Restaurants',
        icon: 'store',
      },
      { id: 'areas', label: 'Restaurant areas', icon: 'grid' },
      {
        id: 'tables',
        label: 'Tables',
        icon: 'utensils',
      },
      { id: 'table-qr', label: 'Table QR codes', icon: 'grid' },
    ],
  },
  {
    title: 'CONFIGURATION',
    items: [
      {
        id: 'tax-fees',
        label: 'VAT & service charges',
        icon: 'coin',
      },
      {
        id: 'payment-methods',
        label: 'Payment methods',
        icon: 'receipt',
      },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'activity', label: 'Activity log', icon: 'clipboard' },
      { id: 'health', label: 'System monitoring', icon: 'activity' },
    ],
  },
]

export function adminHref(id: string) {
  return id === 'overview' ? '/admin' : `/admin/${id}`
}
