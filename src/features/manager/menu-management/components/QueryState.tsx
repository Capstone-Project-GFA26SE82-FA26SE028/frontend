import type { ReactNode } from 'react'
import { secondaryButton } from '../../../admin/components/AdminUI'
import { catalogError } from '../api/catalogApi'

export function QueryState({
  pending,
  error,
  retry,
  children,
  empty,
}: {
  pending: boolean
  error: unknown
  retry: () => void
  children: ReactNode
  empty?: boolean
}) {
  if (pending)
    return (
      <p role="status" className="p-12 text-center text-slate-500">
        Loading…
      </p>
    )
  if (error)
    return (
      <div role="alert" className="space-y-4 p-8 text-center">
        <p className="text-sm text-rose-700">{catalogError(error)}</p>
        <button className={secondaryButton} onClick={retry}>
          Try again
        </button>
      </div>
    )
  if (empty)
    return (
      <div className="px-5 py-14 text-center">
        <h2 className="font-semibold">No results found</h2>
        <p className="mt-2 text-sm text-slate-500">
          Add a new record or change the filters to see results.
        </p>
      </div>
    )
  return children
}
