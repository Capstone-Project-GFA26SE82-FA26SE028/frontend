import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { Icon } from '../../components/Icon/Icon'
import { LogoutButton } from '../../features/auth/components/LogoutButton'

const links = [
  { path: 'categories', label: 'Danh mục', icon: 'grid' },
  { path: 'items', label: 'Món ăn', icon: 'utensils' },
  { path: 'prices', label: 'Giá bán', icon: 'coin' },
]
const ingredientLinks = [
  { path: 'ingredients', label: 'Nguyên liệu', icon: 'leaf' },
  { path: 'units', label: 'Đơn vị và quy đổi', icon: 'settings' },
  { path: 'recipes', label: 'Công thức và định mức', icon: 'clipboard' },
  { path: 'food-cost', label: 'Giá vốn món ăn', icon: 'chart' },
]
const inventoryLinks = [
  { path: 'stock', label: 'Tổng quan tồn kho', icon: 'box' },
  { path: 'stock-history', label: 'Biến động và lô hàng', icon: 'clipboard' },
  { path: 'stock-variance', label: 'Tiêu hao và chênh lệch', icon: 'activity' },
]
const operationsLinks = [
  { path: 'table-monitoring', label: 'Trạng thái bàn', icon: 'utensils' },
  { path: 'kitchen-monitoring', label: 'Tiến độ bếp', icon: 'fire' },
  { path: 'staff-activity', label: 'Hoạt động nhân viên', icon: 'users' },
]
export function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const [account, setAccount] = useState(false)
  const user = useAppSelector((s) => s.auth.session?.user)
  const name = user?.fullName || user?.userName || 'Quản lý'
  const { pathname } = useLocation()
  const page =
    [...links, ...ingredientLinks, ...inventoryLinks, ...operationsLinks].find(
      (link) => pathname.endsWith(`/${link.path}`),
    )?.label || 'Tổng quan'
  useEffect(() => {
    const before = document.title
    document.title = `FoodHub · ${page}`
    return () => {
      document.title = before
    }
  }, [page])
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        setAccount(false)
      }
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [])
  return (
    <div
      lang="vi"
      className="admin-shell min-h-dvh bg-[#f2f8fa] bg-[radial-gradient(ellipse_at_top_right,#eef7fa,transparent_65%)] text-[#253754]"
    >
      <a
        href="#manager-main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4"
      >
        Đến nội dung chính
      </a>
      {open && (
        <button
          aria-label="Đóng điều hướng"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside
        aria-label="Điều hướng quản lý"
        className={`fixed inset-y-0 left-0 z-40 h-dvh w-68 max-w-[calc(100%-3rem)] transition-[width,transform,visibility] duration-300 lg:visible lg:translate-x-0 ${open ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${collapsed ? 'lg:w-18' : 'lg:w-68'}`}
      >
        <div className="flex h-full flex-col bg-linear-to-br from-[#00382b] via-[#00382d] to-[#002e28] text-white">
          <Link
            to="/manager"
            onClick={() => setOpen(false)}
            className={`flex min-h-[76px] items-center gap-3 ${collapsed ? 'justify-center' : 'px-6'}`}
            aria-label="FoodHub - Quản lý"
          >
            <span className="flex size-10 shrink-0 rotate-[-15deg] items-center justify-center rounded-[40%] border-2 border-lime-300/60 bg-linear-to-br from-lime-400 to-emerald-600 text-[#004c32]">
              <Icon name="leaf" size={29} />
            </span>
            {!collapsed && (
              <div>
                <span className="text-[23px] font-bold tracking-tight">
                  FoodHub
                </span>
                <p className="text-xs text-white/70">
                  Nền tảng quản lý nhà hàng
                </p>
              </div>
            )}
          </Link>
          <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <NavLink
              end
              to="/manager"
              onClick={() => setOpen(false)}
              title="Tổng quan"
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/15 text-lime-200' : 'text-white/75 hover:bg-white/10'}`
              }
            >
              <Icon name="home" />
              {!collapsed && 'Tổng quan'}
            </NavLink>
            <div>
              {!collapsed && (
                <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-white/55">
                  Thực đơn và giá bán
                </p>
              )}
              <div className="space-y-1">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={`/manager/menu/${link.path}`}
                    onClick={() => setOpen(false)}
                    title={link.label}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/15 text-lime-200' : 'text-white/75 hover:bg-white/10'}`
                    }
                  >
                    <Icon name={link.icon} />
                    {!collapsed && link.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div>
              {!collapsed && (
                <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-white/55">
                  Nguyên liệu và giá vốn
                </p>
              )}
              <div className="space-y-1">
                {ingredientLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={`/manager/${link.path}`}
                    onClick={() => setOpen(false)}
                    title={link.label}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/15 text-lime-200' : 'text-white/75 hover:bg-white/10'}`
                    }
                  >
                    <Icon name={link.icon} />
                    {!collapsed && link.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div>
              {!collapsed && (
                <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-white/55">
                  Theo dõi kho
                </p>
              )}
              <div className="space-y-1">
                {inventoryLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={`/manager/${link.path}`}
                    onClick={() => setOpen(false)}
                    title={link.label}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/15 text-lime-200' : 'text-white/75 hover:bg-white/10'}`
                    }
                  >
                    <Icon name={link.icon} />
                    {!collapsed && link.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div>
              {!collapsed && (
                <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-white/55">
                  Theo dõi vận hành
                </p>
              )}
              <div className="space-y-1">
                {operationsLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={`/manager/${link.path}`}
                    onClick={() => setOpen(false)}
                    title={link.label}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/15 text-lime-200' : 'text-white/75 hover:bg-white/10'}`
                    }
                  >
                    <Icon name={link.icon} />
                    {!collapsed && link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
          <div
            className={`flex min-h-[92px] items-center gap-3 border-t border-white/10 ${collapsed ? 'justify-center' : 'px-5'}`}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-lg font-semibold text-emerald-100">
              {name.slice(0, 1).toUpperCase()}
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-semibold">{name}</p>
                <p className="mt-1 text-sm text-emerald-100/65">
                  Quản lý nhà hàng
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <div
        className={`transition-[padding-left] duration-300 ${collapsed ? 'lg:pl-18' : 'lg:pl-68'}`}
      >
        <header className="sticky top-0 z-20 flex min-h-[68px] items-center gap-3 border-b border-slate-100 bg-white px-3 sm:px-5">
          <button
            aria-label="Mở / thu gọn điều hướng"
            aria-expanded={open || !collapsed}
            onClick={() => {
              if (matchMedia('(min-width:1024px)').matches)
                setCollapsed(!collapsed)
              else {
                setCollapsed(false)
                setOpen(!open)
              }
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50"
          >
            <Icon name="menu" />
          </button>
          <div className="min-w-0 flex-1">
            <nav
              aria-label="Đường dẫn điều hướng"
              className="flex items-center gap-1.5 text-sm"
            >
              <Link to="/manager" className="text-slate-400">
                FoodHub
              </Link>
              <Icon name="chevron" size={12} />
              <span aria-current="page" className="truncate text-emerald-700">
                {page}
              </span>
            </nav>
            <p className="text-base font-semibold">Quản lý nhà hàng</p>
          </div>
          <div
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setAccount(false)
            }}
          >
            <button
              aria-label="Tài khoản quản lý"
              aria-expanded={account}
              onClick={() => setAccount(!account)}
              className="flex min-h-11 items-center gap-2 rounded-xl px-2 hover:bg-slate-50"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
                {name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-44 truncate font-semibold sm:block">
                {name}
              </span>
              <Icon name="chevron" size={14} className="rotate-90" />
            </button>
            {account && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
                <p className="px-2 font-semibold">{name}</p>
                <p className="mb-3 break-words px-2 text-sm text-slate-500">
                  {user?.email}
                </p>
                <LogoutButton />
              </div>
            )}
          </div>
        </header>
        <main
          id="manager-main"
          className="mx-auto max-w-[1760px] px-3 py-5 sm:px-5"
        >
          <Outlet />
        </main>
        <footer className="mx-5 border-t border-slate-200/50 py-3 text-xs text-slate-500">
          FoodHub · Không gian quản lý nhà hàng
        </footer>
      </div>
    </div>
  )
}
