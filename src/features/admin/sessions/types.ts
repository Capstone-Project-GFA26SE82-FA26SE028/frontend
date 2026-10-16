import type { Role } from '../users/types'
export type LoginSession = {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  device: string
  ip: string
  time: string
}
