import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import branchService from "../../services/BranchService"
import UserNavigation from "../../components/user/UserNavigation"
import { FiPlus, FiMapPin, FiEdit2, FiTrash2, FiRefreshCw, FiPhone, FiInfo } from "react-icons/fi"
import ConfirmDialog from "../../components/ConfirmDialog"

// Eliminamos la importación de UserHeader
// import UserHeader from "../../components/user/UserHeader"

export default function UserBranches() {
  const [branches, setBranches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: ""
  })

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await branchService.getMyBranches()
      setBranches(data)
    } catch (error) {
      setError(error.message || 'Error al cargar las sucursales')
      toast.error('Error al cargar las sucursales')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenForm = (branch = null) => {
    if (branch) {
      setSelectedBranch(branch)
      setFormData({
        nombre: branch.nombre,
        direccion: branch.direccion,
        telefono: branch.telefono
      })
    } else {
      setSelectedBranch(null)
      setFormData({
        nombre: "",
        direccion: "",
        telefono: ""
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedBranch(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedBranch) {
        await branchService.updateBranch(selectedBranch.id, formData)
        toast.success('Sucursal actualizada exitosamente')
      } else {
        await branchService.createBranch(formData)
        toast.success('Sucursal creada exitosamente')
      }
      await fetchBranches()
      setIsFormOpen(false)
    } catch (error) {
      setError(error.message || 'Error al guardar la sucursal')
      toast.error(error.message || 'Error al guardar la sucursal')
    }
  }

  const handleDelete = (branch) => {
    setSelectedBranch(branch)
    setIsDeleteDialogOpen(true)
  }

  const handleRestore = (branch) => {
    setSelectedBranch(branch)
    setIsRestoreDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await branchService.deleteBranch(selectedBranch.id)
      toast.success('Sucursal eliminada exitosamente')
      await fetchBranches()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      setError(error.message || 'Error al eliminar la sucursal')
      toast.error(error.message || 'Error al eliminar la sucursal')
    }
  }

  const confirmRestore = async () => {
    try {
      await branchService.restoreBranch(selectedBranch.id)
      toast.success('Sucursal restaurada exitosamente')
      await fetchBranches()
      setIsRestoreDialogOpen(false)
    } catch (error) {
      setError(error.message || 'Error al restaurar la sucursal')
      toast.error(error.message || 'Error al restaurar la sucursal')
    }
  }

  const handleOpenDetail = (branch) => {
    setSelectedBranch(branch)
    setIsDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Eliminamos el UserHeader de aquí */}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text">Mis Sucursales</h1>
            <p className="text-text-light">Gestiona las sucursales de tu empresa</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FiPlus className="mr-2" />
            Nueva Sucursal
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-l-primary rounded-full mx-auto"></div>
            <p className="mt-4 text-text-light">Cargando sucursales...</p>
          </div>
        ) : branches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiMapPin className="mx-auto h-12 w-12 text-text-light/30" />
            <p className="mt-4 text-text-light">No tienes sucursales registradas</p>
            <button
              onClick={() => handleOpenForm()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Agregar Sucursal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <div 
                key={branch.id} 
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                  branch.estado === 'inactivo' ? 'bg-red-50 border-red-200' : 'border border-gray-100'
                }`}
                onClick={() => handleOpenDetail(branch)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-text">{branch.nombre}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenForm(branch)
                      }}
                      className="p-1 text-text-light hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    {branch.estado === 'activo' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(branch)
                        }}
                        className="p-1 text-text-light hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestore(branch)
                        }}
                        className="p-1 text-text-light hover:text-green-600 transition-colors"
                        title="Restaurar"
                      >
                        <FiRefreshCw size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-text-light mb-2">
                  <div className="flex items-start">
                    <FiMapPin className="mt-1 mr-2 flex-shrink-0" size={14} />
                    <span>{branch.direccion || 'Sin dirección'}</span>
                  </div>
                </div>
                {branch.telefono && (
                  <div className="text-sm text-text-light">
                    <div className="flex items-center">
                      <FiPhone className="mr-2" size={14} />
                      <span>{branch.telefono}</span>
                    </div>
                  </div>
                )}
                {branch.estado === 'inactivo' && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Inactivo
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* También podemos eliminar UserNavigation ya que está en UserLayout */}
      {/* <UserNavigation /> */}
    </div>
  )
}