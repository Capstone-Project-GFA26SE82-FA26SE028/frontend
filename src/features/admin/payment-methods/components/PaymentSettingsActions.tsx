import { primaryButton, secondaryButton } from '../../components/AdminUI'
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
      <button className={secondaryButton} onClick={onCancel}>
        Hủy thay đổi
      </button>
      <button disabled={!dirty} className={primaryButton} onClick={onSave}>
        Lưu thay đổi
      </button>
    </div>
  )
}
