import { useState } from 'react'
import { useCashShift } from '../hooks/useCashShift'
import { cashShiftError } from '../api/cashShiftApi'
import { openingCashSchema } from '../schemas/cashShiftSchema'

export function CashShiftPage() {
  const model = useCashShift()
  return (
    <ShiftContent
      key={`${model.user.userId}:${model.restaurantId}`}
      model={model}
    />
  )
}

function ShiftContent({ model }: { model: ReturnType<typeof useCashShift> }) {
  const [amount, setAmount] = useState('0')
  const { user, restaurantId, workspace, open } = model
  const shift = workspace.data?.shift
  const ownsShift =
    shift?.cashierUserRef.toLowerCase() === user.userId.toLowerCase()
  const openingCash = openingCashSchema.safeParse(amount)
  return (
    <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-emerald-50/70 px-6 py-7 sm:px-9">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
          Ca làm việc
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {shift ? 'Quầy đang mở ca' : 'Sẵn sàng đón khách'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {user.fullName || user.userName} · Thu ngân
        </p>
      </div>
      <div className="space-y-6 p-6 sm:p-9">
        {!restaurantId ? (
          <p role="alert">
            Tài khoản chưa được gán nhà hàng. Liên hệ quản lý để kiểm tra.
          </p>
        ) : workspace.isPending ? (
          <p role="status">Đang kiểm tra ca làm việc…</p>
        ) : workspace.isError ? (
          <div role="alert" className="space-y-4">
            <p className="text-rose-700">{cashShiftError(workspace.error)}</p>
            <button
              className="btn-secondary"
              onClick={() => void workspace.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : shift ? (
          <>
            <div
              className={`rounded-2xl p-4 text-sm ${ownsShift ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}
              role="status"
            >
              {ownsShift
                ? 'Ca của bạn đang hoạt động.'
                : 'Quầy đang có ca của thu ngân khác. Vui lòng bàn giao và đóng ca hiện tại trước khi mở ca mới.'}
            </div>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-sm text-slate-500">Tiền đầu ca</dt>
                <dd className="mt-2 text-3xl font-bold text-emerald-800">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(shift.openingCash)}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-sm text-slate-500">Mở ca lúc</dt>
                <dd className="mt-3 font-semibold">
                  {new Date(shift.openedAt).toLocaleString('vi-VN')}
                </dd>
              </div>
            </dl>
            <p className="text-sm text-slate-500">
              Quầy: {workspace.data?.register?.code || 'Mặc định'}
            </p>
            <button
              className="btn-secondary"
              disabled={workspace.isFetching}
              onClick={() => void workspace.refetch()}
            >
              Kiểm tra ca
            </button>
          </>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              if (
                openingCash.success &&
                !open.isPending &&
                !workspace.isFetching
              )
                open.mutate(openingCash.data)
            }}
          >
            <div>
              <label
                htmlFor="opening-cash"
                className="mb-2 block text-sm font-semibold"
              >
                Tiền mặt đầu ca
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 pr-4 focus-within:ring-2 focus-within:ring-emerald-600">
                <input
                  id="opening-cash"
                  inputMode="numeric"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-4 text-2xl font-semibold outline-none"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  aria-describedby="cash-help"
                />
                <span className="text-sm text-slate-500">VND</span>
              </div>
              <p id="cash-help" className="mt-2 text-sm text-slate-500">
                Nhập số tiền thực có trong quầy trước khi bắt đầu ca.
              </p>
            </div>
            {!openingCash.success && (
              <p role="alert" className="text-sm text-rose-700">
                {openingCash.error.issues[0]?.message}
              </p>
            )}
            {open.isError && (
              <p role="alert" className="text-sm text-rose-700">
                {cashShiftError(open.error)}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                className="btn-secondary"
                disabled={open.isPending || workspace.isFetching}
                onClick={() => void workspace.refetch()}
              >
                Kiểm tra ca
              </button>
              <button
                className="btn-primary"
                disabled={
                  !openingCash.success || open.isPending || workspace.isFetching
                }
              >
                {open.isPending ? 'Đang mở ca…' : 'Mở ca làm việc'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
