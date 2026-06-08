import api from './axios'
import type { User, UserFormData } from '@/types'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users')
    return data
  },

  create: async (payload: UserFormData): Promise<User> => {
    const { data } = await api.post<User>('/users', payload)
    return data
  },

  update: async (id: number, payload: Partial<UserFormData>): Promise<User> => {
    const { data } = await api.put<User>(`/users/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
