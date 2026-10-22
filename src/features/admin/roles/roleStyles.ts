// Presentation only; available roles and their descriptions come from the API.
const colors: Record<string, string> = {
  admin: 'border-blue-200 bg-blue-100 text-blue-900',
  manager: 'border-violet-200 bg-violet-100 text-violet-900',
  waiter: 'border-cyan-200 bg-cyan-100 text-cyan-900',
  cashier: 'border-emerald-200 bg-emerald-100 text-emerald-900',
  kitchen: 'border-orange-200 bg-orange-100 text-orange-900',
  inventory: 'border-amber-200 bg-amber-100 text-amber-900',
}
export function roleColor(id: string) {
  return colors[id] || 'border-slate-200 bg-slate-100 text-slate-700'
}
