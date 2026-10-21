import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import { queryClient } from './queryClient'
import { ToastContainer } from 'react-toastify'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer position="top-right" autoClose={4000} limit={3} theme="light" />
      </QueryClientProvider>
    </Provider>
  )
}
