import type { Command, KitchenState, Lot } from './types'
export function applyKitchen(
  s: KitchenState,
  c: Command,
  now: number,
): string | null {
  if (c.type === 'login') {
    if (!['Hot kitchen', 'Bar'].includes(c.area))
      return 'Invalid kitchen station.'
    s.signedIn = true
    s.area = c.area
    return null
  }
  if (c.type === 'logout') {
    s.signedIn = false
    return null
  }
  if (!s.signedIn) return 'Please sign in to Kitchen.'
  const log = (text: string, ticket?: string) =>
    s.logs.unshift({
      time: now,
      actor: 'Minh · Kitchen demo',
      text,
      area: s.area,
      ticket,
    })
  const recipeFor = (id: string) =>
    s.recipes.find((r) => r.id === id && r.area === s.area)
  if (c.type === 'receive') {
    if (
      s.events.includes(c.eventId) ||
      s.tickets.some((t) => t.id === c.ticket.id)
    )
      return 'Event already received; duplicate ticket rejected.'
    const r = recipeFor(c.ticket.dishId)
    if (
      !r ||
      r.availability !== 'Available' ||
      c.ticket.status !== 'Pending' ||
      !Number.isInteger(c.ticket.quantity) ||
      c.ticket.quantity < 1 ||
      c.ticket.quantity > 99
    )
      return 'Invalid order or dish unavailable for new orders.'
    s.events.push(c.eventId)
    s.tickets.push({ ...c.ticket })
    log(`Received ${c.ticket.id} from simulated QR menu.`, c.ticket.id)
  } else if (c.type === 'transition' || c.type === 'cancel') {
    const t = s.tickets.find((t) => t.id === c.id)
    const r = t && recipeFor(t.dishId)
    if (!t || !r) return 'Ticket does not belong to this kitchen station.'
    if (c.type === 'cancel') {
      if (t.status !== 'Pending')
        return 'Only pending dishes can be cancelled.'
      if (!c.reason.trim()) return 'A cancellation reason is required.'
      t.status = 'Cancelled'
      t.reason = c.reason.trim()
      t.finished = now
      log(`Cancellation received for ${t.id}: ${t.reason}`, t.id)
    } else if (c.status === 'Cooking') {
      if (t.status !== 'Pending') return 'Only pending dishes can start cooking.'
      if (!r.bom.length) return 'No ingredient quantities are defined for this dish.'
      const allocation: { lot: Lot; amount: number }[] = []
      const needed = new Map<string, number>()
      for (const b of r.bom) {
        if (
          !Number.isFinite(b.amount) ||
          b.amount <= 0 ||
          !s.ingredients.some((i) => i.id === b.ingredient)
        )
          return 'Invalid recipe ingredients.'
        needed.set(
          b.ingredient,
          (needed.get(b.ingredient) || 0) + b.amount * t.quantity,
        )
      }
      for (const [ingredient, amountNeeded] of needed) {
        let remaining = amountNeeded
        for (const lot of s.lots
          .filter(
            (l) =>
              l.ingredient === ingredient && l.expires > now && l.quantity > 0,
          )
          .sort(
            (a, b) => a.received - b.received || a.id.localeCompare(b.id),
          )) {
          const amount = Math.min(remaining, lot.quantity)
          if (amount > 0) allocation.push({ lot, amount })
          remaining -= amount
        }
        if (remaining > 0.000001)
          return `Insufficient ${s.ingredients.find((i) => i.id === ingredient)?.name}. Please report an ingredient shortage.`
      }
      allocation.forEach(({ lot, amount }) => {
        lot.quantity = Math.max(0, lot.quantity - amount)
        s.movements.push({ ticket: t.id, lot: lot.id, amount, time: now })
      })
      t.status = 'Cooking'
      t.started = now
      for (const ingredientId of needed.keys()) {
        const ingredient = s.ingredients.find((i) => i.id === ingredientId)!
        const stock = s.lots
          .filter((l) => l.ingredient === ingredientId && l.expires > now)
          .reduce((n, l) => n + l.quantity, 0)
        if (
          stock <= ingredient.min &&
          !s.alerts.some(
            (a) =>
              a.ingredient === ingredient.id && a.status === 'Awaiting acknowledgment',
          )
        )
          s.alerts.unshift({
            id: `low-${t.id}-${ingredient.id}`,
            ingredient: ingredient.id,
            time: now,
            level: 'Low stock',
            note: `Available stock ${stock.toFixed(2)} ${ingredient.unit}`,
            source: 'Automatic when cooking starts',
            status: 'Awaiting acknowledgment',
            area: s.area,
          })
      }
      log(`${t.id}: Pending → Cooking; FIFO stock deducted.`, t.id)
    } else {
      if (t.status !== 'Cooking') return 'Only cooking dishes can be marked ready.'
      t.status = 'Ready'
      t.finished = now
      s.notifications.push({
        id: `ready-${t.id}`,
        ticket: t.id,
        time: now,
        status: 'pending',
        attempts: 0,
      })
      log(`${t.id}: Cooking → Ready; waiter notification created.`, t.id)
    }
  } else if (c.type === 'availability') {
    const r = recipeFor(c.id)
    if (!r || !['Available', 'Temporarily unavailable', 'Paused'].includes(c.status))
      return 'Invalid dish or status.'
    if (!c.reason.trim()) return 'A reason is required.'
    r.availability = c.status
    log(`${r.name}: ${c.status}. ${c.reason.trim()}`)
  } else if (c.type === 'alert') {
    if (
      !s.recipes.some(
        (r) =>
          r.area === s.area && r.bom.some((b) => b.ingredient === c.ingredient),
      ) ||
      !c.note.trim() ||
      !c.level.trim()
    )
      return 'Select an ingredient assigned to this kitchen and enter details.'
    s.alerts.unshift({
      id: `manual-${now}-${s.alerts.length}`,
      ingredient: c.ingredient,
      note: c.note.trim(),
      level: c.level,
      time: now,
      source: 'Minh · Kitchen demo',
      status: 'Awaiting acknowledgment',
      area: s.area,
    })
    log('Created an alert for Inventory and Manager (simulated).')
  } else if (c.type === 'notify') {
    const n = s.notifications.find((n) => n.id === c.id)
    const t = s.tickets.find((t) => t.id === n?.ticket)
    if (!n || !t || !recipeFor(t.dishId) || n.status === 'simulated')
      return 'Invalid notification or already sent in simulation.'
    n.attempts++
    n.status = c.fail ? 'failed' : 'simulated'
    log(
      `${n.id}: ${c.fail ? 'simulated delivery failed' : 'simulated delivery succeeded'}.`,
      t.id,
    )
  } else if (c.type === 'acknowledge') {
    const a = s.alerts.find((a) => a.id === c.id && a.area === s.area)
    if (!a || a.status !== 'Awaiting acknowledgment')
      return 'This alert is no longer awaiting acknowledgment.'
    a.status = 'Acknowledged'
    log('Simulated inventory acknowledgment of the alert.')
  }
  return null
}
