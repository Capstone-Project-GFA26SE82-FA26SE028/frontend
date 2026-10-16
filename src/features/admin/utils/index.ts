export const matches = (query: string, ...values: string[]) => {
  const clean = (v: string) =>
    v
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
  return clean(values.join(' ')).includes(clean(query.trim()))
}
export const dateTime = (date: string) =>
  new Date(date).toLocaleString('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
export function downloadCsv(
  name: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const cell = (value: string | number) =>
    '"' +
    String(value)
      .replace(/^[=+@-]/, "'$&")
      .replaceAll('"', '""') +
    '"'
  const url = URL.createObjectURL(
    new Blob(
      [
        '\uFEFF' +
          [headers, ...rows].map((r) => r.map(cell).join(',')).join('\r\n'),
      ],
      { type: 'text/csv;charset=utf-8;' },
    ),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.csv`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
