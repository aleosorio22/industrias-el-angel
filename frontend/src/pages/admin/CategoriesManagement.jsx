"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi"
import { DataTable, SearchAndFilter } from "../../components/ui/data-table"
import ConfirmDialog from "../../components/ConfirmDialog"
import CategoryFormModal from "../../components/CategoryFormModal"
import categoryService from "../../services/CategoryService"

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
  })

  // Columnas para la tabla
  const columns = [
    {
      field: "nombre",
      header: "Nombre",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <FiTag className="text-primary" />
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
      field: "productos",
      header: "Productos",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 bg-accent/10 rounded-full text-xs">{row.productos || 0} productos</span>
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
    {
      field: "fechaCreacion",
      header: "Creado",
      sortable: true,
      render: (row) => {
        try {
          const date = row.created_at || row.fechaCreacion; 
          if (!date) return "N/A";
          
          return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch (error) {
          return "Fecha inválida";
        }
      },
    },
  ]

  // Filtros para el componente SearchAndFilter
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

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories()
  }, [])

  // Reemplazar el fetchCategories actual con:
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message || "Error al cargar categorías")
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

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion,
      estado: category.estado,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await categoryService.deleteCategory(selectedCategory.id)
      await fetchCategories() // Recargar la lista
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError(err.message || "Error al eliminar la categoría")
    }
  }

  // Filtrar categorías según los filtros aplicados
  const filteredCategories = categories.filter((category) => {
    // Filtro por búsqueda
    const matchesSearch = filters.search
      ? category.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        category.descripcion.toLowerCase().includes(filters.search.toLowerCase())
      : true

    // Filtro por estado
    const matchesStatus = filters.status === "all" || category.estado === filters.status

    return matchesSearch && matchesStatus
  })

  // Renderizar acciones para cada fila
  const handleRestore = async (category) => {
    try {
      await categoryService.restoreCategory(category.id)
      await fetchCategories()
    } catch (err) {
      setError(err.message || "Error al restaurar la categoría")
    }
  }
  
  // Actualizar el renderRowActions para incluir la restauración
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await categoryService.createCategory(formData)
      await fetchCategories() // Recargar la lista
      setIsCreateModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message || "Error al crear la categoría")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      estado: "activo",
    })
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-text">Gestión de Categorías</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filterOptions}
        totalItems={filteredCategories.length}
        currentFilters={filters}
        searchPlaceholder="Buscar por nombre o descripción..."
      />

      <DataTable
        data={filteredCategories}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron categorías"
        emptyIcon={FiTag}
        renderRowActions={renderRowActions}
        initialSortField="nombre"
        onRowClick={(row) => handleEdit(row)}
      />

      <CategoryFormModal
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

      <CategoryFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          resetForm()
        }}
        onSubmit={async (e) => {  // Aquí está el problema
          e.preventDefault()
          try {
            await categoryService.updateCategory(selectedCategory.id, formData)
            await fetchCategories()
            setIsEditModalOpen(false)
            resetForm()
          } catch (err) {
            setError(err.message || "Error al actualizar la categoría")
          }
        }}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        selectedCategory={selectedCategory}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro que deseas eliminar la categoría "${selectedCategory?.nombre}"? Esta acción no se puede deshacer.`}
        type="warning"
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-medium">{error}</div>
      )}
    </div>
  )
}

