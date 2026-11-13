import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLoyaltyTiers, getMember, loyaltyError } from '../api/loyaltyApi'
import type { CustomerMember } from '../types/types'

export function useLoyalty() {
  const [phone, setPhone] = useState('')
  const [member, setMember] = useState<CustomerMember | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => request.current?.abort(), [])

  const tiers = useQuery({
    queryKey: ['customer-loyalty-tiers'],
    queryFn: ({ signal }) => getLoyaltyTiers(signal),
    enabled: !!member,
    staleTime: 60000,
    retry: false,
    refetchOnWindowFocus: false,
  })

  function changePhone(value: string) {
    request.current?.abort()
    request.current = null
    setPending(false)
    setPhone(value)
    setMember(null)
    setError('')
  }

  async function lookup() {
    if (request.current) return
    if (!/^0\d{9}$/.test(phone.trim())) {
      setError('Nhập số điện thoại gồm 10 chữ số, bắt đầu bằng 0.')
      return
    }
    const controller = new AbortController()
    request.current = controller
    setError('')
    setMember(null)
    setPending(true)
    try {
      const value = await getMember(phone.trim(), controller.signal)
      if (!controller.signal.aborted) setMember(value)
    } catch (cause) {
      if (!controller.signal.aborted) setError(loyaltyError(cause))
    } finally {
      if (!controller.signal.aborted) {
        request.current = null
        setPending(false)
      }
    }
  }

  return { phone, changePhone, member, error, pending, lookup, tiers }
}
