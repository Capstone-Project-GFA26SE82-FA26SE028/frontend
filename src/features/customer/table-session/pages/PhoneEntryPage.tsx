import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { PhoneEntryForm } from '../components/PhoneEntryForm'
import { BrandBackground } from '../../../../components/BrandBackground/BrandBackground'
import { BrandLogo } from '../../../../components/BrandLogo/BrandLogo'
import { useTableSession } from '../hooks/useTableSession'
import { sessionError } from '../api/tableSessionApi'
import { NotFoundPage } from '../../../../pages/NotFoundPage'
export function PhoneEntryPage() {
  const { valid, scan, join } = useTableSession()
  const [failedLogo, setFailedLogo] = useState<string | null>(null)
  if (!valid) return <NotFoundPage />
  const logoUrl = scan.data?.logoUrl

  return (
    <main
      lang="vi"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center bg-[#123d30] px-4 py-8 text-[#173e32] sm:py-12"
    >
      <BrandBackground />
      <div className="mb-7">
        <BrandLogo />
      </div>
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white px-6 py-8 shadow-2xl shadow-black/15 sm:px-9 sm:py-10">
        <div className="mb-6 flex items-center gap-4">
          {logoUrl && logoUrl !== failedLogo ? (
            <img
              src={logoUrl}
              alt=""
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-2xl bg-emerald-50 object-cover"
              onError={() => setFailedLogo(logoUrl)}
            />
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Icon name="store" size={24} />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold tracking-tight text-ink">
              {scan.data?.restaurantName || 'Vào bàn'}
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
              <div className="min-w-0 flex-1">
                <p className="break-words text-lg font-bold text-ink">
                  Bàn {scan.data.tableCode}
                </p>
                {scan.data.areaName && (
                  <p className="mt-1 text-xs text-slate-500">
                    {scan.data.areaName}
                  </p>
                )}
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
      </section>
    </main>
  )
}
