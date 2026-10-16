import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Chỉ là bước nhập thông tin trên UI, không phải phiên đã xác thực bởi backend.
const initialState: { phone: string | null; qrContext: string } = {
  phone: null,
  qrContext: '',
}

const sessionSlice = createSlice({
  name: 'customerSession',
  initialState,
  reducers: {
    enterSession: (
      state,
      { payload }: PayloadAction<{ phone: string; qrContext: string }>,
    ) => {
      state.phone = payload.phone
      state.qrContext = payload.qrContext
    },
  },
})

export const { enterSession } = sessionSlice.actions
export default sessionSlice.reducer
