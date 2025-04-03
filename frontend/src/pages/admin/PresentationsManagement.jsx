"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi"
import DataTable from "../../components/ui/data-table/DataTable"
import SearchAndFilter from "../../components/ui/data-table/SearchAndFilter"
import ConfirmDialog from "../../components/ConfirmDialog"
import PresentationFormModal from "../../components/PresentationFormModal"
import presentationService from "../../services/PresentationService"

export default function PresentationsManagement() {
  const [presentations, setPresentations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
  })

  const columns = [
    {
      field: "nombre",
      header: "Nombre",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <FiPackage className="text-primary" />
          </div>
          <span className="font-medium text-text">{row.nombre}</span>
        </div>
      ),
    },
    {
      field: "descripcion",
      header: "Descripción",
      sortable: true,
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
    {
      field: "fechaCreacion",
      header: "Creado",
      sortable: true,
      render: (row) => {
        try {
          const date = row.created_at || row.fechaCreacion
          if (!date) return "N/A"
          
          return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        } catch (error) {
          return "Fecha inválida"
        }
      },
    },
  ]

  const filterOptions = [
    {
      id: "status",
      label: "Estado",
      type: "select",
      defaultValue: "all",
      options: [
        { value: "all", label: "Todos los estados" },
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
      ],
    },
  ]

  useEffect(() => {
    fetchPresentations()
  }, [])

  const fetchPresentations = async () => {
    try {
      setIsLoading(true)
      const data = await presentationService.getAllPresentations()
      setPresentations(data)
    } catch (err) {
      setError(err.message || "Error al cargar presentaciones")
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

  const handleEdit = (presentation) => {
    setSelectedPresentation(presentation)
    setFormData({
      nombre: presentation.nombre,
      descripcion: presentation.descripcion,
      estado: presentation.estado,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (presentation) => {
    setSelectedPresentation(presentation)
    setIsDeleteDialogOpen(true)
  }

  const handleRestore = async (presentation) => {
    try {
      await presentationService.restorePresentation(presentation.id)
      await fetchPresentations()
    } catch (err) {
      setError(err.message || "Error al restaurar la presentación")
    }
  }

  const confirmDelete = async () => {
    try {
      await presentationService.deletePresentation(selectedPresentation.id)
      await fetchPresentations()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError(err.message || "Error al eliminar la presentación")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await presentationService.createPresentation(formData)
      await fetchPresentations()
      setIsCreateModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message || "Error al crear la presentación")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      estado: "activo",
    })
    setSelectedPresentation(null)
  }

  const filteredPresentations = presentations.filter((presentation) => {
    const matchesSearch = filters.search
      ? presentation.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        presentation.descripcion.toLowerCase().includes(filters.search.toLowerCase())
      : true

    const matchesStatus = filters.status === "all" || presentation.estado === filters.status

    return matchesSearch && matchesStatus
  })

  const renderRowActions = (row) => (
    <div className="flex items-center justify-end space-x-3">
      <button
        className="text-primary hover:text-primary-dark transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          handleEdit(row)
        }}
      >
        <FiEdit2 size={18} />
      </button>
      {row.estado === "activo" ? (
        <button
          className="text-red-500 hover:text-red-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(row)
          }}
        >
          <FiTrash2 size={18} />
        </button>
      ) : (
        <button
          className="text-green-500 hover:text-green-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            handleRestore(row)
          }}
        >
          <FiRefreshCw size={18} />
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-text">Gestión de Presentaciones</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus />
          <span>Nueva Presentación</span>
        </button>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filterOptions}
        totalItems={filteredPresentations.length}
        currentFilters={filters}
        searchPlaceholder="Buscar por nombre o descripción..."
      />

      <DataTable
        data={filteredPresentations}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron presentaciones"
        emptyIcon={FiPackage}
        renderRowActions={renderRowActions}
        initialSortField="nombre"
        onRowClick={(row) => handleEdit(row)}
      />

      <PresentationFormModal
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

      <PresentationFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          resetForm()
        }}
        onSubmit={async (e) => {
          e.preventDefault()
          try {
            await presentationService.updatePresentation(selectedPresentation.id, formData)
            await fetchPresentations()
            setIsEditModalOpen(false)
            resetForm()
          } catch (err) {
            setError(err.message || "Error al actualizar la presentación")
          }
        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        selectedPresentation={selectedPresentation}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Presentación"
        message={`¿Estás seguro que deseas eliminar la presentación "${selectedPresentation?.nombre}"? Esta acción no se puede deshacer.`}
        type="warning"
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-medium">
          {error}
        </div>
      )}
    </div>
  )
}