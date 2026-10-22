import { z } from 'zod'
export const areaSchema = z.object({
  restaurantId: z.uuid('Select a restaurant.'),
  areaCode: z.string().trim().min(1, 'Enter an area code.').max(50),
  areaName: z.string().trim().min(1, 'Enter an area name.').max(100),
  serviceType: z.string().trim().min(1, 'Enter a service type.').max(50),
  spaceType: z.string().trim().min(1, 'Enter a space type.').max(50),
})
export type AreaValues = z.infer<typeof areaSchema>
