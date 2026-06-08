import {
  Avatar,
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
import PeopleIcon from '@mui/icons-material/People'
import type { User } from '@/types'
import UserPerfilChip from './UserPerfilChip'
import EmptyState from '@/components/common/EmptyState'

interface UserTableProps {
  users: User[]
  currentUserId?: number
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export default function UserTable({
  users,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={PeopleIcon}
        title="Nenhum usuário cadastrado"
        description="Cadastre o primeiro usuário utilizando o botão acima."
      />
    )
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: 2, overflowX: 'auto' }}
    >
      <Table size="small" sx={{ minWidth: 320 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 140 }}>Usuário</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, minWidth: 160 }}>
              E-mail
            </TableCell>
            <TableCell sx={{ minWidth: 100 }}>Perfil</TableCell>
            <TableCell align="right" sx={{ minWidth: 80 }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Avatar
                    sx={{ width: 28, height: 28, fontSize: 13, bgcolor: 'primary.light', flexShrink: 0 }}
                  >
                    {user.nome.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      sx={{ maxWidth: { xs: 110, sm: 'none' } }}
                    >
                      {user.nome}
                      {user.id === currentUserId && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          (você)
                        </Typography>
                      )}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ display: { xs: 'block', sm: 'none' }, maxWidth: 120 }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <UserPerfilChip perfil={user.perfil} />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-end' }}>
                  <Tooltip title="Ver detalhes">
                    <IconButton
                      size="small"
                      onClick={() => onView(user)}
                      sx={{ minWidth: 36, minHeight: 36 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(user)}
                      sx={{ minWidth: 36, minHeight: 36 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      user.id === currentUserId ? 'Não é possível remover a si mesmo' : 'Remover'
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(user)}
                        disabled={user.id === currentUserId}
                        sx={{ minWidth: 36, minHeight: 36 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
