import { useState, useEffect, useCallback } from 'react'
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Service, ServiceFormData, ServiceTipo, ServiceStatus } from '@/types'
import { servicesApi } from '@/api/services.api'
import { useAuth } from '@/contexts/AuthContext'
import ServiceTable from '@/components/services/ServiceTable'
import ServiceFilters from '@/components/services/ServiceFilters'
import ServiceForm from '@/components/services/ServiceForm'
import ServiceDetailModal from '@/components/services/ServiceDetailModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function ServicesPage() {
  const { isAdmin } = useAuth()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filterTipo, setFilterTipo] = useState<ServiceTipo | ''>('')
  const [filterStatus, setFilterStatus] = useState<ServiceStatus | ''>('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [detailService, setDetailService] = useState<Service | null>(null)

  const [deleteService, setDeleteService] = useState<Service | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await servicesApi.getAll()
      setServices(data)
    } catch {
      setError('Erro ao carregar serviços. Verifique a conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const filteredServices = services.filter((s) => {
    const matchTipo = !filterTipo || s.tipo === filterTipo
    const matchStatus = !filterStatus || s.status === filterStatus
    return matchTipo && matchStatus
  })

  const handleOpenNew = () => {
    setEditingService(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (service: Service) => {
    setEditingService(service)
    setFormOpen(true)
  }

  const handleOpenDetail = (service: Service) => {
    setDetailService(service)
  }

  const handleOpenDelete = (service: Service) => {
    setDeleteService(service)
  }

  const handleFormSubmit = async (data: ServiceFormData) => {
    if (editingService) {
      const updated = await servicesApi.update(editingService.id, data)
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } else {
      const created = await servicesApi.create(data)
      setServices((prev) => [created, ...prev])
    }
    setFormOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteService) return
    setDeleteLoading(true)
    try {
      await servicesApi.remove(deleteService.id)
      setServices((prev) => prev.filter((s) => s.id !== deleteService.id))
      setDeleteService(null)
    } catch {
      setError('Erro ao remover serviço.')
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
            Serviços Cartorários
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os serviços do cartório
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNew}
          sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
        >
          Novo Serviço
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <ServiceFilters
          filterTipo={filterTipo}
          filterStatus={filterStatus}
          onTipoChange={setFilterTipo}
          onStatusChange={setFilterStatus}
          onClear={() => {
            setFilterTipo('')
            setFilterStatus('')
          }}
        />
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
        <ServiceTable
          services={filteredServices}
          isAdmin={isAdmin}
          onView={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <ServiceForm
        open={formOpen}
        service={editingService}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ServiceDetailModal
        service={detailService}
        isAdmin={isAdmin}
        open={!!detailService}
        onClose={() => setDetailService(null)}
        onEdit={(s) => {
          setDetailService(null)
          handleOpenEdit(s)
        }}
        onDelete={(s) => {
          setDetailService(null)
          handleOpenDelete(s)
        }}
      />

      <ConfirmDialog
        open={!!deleteService}
        title="Remover Serviço"
        description={`Tem certeza que deseja remover o serviço "${deleteService?.tipo}" de ${deleteService?.nome_solicitante}? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteService(null)}
        loading={deleteLoading}
      />
    </Box>
  )
}
