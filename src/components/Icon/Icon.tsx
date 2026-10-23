const paths: Record<string, string> = {
  qr: 'M3 3h6v6H3V3Zm12 0h6v6h-6V3ZM3 15h6v6H3v-6Zm12 0h3v3h3v3h-6v-6ZM3 12h6m3-9v6m0 3h3m3 0h3M12 15v6',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
  ban: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM5 5l14 14',
  edit: 'm16 3 5 5M3 21l5-1L21 7a2 2 0 0 0-5-5L3 15v6Z',
  smartphone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 17h2',
  tablet: 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6 17h2',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  'eye-off': 'm3 3 18 18M10.6 5.1A12 12 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.1 4M6.1 6.1A22 22 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.9-1.9M9.9 9.9a3 3 0 0 0 4.2 4.2',
  moon: 'M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  message: 'M21 11a8 8 0 0 1-8 8H8l-5 3 1-6a8 8 0 1 1 17-5ZM8 11h.01M12 11h.01M16 11h.01',
  home: 'm3 10 9-7 9 7v11h-7v-7h-4v7H3V10Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  store:
    'M3 10v11h18V10M2 10l2-7h16l2 7M2 10q2 5 5 0 2 5 5 0 2 5 5 0 3 5 5 0M9 21v-7h6v7',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M18 4a4 4 0 0 1 0 8m1 3a4 4 0 0 1 3 4v2',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-4 10 3 3 5-6',
  chart: 'M3 3v18h18M7 16v-4m5 4V7m5 9v-6',
  coin: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-11v14',
  box: 'm3 6 9-4 9 4v12l-9 4-9-4V6Zm0 0 9 4 9-4M12 10v12M7 4l10 4',
  activity: 'M2 12h5l3-9 4 18 3-9h5',
  database:
    'M21 5c0 2-4 3-9 3S3 7 3 5s4-3 9-3 9 1 9 3Zm0 0v14c0 2-4 3-9 3s-9-1-9-3V5m0 7c0 2 4 3 9 3s9-1 9-3',
  server: 'M3 3h18v7H3V3Zm0 11h18v7H3v-7ZM7 6h1m-1 11h1',
  mail: 'M3 4h18v16H3V4Zm0 0 9 9 9-9',
  clipboard: 'M9 4H5v18h14V4h-4M9 2h6v5H9V2Zm-1 10h8m-8 5h5',
  download: 'M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5',
  chevron: 'm9 5 7 7-7 7',
  monitor: 'M3 3h18v13H3V3Zm5 18h8m-4-5v5',
  settings: 'M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6',
  ticket: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Zm12 3v2m0 4v2',
  crown: 'm3 6 5 5 4-8 4 8 5-5-2 13H5L3 6Zm2 16h14',
  leaf: 'M20 4C10 2 3 7 5 14c2 7 13 7 15-10ZM4 21 15 10',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  bag: 'M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  service: 'M3 17h18M5 17a7 7 0 0 1 14 0M12 8V5m-2 0h4M2 21h20',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  close: 'm6 6 12 12M6 18 18 6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
  receipt: 'M5 3h14v19l-3-2-4 2-4-2-3 2V3Zm4 5h6m-6 4h6m-6 4h4',
  calendar: 'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Zm2-3v6m10-6v6M3 11h18',
  check: 'm5 12 4 4L19 6',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  fire: 'M12 2c1 6 7 7 7 13a7 7 0 0 1-14 0c0-4 3-6 4-8 0 3 2 4 2 4s3-4 1-9Z',
  utensils: 'M4 3v6a3 3 0 0 0 6 0V3M7 3v19M18 3c-4 4-4 10 0 10h2M20 3v19',
  cup: 'M4 5h13v9a6.5 6.5 0 0 1-13 0V5Zm13 1h2a3 3 0 0 1 0 6h-2M3 22h15',
}
export function Icon({
  name,
  className = '',
  size = 20,
}: {
  name: string
  className?: string
  size?: number
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d={paths[name] || paths.leaf} />
    </svg>
  )
}
