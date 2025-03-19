"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiUser } from "react-icons/fi"
import userService from "../../services/userService"
import ConfirmDialog from "../../components/ConfirmDialog"
import UserFormModal from "../../components/UserFormModal"
import { DataTable, SearchAndFilter } from "../../components/ui/data-table"

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    sort: "newest",
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showConfirmCreate, setShowConfirmCreate] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    rol: "usuario",
  })

  // Definición de columnas para la tabla
  const columns = [
    {
      field: "nombre",
      header: "Nombre",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">{row.nombre[0]}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-text">{`${row.nombre} ${row.apellido}`}</div>
          </div>
        </div>
      ),
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "telefono",
      header: "Teléfono",
      sortable: false,
    },
    {
      field: "rol",
      header: "Rol",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.rol === "admin" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
          }`}
        >
          {row.rol}
        </span>
      ),
    },
    {
      field: "estado",
      header: "Estado",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
  ]

  // Definición de filtros para el componente SearchAndFilter
  const filterOptions = [
    {
      id: "role",
      label: "Filtrar por rol",
      type: "select",
      defaultValue: "all",
      options: [
        { value: "all", label: "Todos los roles" },
        { value: "admin", label: "Administrador" },
        { value: "usuario", label: "Usuario" },
        { value: "vendedor", label: "Vendedor" },
      ],
    },
    {
      id: "sort",
      label: "Ordenar por",
      type: "select",
      defaultValue: "newest",
      options: [
        { value: "newest", label: "Más recientes" },
        { value: "oldest", label: "Más antiguos" },
        { value: "name_asc", label: "Nombre (A-Z)" },
        { value: "name_desc", label: "Nombre (Z-A)" },
      ],
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar usuarios")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPendingFormData({
      ...formData,
      estado: "activo",
    })
    setShowConfirmCreate(true)
  }

  const handleConfirmCreate = async () => {
    try {
      await userService.createUser(pendingFormData)
      await fetchUsers()
      setIsCreateModalOpen(false)
      setShowConfirmCreate(false)
      resetForm()
    } catch (err) {
      console.error("Error:", err)
      setError(err.message || "Error al procesar la solicitud")
    }
  }

  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false)
  const [pendingUpdateData, setPendingUpdateData] = useState(null)

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setPendingUpdateData({
      ...formData,
      id: selectedUser.id,
    })
    setShowConfirmUpdate(true)
  }

  const handleConfirmUpdate = async () => {
    try {
      await userService.updateUser(selectedUser.id, pendingUpdateData)
      await fetchUsers()
      setIsEditModalOpen(false)
      setShowConfirmUpdate(false)
      resetForm()
    } catch (err) {
      console.error("Error:", err)
      setError(err.response?.data?.message || "Error al actualizar usuario")
    }
  }

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(selectedUser.id)
      await fetchUsers()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar usuario")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      password: "",
      rol: "usuario",
    })
    setSelectedUser(null)
  }

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm })
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  // Filtrar y ordenar usuarios
  const getFilteredAndSortedUsers = () => {
    let filtered = [...users]

    // Aplicar búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.nombre.toLowerCase().includes(searchTerm) ||
          user.apellido.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.telefono.includes(searchTerm) ||
          user.rol.toLowerCase().includes(searchTerm),
      )
    }

    // Filtrar por rol
    if (filters.role !== "all") {
      filtered = filtered.filter((user) => user.rol === filters.role)
    }

    // Aplicar ordenamiento
    switch (filters.sort) {
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      case "oldest":
        filtered.sort((a, b) => a.id - b.id)
        break
      case "name_asc":
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
      case "name_desc":
        filtered.sort((a, b) => b.nombre.localeCompare(a.nombre))
        break
      default:
        break
    }

    return filtered
  }

  // Renderizar acciones para cada fila
  const renderRowActions = (row) => (
    <div className="flex items-center space-x-3">
      <button
        className="text-primary hover:text-primary-dark transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          setSelectedUser(row)
          setIsEditModalOpen(true)
        }}
      >
        <FiEdit2 size={18} />
      </button>
      <button
        className="text-red-500 hover:text-red-700 transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          setSelectedUser(row)
          setIsDeleteDialogOpen(true)
        }}
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-text">Gestión de Usuarios</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filterOptions}
        totalItems={getFilteredAndSortedUsers().length}
        currentFilters={filters}
        searchPlaceholder="Buscar por nombre, email, teléfono..."
      />

      <DataTable
        data={getFilteredAndSortedUsers()}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios"
        emptyIcon={FiUser}
        renderRowActions={renderRowActions}
        initialSortField="nombre"
        onRowClick={(row) => {
          setSelectedUser(row)
          setIsEditModalOpen(true)
        }}
      />

      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          resetForm()
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={false}
      />

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          resetForm()
        }}
        onSubmit={handleUpdateSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        selectedUser={selectedUser}
      />

      <ConfirmDialog
        isOpen={showConfirmUpdate}
        onClose={() => setShowConfirmUpdate(false)}
        onConfirm={handleConfirmUpdate}
        title="Actualizar Usuario"
        message={`¿Estás seguro que deseas actualizar la información de ${selectedUser?.nombre} ${selectedUser?.apellido}?`}
        type="success"
      />

      <ConfirmDialog
        isOpen={showConfirmCreate}
        onClose={() => setShowConfirmCreate(false)}
        onConfirm={handleConfirmCreate}
        title="Crear Usuario"
        message="¿Estás seguro que deseas crear este usuario?"
        type="success"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Eliminar Usuario"
        message={`¿Estás seguro que deseas eliminar al usuario ${selectedUser?.nombre} ${selectedUser?.apellido}?`}
        type="warning"
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-medium">{error}</div>
      )}
    </div>
  )
}

