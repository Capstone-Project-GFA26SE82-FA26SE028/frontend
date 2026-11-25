import { Link, Navigate, type RouteObject } from 'react-router-dom'
import { CategoriesPage } from '../features/manager/categories/pages/CategoriesPage'
import { ItemsPage } from '../features/manager/dishes/pages/ItemsPage'
import { ManagerOverview } from '../features/manager/dashboard/pages/ManagerOverview'
import { PricesPage } from '../features/manager/prices/pages/PricesPage'
import { StaffLayout } from '../layouts/staff/StaffLayout'
import { IngredientsPage } from '../features/manager/ingredients/pages/IngredientsPage'
import { UnitsPage } from '../features/manager/units/pages/UnitsPage'
import { RecipesPage } from '../features/manager/recipes/pages/RecipesPage'
import { FoodCostPage } from '../features/manager/food-cost/pages/FoodCostPage'
import { StockOverviewPage } from '../features/manager/stock-overview/pages/StockOverviewPage'
import { StockHistoryPage } from '../features/manager/stock-history/pages/StockHistoryPage'
import { StockVariancePage } from '../features/manager/stock-variance/pages/StockVariancePage'
import { TableMonitoringPage } from '../features/manager/table-monitoring/pages/TableMonitoringPage'
import { KitchenMonitoringPage } from '../features/manager/kitchen-monitoring/pages/KitchenMonitoringPage'
import { StaffActivityPage } from '../features/manager/staff-activity/pages/StaffActivityPage'
import { ProfilePage } from '../features/profile/pages/ProfilePage'

export const managerRoute: RouteObject = {
  path: '/manager',
  element: <StaffLayout role="manager" />,
  children: [
    { index: true, element: <ManagerOverview /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'menu', element: <Navigate to="categories" replace /> },
    { path: 'menu/categories', element: <CategoriesPage /> },
    { path: 'menu/items', element: <ItemsPage /> },
    { path: 'menu/prices', element: <PricesPage /> },
    { path: 'ingredients', element: <IngredientsPage /> },
    { path: 'units', element: <UnitsPage /> },
    { path: 'recipes', element: <RecipesPage /> },
    { path: 'food-cost', element: <FoodCostPage /> },
    { path: 'stock', element: <StockOverviewPage /> },
    { path: 'stock-history', element: <StockHistoryPage /> },
    { path: 'stock-variance', element: <StockVariancePage /> },
    { path: 'table-monitoring', element: <TableMonitoringPage /> },
    { path: 'kitchen-monitoring', element: <KitchenMonitoringPage /> },
    { path: 'staff-activity', element: <StaffActivityPage /> },
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
