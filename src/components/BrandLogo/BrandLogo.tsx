export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={
        compact
          ? 'relative inline-block size-10 shrink-0 overflow-hidden align-middle'
          : 'inline-block h-10 w-36 shrink-0 overflow-hidden align-middle sm:h-11 sm:w-40'
      }
    >
      <img
        src="/images/dinelink-logo.png"
        alt="DineLink"
        width={2172}
        height={724}
        style={{ filter: 'brightness(0) invert(1)' }}
        className={
          compact
            ? 'absolute top-[-9px] left-[-12px] h-[58px] w-[174px] max-w-none'
            : 'h-full w-full object-cover'
        }
      />
    </span>
  )
}
