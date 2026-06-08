import api from './axios'
import type { LoginResponse, User } from '@/types'

export const authApi = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, senha })
    return data
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
}
