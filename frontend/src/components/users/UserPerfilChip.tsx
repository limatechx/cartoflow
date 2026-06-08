import { Chip } from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import type { Perfil } from '@/types'

interface UserPerfilChipProps {
  perfil: Perfil
}

export default function UserPerfilChip({ perfil }: UserPerfilChipProps) {
  const isAdmin = perfil === 'Administrador'
  return (
    <Chip
      icon={isAdmin ? <AdminPanelSettingsIcon /> : <SupportAgentIcon />}
      label={perfil}
      color={isAdmin ? 'primary' : 'default'}
      size="small"
      variant={isAdmin ? 'filled' : 'outlined'}
    />
  )
}
