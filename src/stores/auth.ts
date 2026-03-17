import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { MemoriesRegisterRequest, MemoriesUserResponse } from '@/api/models'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token') || null)
  const user = ref<MemoriesUserResponse | null>(null)

  const isAuthenticated = computed(() => !!token.value)



  const login = async (email: string, password: string): Promise<void> => {
    const response = await authApi.login(email, password)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('auth_token', response.token)
  }

  const register = async (data: MemoriesRegisterRequest): Promise<void> => {
    const response = await authApi.register(data)
    token.value = response.token
    user.value = response.user
    localStorage.setItem('auth_token', response.token)
  }

  const fetchMe = async (): Promise<void> => {
    user.value = await authApi.getMe()
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  return { token, user, isAuthenticated, login, register, fetchMe, logout }
})