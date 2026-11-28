import { CashierLayout } from '../layouts/cashier/CashierLayout'
import { CashShiftPage } from '../features/cashier/shifts/pages/CashShiftPage'
import { TableBillingPage } from '../features/cashier/table-billing/pages/TableBillingPage'
import { TakeawayOrdersPage } from '../features/cashier/takeaway-orders/pages/TakeawayOrdersPage'

export const cashierRoute = {
  path: '/cashier',
  element: <CashierLayout />,
  children: [
    { index: true, element: <CashShiftPage /> },
    { path: 'table-billing', element: <TableBillingPage /> },
    { path: 'takeaway-orders', element: <TakeawayOrdersPage /> },
  ],
}
