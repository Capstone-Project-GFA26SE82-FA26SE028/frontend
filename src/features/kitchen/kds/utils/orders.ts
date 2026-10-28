import type { Ticket } from '../types'

export function groupKdsOrders(tickets: Ticket[]) {
  const groups = new Map<string, Ticket[]>()
  for (const ticket of tickets) {
    if (!['Pending', 'Cooking', 'Ready', 'Hold'].includes(ticket.status))
      continue
    const key = `${ticket.status}:${ticket.order}`
    const lines = groups.get(key) || []
    lines.push(ticket)
    groups.set(key, lines)
  }
  return [...groups.values()].map((lines) => ({
    id: lines[0].order,
    lines,
    created: Math.min(...lines.map((t) => t.created)),
    vip: lines.some((t) => t.vip),
    // Split mixed orders across lanes so held dishes never disappear behind active ones.
    status: lines[0].status,
  }))
}
