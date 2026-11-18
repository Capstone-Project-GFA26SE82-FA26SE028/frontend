import { useQuery } from '@tanstack/react-query'
import { Modal } from '../../../../components/Modal/Modal'
import { TakeawayDishOptionsForm } from '../../takeaway-menu/components/TakeawayDishOptionsForm'
import { getTakeawayMenu } from '../../takeaway-menu/api/takeawayMenuApi'
import type { TakeawayCartEditTarget } from '../types/types'
import type { useTakeawayCart } from '../hooks/useTakeawayCart'
export function TakeawayCartEditModal({
  restaurantId,
  editing,
  model,
  blocked,
  onClose,
}: {
  restaurantId: string
  editing: TakeawayCartEditTarget
  model: ReturnType<typeof useTakeawayCart>
  blocked: boolean
  onClose: () => void
}) {
  const cart = model.cart.data
  const menu = useQuery({
    queryKey: ['takeaway-cart-edit-menu', restaurantId],
    queryFn: ({ signal }) =>
      getTakeawayMenu(restaurantId, { search: '', categoryId: '' }, signal),
    enabled: true,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const dish = menu.data?.find((item) => item.itemId === editing.line.itemId)

  return (
    <Modal
      title="Sửa món"
      onClose={() => {
        if (!model.pending) onClose()
      }}
    >
      <div className="space-y-4 p-6">
        {menu.isFetching ? (
          <p role="status">Đang tải tùy chọn…</p>
        ) : menu.isError ? (
          <div role="alert">
            <p>Không thể tải tùy chọn món.</p>
            <button
              type="button"
              onClick={() => void menu.refetch()}
              className="mt-3 text-brand underline"
            >
              Thử lại
            </button>
          </div>
        ) : dish ? (
          <>
            <h3 className="font-bold">{dish.itemName}</h3>
            {(!dish.canOrder || dish.price === null) && (
              <p className="text-sm text-amber-800">
                Món hiện không khả dụng. Bạn có thể xóa món khỏi giỏ.
              </p>
            )}
            <TakeawayDishOptionsForm
              dish={dish}
              initial={editing.line}
              submitLabel="Lưu thay đổi"
              pending={model.pending}
              disabled={blocked || cart?.version !== editing.version}
              onAdd={async (line) => {
                if (!cart) return
                if (
                  await model.changeItems(
                    cart.items.map((item, index) =>
                      index === editing.index ? line : item,
                    ),
                    editing.version,
                  )
                )
                  onClose()
              }}
            />
          </>
        ) : (
          <p>Món không còn trong thực đơn. Bạn có thể xóa món khỏi giỏ.</p>
        )}
        {(model.error || cart?.version !== editing.version) && (
          <p role="alert" className="text-sm text-amber-800">
            {model.error ||
              'Giỏ hàng đã thay đổi. Đóng cửa sổ và tải lại giỏ hàng.'}
          </p>
        )}
        <button
          type="button"
          disabled={model.pending}
          onClick={() => onClose()}
          className="btn-secondary w-full"
        >
          Đóng
        </button>
      </div>
    </Modal>
  )
}
