export type ReportPreset = 'today' | '7d' | 'month' | 'year'

export function reportPreset(preset: ReportPreset, now = new Date()) {
  const local = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  const day = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate())
  const start = preset === 'month'
    ? Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1)
    : preset === 'year'
      ? Date.UTC(local.getUTCFullYear(), 0, 1)
      : preset === '7d' ? day - 6 * 86400000 : day
  return {
    from: new Date(start).toISOString().slice(0, 16),
    to: new Date(day + 86400000).toISOString().slice(0, 16),
  }
}
