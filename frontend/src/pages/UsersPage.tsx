import { useState, useEffect, useCallback } from 'react'
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import type { User, UserFormData } from '@/types'
import { usersApi } from '@/api/users.api'
import { useAuth } from '@/contexts/AuthContext'
import UserTable from '@/components/users/UserTable'
import UserForm from '@/components/users/UserForm'
import UserDetailModal from '@/components/users/UserDetailModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function UsersPage() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [detailUser, setDetailUser] = useState<User | null>(null)

  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await usersApi.getAll()
      setUsers(data)
    } catch {
      setError('Erro ao carregar usuários. Verifique a conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleOpenNew = () => {
    setEditingUser(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setFormOpen(true)
  }

  const handleOpenDetail = (user: User) => {
    setDetailUser(user)
  }

  const handleOpenDelete = (user: User) => {
    setDeleteUser(user)
  }

  const handleFormSubmit = async (data: UserFormData) => {
    if (editingUser) {
      const updated = await usersApi.update(editingUser.id, data)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    } else {
      const created = await usersApi.create(data)
      setUsers((prev) => [created, ...prev])
    }
    setFormOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return
    setDeleteLoading(true)
    try {
      await usersApi.remove(deleteUser.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id))
      setDeleteUser(null)
    } catch {
      setError('Erro ao remover usuário.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Usuários
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os usuários do sistema
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenNew}
          sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
        >
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <UserTable
          users={users}
          currentUserId={currentUser?.id}
          onView={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <UserForm
        open={formOpen}
        user={editingUser}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <UserDetailModal
        user={detailUser}
        currentUserId={currentUser?.id}
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        onEdit={(u) => {
          setDetailUser(null)
          handleOpenEdit(u)
        }}
        onDelete={(u) => {
          setDetailUser(null)
          handleOpenDelete(u)
        }}
      />

      <ConfirmDialog
        open={!!deleteUser}
        title="Remover Usuário"
        description={`Tem certeza que deseja remover o usuário "${deleteUser?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteUser(null)}
        loading={deleteLoading}
      />
    </Box>
  )
}
