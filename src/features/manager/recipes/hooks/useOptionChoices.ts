import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useAppSelector } from '../../../../app/hooks'
import { getChoices } from '../api/catalogApi'

const optionSchema = z.object({
  optionId: z.string(),
  optionGroupId: z.string(),
  optionName: z.string(),
})
const groupSchema = z.object({
  optionGroupId: z.string(),
  optionGroupName: z.string(),
})

export function useOptionChoices(enabled: boolean) {
  const user = useAppSelector((state) => state.auth.session?.user)
  return useQuery({
    queryKey: ['manager-menu-options', `${user?.userId}:${user?.restaurantId}`, 'recipe-choices'],
    enabled,
    queryFn: async ({ signal }) => {
      const [options, groups] = await Promise.all([
        getChoices('/options', optionSchema, signal),
        getChoices('/option-groups', groupSchema, signal),
      ])
      return options.map((option) => ({
        ...option,
        groupName: groups.find((group) => group.optionGroupId === option.optionGroupId)?.optionGroupName || 'Nhóm khác',
      }))
    },
  })
}
