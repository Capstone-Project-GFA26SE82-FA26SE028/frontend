import { PageHeading } from './AdminUI'
import type { ReactNode } from 'react'
export function RestaurantHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <PageHeading
      eyebrow="Quản trị nhà hàng"
      title={title}
      description={description + ' · Bản mẫu lưu trên trình duyệt.'}
      action={action}
    />
  )
}
