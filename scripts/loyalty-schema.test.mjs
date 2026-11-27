import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { z } from 'zod'
import { tierSchema } from '../src/features/manager/loyalty/schemas/loyaltySchema.ts'

const tier = {
  loyaltyTierId: '30000000-0000-0000-0000-000000000001',
  loyaltyTierCode: 'BRONZE',
  loyaltyTierName: 'Thành viên Đồng',
  requiredSpend: 0,
  discountPercent: 0,
}

test('accepts all .NET Guid tier IDs from the backend seed', () => {
  const seed = readFileSync(new URL('../../backend/docker/sql/seed/CustomerDb.sql', import.meta.url), 'utf8')
  const ids = [...seed.matchAll(/\(N'([^']+)', N'(BRONZE|SILVER|GOLD|DIAMOND)'/g)].map((match) => match[1])
  assert.equal(ids.length, 4)
  assert.equal(z.string().uuid().safeParse(ids[0]).success, false)
  assert.equal(z.array(tierSchema).parse(ids.map((loyaltyTierId) => ({ ...tier, loyaltyTierId }))).length, 4)
})

test('accepts a newly generated UUID and rejects malformed IDs', () => {
  assert.equal(tierSchema.safeParse({ ...tier, loyaltyTierId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }).success, true)
  for (const loyaltyTierId of ['', 'invalid', '30000000-0000-0000-0000-00000000000Z']) {
    assert.equal(tierSchema.safeParse({ ...tier, loyaltyTierId }).success, false)
  }
})

test('still rejects invalid thresholds and discount percentages', () => {
  for (const values of [{ requiredSpend: -1 }, { requiredSpend: Infinity }, { discountPercent: -1 }, { discountPercent: 101 }]) {
    assert.equal(tierSchema.safeParse({ ...tier, ...values }).success, false)
  }
})
