export function FormActions({
  pending,
  close,
  submitDisabled = false,
}: {
  pending: boolean
  close: () => void
  submitDisabled?: boolean
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        onClick={close}
      >
        Hủy
      </button>
      <button
        type="submit"
        disabled={pending || submitDisabled}
        className="inline-flex min-h-11 items-center rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
      >
        {pending ? 'Đang lưu…' : 'Lưu thay đổi'}
      </button>
    </div>
  )
}
