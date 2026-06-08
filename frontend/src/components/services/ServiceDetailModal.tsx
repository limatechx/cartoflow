import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Service } from '@/types'
import ServiceStatusChip from './ServiceStatusChip'
import { formatDate, formatDateTime, formatCPF } from '@/utils/formatters'

interface ServiceDetailModalProps {
  service: Service | null
  isAdmin: boolean
  open: boolean
  onClose: () => void
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        textTransform="uppercase"
      >
        {label}
      </Typography>
      <Box mt={0.25} sx={{ wordBreak: 'break-word' }}>
        {typeof value === 'string' ? (
          <Typography variant="body1">{value || <span style={{ color: '#bbb' }}>—</span>}</Typography>
        ) : (
          value ?? <Typography variant="body1" sx={{ color: '#bbb' }}>—</Typography>
        )}
      </Box>
    </Box>
  )
}

export default function ServiceDetailModal({
  service,
  isAdmin,
  open,
  onClose,
  onEdit,
  onDelete,
}: ServiceDetailModalProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (!service) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Detalhes do Serviço #{service.id}
          </Typography>
          <ServiceStatusChip status={service.status} />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InfoRow
              label="Tipo"
              value={
                <Chip label={service.tipo} variant="outlined" color="primary" size="small" />
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoRow label="Solicitante" value={service.nome_solicitante} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoRow label="CPF" value={formatCPF(service.cpf_solicitante)} />
          </Grid>

          <Grid item xs={12}>
            <InfoRow label="Descrição" value={service.descricao} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoRow label="Data de Solicitação" value={formatDate(service.data_solicitacao)} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoRow label="Status" value={<ServiceStatusChip status={service.status} />} />
          </Grid>

          {service.observacoes && (
            <Grid item xs={12}>
              <InfoRow label="Observações" value={service.observacoes} />
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoRow label="Criado em" value={formatDateTime(service.created_at)} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoRow label="Atualizado em" value={formatDateTime(service.updated_at)} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Button onClick={onClose} fullWidth={fullScreen}>
          Fechar
        </Button>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          fullWidth={fullScreen}
          onClick={() => {
            onClose()
            onEdit(service)
          }}
        >
          Editar
        </Button>
        {isAdmin && (
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            fullWidth={fullScreen}
            onClick={() => {
              onClose()
              onDelete(service)
            }}
          >
            Remover
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
