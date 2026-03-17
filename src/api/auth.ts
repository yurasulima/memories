import api from './api'
import type {
  MemoriesAuthResponse,
  MemoriesAuthRequest,
  MemoriesRegisterRequest,
  MemoriesUserResponse
} from './models.ts'

export const authApi = {

  getMe: async (): Promise<MemoriesUserResponse> => {
    const response = await api.get<MemoriesUserResponse>('/memories/auth/me')
    return response.data
  },

  login: async (email: string, password: string): Promise<MemoriesAuthResponse> => {
    const response = await api.post<MemoriesAuthResponse>('/memories/auth/login', { email, password } satisfies MemoriesAuthRequest)
    return response.data
  },
  register: async (data: MemoriesRegisterRequest): Promise<MemoriesAuthResponse> => {
    const response = await api.post<MemoriesAuthResponse>('/memories/auth/register', data)
    return response.data
  }
}
