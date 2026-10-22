export type SystemRole = {
  roleId: string
  roleName: string
  description: string | null
}

export type RoleAccount = {
  userId: string
  avatarUrl: string | null
  userName: string
  fullName: string | null
  email: string
  roleId: string
  isActive: boolean
}

export type RoleUserQuery = {
  page: number
  pageSize: number
  search?: string
  roleId?: string
  isActive?: boolean
}
