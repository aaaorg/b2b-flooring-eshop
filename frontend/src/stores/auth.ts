import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type User, type LoginCredentials, type RegisterData } from '@/services/auth.service'
import { Notify } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const isApproved = computed(() => user.value?.isApproved === true)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      user.value = response.user

      Notify.create({
        type: 'positive',
        message: response.message || 'Login successful',
        position: 'top'
      })

      return true
    } catch (error: any) {
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    try {
      const response = await authService.register(data)

      Notify.create({
        type: 'info',
        message: response.message || 'Registration successful. Waiting for approval.',
        position: 'top',
        timeout: 5000
      })

      return true
    } catch (error: any) {
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    loading.value = true
    try {
      const response = await authService.getMe()
      user.value = response.user
      return true
    } catch (error) {
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
      user.value = null

      Notify.create({
        type: 'positive',
        message: 'Logged out successfully',
        position: 'top'
      })

      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    isApproved,
    login,
    register,
    fetchUser,
    logout
  }
})
