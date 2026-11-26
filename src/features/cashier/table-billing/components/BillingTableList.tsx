import { Icon } from '../../../../components/Icon/Icon'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import type { useTableBilling } from '../hooks/useTableBilling'
import {
  entryKey,
  money,
  tableName,
} from '../utils/billingDisplay'

export function BillingTableList({
  model,
  searchInput,
}: {
  model: ReturnType<typeof useTableBilling>
  searchInput: RefObject<HTMLInputElement | null>
}) {
  const {
    tab,
    setTab,
    input,
    setInput,
    search,
    areaId,
    setAreaId,
    page,
    selected,
    setSelectedKey,
    list,
    areas,
    data,
    groups,
    lastPage,
    changePage,
  } = model
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-x-4 border-b border-slate-100 px-4">
        <div className="flex gap-4">
          {(['incoming', 'paid'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={tab === value}
              className="border-b-2 border-transparent py-4 text-sm font-semibold text-slate-500 aria-pressed:border-emerald-700 aria-pressed:text-emerald-800"
              onClick={() => {
                setTab(value)
                setAreaId('')
                changePage(1)
              }}
            >
              {value === 'incoming' ? 'Chờ thanh toán' : 'Đã thanh toán'}
              {tab === value && data && (
                <span className="ml-2 rounded-lg bg-emerald-50 px-2 py-1 text-xs">
                  {data.totalCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>
      <div className="space-y-3 border-b border-slate-100 p-4">
        <label className="relative block">
          <Icon
            name="search"
            size={17}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            ref={searchInput}
            aria-label="Tìm bàn hoặc mã hóa đơn"
            type="search"
            maxLength={50}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tìm bàn, mã hóa đơn…"
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-sm outline-none focus:border-emerald-500 lg:pr-12"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 text-xs text-slate-400 lg:block">
            F2
          </kbd>
        </label>
        <div className="flex flex-wrap gap-2">
          {[['', 'Tất cả khu vực'], ...(areas.data ?? [])].map(([id, name]) => (
            <button
              key={id}
              type="button"
              aria-pressed={areaId === id}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium aria-pressed:bg-emerald-700 aria-pressed:text-white"
              onClick={() => {
                setAreaId(id)
                changePage(1)
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-5 bg-slate-50/70 p-3 sm:p-4">
        {list.isPending && <p role="status">Đang tải danh sách…</p>}
        {list.isError && (
          <p role="alert" className="text-sm text-rose-700">
            {cashShiftError(list.error)}
          </p>
        )}
        {data && page > lastPage && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => changePage(lastPage)}
          >
            Về trang {lastPage}
          </button>
        )}
        {data && page <= lastPage && !data.items.length && (
          <p className="py-8 text-center text-sm text-slate-500">
            {search || areaId
              ? 'Không tìm thấy kết quả.'
              : 'Chưa có hóa đơn trong danh sách này.'}
          </p>
        )}
        {[...groups].map(([name, entries]) => (
          <div key={name}>
            <h2 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Icon name="pin" size={16} />
              {name}
              <span className="rounded-full bg-slate-200/60 px-2 py-0.5 text-xs font-medium text-slate-600">{entries.length}</span>
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,8rem),1fr))] gap-3">
              {entries.map((entry) => (
                <li key={entryKey(entry)} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={selected === entry}
                    onClick={() => setSelectedKey(entryKey(entry))}
                    className={`flex min-h-20 w-full min-w-0 items-center justify-center rounded-2xl border px-4 py-3 text-center transition-colors hover:border-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 aria-pressed:border-emerald-600 aria-pressed:ring-1 aria-pressed:ring-emerald-600 ${tab === 'paid' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}
                  >
                    <span className="block break-words text-xl font-bold leading-tight text-slate-900">
                      {tableName(entry)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data && (
        <footer className="border-t border-slate-100">
          <p className="px-4 py-3 text-sm text-slate-600">
            {tab === 'paid' ? 'Đã thu' : 'Cần thu'}{' '}
            <strong>
              {money.format(data.totalAmount ?? data.knownTotalAmount)}
            </strong>
            {data.unbilledCount > 0 && (
              <span> · {data.unbilledCount} yêu cầu chưa có hóa đơn</span>
            )}
          </p>
          {lastPage > 1 && page <= lastPage && (
            <Pagination
              total={data.totalCount}
              size={data.pageSize}
              page={data.page}
              onPage={changePage}
            />
          )}
        </footer>
      )}
    </section>
  )
}
import type { RefObject } from 'react'
