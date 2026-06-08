import { useEffect } from 'react'
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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import type { Service, ServiceFormData } from '@/types'
import { SERVICE_TIPOS, SERVICE_STATUS } from '@/types'
import { toDateInputValue } from '@/utils/formatters'

const schema = yup.object({
  tipo: yup.string().oneOf(SERVICE_TIPOS).required('Tipo é obrigatório'),
  nome_solicitante: yup
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .required('Nome do solicitante é obrigatório'),
  cpf_solicitante: yup
    .string()
    .matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$|^\d{11}$/, 'CPF inválido')
    .required('CPF é obrigatório'),
  descricao: yup.string().optional(),
  status: yup.string().oneOf(SERVICE_STATUS).required('Status é obrigatório'),
  data_solicitacao: yup.string().required('Data de solicitação é obrigatória'),
  observacoes: yup.string().optional(),
})

interface ServiceFormProps {
  open: boolean
  service?: Service | null
  onClose: () => void
  onSubmit: (data: ServiceFormData) => Promise<void>
}

export default function ServiceForm({ open, service, onClose, onSubmit }: ServiceFormProps) {
  const isEditing = !!service
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: yupResolver(schema) as never,
    defaultValues: {
      tipo: 'Certidão de Nascimento',
      status: 'Aguardando',
      data_solicitacao: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (open) {
      if (service) {
        reset({
          tipo: service.tipo,
          nome_solicitante: service.nome_solicitante,
          cpf_solicitante: service.cpf_solicitante,
          descricao: service.descricao ?? '',
          status: service.status,
          data_solicitacao: toDateInputValue(service.data_solicitacao),
          observacoes: service.observacoes ?? '',
        })
      } else {
        reset({
          tipo: 'Certidão de Nascimento',
          status: 'Aguardando',
          data_solicitacao: new Date().toISOString().split('T')[0],
          nome_solicitante: '',
          cpf_solicitante: '',
          descricao: '',
          observacoes: '',
        })
      }
    }
  }, [open, service, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle fontWeight={700}>
        {isEditing ? 'Editar Serviço' : 'Novo Serviço Cartorário'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.tipo}>
                <InputLabel>Tipo *</InputLabel>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Tipo *">
                      {SERVICE_TIPOS.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                label="Nome do solicitante *"
                fullWidth
                {...register('nome_solicitante')}
                error={!!errors.nome_solicitante}
                helperText={errors.nome_solicitante?.message}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="CPF *"
                fullWidth
                placeholder="000.000.000-00"
                {...register('cpf_solicitante')}
                error={!!errors.cpf_solicitante}
                helperText={errors.cpf_solicitante?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                fullWidth
                multiline
                rows={2}
                {...register('descricao')}
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status *</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Status *">
                      {SERVICE_STATUS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data de solicitação *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('data_solicitacao')}
                error={!!errors.data_solicitacao}
                helperText={errors.data_solicitacao?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Observações"
                fullWidth
                multiline
                rows={3}
                {...register('observacoes')}
                error={!!errors.observacoes}
                helperText={errors.observacoes?.message}
              />
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
