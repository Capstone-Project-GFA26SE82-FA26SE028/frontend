import { cloneElement, useId, type ReactElement } from 'react'

// Hiển thị nhãn và lỗi cho ô nhập; không tự kiểm tra dữ liệu.
export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactElement<{
    id?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }>
}) {
  const id = useId()
  return (
    <div className="block space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-600">
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-describedby': error ? `${id}-error` : undefined,
        'aria-invalid': Boolean(error),
      })}
      {error && (
        <span
          id={`${id}-error`}
          role="alert"
          className="block text-xs text-rose-600"
        >
          {error}
        </span>
      )}
    </div>
  )
}
