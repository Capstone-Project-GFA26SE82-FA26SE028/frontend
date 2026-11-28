import { useQuery } from '@tanstack/react-query'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import { useRecipe } from '../hooks/useRecipe'
import { useKds } from '../hooks/useKds'
import { kdsApi, kdsError } from '../api/kdsApi'

export function RecipeModal({
  dish,
  option = false,
  onClose,
}: {
  dish: { id: string; name: string; image: string }
  option?: boolean
  onClose: () => void
}) {
  const recipe = useRecipe(dish.id, option)
  const { items, run, pending } = useKds()
  const data = recipe.data

  // Tải danh sách tồn kho nguyên liệu thời gian thực
  const ingredientsQuery = useQuery({
    queryKey: ['kitchen-live', 'ingredients'],
    queryFn: ({ signal }) => kdsApi.ingredients(signal),
    staleTime: 30000,
  })
  const allIngredients = ingredientsQuery.data || []

  // Tìm thông tin món ăn trong thực đơn để biết trạng thái đang bán hay tạm hết
  const menuItem = items.find((i) => i.itemId === dish.id)
  const isOutOfStock = menuItem?.availability === 'OutOfStock'

  // Phân tích danh sách nguyên liệu và kiểm tra xem có nguyên liệu nào bị hết hàng không
  const ingredientDetails = (data?.ingredients || []).map((ing) => {
    const matched = allIngredients.find(
      (inv) => inv.ingredientId === ing.ingredientRef,
    )
    const stock = matched?.stockQuantity ?? null
    const unit = matched?.baseUnit || 'đơn vị'
    const name = matched?.ingredientName || `Nguyên liệu #${ing.ingredientRef.slice(-6)}`
    const isZeroStock = stock !== null && stock <= 0
    const isLowStock = matched ? matched.isLowStock || (stock !== null && stock <= matched.lowStockThreshold) : false
    const portionsLeft =
      stock !== null && ing.baseQuantitySnapshot > 0
        ? Math.floor(stock / ing.baseQuantitySnapshot)
        : null

    return {
      ...ing,
      name,
      stock,
      unit,
      isZeroStock,
      isLowStock,
      portionsLeft,
    }
  })

  // Đếm số nguyên liệu bị hết hàng hoặc cảnh báo
  const zeroStockIngredients = ingredientDetails.filter((i) => i.isZeroStock)

  return (
    <Modal
      title={`Công thức · ${dish.name}`}
      closeLabel="Đóng công thức"
      size="wide"
      onClose={onClose}
    >
      <div className="space-y-5 p-5 sm:p-6">
        {!option && dish.image && (
          <img
            src={dish.image}
            alt={dish.name}
            className="h-44 w-full rounded-2xl object-cover sm:h-56"
          />
        )}

        {/* Cảnh báo nếu có nguyên liệu bị hết hàng trong kho */}
        {zeroStockIngredients.length > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-xs">
            <Icon name="close" size={20} className="mt-0.5 shrink-0 text-rose-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-rose-800">
                Cảnh báo kho: Có {zeroStockIngredients.length} nguyên liệu đã hết hàng!
              </p>
              <p className="mt-0.5 text-xs text-rose-700">
                Các nguyên liệu:{' '}
                <strong>
                  {zeroStockIngredients.map((i) => i.name).join(', ')}
                </strong>{' '}
                hiện đã cạn tồn kho. Bạn có thể bấm nút &quot;Báo hết món&quot; bên dưới để tạm ngưng nhận món.
              </p>
            </div>
          </div>
        )}

        {/* Thông báo nếu gặp lỗi tải dữ liệu tồn kho */}
        {ingredientsQuery.isError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-center justify-between">
            <span>Không thể đồng bộ tồn kho: {kdsError(ingredientsQuery.error)}</span>
            <button
              type="button"
              onClick={() => void ingredientsQuery.refetch()}
              className="ml-2 font-bold text-amber-800 underline hover:text-amber-950"
            >
              Thử lại
            </button>
          </div>
        )}

        {recipe.isPending && (
          <p role="status" className="text-sm text-emerald-800">
            Đang tải công thức và kiểm tra nguyên liệu…
          </p>
        )}

        {recipe.isError && (
          <div
            role="alert"
            className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800"
          >
            <p>{recipe.errorMessage}</p>
            <button
              type="button"
              className="mt-3 underline"
              onClick={() => void recipe.refetch()}
            >
              Thử lại
            </button>
          </div>
        )}

        {data && (
          <>
            {/* Header phiên bản công thức & Nút thao tác Báo hết món nhanh */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                  Phiên bản công thức {data.version}
                </span>
                <span className="text-xs text-slate-500">
                  Áp dụng từ {new Date(data.effectiveFrom).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {/* Nút thao tác nhanh tình trạng món ăn */}
              {menuItem && (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      isOutOfStock
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isOutOfStock ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    />
                    {isOutOfStock ? 'Đang báo hết món' : 'Đang sẵn sàng'}
                  </span>

                  {isOutOfStock ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        void run({
                          type: 'availability',
                          id: menuItem.itemId,
                          availability: 'Available',
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <Icon name="check" size={13} className="text-emerald-600" />
                      Mở bán lại
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        void run({
                          type: 'availability',
                          id: menuItem.itemId,
                          availability: 'OutOfStock',
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-100 disabled:opacity-50"
                    >
                      <Icon name="close" size={13} className="text-rose-600" />
                      Báo hết món này
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bảng Nguyên liệu & Tồn kho thực tế trong bếp */}
            <section aria-label="Nguyên liệu định lượng và tồn kho">
              <h3 className="mb-2.5 text-sm font-bold text-slate-900">
                Nguyên liệu định lượng & Tồn kho thực tế
              </h3>
              {ingredientDetails.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3.5">Nguyên liệu</th>
                        <th className="py-2.5 px-3">Định lượng / phần</th>
                        <th className="py-2.5 px-3">Tồn kho bếp</th>
                        <th className="py-2.5 px-3 text-right">Tình trạng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ingredientDetails.map((ing) => (
                        <tr
                          key={ing.ingredientRef}
                          className={`transition-colors ${
                            ing.isZeroStock
                              ? 'bg-rose-50/60'
                              : ing.isLowStock
                                ? 'bg-amber-50/50'
                                : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-2.5 px-3.5 font-bold text-slate-900">
                            {ing.name}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-600">
                            {ing.baseQuantitySnapshot} {ing.unit}
                          </td>
                          <td className="py-2.5 px-3 font-bold tabular-nums">
                            {ing.stock !== null ? (
                              <span
                                className={
                                  ing.isZeroStock
                                    ? 'text-rose-700 font-black'
                                    : ing.isLowStock
                                      ? 'text-amber-700 font-bold'
                                      : 'text-slate-800'
                                }
                              >
                                {ing.stock} {ing.unit}
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                {ingredientsQuery.isLoading ? 'Đang kiểm kho…' : 'Chưa kiểm kho'}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {ing.isZeroStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-extrabold text-rose-800">
                                🔴 Hết hàng
                              </span>
                            ) : ing.isLowStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                                🟠 Sắp hết {ing.portionsLeft !== null ? `(~${ing.portionsLeft}p)` : ''}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                🟢 Đủ tồn {ing.portionsLeft !== null ? `(~${ing.portionsLeft} phần)` : ''}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
                  Công thức chưa có danh sách nguyên liệu định lượng.
                </p>
              )}
            </section>

            {/* Hướng dẫn chế biến */}
            <section aria-label="Hướng dẫn chế biến">
              <h3 className="mb-2.5 text-sm font-bold text-slate-900">
                Hướng dẫn chế biến
              </h3>
              <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-700 border border-slate-100">
                {data.instructions?.trim() ||
                  'Công thức chưa có hướng dẫn chế biến chi tiết.'}
              </p>
            </section>
          </>
        )}
      </div>
    </Modal>
  )
}

