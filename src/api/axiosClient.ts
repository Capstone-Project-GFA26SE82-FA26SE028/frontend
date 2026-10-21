import axios from 'axios'

// Auth interceptors are registered in features/auth/api/authApi.ts.
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})
