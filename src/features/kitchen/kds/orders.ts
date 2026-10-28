import type { Ticket } from '../shared/types'

export function groupKdsOrders(tickets: Ticket[]) {
  const groups = new Map<string, Ticket[]>()
  for (const ticket of tickets) {
    if (!['Pending', 'Cooking', 'Ready'].includes(ticket.status)) continue
    const lines = groups.get(ticket.order) || []
    lines.push(ticket)
    groups.set(ticket.order, lines)
  }
  return [...groups].map(([id, lines]) => ({
    id,
    lines,
    created: Math.min(...lines.map((t) => t.created)),
    vip: lines.some((t) => t.vip),
    // An order remains in progress until all its active lines are Ready.
    status: lines.some((t) => t.status === 'Cooking')
      ? 'Cooking'
      : lines.some((t) => t.status === 'Pending')
        ? 'Pending'
        : 'Ready',
  }))
}
