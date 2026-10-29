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
        <ToastContainer
          position="top-right"
          autoClose={1000}
          limit={3}
          theme="light"
          hideProgressBar
          style={{
            width: 'min(260px, calc(100vw - 24px))',
            top: 'max(12px, env(safe-area-inset-top))',
            right: 12,
            left: 'auto',
            transform: 'none',
          }}
          toastStyle={{
            width: '100%',
            minHeight: 48,
            borderRadius: 10,
            padding: '12px 28px 12px 12px',
            fontSize: 14,
          }}
        />
      </QueryClientProvider>
    </Provider>
  )
}
