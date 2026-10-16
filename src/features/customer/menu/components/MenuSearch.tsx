import { Icon } from '../../../../components/Icon/Icon'

type MenuSearchProps = { value: string; onChange: (value: string) => void }

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Tìm món ăn</span>
      <Icon name="search" className="absolute top-3.5 left-4 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm món bạn yêu thích..."
        className="field pl-11"
      />
    </label>
  )
}
