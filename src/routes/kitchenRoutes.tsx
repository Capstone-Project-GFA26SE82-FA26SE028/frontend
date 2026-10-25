import { Link, Navigate, type RouteObject } from 'react-router-dom'
import { KitchenLayout } from '../layouts/KitchenLayout'
import { KitchenPage } from '../features/kitchen/pages/KitchenPage'

export const kitchenRoute: RouteObject = {
  path: '/kitchen',
  element: <KitchenLayout />,
  children: [
    { index: true, element: <Navigate to="kds" replace /> },
    { path: 'kds', element: <KitchenPage /> },
    {
      path: '*',
      element: (
        <div className="p-6">
          <h1 className="text-xl font-semibold">Page not found</h1>
          <Link
            to="/kitchen/kds"
            className="mt-4 inline-block text-emerald-700"
          >
            Back to KDS
          </Link>
        </div>
      ),
    },
  ],
}
