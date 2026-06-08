import { Chip } from '@mui/material'
import type { ServiceStatus } from '@/types'

interface ServiceStatusChipProps {
  status: ServiceStatus
}

const statusColor: Record<ServiceStatus, 'warning' | 'info' | 'success'> = {
  Aguardando: 'warning',
  'Em andamento': 'info',
  Concluído: 'success',
}

export default function ServiceStatusChip({ status }: ServiceStatusChipProps) {
  return (
    <Chip
      label={status}
      color={statusColor[status]}
      size="small"
      variant="filled"
    />
  )
}
