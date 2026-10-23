import { useEffect, useRef } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import { primaryButton, secondaryButton } from '../../components/AdminUI'
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
        title="Regenerate QR code?"
        subtitle={
          context.data ? 'Table ' + context.data.table.tableCode : undefined
        }
        closeLabel="Cancel"
        onClose={() => {
          if (!mutation.isPending) setConfirm(false)
        }}
      >
        <div className="space-y-5 p-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Icon name="qr" size={26} />
          </div>
          <p className="text-sm leading-6 text-slate-600">
            The current QR code will stop working immediately. Download and
            replace the printed code after generating a new one.
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
                Reload QR
              </button>
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              autoFocus
              className={secondaryButton}
              disabled={mutation.isPending}
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
            <button
              className={primaryButton}
              disabled={
                !allowed ||
                mutation.isPending ||
                context.isFetching ||
                mutation.isError
              }
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? 'Generating...' : 'Regenerate QR'}
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  return (
    <Modal
      key="preview"
      title={context.data ? 'QR - ' + context.data.table.tableCode : 'Table QR'}
      subtitle={
        context.data
          ? context.data.restaurant.restaurantName +
            ' / ' +
            context.data.area.areaName
          : undefined
      }
      closeLabel="Close"
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <div className="space-y-5 p-6">
        {context.isPending ? (
          <p role="status">Loading table QR...</p>
        ) : context.isError ? (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-rose-600">
              {qrError(context.error)}
            </p>
            <button className={secondaryButton} onClick={() => void reload()}>
              Try again
            </button>
          </div>
        ) : (
          <>
            {current ? (
              <>
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
                  {picture.isPending ? (
                    <p role="status">Loading QR image...</p>
                  ) : picture.isError ? (
                    <div className="space-y-3 text-center">
                      <p role="alert" className="text-sm text-rose-600">
                        {qrError(picture.error)}
                      </p>
                      <button
                        className={secondaryButton}
                        onClick={() => void picture.refetch()}
                      >
                        Retry image
                      </button>
                    </div>
                  ) : picture.data ? (
                    <img
                      ref={imageRef}
                      alt={'QR code for table ' + context.data.table.tableCode}
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
                    {current.isUsable && allowed ? 'Usable' : 'Unavailable'}
                  </span>
                  <span className="text-slate-500">
                    Created{' '}
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
                <p className="mt-3 font-semibold">No QR code yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Create a QR code for this table.
                </p>
              </div>
            )}
            {!allowed && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                The table and its area must be active to create or use a QR
                code.
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
                  Reload QR
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {current && (
                <button
                  className={primaryButton}
                  disabled={
                    !picture.data ||
                    picture.isError ||
                    picture.isFetching ||
                    mutation.isPending
                  }
                  onClick={download}
                >
                  <Icon name="download" size={17} />
                  Download PNG
                </button>
              )}
              <button
                className={current ? secondaryButton : primaryButton}
                disabled={
                  !allowed ||
                  mutation.isPending ||
                  context.isFetching ||
                  mutation.isError
                }
                onClick={() => (current ? setConfirm(true) : mutation.mutate())}
              >
                {mutation.isPending
                  ? 'Creating...'
                  : current
                    ? 'Regenerate'
                    : 'Create QR'}
              </button>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-4">
              <button
                className={secondaryButton}
                disabled={mutation.isPending || context.isFetching}
                onClick={() => void reload()}
              >
                Refresh
              </button>
              <button
                className={secondaryButton}
                disabled={mutation.isPending}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
