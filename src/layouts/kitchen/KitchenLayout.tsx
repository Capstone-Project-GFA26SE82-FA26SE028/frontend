import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { KitchenSidebar } from './components/KitchenSidebar'
import { KitchenHeader } from './components/KitchenHeader'

export function KitchenLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const [desktop, setDesktop] = useState(
    () => matchMedia('(min-width:1024px)').matches,
  )
  const sidebar = useRef<HTMLElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const before = document.title
    document.title = 'FoodHub - Kitchen Display'
    return () => {
      document.title = before
    }
  }, [])

  useEffect(() => {
    const media = matchMedia('(min-width:1024px)')
    function change(event: MediaQueryListEvent) {
      setDesktop(event.matches)
      setOpen(false)
    }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!open) return
    const before = document.body.style.overflow
    opener.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    sidebar.current?.querySelector<HTMLElement>('a, button')?.focus()
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const controls =
        sidebar.current?.querySelectorAll<HTMLElement>('a, button')
      if (!controls?.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', keydown)
    return () => {
      document.body.style.overflow = before
      window.removeEventListener('keydown', keydown)
      opener.current?.focus()
    }
  }, [open])

  return (
    <div
      lang="en"
      className="admin-shell min-h-dvh bg-[#f2f8fa] bg-[radial-gradient(ellipse_at_top_right,#eef7fa,transparent_65%)] text-[#253754]"
    >
      <a
        href="#kitchen-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-white focus:p-4"
      >
        Skip to main content
      </a>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside
        id="kitchen-sidebar"
        ref={sidebar}
        aria-label="Kitchen sidebar"
        className={`fixed inset-y-0 left-0 z-40 h-dvh w-68 max-w-[calc(100%-3rem)] overflow-x-clip transition-[width,transform,visibility] duration-300 motion-reduce:transition-none lg:visible lg:translate-x-0 ${open ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${collapsed ? 'lg:w-18' : 'lg:w-68'}`}
      >
        <KitchenSidebar
          collapsed={collapsed}
          onNavigate={() => setOpen(false)}
        />
      </aside>
      <div
        className={`transition-[padding-left] duration-300 motion-reduce:transition-none ${collapsed ? 'lg:pl-18' : 'lg:pl-68'}`}
      >
        <KitchenHeader
          expanded={desktop ? !collapsed : open}
          onMenu={() => {
            if (desktop) setCollapsed((value) => !value)
            else {
              setCollapsed(false)
              setOpen((value) => !value)
            }
          }}
        />
        <main
          id="kitchen-main"
          tabIndex={-1}
          className="mx-auto max-w-[1760px] px-3 py-5 sm:px-5"
        >
          <Outlet />
        </main>
        <footer className="mx-5 flex flex-wrap justify-between gap-2 border-t border-slate-200/60 py-3 text-xs text-slate-400">
          <span>FoodHub · Kitchen workspace</span>
          <span>Preparation & service readiness</span>
        </footer>
      </div>
    </div>
  )
}
