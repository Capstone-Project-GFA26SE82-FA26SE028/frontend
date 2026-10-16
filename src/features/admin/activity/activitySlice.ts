import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuditEntry } from './types'
import { saveUser } from '../users/usersSlice'
const slice = createSlice({
  name: 'admin',
  initialState: [] as AuditEntry[],
  reducers: {
    addSetupAudit(state, { payload }: PayloadAction<AuditEntry>) {
      state.unshift(payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveUser, (state, { payload }) => {
      state.unshift({
        ...payload.audit,
        targetId: payload.user.id,
        entity: 'user',
      })
    })
  },
})
export const { addSetupAudit } = slice.actions
export default slice.reducer
