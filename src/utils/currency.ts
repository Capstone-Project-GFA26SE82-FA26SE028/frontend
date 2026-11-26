export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    value,
  )

export function formatCurrencyInput(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
