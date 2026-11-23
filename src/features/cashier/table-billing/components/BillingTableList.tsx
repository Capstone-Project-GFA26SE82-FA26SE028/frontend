import { Icon } from '../../../../components/Icon/Icon'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import type { useTableBilling } from '../hooks/useTableBilling'
import {
  entryKey,
  money,
  STATUS_NAMES,
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
    setSearch,
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
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            setSearch(input.trim())
            changePage(1)
          }}
        >
          <input
            ref={searchInput}
            aria-label="Tìm bàn hoặc mã hóa đơn"
            type="search"
            maxLength={50}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tìm bàn, mã hóa đơn…"
            className="min-h-11 min-w-40 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm"
          />
          <button className="btn-secondary">Tìm</button>
          {search && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setInput('')
                setSearch('')
                changePage(1)
              }}
            >
              Xóa tìm kiếm
            </button>
          )}
        </form>
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
      <div className="flex-1 space-y-5 bg-slate-50 p-4">
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
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Icon name="pin" size={16} />
              {name}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
              {entries.map((entry) => (
                <li key={entryKey(entry)} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={selected === entry}
                    onClick={() => setSelectedKey(entryKey(entry))}
                    className="h-full w-full space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-emerald-600 aria-pressed:border-emerald-600 aria-pressed:ring-1 aria-pressed:ring-emerald-600"
                  >
                    <Icon
                      name="utensils"
                      size={20}
                      className="text-emerald-700"
                    />
                    <span className="block break-words font-bold">
                      {tableName(entry)}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {entry.partySize > 0
                        ? `${entry.partySize} khách`
                        : (STATUS_NAMES[entry.status] ?? entry.status)}
                    </span>
                    <span className="block border-t border-slate-100 pt-2 text-sm font-semibold text-emerald-800">
                      {entry.totalAmount === null
                        ? 'Chờ lập hóa đơn'
                        : money.format(entry.totalAmount)}
                    </span>
                    {entry.billCode && (
                      <span className="block break-words text-xs text-slate-500">
                        {entry.billCode}
                      </span>
                    )}
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
