import {
  Avatar,
  Box,
  Button,
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
import type { User } from '@/types'
import UserPerfilChip from './UserPerfilChip'
import { formatDateTime } from '@/utils/formatters'

interface UserDetailModalProps {
  user: User | null
  currentUserId?: number
  open: boolean
  onClose: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
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
          <Typography variant="body1">{value}</Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  )
}

export default function UserDetailModal({
  user,
  currentUserId,
  open,
  onClose,
  onEdit,
  onDelete,
}: UserDetailModalProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (!user) return null

  const isSelf = user.id === currentUserId

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, flexShrink: 0 }}>
            {user.nome.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2} noWrap>
              {user.nome}
            </Typography>
            <UserPerfilChip perfil={user.perfil} />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <InfoRow label="E-mail" value={user.email} />
          </Grid>
          <Grid item xs={12}>
            <InfoRow label="Perfil" value={<UserPerfilChip perfil={user.perfil} />} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Cadastrado em" value={formatDateTime(user.created_at)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Atualizado em" value={formatDateTime(user.updated_at)} />
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
            onEdit(user)
          }}
        >
          Editar
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          variant="contained"
          color="error"
          disabled={isSelf}
          fullWidth={fullScreen}
          onClick={() => {
            onClose()
            onDelete(user)
          }}
        >
          Remover
        </Button>
      </DialogActions>
    </Dialog>
  )
}
