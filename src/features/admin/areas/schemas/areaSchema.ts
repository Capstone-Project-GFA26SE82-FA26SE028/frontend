import { z } from 'zod'
export const areaSchema = z.object({
  restaurantId: z.uuid('Vui lòng chọn nhà hàng.'),
  areaCode: z.string().trim().min(1, 'Vui lòng nhập mã khu vực.').max(50),
  areaName: z.string().trim().min(1, 'Vui lòng nhập tên khu vực.').max(100),
  serviceType: z.string().trim().min(1, 'Vui lòng nhập loại phục vụ.').max(50),
  spaceType: z.string().trim().min(1, 'Vui lòng nhập loại không gian.').max(50),
})
export type AreaValues = z.infer<typeof areaSchema>
