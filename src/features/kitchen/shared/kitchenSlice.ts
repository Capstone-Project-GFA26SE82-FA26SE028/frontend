import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { seedKitchen } from './data'
import { applyKitchen } from './rules'
import type { Command } from './types'
import { sessionReceived, signedOut } from '../../auth/authSlice'
const slice = createSlice({
  name: 'kitchen',
  initialState: seedKitchen(),
  reducers: {
    executeKitchen(
      state,
      action: PayloadAction<{ command: Command; now: number }>,
    ) {
      const error = applyKitchen(
        state,
        action.payload.command,
        action.payload.now,
      )
      state.feedback = {
        error: !!error,
        text: error || 'Updated in this demo session.',
      }
    },
    clearKitchenFeedback(state) {
      state.feedback = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sessionReceived, (state, { payload }) => {
      state.signedIn = payload.user.isActive && payload.user.roleId === 'kitchen'
    })
    builder.addCase(signedOut, () => seedKitchen())
  },
})
export const { executeKitchen, clearKitchenFeedback } = slice.actions
export default slice.reducer
