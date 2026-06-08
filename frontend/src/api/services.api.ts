import api from './axios'
import type { Service, ServiceFormData } from '@/types'

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const { data } = await api.get<Service[]>('/services')
    return data
  },

  create: async (payload: ServiceFormData): Promise<Service> => {
    const { data } = await api.post<Service>('/services', payload)
    return data
  },

  update: async (id: number, payload: Partial<ServiceFormData>): Promise<Service> => {
    const { data } = await api.put<Service>(`/services/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`)
  },
}
