import { Link, Navigate, type RouteObject } from 'react-router-dom'
import { CategoriesPage } from '../features/manager/menu-management/pages/CategoriesPage'
import { ItemsPage } from '../features/manager/menu-management/pages/ItemsPage'
import { ManagerOverview } from '../features/manager/menu-management/pages/ManagerOverview'
import { PricesPage } from '../features/manager/menu-management/pages/PricesPage'
import { ManagerLayout } from '../layouts/ManagerLayout'

export const managerRoute: RouteObject = {
  path: '/manager',
  element: <ManagerLayout />,
  children: [
    { index: true, element: <ManagerOverview /> },
    { path: 'menu', element: <Navigate to="categories" replace /> },
    { path: 'menu/categories', element: <CategoriesPage /> },
    { path: 'menu/items', element: <ItemsPage /> },
    { path: 'menu/prices', element: <PricesPage /> },
    {
      path: '*',
      element: (
        <div className="p-6">
          <h1 className="text-xl font-semibold">Page not found</h1>
          <Link to="/manager" className="mt-4 inline-block text-emerald-700">
            Back to Manager overview
          </Link>
        </div>
      ),
    },
  ],
}
