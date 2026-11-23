import { CashierLayout } from '../layouts/cashier/CashierLayout'
import { CashShiftPage } from '../features/cashier/shifts/pages/CashShiftPage'
import { TableBillingPage } from '../features/cashier/table-billing/pages/TableBillingPage'

export const cashierRoute = {
  path: '/cashier',
  element: <CashierLayout />,
  children: [
    { index: true, element: <CashShiftPage /> },
    { path: 'table-billing', element: <TableBillingPage /> },
  ],
}
