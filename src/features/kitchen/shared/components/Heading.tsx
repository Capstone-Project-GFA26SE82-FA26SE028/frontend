import type { ReactNode } from 'react'
export function Heading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold tracking-widest text-emerald-700">
          MOC RESTAURANT · KITCHEN
        </p>
        <h1 className="text-[28px] font-bold text-[#101b3e]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}
