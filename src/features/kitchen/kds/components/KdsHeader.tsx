import { Icon } from '../../../../components/Icon/Icon'
import { clock } from '../utils/format'

export function KdsHeader({
  now,
  focus,
  onToggleFocus,
}: {
  now: number
  focus: boolean
  onToggleFocus: () => void
}) {
  return (
    <>
      <div className="mb-6 flex flex-col items-center gap-5">
        <div className="flex w-full flex-wrap items-center justify-end gap-6">
          <div className="grid gap-0.5 text-left md:text-right [&>strong]:text-[23px] [&>strong]:leading-none [&>strong]:tracking-[-1px] [&>strong]:tabular-nums md:[&>strong]:text-[27px] [&>span]:text-sm [&>span]:text-[#475569]">
            <strong>{clock(now)}</strong>
            <span>
              {new Date(now).toLocaleDateString('en-US', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          </div>
          <button
            className="flex items-center gap-2 rounded-[9px] border border-[#d7e2dc] bg-white px-[13px] py-[11px] text-sm font-semibold whitespace-nowrap hover:bg-[#e6f1eb] motion-safe:transition-colors motion-safe:duration-150 min-[1251px]:text-sm"
            onClick={onToggleFocus}
            aria-pressed={focus}
          >
            <Icon name={focus ? 'close' : 'monitor'} size={18} />
            {focus ? 'Thoát chế độ tập trung' : 'Chế độ tập trung'}
          </button>
        </div>
      </div>
    </>
  )
}
