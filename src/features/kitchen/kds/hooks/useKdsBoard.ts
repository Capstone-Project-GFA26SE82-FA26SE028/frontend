import { useState } from 'react'
import { useKds } from './useKds'
import { useClock } from './useClock'
import { matches } from '../utils/format'
import { groupKdsOrders } from '../utils/orders'
import type { Ticket } from '../types'

export function useKdsBoard() {
  const { state, tickets, run } = useKds()
  const now = useClock()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('By arrival time')
  const [focus, setFocus] = useState(false)
  const [selected, setSelected] = useState('')
  const [recipeId, setRecipeId] = useState('')
  const [notice, setNotice] = useState('')
  const active = tickets.filter((t) =>
    ['Pending', 'Cooking', 'Ready', 'Hold'].includes(t.status),
  )
  const late = (t: Ticket) =>
    t.status === 'Pending' && now - t.created >= 10 * 60000
  const orders = groupKdsOrders(active)
  const shown = orders
    .filter(
      (t) =>
        (filter !== 'VIP priority' || t.vip) &&
        (filter !== 'Long wait' || t.lines.some(late)) &&
        matches(
          `${t.id} ${t.lines.map((line) => `${line.id} ${state.dishes.find((r) => r.id === line.dishId)?.name}`).join(' ')}`,
          query,
        ),
    )
    .sort(
      (a, b) =>
        (sort === 'VIP first' ? Number(b.vip) - Number(a.vip) : 0) ||
        a.created - b.created ||
        a.id.localeCompare(b.id),
    )
  const selectedTicket = tickets.find((t) => t.id === selected)
  const selectedDish = state.dishes.find((r) => r.id === selectedTicket?.dishId)
  const recipeDish = state.dishes.find((r) => r.id === recipeId)
  const act = async (t: Ticket) => {
    if (t.status !== 'Pending' && t.status !== 'Cooking') return
    const success = await run({
      type: 'transition',
      id: t.id,
      status: t.status === 'Pending' ? 'Cooking' : 'Ready',
    })
    setNotice(
      success
        ? `${t.order} · ${state.dishes.find((r) => r.id === t.dishId)?.name}: ${t.status === 'Pending' ? 'đã bắt đầu nấu' : 'đã sẵn sàng phục vụ'}.`
        : 'Không thể đổi trạng thái. Vui lòng kiểm tra thông báo lỗi và thử lại.',
    )
  }
  return {
    state,
    now,
    query,
    setQuery,
    filter,
    setFilter,
    sort,
    setSort,
    focus,
    setFocus,
    selected,
    setSelected,
    recipeId,
    setRecipeId,
    notice,
    setNotice,
    active,
    late,
    orders,
    shown,
    selectedTicket,
    selectedDish,
    recipeDish,
    act,
  }
}
