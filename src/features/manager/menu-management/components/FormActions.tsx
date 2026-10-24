import { secondaryButton } from '../../../admin/components/AdminUI'

export function FormActions({
  pending,
  close,
}: {
  pending: boolean
  close: () => void
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        disabled={pending}
        className={secondaryButton}
        onClick={close}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}
