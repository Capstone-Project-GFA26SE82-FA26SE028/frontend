import test from 'node:test'
import assert from 'node:assert/strict'
import { reservationRequest } from '../src/features/customer/reservation/utils/reservationRequest.ts'
import { reservationSchema } from '../src/features/customer/reservation/schemas/reservationSchema.ts'

const values = {
  restaurantId: '20000000-0000-0000-0000-000000000001',
  name: 'Khách kiểm tra', phone: '0901234567', guests: 2,
  date: '2099-01-02', time: '18:30',
}

test('request uses the gateway contract with seconds and Vietnam offset', () => {
  assert.deepEqual(reservationRequest(values), {
    restaurantId: values.restaurantId, requestedAreaId: null,
    contactName: values.name, phone: values.phone, partySize: 2,
    startAt: '2099-01-02T18:30:00+07:00',
  })
})

test('reservation accepts no area and still requires a restaurant and future Vietnam time', () => {
  const originalNow = Date.now
  Date.now = () => Date.parse('2099-01-02T17:00:00+07:00')
  try {
    assert.equal(reservationSchema.safeParse(values).success, true)
    assert.equal(reservationSchema.safeParse({ ...values, restaurantId: '' }).success, false)
    assert.equal(reservationSchema.safeParse({ ...values, time: '17:10' }).success, false)
    assert.equal(reservationSchema.safeParse({ ...values, date: '2099-02-30' }).success, false)
  } finally {
    Date.now = originalNow
  }
})
