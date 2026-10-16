export const localDay = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export type ActivityDateRange = { from: string; to: string }
export const inRange = (value: string, range: ActivityDateRange) => {
  const day = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : localDay(new Date(value))
  return (
    (!range.from || day >= range.from) &&
    (!range.to || day <= range.to) &&
    !(range.from && range.to && range.from > range.to)
  )
}
