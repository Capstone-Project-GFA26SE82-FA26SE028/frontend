import { useState } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import { DishOptionModal } from '../../menu/components/DishOptionModal'
import { DishImage } from '../../menu/components/DishImage'
import { useCartRecommendations } from '../hooks/useCartRecommendations'

export function CartRecommendations({
  sessionId,
  cartId,
  version,
  disabled,
  onReload,
  autoRequested,
}: {
  sessionId: string
  cartId: string
  version: string
  disabled: boolean
  onReload: () => Promise<unknown>
  autoRequested: { current: boolean }
}) {
  const m = useCartRecommendations(
    sessionId,
    cartId,
    version,
    disabled,
    autoRequested,
  )
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <section
      aria-label="Gợi ý thêm món"
      className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white text-brand">
            <Icon name="spark" size={19} />
          </span>
          <h2 className="text-sm font-semibold text-ink">Gợi ý thêm món</h2>
        </div>
        <button
          type="button"
          disabled={disabled || m.pending || m.needsReload}
          onClick={() => void m.load()}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 text-xs font-semibold text-brand transition-colors hover:bg-mint disabled:opacity-50"
        >
          <Icon
            name={m.pending ? 'refresh' : m.result ? 'refresh' : 'spark'}
            size={15}
            className={m.pending ? 'animate-spin' : ''}
          />
          {m.pending ? 'Đang gợi ý…' : m.result ? 'Gợi ý lại' : 'Xem gợi ý'}
        </button>
      </div>
      {m.pending && (
        <p role="status" className="mt-3 text-xs text-muted">
          Đang chọn món phù hợp với giỏ hàng…
        </p>
      )}
      {!!m.error && (
        <div className="mt-3 rounded-xl bg-white/80 p-3">
          <p role="alert" className="text-xs leading-5 text-muted">
            {m.error}
          </p>
          {m.needsReload && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => void onReload()}
              className="mt-2 min-h-9 text-xs font-semibold text-brand disabled:opacity-50"
            >
              Tải lại giỏ hàng
            </button>
          )}
        </div>
      )}
      {m.result && (
        <>
          {m.result.items.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {m.result.items.map(({ item, reason }) => (
                <button
                  key={item.itemId}
                  type="button"
                  aria-label={`Chọn món ${item.itemName}`}
                  disabled={disabled || !item.canOrder || item.price === null}
                  onClick={() => setSelected(item.itemId)}
                  className="flex min-w-0 overflow-hidden rounded-2xl border border-stone-200/70 bg-white text-left transition-colors hover:border-emerald-400 disabled:opacity-50 sm:flex-col"
                >
                  <DishImage
                    src={item.imageUrl}
                    name={item.itemName}
                    className="h-24 w-24 shrink-0 sm:aspect-[4/3] sm:h-auto sm:w-full"
                  />
                  <span className="flex min-w-0 flex-1 flex-col p-3">
                    <span className="text-sm font-semibold leading-5 text-ink">
                      {item.itemName}
                    </span>
                    <span className="mt-1 text-[11px] leading-4 text-muted">
                      {reason}
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-brand">
                        {item.price === null
                          ? 'Chưa có giá'
                          : formatCurrency(item.price)}
                      </span>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mint text-brand">
                        <Icon name="plus" size={15} />
                      </span>
                    </span>
                    {item.requiresOptionSelection && (
                      <span className="mt-1 text-[10px] text-muted">
                        Chọn tùy chọn
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p role="status" className="mt-3 text-xs leading-5 text-muted">
              Chưa có món gợi ý phù hợp. Bạn có thể chọn thêm từ thực đơn.
            </p>
          )}
          {m.result.searchLimited && (
            <p className="mt-3 text-[11px] leading-4 text-muted">
              Gợi ý dựa trên một phần thực đơn hiện tại.
            </p>
          )}
        </>
      )}
      {selected && (
        <DishOptionModal
          itemId={selected}
          sessionId={sessionId}
          onClose={() => setSelected(null)}
          onAdded={() => {
            setSelected(null)
            toast.success('Đã thêm món vào giỏ hàng.')
          }}
        />
      )}
    </section>
  )
}
