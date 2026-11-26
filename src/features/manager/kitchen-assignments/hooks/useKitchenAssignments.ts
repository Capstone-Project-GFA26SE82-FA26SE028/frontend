import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { assignmentApi } from '../api/assignmentApi'
import { ASSIGNMENT_KEY } from '../constants/assignment'
import { assignmentDenied } from '../utils/assignment'

export function useKitchenAssignments(onSaved: () => void) {
  const user = useAppSelector((s) => s.auth.session?.user)
  const client = useQueryClient()
  const key = [...ASSIGNMENT_KEY, user?.userId, user?.restaurantId]
  const policy = {
    enabled: user?.roleId === 'manager' && !!user.restaurantId,
    retry: (count: number, error: unknown) =>
      !assignmentDenied(error) && count < 1,
    retryOnMount: false,
    refetchOnWindowFocus: (query: { state: { error: unknown } }) =>
      !assignmentDenied(query.state.error),
    refetchOnReconnect: (query: { state: { error: unknown } }) =>
      !assignmentDenied(query.state.error),
  }
  const stations = useQuery({
    ...policy,
    queryKey: [...key, 'stations'],
    queryFn: ({ signal }) => assignmentApi.stations(signal),
  })
  const assignments = useQuery({
    ...policy,
    queryKey: [...key, 'assignments'],
    queryFn: ({ signal }) => assignmentApi.assignments(signal),
  })
  const employees = useQuery({
    ...policy,
    queryKey: [...key, 'employees'],
    queryFn: ({ signal }) => assignmentApi.employees(signal),
  })
  const refresh = async () => {
    await client.cancelQueries({ queryKey: key })
    await client.invalidateQueries({ queryKey: key })
  }
  const mutation = useMutation({
    mutationFn: assignmentApi.write,
    onSuccess: async () => {
      await refresh()
      onSaved()
    },
    onError: async () => {
      await refresh()
    },
  })
  return {
    stations,
    assignments,
    employees,
    mutation,
    refresh,
    enabled: policy.enabled,
  }
}
