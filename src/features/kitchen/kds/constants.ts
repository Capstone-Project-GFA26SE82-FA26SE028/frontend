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
    column: 'border-amber-200/80 bg-amber-50/40',
    header: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm',
    badge: 'bg-amber-100/80 text-amber-900 border border-amber-200/60',
    card: 'border-t-amber-500',
    dot: 'bg-amber-500',
    ring: 'hover:ring-amber-500',
  },
  cooking: {
    column: 'border-sky-200/80 bg-sky-50/40',
    header: 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-sm',
    badge: 'bg-sky-100/80 text-sky-900 border border-sky-200/60',
    card: 'border-t-sky-500',
    dot: 'bg-sky-500',
    ring: 'hover:ring-sky-500',
  },
  ready: {
    column: 'border-emerald-200/80 bg-emerald-50/40',
    header: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm',
    badge: 'bg-emerald-100/80 text-emerald-900 border border-emerald-200/60',
    card: 'border-t-emerald-500',
    dot: 'bg-emerald-500',
    ring: 'hover:ring-emerald-500',
  },
  hold: {
    column: 'border-violet-200/80 bg-violet-50/40',
    header: 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-sm',
    badge: 'bg-violet-100/80 text-violet-900 border border-violet-200/60',
    card: 'border-t-violet-500',
    dot: 'bg-violet-500',
    ring: 'hover:ring-violet-500',
  },
} as const
