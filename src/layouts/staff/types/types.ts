export type StaffRole = 'admin' | 'manager' | 'platform_admin'

export type StaffNavigationItem = {
  to: string
  label: string
  icon: string
  end?: boolean
}

export type StaffNavigationGroup = {
  title: string
  items: StaffNavigationItem[]
}
