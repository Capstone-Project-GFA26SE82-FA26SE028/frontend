import { NavLink, Outlet } from 'react-router-dom'

export function CustomerLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header className="site-header">
        <NavLink className="brand" to="/menu">
          Smart Restaurant
        </NavLink>
        <nav aria-label="Điều hướng khách hàng">
          <NavLink to="/menu">Thực đơn</NavLink>
          <NavLink to="/cart">Giỏ hàng</NavLink>
        </nav>
      </header>
      <main id="main-content" className="container">
        <Outlet />
      </main>
    </>
  )
}
