// datetime-local omits seconds when they are zero; the report API requires them.
export function reportTime(value: string) {
  return `${value.length === 16 ? `${value}:00` : value}+07:00`
}
