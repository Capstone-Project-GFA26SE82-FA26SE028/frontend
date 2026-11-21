import { CashierLayout } from '../layouts/cashier/CashierLayout'
import { CashShiftPage } from '../features/cashier/shifts/pages/CashShiftPage'

export const cashierRoute = {
  path: '/cashier',
  element: <CashierLayout />,
  children: [{ index: true, element: <CashShiftPage /> }],
}
