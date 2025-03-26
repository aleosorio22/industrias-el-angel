"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"  // Add this import
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiPackage, FiEye } from "react-icons/fi"
import { DataTable, SearchAndFilter } from "../../components/ui/data-table"
import ConfirmDialog from "../../components/ConfirmDialog"
import ProductFormModal from "../../components/ProductFormModal"
import productService from "../../services/ProductService"
import categoryService from "../../services/CategoryService"
import unitService from "../../services/UnitService"
import { toast } from "react-hot-toast"

export default function ProductsManagement() {
  const navigate = useNavigate();  // Add this line
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    estado: "activo",
    categoria_id: "all"
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    unidad_base_id: "",
    precio_base: "",
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
    },
    {
      id: "categoria_id",
      label: "Categoría",
      type: "select",
      options: [
        { value: "all", label: "Todas las categorías" },
        ...categories.map(cat => ({
          value: cat.id.toString(),
          label: cat.nombre
        }))
      ]
    }
  ]

  const columns = [
    {
      field: "codigo",
      header: "Código",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <FiPackage className="text-primary" />
          </div>
          <span className="font-medium text-text">{row.codigo}</span>
        </div>
      ),
    },
    {
      field: "nombre",
      header: "Nombre",
      sortable: true,
    },
    {
      field: "categoria_nombre",
      header: "Categoría",
      sortable: true,
    },
    {
      field: "precio_base",
      header: "Precio Base",
      sortable: true,
      render: (row) => (
        <span className="font-medium">
          Q{Number(row.precio_base).toFixed(2)}
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
    {
      field: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/products/${row.id}/details`)}
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
      const [productsData, categoriesData, unitsData] = await Promise.all([
        productService.getAllProducts(filters.estado === "inactivo" || filters.estado === "all"),
        categoryService.getAllCategories(),
        unitService.getAllUnits()
      ])

      let filteredProducts = productsData
      
      if (filters.estado !== "all") {
        filteredProducts = filteredProducts.filter(
          product => product.estado === filters.estado
        )
      }

      if (filters.categoria_id && filters.categoria_id !== "all") {
        filteredProducts = filteredProducts.filter(
          product => product.categoria_id.toString() === filters.categoria_id
        )
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(
          product =>
            product.codigo.toLowerCase().includes(searchTerm) ||
            product.nombre.toLowerCase().includes(searchTerm)
        )
      }

      setProducts(filteredProducts)
      setCategories(categoriesData)
      setUnits(unitsData)
    } catch (err) {
      setError(err.message)
      toast.error("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      // Convertir los IDs a números y precio_base a float
      const formattedData = {
        ...formData,
        categoria_id: parseInt(formData.categoria_id),
        unidad_base_id: parseInt(formData.unidad_base_id),
        precio_base: parseFloat(formData.precio_base)
      }
      
      await productService.createProduct(formattedData)
      toast.success("Producto creado exitosamente")
      setIsCreateModalOpen(false)
      fetchInitialData()
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        categoria_id: "",
        unidad_base_id: "",
        precio_base: "",
        estado: "activo"
      })
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error.response?.data?.message || "Error al crear el producto")
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      codigo: product.codigo,
      nombre: product.nombre,
      descripcion: product.descripcion,
      categoria_id: product.categoria_id,
      unidad_base_id: product.unidad_base_id,
      precio_base: product.precio_base,
      estado: product.estado
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await productService.updateProduct(selectedProduct.id, formData)
      toast.success("Producto actualizado exitosamente")
      setIsEditModalOpen(false)
      fetchInitialData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar el producto")
    }
  }

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await productService.deleteProduct(selectedProduct.id)
      toast.success("Producto desactivado exitosamente")
      setIsDeleteDialogOpen(false)
      fetchInitialData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al desactivar el producto")
    }
  }

  const handleRestore = (product) => {
    setSelectedProduct(product)
    setIsRestoreDialogOpen(true)
  }

  const confirmRestore = async () => {
    try {
      await productService.restoreProduct(selectedProduct.id)
      toast.success("Producto restaurado exitosamente")
      setIsRestoreDialogOpen(false)
      fetchInitialData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al restaurar el producto")
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold text-text">Gestión de Productos</h1>
        <button
          onClick={() => {
            setFormData({
              codigo: "",
              nombre: "",
              descripcion: "",
              categoria_id: "",
              unidad_base_id: "",
              precio_base: "",
              estado: "activo"
            })
            setIsCreateModalOpen(true)
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" />
          Nuevo Producto
        </button>
      </div>

      <SearchAndFilter
        onSearch={(term) => setFilters(prev => ({ ...prev, search: term }))}
        onFilter={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        filters={filterOptions}
        totalItems={products.length}
        currentFilters={filters}
        searchPlaceholder="Buscar por código o nombre..."
      />

      <div className="mt-6">
        <DataTable
          data={products}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No se encontraron productos"
          emptyIcon={FiPackage}
        />
      </div>

      <ProductFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        formData={formData}
        setFormData={setFormData}
        isEditing={false}
        categories={categories}
        units={units}
      />

      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        selectedProduct={selectedProduct}
        categories={categories}
        units={units}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Desactivar Producto"
        message="¿Estás seguro de que deseas desactivar este producto?"
      />

      <ConfirmDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
        title="Restaurar Producto"
        message="¿Estás seguro de que deseas restaurar este producto?"
      />
    </div>
  )
}