"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiHash } from "react-icons/fi"
import { DataTable, SearchAndFilter } from "../../components/ui/data-table"
import ConfirmDialog from "../../components/ConfirmDialog"
import UnitFormModal from "../../components/UnitFormModal"
import unitService from "../../services/UnitService"

export default function UnitsManagement() {
  const [units, setUnits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    simbolo: "",
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
            <FiHash className="text-primary" />
          </div>
          <span className="font-medium text-text">{row.nombre}</span>
        </div>
      ),
    },
    {
      field: "simbolo",
      header: "Símbolo",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 bg-accent/10 rounded-full text-xs font-medium">
          {row.simbolo}
        </span>
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
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    try {
      setIsLoading(true)
      const data = await unitService.getAllUnits()
      setUnits(data)
    } catch (err) {
      setError(err.message || "Error al cargar unidades")
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

  const handleEdit = (unit) => {
    setSelectedUnit(unit)
    setFormData({
      nombre: unit.nombre,
      simbolo: unit.simbolo,
      descripcion: unit.descripcion,
      estado: unit.estado,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (unit) => {
    setSelectedUnit(unit)
    setIsDeleteDialogOpen(true)
  }

  const handleRestore = async (unit) => {
    try {
      await unitService.restoreUnit(unit.id)
      await fetchUnits()
    } catch (err) {
      setError(err.message || "Error al restaurar la unidad")
    }
  }

  const confirmDelete = async () => {
    try {
      await unitService.deleteUnit(selectedUnit.id)
      await fetchUnits()
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError(err.message || "Error al eliminar la unidad")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await unitService.createUnit(formData)
      await fetchUnits()
      setIsCreateModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message || "Error al crear la unidad")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      simbolo: "",
      descripcion: "",
      estado: "activo",
    })
    setSelectedUnit(null)
  }

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = filters.search
      ? unit.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        unit.descripcion.toLowerCase().includes(filters.search.toLowerCase()) ||
        unit.simbolo.toLowerCase().includes(filters.search.toLowerCase())
      : true

    const matchesStatus = filters.status === "all" || unit.estado === filters.status

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
        <h1 className="text-2xl font-display text-text">Gestión de Unidades</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus />
          <span>Nueva Unidad</span>
        </button>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filterOptions}
        totalItems={filteredUnits.length}
        currentFilters={filters}
        searchPlaceholder="Buscar por nombre, símbolo o descripción..."
      />

      <DataTable
        data={filteredUnits}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron unidades"
        emptyIcon={FiHash}
        renderRowActions={renderRowActions}
        initialSortField="nombre"
        onRowClick={(row) => handleEdit(row)}
      />

      <UnitFormModal
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

      <UnitFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          resetForm()
        }}
        onSubmit={async (e) => {
          e.preventDefault()
          try {
            await unitService.updateUnit(selectedUnit.id, formData)
            await fetchUnits()
            setIsEditModalOpen(false)
            resetForm()
          } catch (err) {
            setError(err.message || "Error al actualizar la unidad")
          }
        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        selectedUnit={selectedUnit}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Unidad"
        message={`¿Estás seguro que deseas eliminar la unidad "${selectedUnit?.nombre}"? Esta acción no se puede deshacer.`}
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