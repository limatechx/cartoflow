import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AssignmentIcon from '@mui/icons-material/Assignment'
import type { Service } from '@/types'
import ServiceStatusChip from './ServiceStatusChip'
import EmptyState from '@/components/common/EmptyState'
import { formatDate, formatCPF } from '@/utils/formatters'

const cellEllipsisMobile = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
  maxWidth: { xs: 110, sm: 'none' },
}

interface ServiceTableProps {
  services: Service[]
  isAdmin: boolean
  onView: (service: Service) => void
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
}

export default function ServiceTable({
  services,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        icon={AssignmentIcon}
        title="Nenhum serviço encontrado"
        description="Nenhum serviço cartorário foi cadastrado ainda ou os filtros aplicados não retornaram resultados."
      />
    )
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: 2, overflowX: 'auto' }}
    >
      <Table size="small" sx={{ minWidth: 360 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 120 }}>Tipo</TableCell>
            <TableCell sx={{ minWidth: 120 }}>Solicitante</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, minWidth: 110 }}>
              CPF
            </TableCell>
            <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, minWidth: 110 }}>
              Data
            </TableCell>
            <TableCell align="right" sx={{ minWidth: 80 }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id} hover>
              <TableCell>
                <Tooltip title={service.tipo} enterDelay={600}>
                  <Typography variant="body2" fontWeight={500} sx={cellEllipsisMobile}>
                    {service.tipo}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={service.nome_solicitante} enterDelay={600}>
                  <Typography variant="body2" sx={cellEllipsisMobile}>
                    {service.nome_solicitante}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography variant="body2" color="text.secondary">
                  {formatCPF(service.cpf_solicitante)}
                </Typography>
              </TableCell>
              <TableCell>
                <ServiceStatusChip status={service.status} />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(service.data_solicitacao)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-end' }}>
                  <Tooltip title="Ver detalhes">
                    <IconButton
                      size="small"
                      onClick={() => onView(service)}
                      sx={{ minWidth: 36, minHeight: 36 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(service)}
                      sx={{ minWidth: 36, minHeight: 36 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {isAdmin && (
                    <Tooltip title="Remover">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(service)}
                        sx={{ minWidth: 36, minHeight: 36 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
