export const clock = (n: number) =>
  new Date(n).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
export const dateTime = (n: number) =>
  Number.isFinite(n) ? new Date(n).toLocaleString('en-US') : 'No expiry date'
export const elapsed = (start: number, now: number) =>
  `${Math.max(0, Math.floor((now - start) / 60000))} min`
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
export const matches = (value: string, query: string) =>
  normalize(value).includes(normalize(query))
