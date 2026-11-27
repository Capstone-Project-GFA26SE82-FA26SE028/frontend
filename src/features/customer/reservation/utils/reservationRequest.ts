import type { ReservationFormValues } from '../schemas/reservationSchema'

export function reservationRequest(values: ReservationFormValues) {
  return {
    restaurantId: values.restaurantId,
    requestedAreaId: null,
    contactName: values.name,
    phone: values.phone,
    partySize: values.guests,
    startAt: `${values.date}T${values.time}:00+07:00`,
  }
}
