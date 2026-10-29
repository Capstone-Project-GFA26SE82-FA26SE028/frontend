import { previewRestaurant } from '../data/previewRestaurant'
import { Icon } from '../../../../components/Icon/Icon'
import { PhoneEntryForm } from '../components/PhoneEntryForm'
import { PhoneEntryWelcome } from '../components/PhoneEntryWelcome'
import { useTableSession } from '../hooks/useTableSession'
import { sessionError } from '../api/tableSessionApi'
import { NotFoundPage } from '../../../../pages/NotFoundPage'
export function PhoneEntryPage() {
  const { valid, scan, join } = useTableSession()
  if (!valid) return <NotFoundPage />

  return (
    <main
      lang="vi"
      className="flex min-h-dvh items-center justify-center bg-white md:bg-[#faf9f6] md:p-8"
    >
      <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-white md:grid md:min-h-0 md:max-w-5xl md:grid-cols-2 md:rounded-3xl md:border md:border-stone-200 md:shadow-xl md:shadow-emerald-950/5">
        <PhoneEntryWelcome />
        <section className="relative flex flex-1 flex-col px-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-10 md:justify-center md:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-6 flex items-center gap-4">
              <img
                src={previewRestaurant.logoUrl}
                alt="Logo nhà hàng"
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-2xl border-4 border-white bg-[#123d30] object-cover shadow-sm"
              />
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold tracking-tight text-ink">
                  {previewRestaurant.restaurantName}
                </h1>
              </div>
            </div>
            {scan.isPending ? (
              <p role="status" className="mt-5">
                Đang kiểm tra bàn…
              </p>
            ) : scan.isError ? (
              <div className="mt-5 space-y-3">
                <p role="alert" className="text-sm text-rose-700">
                  {sessionError(scan.error)}
                </p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    join.reset()
                    void scan.refetch()
                  }}
                >
                  Thử lại
                </button>
              </div>
            ) : scan.data?.status !== 'Open' ? (
              <p role="alert" className="mt-5">
                Bàn này hiện không nhận khách. Vui lòng liên hệ nhân viên.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
                    <Icon name="utensils" size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-lg font-bold text-ink">
                      Bàn {scan.data.tableCode}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {previewRestaurant.areaName}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Đang mở
                  </span>
                </div>
                <PhoneEntryForm
                  key={scan.data.tableSessionId}
                  pending={join.isPending}
                  error={join.isError ? sessionError(join.error) : undefined}
                  onSubmit={({ phone }) => join.mutate(phone)}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
