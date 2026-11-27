import { axiosClient } from '../../../api/axiosClient'
import type { AuthResponse } from '../types/types'
import type { RestaurantValues } from '../../platform-admin/restaurants/schemas/restaurantSchema'

export type RegistrationReceipt = {
  registrationId: string
  status: 'Pending' | 'Provisioning' | 'Approved'
  restaurantId: string | null
}

export async function registerRestaurant(
  registrationId: string,
  restaurant: RestaurantValues,
  account: {
    email: string
    password: string
    fullName: string
    phoneNumber: string
  } | null,
  business: File,
  safety: File,
) {
  const form = new FormData()
  form.append('RegistrationId', registrationId)
  for (const key of [
    'restaurantName',
    'address',
    'hotline',
    'taxCode',
    'timeZone',
  ] as const) {
    form.append(key, restaurant[key])
  }
  restaurant.openingHours.forEach((hours, index) => {
    form.append(`OpeningHours[${index}].DayOfWeek`, String(hours.dayOfWeek))
    form.append(`OpeningHours[${index}].OpenAt`, hours.openAt)
    form.append(`OpeningHours[${index}].CloseAt`, hours.closeAt)
  })
  if (account) {
    for (const [key, value] of Object.entries(account)) form.append(key, value)
  }
  form.append('BusinessCertificateImage', business)
  form.append('FoodSafetyCertificateImage', safety)
  const { data } = await axiosClient.post<AuthResponse<RegistrationReceipt>>(
    '/restaurant-registrations',
    form,
    { timeout: 60_000 },
  )
  if (!data.isSuccess) throw new Error(data.message || 'Không thể gửi hồ sơ.')
  return data.result
}
