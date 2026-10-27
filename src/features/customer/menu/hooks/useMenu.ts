import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getMenu } from '../api/menuApi'
export function useMenu() {
  const sessionId = useAppSelector(
    (s) => s.customerSession.table?.tableSessionId,
  )
  const [search, setSearch] = useState('')
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('default')
  useEffect(() => {
    const timer = setTimeout(() => setTerm(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])
  const query = (search: string, categoryId: string) => ({
    queryKey: ['customer-menu', sessionId, { search, categoryId }],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      getMenu(sessionId!, { search, categoryId }, signal),
    enabled: !!sessionId,
    retry: false,
    staleTime: 30000,
  })
  const catalogue = useQuery(query('', ''))
  const list = useQuery(query(term, category))
  const categories = [
    ...new Map(
      (catalogue.data || []).map((d) => [
        d.categoryId,
        { id: d.categoryId, label: d.categoryName },
      ]),
    ).values(),
  ]
  const items = [...(list.data || [])]
  if (sort !== 'default')
    items.sort((a, b) =>
      a.price === null
        ? b.price === null
          ? 0
          : 1
        : b.price === null
          ? -1
          : sort === 'asc'
            ? a.price - b.price
            : b.price - a.price,
    )
  return {
    sessionId,
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    catalogue,
    list,
    categories,
    items,
  }
}
