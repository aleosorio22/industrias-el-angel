"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiLayers, FiEye } from "react-icons/fi"
import { DataTable, SearchAndFilter } from "../../components/ui/data-table"
import ConfirmDialog from "../../components/ConfirmDialog"
import productionAreaService from "../../services/ProductionAreaService"
import categoryService from "../../services/CategoryService"
import { toast } from "react-hot-toast"
import ProductionAreaFormModal from "../../components/ProductionAreaFormModal"

export default function ProductionAreasManagement() {
  const navigate = useNavigate()
  const [areas, setAreas] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    estado: "activo"
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categorias: []
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)

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
      header: "Nombre",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <FiLayers className="text-primary" />
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
      field: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/production-areas/${row.id}/details`)}
            className="p-1 text-text-light hover:text-primary transition-colors"
            title="Ver más"
          >
            <FiEye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-text-light hover:text-text transition-colors"
            title="Editar"
          >
            <FiEdit2 size={18} />
          </button>
          {row.estado === "activo" ? (
            <button
              onClick={() => handleDelete(row)}
              className="p-1 text-text-light hover:text-destructive transition-colors"
              title="Desactivar"
            >
              <FiTrash2 size={18} />
            </button>
          ) : (
            <button
              onClick={() => handleRestore(row)}
              className="p-1 text-text-light hover:text-primary transition-colors"
              title="Restaurar"
            >
              <FiRefreshCw size={18} />
            </button>
          )}
        </div>
      ),
    },
  ]

  const fetchInitialData = async () => {
    try {
      setIsLoading(true)
      const [areasResponse, categoriesResponse] = await Promise.all([
        productionAreaService.getAllAreas(filters.estado === "inactivo" || filters.estado === "all"),
        categoryService.getAllCategories()
      ])

      let filteredAreas = []
      if (areasResponse.success && areasResponse.data?.data) {
        filteredAreas = areasResponse.data.data
      } else if (areasResponse.data) {
        filteredAreas = areasResponse.data
      } else if (Array.isArray(areasResponse)) {
        filteredAreas = areasResponse
      } else {
        console.error("Formato de respuesta inesperado:", areasResponse)
        setError("Formato de respuesta de áreas inesperado")
        setAreas([])
        return
      }

      const categoriesData = categoriesResponse.success ? categoriesResponse.data : 
                           (Array.isArray(categoriesResponse) ? categoriesResponse : [])

      if (filters.estado !== "all") {
        filteredAreas = filteredAreas.filter(
          area => area.estado === filters.estado
        )
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredAreas = filteredAreas.filter(
          area =>
            area.nombre.toLowerCase().includes(searchTerm) ||
            area.descripcion.toLowerCase().includes(searchTerm)
        )
      }

      setAreas(filteredAreas)
      setCategories(categoriesData)
      
    } catch (err) {
      console.error("Error completo al cargar datos:", err)
      setError(err.message || "Error desconocido al cargar los datos")
      toast.error("Error al cargar los datos: " + (err.message || "Error desconocido"))
      setAreas([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (area) => {
    setSelectedArea(area)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await productionAreaService.deleteArea(selectedArea.id)
      toast.success("Área de producción desactivada exitosamente")
      setIsDeleteDialogOpen(false)
      fetchInitialData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al desactivar el área de producción")
    }
  }

  const handleRestore = (area) => {
    setSelectedArea(area)
    setIsRestoreDialogOpen(true)
  }

  const confirmRestore = async () => {
    try {
      await productionAreaService.restoreArea(selectedArea.id)
      toast.success("Área de producción restaurada exitosamente")
      setIsRestoreDialogOpen(false)
      fetchInitialData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al restaurar el área de producción")
    }
  }

  const handleEdit = async (area) => {
    try {
      setIsLoading(true)
      const response = await productionAreaService.getAreaById(area.id)
      
      if (response.success) {
        const areaWithCategories = response.data
        setSelectedArea(areaWithCategories)
        setFormData({
          nombre: areaWithCategories.nombre,
          descripcion: areaWithCategories.descripcion,
          categorias: areaWithCategories.categorias?.map(cat => cat.id) || []
        })
        setIsCreateModalOpen(true)
      } else {
        toast.error("Error al cargar los datos del área")
      }
    } catch (error) {
      console.error("Error al cargar área:", error)
      toast.error("Error al cargar los datos del área")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (selectedArea) {
        const response = await productionAreaService.updateArea(selectedArea.id, formData)
        if (response.success) {
          toast.success("Área de producción actualizada exitosamente")
          setIsCreateModalOpen(false)
          setSelectedArea(null)
          setFormData({
            nombre: "",
            descripcion: "",
            categorias: []
          })
          fetchInitialData()
        } else {
          throw new Error(response.message)
        }
      } else {
        const response = await productionAreaService.createArea(formData)
        if (response.success) {
          toast.success("Área de producción creada exitosamente")
          setIsCreateModalOpen(false)
          fetchInitialData()
        } else {
          throw new Error(response.message)
        }
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold text-text">Gestión de Áreas de Producción</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" />
          Nueva Área
        </button>
      </div>

      <SearchAndFilter
        onSearch={(term) => setFilters(prev => ({ ...prev, search: term }))}
        onFilter={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        filters={filterOptions}
        totalItems={areas.length}
        currentFilters={filters}
        searchPlaceholder="Buscar por nombre o descripción..."
      />

      <div className="mt-6">
        <DataTable
          data={areas}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No se encontraron áreas de producción"
          emptyIcon={FiLayers}
        />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Desactivar Área de Producción"
        message="¿Estás seguro de que deseas desactivar esta área de producción?"
      />

      <ConfirmDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
        title="Restaurar Área de Producción"
        message="¿Estás seguro de que deseas restaurar esta área de producción?"
      />

      <ProductionAreaFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setSelectedArea(null)
          setFormData({
            nombre: "",
            descripcion: "",
            categorias: []
          })
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!selectedArea}
        selectedArea={selectedArea}
        categories={categories}
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
      />
    </div>
  )
}