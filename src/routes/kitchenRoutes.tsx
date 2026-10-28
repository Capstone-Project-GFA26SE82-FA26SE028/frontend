import { Link, type RouteObject } from 'react-router-dom'
export const kitchenRoute: RouteObject = {
  path: '/kitchen',
  hydrateFallbackElement: (
    <div className="p-8 text-emerald-800">Loading kitchen workspace…</div>
  ),
  lazy: async () => ({
    Component: (await import('../layouts/kitchen/KitchenLayout')).KitchenLayout,
  }),
  children: [
    {
      path: 'kds',
      lazy: async () => ({
        Component: (await import('../features/kitchen/kds/pages/KdsPage'))
          .KdsPage,
      }),
    },
    {
      index: true,
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/dashboard/pages/DashboardPage')
        ).KitchenDashboardPage,
      }),
    },
    {
      path: 'queue',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/order-queue/pages/QueuePage')
        ).QueuePage,
      }),
    },
    {
      path: 'cooking',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/cooking/pages/CookingPage')
        ).CookingPage,
      }),
    },
    {
      path: 'ready',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/ready-orders/pages/ReadyPage')
        ).ReadyPage,
      }),
    },
    {
      path: 'menu',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/unavailable-dishes/pages/AvailabilityPage')
        ).AvailabilityPage,
      }),
    },
    {
      path: 'ingredients',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/inventory/pages/IngredientsPage')
        ).KitchenIngredientsPage,
      }),
    },
    {
      path: 'recipes',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/recipes/pages/RecipesPage')
        ).KitchenRecipesPage,
      }),
    },
    {
      path: 'notifications',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/notifications/pages/NotificationsPage')
        ).KitchenNotificationsPage,
      }),
    },
    {
      path: 'history',
      lazy: async () => ({
        Component: (
          await import('../features/kitchen/history/pages/HistoryPage')
        ).KitchenHistoryPage,
      }),
    },
    {
      path: '*',
      element: (
        <div className="p-8">
          <h1 className="text-xl font-bold">Kitchen page not found</h1>
          <Link className="mgr-secondary mt-4" to="/kitchen">
            Back to dashboard
          </Link>
        </div>
      ),
    },
  ],
}
