import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { Notify } from 'quasar'

const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for session-based auth
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      const status = error.response.status
      const message = (error.response.data as any)?.message || 'An error occurred'

      switch (status) {
        case 401:
          Notify.create({
            type: 'negative',
            message: 'Unauthorized. Please log in.',
            position: 'top'
          })
          break
        case 403:
          Notify.create({
            type: 'negative',
            message: message,
            position: 'top'
          })
          break
        case 404:
          Notify.create({
            type: 'negative',
            message: 'Resource not found',
            position: 'top'
          })
          break
        case 500:
          Notify.create({
            type: 'negative',
            message: 'Server error. Please try again later.',
            position: 'top'
          })
          break
        default:
          Notify.create({
            type: 'negative',
            message: message,
            position: 'top'
          })
      }
    } else if (error.request) {
      Notify.create({
        type: 'negative',
        message: 'Network error. Please check your connection.',
        position: 'top'
      })
    }

    return Promise.reject(error)
  }
)

export default api
