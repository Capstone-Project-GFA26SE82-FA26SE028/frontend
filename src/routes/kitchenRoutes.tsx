import { Navigate, type RouteObject } from 'react-router-dom'

export const kitchenRoute: RouteObject = {
  path: '/kitchen',
  hydrateFallbackElement: (
    <div className="p-8 text-emerald-800">Loading kitchen display…</div>
  ),
  lazy: async () => ({
    Component: (await import('../layouts/kitchen/KitchenLayout')).KitchenLayout,
  }),
  children: [
    {
      index: true,
      lazy: async () => ({
        Component: (await import('../features/kitchen/kds/pages/KdsPage'))
          .KdsPage,
      }),
    },
    { path: '*', element: <Navigate to="/kitchen" replace /> },
  ],
}
