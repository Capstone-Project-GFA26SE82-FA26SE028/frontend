import { Modal } from '../../../../components/Modal/Modal'
import { useRecipe } from '../hooks/useRecipe'

export function RecipeModal({
  dish,
  onClose,
}: {
  dish: { id: string; name: string; image: string }
  onClose: () => void
}) {
  const recipe = useRecipe(dish.id)
  const data = recipe.data
  return (
    <Modal
      title={`Công thức · ${dish.name}`}
      closeLabel="Đóng công thức"
      size="wide"
      onClose={onClose}
    >
      <div className="space-y-5 p-5 sm:p-6">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-48 w-full rounded-2xl object-cover sm:h-64"
        />
        {recipe.isPending && (
          <p role="status" className="text-sm text-emerald-800">
            Đang tải công thức…
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
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                Phiên bản {data.version}
              </span>
              <span>
                Áp dụng từ{' '}
                {new Date(data.effectiveFrom).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <section aria-label="Hướng dẫn chế biến">
              <h3 className="mb-3 text-base font-bold text-emerald-950">
                Hướng dẫn chế biến
              </h3>
              <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {data.instructions?.trim() ||
                  'Công thức chưa có hướng dẫn chế biến.'}
              </p>
            </section>
          </>
        )}
      </div>
    </Modal>
  )
}
