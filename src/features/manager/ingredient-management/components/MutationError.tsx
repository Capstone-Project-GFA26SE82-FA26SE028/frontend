import { catalogError } from '../../menu-management/api/catalogApi'

export function MutationError({ error }: { error: unknown }) {
  if (!error) return null

  return (
    <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
      {catalogError(error)}
    </p>
  )
}
