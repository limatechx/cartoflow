export interface UserRow {
  id: number;
  nome: string;
  email: string;
  senha: string;
  perfil: 'Administrador' | 'Atendente';
  created_at: string;
  updated_at: string;
}

export type UserPublic = Omit<UserRow, 'senha'>;
