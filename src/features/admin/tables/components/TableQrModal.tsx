import { useEffect, useRef } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'

import { useTableQr } from '../hooks/useTableQr'
import { qrError } from '../api/tableQrApi'
export function TableQrModal({
  tableId,
  onClose,
}: {
  tableId: string
  onClose: () => void
}) {
  const {
    context,
    current,
    picture,
    mutation,
    allowed,
    confirm,
    setConfirm,
    reload,
    download,
  } = useTableQr(tableId)
  const imageRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (!picture.data || !imageRef.current) return
    const url = URL.createObjectURL(picture.data)
    imageRef.current.src = url
    return () => URL.revokeObjectURL(url)
  })
  if (confirm) {
    return (
      <Modal
        key="confirm"
        title="Tạo lại mã QR?"
        subtitle={
          context.data ? 'Bàn ' + context.data.table.tableCode : undefined
        }
        closeLabel="Hủy"
        onClose={() => {
          if (!mutation.isPending) setConfirm(false)
        }}
      >
        <div className="space-y-5 p-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Icon name="qr" size={26} />
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Mã QR hiện tại sẽ ngừng hoạt động ngay. Tải về và thay mã đã in sau
            khi tạo mã mới.
          </p>
          {mutation.isError && (
            <div
              role="alert"
              className="space-y-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
            >
              <p>{qrError(mutation.error)}</p>
              <button
                disabled={context.isFetching}
                className="font-semibold underline"
                onClick={() => void reload()}
              >
                Tải lại QR
              </button>
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              autoFocus
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              disabled={mutation.isPending}
              onClick={() => setConfirm(false)}
            >
              Hủy
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
              disabled={
                !allowed ||
                mutation.isPending ||
                context.isFetching ||
                mutation.isError
              }
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? 'Đang tạo…' : 'Tạo lại QR'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  return (
    <Modal
      key="preview"
      title={context.data ? 'QR - ' + context.data.table.tableCode : 'QR bàn'}
      subtitle={
        context.data
          ? context.data.restaurant.restaurantName +
            ' / ' +
            context.data.area.areaName
          : undefined
      }
      closeLabel="Đóng"
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <div className="space-y-5 p-6">
        {context.isPending ? (
          <p role="status">Đang tải QR bàn…</p>
        ) : context.isError ? (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-rose-600">
              {qrError(context.error)}
            </p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => void reload()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {current ? (
              <>
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
                  {picture.isPending ? (
                    <p role="status">Đang tải ảnh QR…</p>
                  ) : picture.isError ? (
                    <div className="space-y-3 text-center">
                      <p role="alert" className="text-sm text-rose-600">
                        {qrError(picture.error)}
                      </p>
                      <button
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                        onClick={() => void picture.refetch()}
                      >
                        Tải lại ảnh
                      </button>
                    </div>
                  ) : picture.data ? (
                    <img
                      ref={imageRef}
                      alt={'Mã QR của bàn ' + context.data.table.tableCode}
                      className="aspect-square w-full max-w-64"
                    />
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span
                    className={
                      'rounded-full px-3 py-1 font-semibold ' +
                      (current.isUsable && allowed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700')
                    }
                  >
                    {current.isUsable && allowed
                      ? 'Có thể sử dụng'
                      : 'Không khả dụng'}
                  </span>
                  <span className="text-slate-500">
                    Ngày tạo{' '}
                    {new Date(current.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <Icon
                  name="qr"
                  size={40}
                  className="mx-auto text-emerald-600"
                />
                <p className="mt-3 font-semibold">Chưa có mã QR</p>
                <p className="mt-1 text-sm text-slate-500">
                  Tạo mã QR cho bàn này.
                </p>
              </div>
            )}
            {!allowed && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                Bàn và khu vực phải đang hoạt động để tạo hoặc sử dụng mã QR.
              </p>
            )}
            {mutation.isError && (
              <div
                role="alert"
                className="space-y-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
              >
                <p>{qrError(mutation.error)}</p>
                <button
                  disabled={context.isFetching}
                  className="font-semibold underline"
                  onClick={() => void reload()}
                >
                  Tải lại QR
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {current && (
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
                  disabled={
                    !picture.data ||
                    picture.isError ||
                    picture.isFetching ||
                    mutation.isPending
                  }
                  onClick={download}
                >
                  <Icon name="download" size={17} />
                  Tải ảnh PNG
                </button>
              )}
              <button
                className={
                  current
                    ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40'
                    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40'
                }
                disabled={
                  !allowed ||
                  mutation.isPending ||
                  context.isFetching ||
                  mutation.isError
                }
                onClick={() => (current ? setConfirm(true) : mutation.mutate())}
              >
                {mutation.isPending
                  ? 'Đang tạo…'
                  : current
                    ? 'Tạo lại'
                    : 'Tạo QR'}
              </button>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-4">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                disabled={mutation.isPending || context.isFetching}
                onClick={() => void reload()}
              >
                Làm mới
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                disabled={mutation.isPending}
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
