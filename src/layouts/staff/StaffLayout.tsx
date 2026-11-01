import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { StaffSidebar } from './components/StaffSidebar'
import { StaffHeader } from './components/StaffHeader'
import { StaffFooter } from './components/StaffFooter'
import { adminNavigation } from './navigation/adminNavigation'
import { managerNavigation } from './navigation/managerNavigation'
import type { StaffRole } from './types/types'

export function StaffLayout({ role }: { role: StaffRole }) {
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { hash, pathname } = useLocation()
  const groups = role === 'admin' ? adminNavigation : managerNavigation
  const homePath = `/${role}`
  const workspaceTitle =
    role === 'admin' ? 'Quản trị nhà hàng' : 'Quản lý nhà hàng'
  const roleLabel =
    role === 'admin' ? 'Quản trị viên nhà hàng' : 'Quản lý nhà hàng'
  const currentItem = groups
    .flatMap((group) => group.items)
    .find((item) => item.to === pathname)
  const pageName =
    pathname === `${homePath}/profile`
      ? 'Hồ sơ cá nhân'
      : currentItem?.label || 'Tổng quan'
  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ block: 'start' }),
    )
    return () => cancelAnimationFrame(frame)
  }, [hash])
  useEffect(() => {
    const before = document.title
    document.title = `FoodHub · ${pageName}`
    return () => {
      document.title = before
    }
  }, [pageName])
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  return (
    <div
      lang="vi"
      className="admin-shell min-h-dvh bg-[#f2f8fa] bg-[radial-gradient(ellipse_at_top_right,#eef7fa,transparent_65%)] text-[#253754]"
    >
      <a
        href="#staff-main"
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
      <aside
        aria-label="Thanh điều hướng nhân viên"
        className={`fixed inset-y-0 left-0 z-40 h-dvh w-68 max-w-[calc(100%-3rem)] overflow-x-clip transition-[width,transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:visible lg:translate-x-0 ${sidebarOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${collapsed ? 'lg:w-18' : 'lg:w-68'}`}
      >
        <StaffSidebar
          groups={groups}
          homePath={homePath}
          roleLabel={roleLabel}
          collapsed={collapsed}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>
      <div
        className={`flex min-h-dvh flex-col transition-[padding-left] duration-300 ease-out motion-reduce:transition-none ${collapsed ? 'lg:pl-18' : 'lg:pl-68'}`}
      >
        <StaffHeader
          homePath={homePath}
          workspaceTitle={workspaceTitle}
          pageName={pageName}
          profilePath={`${homePath}/profile`}
          onMenu={() => {
            if (matchMedia('(min-width:1024px)').matches) {
              setSidebarOpen(false)
              setCollapsed((value) => !value)
            } else {
              setCollapsed(false)
              setSidebarOpen((value) => !value)
            }
          }}
        />
        <main
          id="staff-main"
          className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col px-3 py-4 sm:px-5"
        >
          <Outlet />
        </main>
        <StaffFooter role={role} />
      </div>
    </div>
  )
}
