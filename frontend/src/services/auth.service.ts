import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  phone?: string
  companyName: string
}

export interface User {
  id: number
  email: string
  fullName: string
  role: string
  isApproved: boolean
  company: {
    id: number
    name: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/login', credentials)
    return response.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/register', data)
    return response.data
  },

  async getMe() {
    const response = await api.get('/me')
    return response.data
  },

  async logout() {
    const response = await api.post('/logout')
    return response.data
  }
}
