export type TaxFeePolicy = {
  taxFeePolicyId: string
  version: number
  vatRate: number
  serviceRate: number
  serviceEnabled: boolean
  effectiveFrom: string
}

export type TaxFeeRequest = {
  vatRate: number
  serviceRate: number
  serviceEnabled: boolean
  effectiveFrom?: string
}

export type TaxFeePage = {
  items: TaxFeePolicy[]
  totalCount: number
  page: number
  pageSize: number
}

export type TaxFeeResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}

export type FeeVersion = {
  id: string
  version: number
  vat: number
  service: number
  serviceEnabled: boolean
  effectiveAt: string
}
