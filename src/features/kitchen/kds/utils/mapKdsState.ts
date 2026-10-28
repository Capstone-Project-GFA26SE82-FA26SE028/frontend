import type { KitchenTask, KitchenItem, KdsState, Dish, Status } from '../types'

type Input = {
  signedIn: boolean
  area: string
  tasks: KitchenTask[]
  items: KitchenItem[]
  feedback: KdsState['feedback']
}

export function mapKdsState({
  signedIn,
  area,
  tasks,
  items,
  feedback,
}: Input): KdsState {
  const dishes: Dish[] = items.map((item) => ({
    id: item.itemId,
    name: item.itemName,
    area,
    image: item.imageUrl || '/images/menu-placeholder.svg',
  }))

  // Catalog failures must not hide orders or break their dish cards.
  for (const task of tasks) {
    if (!dishes.some((dish) => dish.id === task.itemId)) {
      dishes.push({
        id: task.itemId,
        name: task.nameSnapshot,
        area,
        image: '/images/menu-placeholder.svg',
      })
    }
  }

  const tickets = tasks
    .filter((task) =>
      ['Pending', 'Cooking', 'Ready', 'Hold', 'Served', 'Cancelled'].includes(
        task.status,
      ),
    )
    .map((task) => ({
      id: task.kitchenTaskId,
      order: task.orderNumber,
      dishId: task.itemId,
      quantity: task.quantity,
      note: [
        task.note,
        ...task.options.map(
          (option) => `${option.quantity} \u00d7 ${option.name}`,
        ),
      ]
        .filter(Boolean)
        .join('\n'),
      vip: task.priority > 0,
      created: Date.parse(task.queuedAt),
      status: task.status as Status,
      started: task.cookingAt ? Date.parse(task.cookingAt) : undefined,
      finished: task.readyAt ? Date.parse(task.readyAt) : undefined,
    }))

  return { signedIn, area, dishes, tickets, feedback }
}
