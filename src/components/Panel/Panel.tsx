import type { ReactNode } from 'react'

// Khung nội dung dùng chung; className bổ sung khoảng cách và bố cục của từng màn.
export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={` rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_24px_#153b2503] ${className}`}
    >
      {children}
    </section>
  )
}
