export const kdsColumns = [
  {
    status: 'Pending',
    title: 'Chờ chế biến',
    icon: 'clipboard',
    tone: 'waiting',
  },
  {
    status: 'Cooking',
    title: 'Đang chế biến',
    icon: 'fire',
    tone: 'cooking',
  },
  {
    status: 'Ready',
    title: 'Sẵn sàng',
    icon: 'service',
    tone: 'ready',
  },
  {
    status: 'Hold',
    title: 'Tạm hoãn',
    icon: 'clock',
    tone: 'hold',
  },
] as const

export const kdsToneStyles = {
  waiting: {
    column: 'border-amber-300 bg-amber-50',
    header: 'bg-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    card: 'border-t-amber-700',
    dot: 'bg-[#efbd72]',
    ring: 'hover:ring-amber-700',
  },
  cooking: {
    column: 'border-blue-300 bg-blue-50',
    header: 'bg-sky-700',
    badge: 'bg-blue-100 text-sky-700',
    card: 'border-t-sky-700',
    dot: 'bg-[#9fc9eb]',
    ring: 'hover:ring-sky-700',
  },
  ready: {
    column: 'border-emerald-300 bg-emerald-50',
    header: 'bg-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    card: 'border-t-emerald-700',
    dot: 'bg-[#98d3ac]',
    ring: 'hover:ring-emerald-700',
  },
  hold: {
    column: 'border-violet-300 bg-violet-50',
    header: 'bg-violet-600',
    badge: 'bg-violet-100 text-violet-600',
    card: 'border-t-violet-600',
    dot: 'bg-[#c4b5fd]',
    ring: 'hover:ring-violet-600',
  },
} as const
