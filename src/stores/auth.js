import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/auth.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email, password) => {
    const response = await authApi.login(email, password)
    token.value = response.token
    localStorage.setItem('auth_token', response.token)
  }

  const register = async (data) => {
    const response = await authApi.register(data)
    token.value = response.token
    localStorage.setItem('auth_token', response.token)
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('auth_token')
  }

  return { token, isAuthenticated, login, register, logout }
})
