import type { FeeVersion } from '../schema'
export const mockTaxFees: FeeVersion[] = [
  {
    id: 'fee-initial',
    vat: 8,
    service: 5,
    serviceEnabled: false,
    effectiveAt: '2026-01-01T00:00:00+07:00',
  },
]
