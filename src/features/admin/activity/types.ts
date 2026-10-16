export type AuditEntry = {
  actor?: string
  targetId?: string
  entity?:
    | 'restaurant'
    | 'user'
    | 'application'
    | 'plan'
    | 'coupon'
    | 'payment'
    | 'verification'
    | 'settings'
  id: string
  time: string
  action: string
  target: string
  reason: string
}
