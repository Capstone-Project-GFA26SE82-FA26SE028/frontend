import type { StaffRole } from '../types/types'

export function StaffFooter({ role }: { role: StaffRole }) {
  return (
    <footer className="mx-5 flex flex-wrap justify-between gap-1 border-t border-slate-200/50 py-3 text-xs text-slate-500">
      <span>
        DineLink ·{' '}
        {role === 'platform_admin'
          ? 'Quản trị nền tảng'
          : `Không gian ${role === 'admin' ? 'quản trị' : 'quản lý'} nhà hàng`}
      </span>
      <a
        href="mailto:foodhub@gmail.com"
        className="hover:text-emerald-700 hover:underline"
      >
        dinelink@gmail.com
      </a>
    </footer>
  )
}
