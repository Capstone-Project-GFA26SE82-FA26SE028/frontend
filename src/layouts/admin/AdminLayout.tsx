import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
export type AdminOutletContext = {
  query: string
  setQuery: (value: string) => void
}
export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState({ path: '', value: '' })
  const { hash, pathname } = useLocation()
  const query = search.path === pathname ? search.value : ''
  const setQuery = (value: string) => setSearch({ path: pathname, value })
  useEffect(() => {
    if (hash)
      requestAnimationFrame(() =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ block: 'start' }),
      )
  }, [hash])
  useEffect(() => {
    const before = document.title
    const page =
      {
        '/admin/sessions': 'Phiên đăng nhập',
        '/admin/restaurants': 'Nhà hàng',
        '/admin/areas': 'Khu vực nhà hàng',
        '/admin/tables': 'Bàn',
        '/admin/tax-fees': 'VAT & phí dịch vụ',
        '/admin/payment-methods': 'Phương thức thanh toán',
        '/admin/users': 'Tài khoản người dùng',
        '/admin/activity': 'Nhật ký hoạt động',
        '/admin/roles': 'Vai trò và quyền hạn',
        '/admin/health': 'Giám sát dịch vụ',
      }[pathname] || 'Tổng quan'
    document.title = `FoodHub · ${page}`
    return () => {
      document.title = before
    }
  }, [pathname])
  return (
    <div className="admin-shell min-h-dvh bg-[#f2f8fa] bg-[radial-gradient(ellipse_at_top_right,#eef7fa,transparent_65%)] text-[#253754]">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-4"
      >
        Đến nội dung chính
      </a>
      {sidebarOpen && (
        <button
          aria-label="Đóng menu điều hướng"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}
      {/* Mobile: trượt từ trái. Desktop: luôn hiện và có thể thu gọn. */}
      <aside
        aria-label="Thanh điều hướng quản trị"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setSidebarOpen(false)
        }}
        className={`fixed inset-y-0 left-0 z-40 h-dvh w-68 max-w-[calc(100%-3rem)] overflow-x-clip transition-[width,transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:visible lg:translate-x-0 ${sidebarOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${collapsed ? 'lg:w-18' : 'lg:w-68'}`}
      >
        <AdminSidebar
          collapsed={collapsed}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>
      <div
        className={`flex min-h-dvh flex-col transition-[padding-left] duration-300 ease-out motion-reduce:transition-none ${collapsed ? 'lg:pl-18' : 'lg:pl-68'}`}
      >
        <AdminHeader
          onMenu={() => {
            if (matchMedia('(min-width:1024px)').matches) {
              setSidebarOpen(false)
              setCollapsed((v) => !v)
            } else {
              setCollapsed(false)
              setSidebarOpen((value) => !value)
            }
          }}
        />
        <main
          id="admin-main"
          className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col px-3 py-4 sm:px-5"
        >
          <Outlet context={{ query, setQuery } satisfies AdminOutletContext} />
        </main>
        <footer className="mx-5 flex flex-wrap justify-between gap-1 border-t border-slate-200/50 py-3 text-xs text-slate-500">
          <span>FoodHub · Không gian quản trị nhà hàng</span>
          {![
            '/admin/users',
            '/admin/roles',
            '/admin/sessions',
            '/admin/activity',
            '/admin/restaurants',
            '/admin/areas',
            '/admin/tables',
            '/admin/tax-fees',
          ].includes(pathname) && (
            <span>Bản xem trước · Toàn bộ số liệu là dữ liệu mẫu</span>
          )}
        </footer>
      </div>
    </div>
  )
}
