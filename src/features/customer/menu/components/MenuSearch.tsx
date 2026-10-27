import { Icon } from '../../../../components/Icon/Icon'
export function MenuSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Search dishes</span>
      <Icon
        name="search"
        className="pointer-events-none absolute top-3.5 left-4 text-muted"
      />
      <input
        type="search"
        maxLength={255}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search dishes..."
        className="field pl-11"
      />
    </label>
  )
}
