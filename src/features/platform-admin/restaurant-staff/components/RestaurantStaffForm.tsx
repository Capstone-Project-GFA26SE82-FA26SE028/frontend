import { Field } from '../../../../components/Field/Field'
import { Pagination } from '../../../../components/Pagination/Pagination'
import {
  useStaffAccountSearch,
  type useRestaurantStaff,
} from '../hooks/useRestaurantStaff'
import { restaurantStaffError } from '../api/restaurantStaffApi'
import type { StaffAccount } from '../types/types'

export function RestaurantStaffForm({
  management: m,
}: {
  management: ReturnType<typeof useRestaurantStaff>
}) {
  const {
    search,
    page,
    selected,
    selectAccount,
    changeSearch,
    changePage,
    query,
    waiting,
  } = useStaffAccountSearch()
  function unavailable(account: StaffAccount) {
    if (
      ![
        'admin',
        'manager',
        'waiter',
        'cashier',
        'kitchen',
        'inventory',
      ].includes(account.roleId)
    )
      return 'Vai trò không áp dụng'
    if (m.active.some((row) => row.userIdRef === account.userId))
      return 'Đã phân công'
    if (account.restaurantId && account.restaurantId !== m.restaurantId)
      return 'Thuộc nhà hàng khác'
    return ''
  }
  const busy = m.change.isPending || m.list.isFetching || !m.list.isSuccess
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (busy || !selected || unavailable(selected)) return
        m.change.mutate({ userId: selected.userId, remove: false })
      }}
    >
      <Field label="Tìm nhân viên">
        <input
          type="search"
          value={search}
          maxLength={255}
          disabled={m.change.isPending}
          autoComplete="off"
          placeholder="Nhập tên, username hoặc email…"
          className="field"
          onChange={(event) => changeSearch(event.target.value)}
        />
      </Field>
      {!!search.trim() &&
        (waiting || query.isPending ? (
          <p role="status" className="text-sm text-muted">
            Đang tìm nhân viên…
          </p>
        ) : query.isError ? (
          <div role="alert" className="text-sm text-rose-600">
            {restaurantStaffError(query.error)}{' '}
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div
              className="max-h-80 space-y-2 overflow-y-auto"
              aria-label="Kết quả tìm nhân viên"
            >
              {!query.data?.items.length && (
                <p className="py-5 text-center text-sm text-muted">
                  Không tìm thấy tài khoản phù hợp.
                </p>
              )}
              {query.data?.items.map((account) => {
                const reason = unavailable(account)
                return (
                  <button
                    key={account.userId}
                    type="button"
                    aria-pressed={selected?.userId === account.userId}
                    disabled={!!reason || busy}
                    onClick={() => selectAccount(account)}
                    className={
                      'block w-full rounded-xl border p-3 text-left disabled:opacity-50 ' +
                      (selected?.userId === account.userId
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 hover:bg-slate-50')
                    }
                  >
                    <span className="block break-words text-sm font-semibold">
                      {account.fullName || account.userName}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      {account.roleId}
                      {reason ? ' · ' + reason : ''}
                    </span>
                  </button>
                )
              })}
            </div>
            {!!query.data && query.data.totalCount > 10 && (
              <Pagination
                page={page}
                total={query.data.totalCount}
                size={10}
                onPage={changePage}
              />
            )}
          </>
        ))}
      {selected && (
        <p className="break-words text-sm text-emerald-700">
          Đã chọn: <strong>{selected.fullName || selected.userName}</strong>
        </p>
      )}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={m.change.isPending}
          onClick={() => m.setAdding(false)}
          className="btn-secondary"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={busy || !selected || !!unavailable(selected)}
          className="btn-primary"
        >
          {m.change.isPending ? 'Đang gán…' : 'Gán nhân viên'}
        </button>
      </div>
    </form>
  )
}
