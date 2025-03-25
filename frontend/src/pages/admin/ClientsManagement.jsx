"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiUsers, FiEye } from "react-icons/fi"
import { DataTable, SearchAndFilter } from "../../components/ui/data-table"
import ConfirmDialog from "../../components/ConfirmDialog"
import ClientFormModal from "../../components/client/ClientFormModal"
import clientService from "../../services/ClientService"
import userService from "../../services/UserService"
import { toast } from "react-hot-toast"

export default function ClientsManagement() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    estado: "activo"
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [formData, setFormData] = useState({
    usuario_id: "",
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
    estado: "activo"
  })

  const filterOptions = [
    {
      id: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "all", label: "Todos" },
        { value: "activo", label: "Activos" },
        { value: "inactivo", label: "Inactivos" }
      ]
    }
  ]

  const columns = [
    {
      field: "nombre",
      header: "Nombre Cliente",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <FiUsers className="text-primary" />
          </div>
          <span className="font-medium text-text">{row.nombre}</span>
        </div>
      ),
    },
    {
      field: "usuario_email",
      header: "Usuario Asignado",
      sortable: true,
    },
    {
      field: "nit",
      header: "NIT",
      sortable: true,
    },
    {
      field: "telefono",
      header: "Teléfono",
      sortable: true,
    },
    {
      field: "estado",
      header: "Estado",
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row.estado}
        </span>
      ),
    }
  ]

  useEffect(() => {
    fetchClients()
  }, [filters])

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const includeInactive = filters.estado === "all" || filters.estado === "inactivo"
      const [clientsData, usersData] = await Promise.all([
        clientService.getAllClients(includeInactive),
        userService.getAvailableUsers()
      ])
      setClients(clientsData)
      setUsers(usersData)
    } catch (error) {
      setError(error.message || 'Error al cargar los datos')
      toast.error('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm })
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const handleEdit = (client) => {
    setSelectedClient(client)
    setFormData({
      usuario_id: client.usuario_id,
      nombre: client.nombre,
      nit: client.nit,
      direccion: client.direccion,
      telefono: client.telefono,
      estado: client.estado
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (client) => {
    setSelectedClient(client)
    setIsDeleteDialogOpen(true)
  }

  const handleRestore = (client) => {
    setSelectedClient(client)
    setIsRestoreDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedClient) {
        await clientService.updateClient(selectedClient.id, formData)
        toast.success('Cliente actualizado exitosamente')
      } else {
        await clientService.createClient(formData)
        toast.success('Cliente creado exitosamente')
      }
      await fetchClients()
      setIsCreateModalOpen(false)
      setIsEditModalOpen(false)
      resetForm()
    } catch (error) {
      setError(error.message || 'Error al guardar el cliente')
      toast.error(error.message || 'Error al guardar el cliente')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await clientService.deleteClient(selectedClient.id)
      toast.success('Cliente eliminado exitosamente')
      await fetchClients()
      setIsDeleteDialogOpen(false)
      setSelectedClient(null)
    } catch (error) {
      setError(error.message || 'Error al eliminar el cliente')
      toast.error(error.message || 'Error al eliminar el cliente')
    }
  }

  const handleConfirmRestore = async () => {
    try {
      await clientService.restoreClient(selectedClient.id)
      toast.success('Cliente restaurado exitosamente')
      await fetchClients()
      setIsRestoreDialogOpen(false)
      setSelectedClient(null)
    } catch (error) {
      setError(error.message || 'Error al restaurar el cliente')
      toast.error(error.message || 'Error al restaurar el cliente')
    }
  }

  const resetForm = () => {
    setFormData({
      usuario_id: "",
      nombre: "",
      nit: "",
      direccion: "",
      telefono: "",
      estado: "activo"
    })
    setSelectedClient(null)
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch = filters.search
      ? client.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.nit.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.telefono.toLowerCase().includes(filters.search.toLowerCase())
      : true

    const matchesStatus = filters.estado === "all" || client.estado === filters.estado

    return matchesSearch && matchesStatus
  })

  const renderRowActions = (row) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => navigate(`/admin/clients/${row.id}/details`)}
        className="p-2 text-text-light hover:text-primary transition-colors"
        title="Ver detalles"
      >
        <FiEye size={18} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleEdit(row)
        }}
        className="p-2 text-text-light hover:text-primary transition-colors"
        title="Editar"
      >
        <FiEdit2 size={18} />
      </button>
      {row.estado === "activo" ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(row)
          }}
          className="p-2 text-text-light hover:text-red-600 transition-colors"
          title="Eliminar"
        >
          <FiTrash2 size={18} />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleRestore(row)
          }}
          className="p-2 text-text-light hover:text-green-600 transition-colors"
          title="Restaurar"
        >
          <FiRefreshCw size={18} />
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-text">Gestión de Clientes</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filterOptions}
        totalItems={filteredClients.length}
        currentFilters={filters}
        searchPlaceholder="Buscar por nombre, NIT o teléfono..."
      />

      <DataTable
        data={filteredClients}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron clientes"
        emptyIcon={FiUsers}
        renderRowActions={renderRowActions}
        initialSortField="nombre"
        onRowClick={(row) => navigate(`/admin/clients/${row.id}/details`)}
      />

      <ClientFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
          resetForm()
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        users={users}
        isEditing={!!selectedClient}
        selectedClient={selectedClient}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cliente"
        message={`¿Estás seguro que deseas eliminar el cliente "${selectedClient?.nombre}"? Esta acción no se puede deshacer.`}
        type="warning"
      />

      <ConfirmDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={handleConfirmRestore}
        title="Restaurar Cliente"
        message={`¿Estás seguro que deseas restaurar el cliente "${selectedClient?.nombre}"?`}
        type="success"
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-medium">
          {error}
        </div>
      )}
    </div>
  )
}