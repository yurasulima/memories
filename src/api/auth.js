import api from './api.js'

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/memories/auth/login', { email, password })
    return response.data
  },
  register: async (data) => {
    const response = await api.post('/memories/auth/register', data)
    return response.data
  }
}
