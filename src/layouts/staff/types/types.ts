export type StaffRole = 'admin' | 'manager' | 'platform_admin'

export type StaffNavigationItem = {
  to: string
  label: string
  icon: string
}

export type StaffNavigationGroup = {
  title: string
  items: StaffNavigationItem[]
}
