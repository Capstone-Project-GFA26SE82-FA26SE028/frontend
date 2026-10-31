import { Badge } from '../../../../components/Badge/Badge'

// Chỉ chọn màu cho vai trò; danh sách vai trò và quyền vẫn lấy từ API.
const roleTones: Record<
  string,
  'blue' | 'purple' | 'cyan' | 'green' | 'orange' | 'amber'
> = {
  admin: 'blue',
  manager: 'purple',
  waiter: 'cyan',
  cashier: 'green',
  kitchen: 'orange',
  inventory: 'amber',
}

export function RoleBadge({ id, name }: { id: string; name: string }) {
  const tone = roleTones[id.trim().toLowerCase()] || 'slate'
  return <Badge tone={tone}>{name}</Badge>
}
