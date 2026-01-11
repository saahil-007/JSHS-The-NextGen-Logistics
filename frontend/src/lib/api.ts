import axios, { AxiosError } from 'axios'
import { handleApiError } from '../utils/errorHandler'

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // If on Render or production domain, strip subdomains to find the API
    if (hostname.includes('.onrender.com') || hostname.includes('.railway.app') || hostname.includes('.jshs.app')) {
      const baseDomain = hostname.replace(/^(manager|driver)\./, '')
      return `https://${baseDomain}/api`
    }
  }

  return 'http://localhost:4000/api'
}

export const API_URL = getApiUrl()

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    throw handleApiError(error);
  }
)
