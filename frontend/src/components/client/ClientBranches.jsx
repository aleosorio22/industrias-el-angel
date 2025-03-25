import { useState, useEffect } from "react"
import { FiPlus, FiMapPin, FiEdit2, FiTrash2, FiRefreshCw, FiPhone, FiInfo } from "react-icons/fi"
import { toast } from "react-hot-toast"
import branchService from "../../services/BranchService"
import ConfirmDialog from "../ConfirmDialog"

export default function ClientBranches({ clientId, onRefresh }) {
  const [branches, setBranches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formData, setFormData] = useState({
    cliente_id: clientId,
    nombre: "",
    direccion: "",
    telefono: ""
  })

  useEffect(() => {
    fetchBranches()
  }, [clientId])

  const fetchBranches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await branchService.getBranchesByClientId(clientId, true)
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
        cliente_id: clientId,
        nombre: branch.nombre,
        direccion: branch.direccion,
        telefono: branch.telefono
      })
    } else {
      setSelectedBranch(null)
      setFormData({
        cliente_id: clientId,
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
      if (onRefresh) onRefresh()
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
      if (onRefresh) onRefresh()
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
      if (onRefresh) onRefresh()
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text">Sucursales</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
        >
          <FiPlus size={18} />
          <span>Agregar Sucursal</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-l-primary rounded-full mx-auto"></div>
          <p className="mt-2 text-text-light">Cargando sucursales...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center py-8">
          <FiMapPin className="mx-auto h-12 w-12 text-text-light/50" />
          <p className="mt-2 text-text-light">No hay sucursales registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div 
              key={branch.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                branch.estado === 'inactivo' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
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

      {/* Formulario de Sucursal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Dirección
                    </label>
                    <textarea
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-text-light hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    {selectedBranch ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detalle de Sucursal */}
      {isDetailOpen && selectedBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{selectedBranch.nombre}</h2>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-text-light hover:text-text"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-text-light mb-1">Dirección</h3>
                  <p className="text-text">{selectedBranch.direccion || 'Sin dirección'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-light mb-1">Teléfono</h3>
                  <p className="text-text">{selectedBranch.telefono || 'Sin teléfono'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-light mb-1">Estado</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedBranch.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedBranch.estado}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-text mb-3">Pedidos Recientes</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <FiInfo className="mx-auto h-8 w-8 text-text-light/50" />
                  <p className="mt-2 text-text-light">
                    La información de pedidos estará disponible próximamente
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-text rounded-md hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogos de confirmación */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Sucursal"
        message={`¿Estás seguro que deseas eliminar la sucursal "${selectedBranch?.nombre}"? Esta acción no se puede deshacer.`}
        type="warning"
      />

      <ConfirmDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
        title="Restaurar Sucursal"
        message={`¿Estás seguro que deseas restaurar la sucursal "${selectedBranch?.nombre}"?`}
        type="success"
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}