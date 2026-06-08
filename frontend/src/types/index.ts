export type Perfil = 'Administrador' | 'Atendente'

export type ServiceTipo =
  | 'Certidão de Nascimento'
  | 'Reconhecimento de Firma'
  | 'Autenticação'
  | 'Escritura'
  | 'Outro'

export type ServiceStatus = 'Aguardando' | 'Em andamento' | 'Concluído'

export interface User {
  id: number
  nome: string
  email: string
  perfil: Perfil
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  tipo: ServiceTipo
  nome_solicitante: string
  cpf_solicitante: string
  descricao: string | null
  status: ServiceStatus
  data_solicitacao: string
  observacoes: string | null
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UserFormData {
  nome: string
  email: string
  senha?: string
  perfil: Perfil
}

export interface ServiceFormData {
  tipo: ServiceTipo
  nome_solicitante: string
  cpf_solicitante: string
  descricao?: string
  status: ServiceStatus
  data_solicitacao: string
  observacoes?: string
}

export const SERVICE_TIPOS: ServiceTipo[] = [
  'Certidão de Nascimento',
  'Reconhecimento de Firma',
  'Autenticação',
  'Escritura',
  'Outro',
]

export const SERVICE_STATUS: ServiceStatus[] = [
  'Aguardando',
  'Em andamento',
  'Concluído',
]

export const PERFIS: Perfil[] = ['Administrador', 'Atendente']
