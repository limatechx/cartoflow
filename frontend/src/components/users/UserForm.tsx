import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import type { User, UserFormData } from '@/types'
import { PERFIS } from '@/types'

const createSchema = yup.object({
  nome: yup.string().min(3, 'Mínimo 3 caracteres').required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  perfil: yup.string().oneOf(PERFIS).required('Perfil é obrigatório'),
})

const editSchema = yup.object({
  nome: yup.string().min(3, 'Mínimo 3 caracteres').required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  senha: yup
    .string()
    .optional()
    .test('min-if-filled', 'Mínimo 6 caracteres', (val) => {
      if (!val || val.length === 0) return true
      return val.length >= 6
    }),
  perfil: yup.string().oneOf(PERFIS).required('Perfil é obrigatório'),
})

interface UserFormProps {
  open: boolean
  user?: User | null
  onClose: () => void
  onSubmit: (data: UserFormData) => Promise<void>
}

export default function UserForm({ open, user, onClose, onSubmit }: UserFormProps) {
  const isEditing = !!user
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: yupResolver(isEditing ? editSchema : createSchema) as never,
    defaultValues: { perfil: 'Atendente' },
  })

  useEffect(() => {
    if (open) {
      setShowPassword(false)
      if (user) {
        reset({ nome: user.nome, email: user.email, perfil: user.perfil, senha: '' })
      } else {
        reset({ nome: '', email: '', senha: '', perfil: 'Atendente' })
      }
    }
  }, [open, user, reset])

  const handleFormSubmit = async (data: UserFormData) => {
    if (isEditing && !data.senha) delete data.senha
    await onSubmit(data)
  }

  return (
    <Dialog key={user?.id ?? 'new'} open={open} onClose={onClose} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle fontWeight={700}>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                label="Nome *"
                fullWidth
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="E-mail *"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={isEditing ? 'Nova senha (em branco = sem alteração)' : 'Senha *'}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register('senha')}
                error={!!errors.senha}
                helperText={errors.senha?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.perfil}>
                <InputLabel>Perfil *</InputLabel>
                <Controller
                  name="perfil"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Perfil *">
                      {PERFIS.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.perfil && <FormHelperText>{errors.perfil.message}</FormHelperText>}
              </FormControl>
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
          <Button onClick={onClose} disabled={isSubmitting} fullWidth={fullScreen}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth={fullScreen}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditing ? (
              'Salvar alterações'
            ) : (
              'Cadastrar'
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
