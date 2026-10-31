export function PaymentSettingsActions({
  dirty,
  onCancel,
  onSave,
}: {
  dirty: boolean
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 sm:px-6">
      <p
        role="status"
        className="mr-auto w-full text-sm text-slate-500 sm:w-auto"
      >
        {dirty ? 'Có thay đổi chưa lưu' : 'Cấu hình đã được lưu'}
      </p>
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        onClick={onCancel}
      >
        Hủy thay đổi
      </button>
      <button
        disabled={!dirty}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
        onClick={onSave}
      >
        Lưu thay đổi
      </button>
    </div>
  )
}
