import type {
  KitchenTask,
  MonitoredTable,
  StaffActivity,
} from '../types/operations'

// UI-only fixtures. These records are never written to the backend.
export function previewTables(): MonitoredTable[] {
  return Array.from({ length: 16 }, (_, i) => ({
    tableId: `preview-table-${i + 1}`,
    tableCode: `T${String(i + 1).padStart(2, '0')}`,
    areaId: i < 8 ? 'preview-ground' : 'preview-terrace',
    areaName: i < 8 ? 'Ground floor' : 'Terrace',
    restaurantId: 'preview-restaurant',
    cleaningStatus: i === 5 ? 'NeedsCleaning' : 'Clean',
    openSessionIds: i % 3 === 0 ? [] : [`preview-session-${i + 1}`],
  }))
}

export function previewKitchen(now: number): KitchenTask[] {
  return Array.from({ length: 18 }, (_, i) => {
    const status = ['Pending', 'Cooking', 'Ready', 'Pending', 'Cancelled'][
      i % 5
    ]
    const queued = now - (i + 3) * 60000
    return {
      taskId: `preview-task-${i + 1}`,
      orderId: `preview-order-${Math.floor(i / 3) + 1}`,
      orderNumber: `DEMO-${String(Math.floor(i / 3) + 1).padStart(3, '0')}`,
      tableId: `preview-table-${[2, 3, 5, 6, 8, 9, 11, 12, 14, 15][i % 10]}`,
      sessionId: `preview-session-${[2, 3, 5, 6, 8, 9, 11, 12, 14, 15][i % 10]}`,
      itemName: [
        'Iced Tea',
        'Grilled Chicken',
        'Tomato Pasta',
        'Orange Juice',
        'Garden Salad',
        'Beef Steak',
      ][i % 6],
      quantity: (i % 3) + 1,
      stationId: i % 3 === 0 ? 'preview-bar' : 'preview-hot',
      stationName: i % 3 === 0 ? 'Beverage Bar' : 'Hot Kitchen',
      status,
      queuedAt: new Date(queued).toISOString(),
      cookingAt:
        status === 'Cooking' || status === 'Ready'
          ? new Date(queued + 2 * 60000).toISOString()
          : '',
      readyAt:
        status === 'Ready' ? new Date(queued + 3 * 60000).toISOString() : '',
    }
  })
}

export function previewActivity(now: number): StaffActivity[] {
  return Array.from({ length: 24 }, (_, i) => ({
    auditLogId: `preview-activity-${i + 1}`,
    userId: `preview-employee-${(i % 6) + 1}`,
    employeeName: [
      'Alex Nguyen',
      'Mai Tran',
      'Sam Lee',
      'Linh Pham',
      'Chris Vo',
      'An Le',
    ][i % 6],
    action: ['OPEN_TABLE', 'MERGE_TABLE', 'CANCEL_ITEM', 'MANUAL_DISCOUNT'][
      i % 4
    ],
    tableCode: `T${String((i % 16) + 1).padStart(2, '0')}`,
    orderNumber: `DEMO-${String((i % 6) + 1).padStart(3, '0')}`,
    reason: [
      'Guests seated',
      'Guests requested adjoining tables',
      'Customer changed their order before preparation',
      'Service recovery approved within cashier limit',
    ][i % 4],
    beforeValue: [
      'No service session',
      'Two separate table sessions',
      '1 Garden Salad',
      'Order total: 200,000 VND',
    ][i % 4],
    afterValue: [
      'Service session opened',
      'Tables linked to one service session',
      'Garden Salad cancelled',
      'Discount: 10,000 VND; payable: 190,000 VND',
    ][i % 4],
    createdAt: new Date(now - i * 3600000).toISOString(),
  }))
}
