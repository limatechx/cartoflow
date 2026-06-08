import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  type SelectChangeEvent,
} from '@mui/material'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import { SERVICE_TIPOS, SERVICE_STATUS } from '@/types'
import type { ServiceTipo, ServiceStatus } from '@/types'

interface ServiceFiltersProps {
  filterTipo: ServiceTipo | ''
  filterStatus: ServiceStatus | ''
  onTipoChange: (value: ServiceTipo | '') => void
  onStatusChange: (value: ServiceStatus | '') => void
  onClear: () => void
}

export default function ServiceFilters({
  filterTipo,
  filterStatus,
  onTipoChange,
  onStatusChange,
  onClear,
}: ServiceFiltersProps) {
  const hasFilters = !!filterTipo || !!filterStatus

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <FormControl sx={{ width: { xs: '100%', sm: 220 } }}>
        <InputLabel>Tipo de serviço</InputLabel>
        <Select
          value={filterTipo}
          label="Tipo de serviço"
          onChange={(e: SelectChangeEvent) => onTipoChange(e.target.value as ServiceTipo | '')}
        >
          <MenuItem value="">Todos</MenuItem>
          {SERVICE_TIPOS.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: { xs: '100%', sm: 180 } }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filterStatus}
          label="Status"
          onChange={(e: SelectChangeEvent) =>
            onStatusChange(e.target.value as ServiceStatus | '')
          }
        >
          <MenuItem value="">Todos</MenuItem>
          {SERVICE_STATUS.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasFilters && (
        <Button
          startIcon={<FilterListOffIcon />}
          onClick={onClear}
          color="inherit"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Limpar filtros
        </Button>
      )}
    </Box>
  )
}
