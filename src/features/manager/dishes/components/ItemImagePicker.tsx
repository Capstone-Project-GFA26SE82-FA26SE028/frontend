import { useId } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { itemImageAccept } from '../utils/itemImage'

type Props = {
  imageUrl: string | null
  error: string | null
  pending: boolean
  onSelect: (file: File) => void
  onRemove: () => void
}

export function ItemImagePicker({
  imageUrl,
  error,
  pending,
  onSelect,
  onRemove,
}: Props) {
  const id = useId()
  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        Ảnh món ăn
      </label>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-emerald-700">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Xem trước món ăn"
              className="size-full object-cover"
            />
          ) : (
            <Icon name="utensils" size={30} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            type="file"
            accept={itemImageAccept}
            disabled={pending}
            aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
            aria-invalid={!!error}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100 disabled:opacity-50"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) onSelect(file)
            }}
          />
          <p id={`${id}-hint`} className="text-sm text-slate-500">
            JPEG, PNG hoặc WebP · Tối đa 2 MB
          </p>
          {(imageUrl || error) && (
            <button
              type="button"
              disabled={pending}
              onClick={onRemove}
              className="text-sm font-semibold text-rose-700 hover:underline disabled:opacity-50"
            >
              {imageUrl ? 'Xóa ảnh' : 'Bỏ chọn'}
            </button>
          )}
        </div>
      </div>
      {pending && (
        <p role="status" className="text-sm text-emerald-700">
          Đang tải ảnh lên…
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}
