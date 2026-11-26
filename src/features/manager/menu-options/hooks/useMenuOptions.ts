import { useState, type FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listMenuOptions, writeMenuOption } from '../api/menuOptionApi'
import { itemChoiceSchema, optionRowSchema } from '../schemas/menuOptionSchema'
import type { Mode, Row, OptionDialog } from '../types/menuOption'
export function useMenuOptions(scope: string) {
  const [mode, setMode] = useState<Mode>('groups')
  const [itemId, setItemId] = useState('')
  const [dialog, setDialog] = useState<OptionDialog>()
  const client = useQueryClient()
  const key = ['manager-menu-options', scope]
  const groups = useQuery({
    queryKey: [...key, 'groups'],
    queryFn: ({ signal }) =>
      listMenuOptions('/option-groups', optionRowSchema, signal),
  })
  const items = useQuery({
    queryKey: [...key, 'items'],
    enabled: mode === 'links',
    queryFn: ({ signal }) =>
      listMenuOptions('/items', itemChoiceSchema, signal),
  })
  const path =
    mode === 'options' ? '/options' : `/items/${itemId}/option-groups`
  const records = useQuery({
    queryKey: [...key, path],
    enabled: mode === 'options' || (mode === 'links' && !!itemId),
    queryFn: ({ signal }) => listMenuOptions(path, optionRowSchema, signal),
  })
  const source = mode === 'groups' ? groups : records
  const base = mode === 'groups' ? '/option-groups' : path
  const mutation = useMutation({
    mutationFn: writeMenuOption,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key })
      setDialog(undefined)
    },
  })
  const id = (row: Row) =>
    mode === 'options' ? row.optionId : row.optionGroupId
  const groupName = (row: Row) =>
    row.optionGroupName ||
    groups.data?.find((group) => group.optionGroupId === row.optionGroupId)
      ?.optionGroupName
  const name = (row: Row) => row.optionName || groupName(row) || 'Nhóm tùy chọn'
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const read = (field: string) => String(fields.get(field) || '').trim()
    const row = dialog?.row
    const body =
      mode === 'groups'
        ? { optionGroupName: read('name') }
        : mode === 'options'
          ? {
              optionName: read('name'),
              extraPrice: Number(read('price')),
              ...(!row && { optionGroupId: read('group') }),
            }
          : {
              minSelection: Number(read('min')),
              maxSelection: Number(read('max')),
              ...(!row && { optionGroupId: read('group') }),
            }
    mutation.mutate({
      method: row ? 'put' : 'post',
      url: row ? base + '/' + id(row) : base,
      body,
    })
  }
  function open(action: 'save' | 'delete', row?: Row) {
    mutation.reset()
    setDialog({ action, row })
  }
  const showList = mode !== 'links' || !!itemId
  return {
    mode,
    setMode,
    itemId,
    setItemId,
    dialog,
    setDialog,
    groups,
    items,
    records,
    source,
    base,
    mutation,
    id,
    groupName,
    name,
    submit,
    open,
    showList,
  }
}
