import test from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'
import { reportTime } from '../src/features/manager/reports/utils/reportTime.ts'
import { reportPreset } from '../src/features/manager/reports/utils/reportPreset.ts'

test('minute precision inputs include seconds and the report timezone', () => {
  assert.equal(reportTime('2026-11-14T23:23'), '2026-11-14T23:23:00+07:00')
  assert.equal(reportTime('2026-11-25T23:23'), '2026-11-25T23:23:00+07:00')
  assert.equal(new Date(reportTime('2026-11-14T23:23')).toISOString(), '2026-11-14T16:23:00.000Z')
})

test('existing seconds and fractions are preserved', () => {
  assert.equal(reportTime('2026-11-14T23:23:45'), '2026-11-14T23:23:45+07:00')
  assert.equal(reportTime('2026-11-14T23:23:45.123'), '2026-11-14T23:23:45.123+07:00')
})

test('Axios query encoding preserves the plus sign in the timezone', () => {
  const from = reportTime('2026-11-14T23:23')
  const uri = axios.getUri({ url: '/reports/period', params: { from } })
  assert.equal(new URL(uri, 'http://localhost').searchParams.get('from'), from)
  assert.match(uri, /%2B07/)
})

test('quick ranges use the Vietnam calendar across UTC midnight and year boundaries', () => {
  const now = new Date('2026-12-31T18:00:00Z')
  assert.deepEqual(reportPreset('today', now), { from: '2027-01-01T00:00', to: '2027-01-02T00:00' })
  assert.deepEqual(reportPreset('7d', now), { from: '2026-12-26T00:00', to: '2027-01-02T00:00' })
  assert.deepEqual(reportPreset('month', new Date('2026-11-26T10:00:00Z')), { from: '2026-11-01T00:00', to: '2026-11-27T00:00' })
})
