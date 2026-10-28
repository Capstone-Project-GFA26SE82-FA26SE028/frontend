import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import {
  clock,
  elapsed,
  matches,
  useClock,
  useKitchen,
} from '../../shared/hooks'
import type { Ticket } from '../../shared/types'
import { groupKdsOrders } from '../orders'
import '../styles/kds.css'

const columns = [
  {
    status: 'Pending',
    title: 'Pending',
    label: 'ACCEPT & PREPARE',
    icon: 'clipboard',
    tone: 'waiting',
  },
  {
    status: 'Cooking',
    title: 'Cooking',
    label: 'FOCUS ON EVERY DISH',
    icon: 'fire',
    tone: 'cooking',
  },
  {
    status: 'Ready',
    title: 'Ready for service',
    label: 'ORDERS READY FOR SERVICE',
    icon: 'service',
    tone: 'ready',
  },
] as const

export function KdsPage() {
  const { state, tickets, run } = useKitchen()
  const now = useClock()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('By arrival time')
  const [focus, setFocus] = useState(false)
  const [selected, setSelected] = useState('')
  const [notice, setNotice] = useState('')
  const active = tickets.filter((t) =>
    ['Pending', 'Cooking', 'Ready'].includes(t.status),
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
          `${t.id} ${t.lines.map((line) => `${line.id} ${state.recipes.find((r) => r.id === line.dishId)?.name}`).join(' ')}`,
          query,
        ),
    )
    .sort(
      (a, b) =>
        (sort === 'VIP first' ? Number(b.vip) - Number(a.vip) : 0) ||
        a.created - b.created ||
        a.id.localeCompare(b.id),
    )
  const current = tickets.find((t) => t.id === selected)
  const recipe = state.recipes.find((r) => r.id === current?.dishId)
  const act = (t: Ticket) => {
    const success = run({
      type: 'transition',
      id: t.id,
      status: t.status === 'Pending' ? 'Cooking' : 'Ready',
    })
    setNotice(
      success
        ? `${t.order} · ${state.recipes.find((r) => r.id === t.dishId)?.name}: ${t.status === 'Pending' ? 'cooking started' : 'ready for service'}.`
        : 'Unable to change status. Check ingredients and dish status.',
    )
  }
  return (
    <div className={`kds-screen ${focus ? 'kds-focus' : ''}`}>
      <div className="kds-topline">
        <span>
          <Icon name="leaf" size={16} /> FOODHUB{' '}
          <span className="kds-separator">/</span> KITCHEN DISPLAY
        </span>
        <span className="kds-demo">
          <i /> Demo data
        </span>
      </div>
      <div className="kds-heading">
        <div>
          <div className="kds-eyebrow">ONE KITCHEN. EVERY DISH MATTERS.</div>
          <h1>
            Kitchen display<span>.</span>
          </h1>
          <p>Track by order · Dishes from the same order share one ticket.</p>
        </div>
        <div className="kds-heading-right">
          <div className="kds-time">
            <strong>{clock(now)}</strong>
            <span>
              {new Date(now).toLocaleDateString('en-US', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          </div>
          <button
            className="kds-focus-button"
            onClick={() => setFocus((v) => !v)}
            aria-pressed={focus}
          >
            <Icon name={focus ? 'close' : 'monitor'} size={18} />
            {focus ? 'Exit focus mode' : 'Focus mode'}
          </button>
        </div>
      </div>
      <div className="kds-overview">
        <div className="kds-station">
          <div className="kds-station-icon">
            <Icon name={state.area === 'Bar' ? 'cup' : 'fire'} size={25} />
          </div>
          <div>
            <span>ASSIGNED STATION</span>
            <strong>{state.area}</strong>
            <small>Kitchen staff</small>
          </div>
        </div>
        <div className="kds-numbers">
          {columns.map((c) => (
            <div key={c.status}>
              <span className={`kds-dot ${c.tone}`} />
              <strong>
                {String(
                  orders.filter((t) => t.status === c.status).length,
                ).padStart(2, '0')}
              </strong>
              <small>orders · {c.title}</small>
            </div>
          ))}
        </div>
        <div className="kds-service-note">
          <Icon name="clock" size={20} />
          <div>
            <strong>
              {active.filter(late).length
                ? `${active.filter(late).length} dish lines waiting too long`
                : 'Queue under control'}
            </strong>
            <span>Alerts after 10 minutes · Demo threshold</span>
          </div>
        </div>
      </div>
      <div className="kds-toolbar">
        <div className="kds-filters" role="group" aria-label="Filter tickets">
          {['All', 'VIP priority', 'Long wait'].map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f === 'VIP priority' && <Icon name="crown" size={15} />} {f}
              {f === 'All' && <span>{orders.length} orders</span>}
            </button>
          ))}
        </div>
        <div className="kds-search-tools">
          <label className="kds-search">
            <Icon name="search" size={17} />
            <input
              aria-label="Search KDS"
              placeholder="Search order IDs or dishes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="KDS sort order"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>By arrival time</option>
            <option>VIP first</option>
          </select>
        </div>
      </div>
      <div className="kds-board">
        {columns.map((c) => {
          const items = shown.filter((t) => t.status === c.status)
          return (
            <section
              className={`kds-column ${c.tone}`}
              key={c.status}
              aria-label={c.title}
            >
              <div className="kds-column-head">
                <div className="kds-column-title">
                  <span className="kds-column-icon">
                    <Icon name={c.icon} size={19} />
                  </span>
                  <h2>{c.title}</h2>
                  <b>{items.length}</b>
                </div>
                <p>{c.label}</p>
              </div>
              <div className="kds-ticket-list">
                {items.map((order) => (
                  <article
                    key={order.id}
                    className={`kds-ticket ${order.lines.some(late) ? 'kds-ticket-late' : ''}`}
                    aria-label={`Order ${order.id}`}
                  >
                    <div className="kds-ticket-meta">
                      <span>
                        <i /> ORDER · {order.lines.length} dish lines
                      </span>
                      <span className="kds-timer">
                        <Icon name="clock" size={13} />
                        {elapsed(order.created, now)}
                      </span>
                    </div>
                    <div className="kds-table-row">
                      <h3 className="kds-order-id">{order.id}</h3>
                      {order.vip && (
                        <span className="kds-vip">
                          <Icon name="crown" size={12} /> VIP
                        </span>
                      )}
                    </div>
                    <p className="kds-order-context">
                      {order.lines.filter((t) => t.status === 'Ready').length}
                      /{order.lines.length} dishes ready
                    </p>
                    {order.lines.map((t) => {
                      const dish = state.recipes.find((r) => r.id === t.dishId)!
                      return (
                        <div key={t.id} className="kds-order-line">
                          <div className="kds-ticket-meta">
                            <span>
                              <i /> {t.status}
                            </span>
                            <span
                              className={`kds-timer ${late(t) ? 'overdue' : ''}`}
                              title="Time since order received"
                            >
                              <Icon name="clock" size={13} />
                              {elapsed(t.created, now)}
                            </span>
                          </div>
                          <div className="kds-ticket-divider" />
                          <div className="kds-dish">
                            <div className="kds-quantity">
                              {t.quantity}
                              <span>SERVINGS</span>
                            </div>
                            <div>
                              <h4>{dish.name}</h4>
                              <span>
                                {t.id} · Received {clock(t.created)}
                              </span>
                            </div>
                            <img src={'/images/menu/' + dish.image} alt="" />
                          </div>
                          <div className={`kds-note ${t.note ? '' : 'plain'}`}>
                            <Icon name="message" size={15} />
                            <p>{t.note || 'No special requests'}</p>
                          </div>
                          {t.previousNote !== undefined && (
                            <button
                              className="kds-amended"
                              onClick={() => setSelected(t.id)}
                            >
                              <span /> Notes updated{' '}
                              <Icon name="chevron" size={12} />
                            </button>
                          )}
                          <div className="kds-ticket-footer">
                            <button
                              className="kds-details"
                              onClick={() => setSelected(t.id)}
                              aria-label={`Details ${t.id}`}
                            >
                              <Icon name="receipt" size={18} />
                            </button>
                            {t.status === 'Ready' ? (
                              <div className="kds-ready-label">
                                <Icon name="check" size={17} /> Awaiting waiter pickup
                              </div>
                            ) : (
                              <button
                                className={`kds-action ${t.status === 'Cooking' ? 'cooking' : 'waiting'}`}
                                onClick={() => act(t)}
                              >
                                <Icon
                                  name={
                                    t.status === 'Pending' ? 'fire' : 'check'
                                  }
                                  size={17}
                                />
                                {t.status === 'Pending'
                                  ? 'Start cooking'
                                  : 'Mark ready'}
                                <Icon name="arrow" size={16} />
                              </button>
                            )}
                          </div>
                          {t.status === 'Cooking' && t.started && (
                            <p className="kds-stage-time">
                              Cooking for {elapsed(t.started, now)}
                            </p>
                          )}
                          {t.status === 'Ready' && t.finished && (
                            <p className="kds-stage-time">
                              Ready at {clock(t.finished)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </article>
                ))}
                {!items.length && (
                  <div className="kds-empty">
                    <span>
                      <Icon name={c.icon} size={28} />
                    </span>
                    <strong>
                      {query || filter !== 'All'
                        ? 'No matching dishes'
                        : c.status === 'Pending'
                          ? 'All dishes accepted'
                          : c.status === 'Cooking'
                            ? 'Kitchen ready'
                            : 'No completed dishes yet'}
                    </strong>
                    <p>
                      {query || filter !== 'All'
                        ? 'Try another search or filter.'
                        : c.status === 'Ready'
                          ? 'Completed dishes will appear here.'
                          : 'Upcoming dishes will appear here.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="kds-column-bottom">
                <span>
                  {items.length} orders ·{' '}
                  {items.reduce(
                    (n, order) =>
                      n + order.lines.reduce((sum, t) => sum + t.quantity, 0),
                    0,
                  )}{' '}
                  servings
                </span>
                <span>
                  {c.status === 'Pending'
                    ? 'Pending'
                    : c.status === 'Cooking'
                      ? 'Cooking'
                      : 'Ready'}
                </span>
              </div>
            </section>
          )
        })}
      </div>
      <div className="kds-bottom">
        <span>
          <Icon name="shield" size={14} /> Manage individual dishes · Automatically check
          ingredients when cooking starts
        </span>
        <Link to="/kitchen/notifications" onClick={() => setFocus(false)}>
          View service notifications <Icon name="arrow" size={14} />
        </Link>
      </div>
      {notice && (
        <div className="kds-feedback" role="status">
          <span>{state.feedback?.error ? state.feedback.text : notice}</span>
          <button aria-label="Dismiss KDS message" onClick={() => setNotice('')}>
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
      {current && recipe && (
        <Modal
          title={`Order ${current.order}`}
          subtitle={`Dish line ${current.id}`}
          onClose={() => setSelected('')}
        >
          <div className="space-y-4 p-6">
            <img
              src={'/images/menu/' + recipe.image}
              alt={recipe.name}
              className="h-44 w-full rounded-2xl object-cover"
            />
            <h3 className="text-xl font-bold">
              {current.quantity} × {recipe.name}
            </h3>
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              {current.note || 'No notes'}
            </p>
            {current.previousNote !== undefined && (
              <p className="text-sm text-slate-500">
                Before update: {current.previousNote}
              </p>
            )}
            <div className="flex justify-between text-sm">
              <span>{recipe.area}</span>
              <strong>{current.status}</strong>
            </div>
            <p className="text-sm text-slate-500">
              Received {clock(current.created)}
              {current.started && ` · Started ${clock(current.started)}`}
              {current.finished && ` · Completed ${clock(current.finished)}`}
            </p>
            <Link
              className="mgr-secondary w-full"
              onClick={() => {
                setSelected('')
                setFocus(false)
              }}
              to={`/kitchen/recipes?dish=${recipe.id}`}
            >
              View recipe · v{recipe.version}
            </Link>
          </div>
        </Modal>
      )}
    </div>
  )
}
