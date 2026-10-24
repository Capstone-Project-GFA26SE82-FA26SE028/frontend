import { Link, Navigate, type RouteObject } from 'react-router-dom'
import { CategoriesPage } from '../features/manager/menu-management/pages/CategoriesPage'
import { ItemsPage } from '../features/manager/menu-management/pages/ItemsPage'
import { ManagerOverview } from '../features/manager/menu-management/pages/ManagerOverview'
import { PricesPage } from '../features/manager/menu-management/pages/PricesPage'
import { ManagerLayout } from '../layouts/ManagerLayout'
import { IngredientsPage } from '../features/manager/ingredient-management/pages/IngredientsPage'
import { UnitsPage } from '../features/manager/ingredient-management/pages/UnitsPage'
import { RecipesPage } from '../features/manager/ingredient-management/pages/RecipesPage'
import { FoodCostPage } from '../features/manager/ingredient-management/pages/FoodCostPage'
import { StockOverviewPage } from '../features/manager/inventory-monitoring/pages/StockOverviewPage'
import { StockHistoryPage } from '../features/manager/inventory-monitoring/pages/StockHistoryPage'
import { StockVariancePage } from '../features/manager/inventory-monitoring/pages/StockVariancePage'

export const managerRoute: RouteObject = {
  path: '/manager',
  element: <ManagerLayout />,
  children: [
    { index: true, element: <ManagerOverview /> },
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
