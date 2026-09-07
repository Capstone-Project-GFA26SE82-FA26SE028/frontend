import axios from 'axios'

// Configure authentication after agreeing on the backend contract.
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})
