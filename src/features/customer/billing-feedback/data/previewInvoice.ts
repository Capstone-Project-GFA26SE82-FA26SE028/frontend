import type { Invoice } from '../types'

// Fixture độc lập: không xác nhận thanh toán cho các đơn trong Redux orders.
export const previewInvoice: Invoice = {
  id: 'preview',
  code: 'MOC-MAU-001',
  tableName: 'Bàn 08 · Không gian vườn',
  issuedAt: '2026-10-17T12:30:00+07:00',
  paidAt: '2026-10-17T12:35:00+07:00',
  status: 'PAID',
  method: 'bank',
  items: [
    {
      id: 'sample-salmon',
      dishId: 'salmon',
      name: 'Cá hồi áp chảo sốt chanh',
      quantity: 2,
      unitPrice: 189000,
      note: 'Ít sốt',
      option: 'Tiêu chuẩn',
      image: '/images/menu/salmon.jpg',
    },
    {
      id: 'sample-salad',
      dishId: 'salad',
      name: 'Salad vườn Mộc',
      quantity: 1,
      unitPrice: 79000,
      note: '',
      option: 'Tiêu chuẩn',
      image: '/images/menu/salad.jpg',
    },
  ],
  subtotal: 457000,
  tax: 45700,
  serviceFee: 0,
  discount: 0,
  total: 502700,
  isPreview: true,
}
