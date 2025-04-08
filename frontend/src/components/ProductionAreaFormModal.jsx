import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import ErrorMessage from "./ui/ErrorMessage"
import productionAreaService from "../services/ProductionAreaService"

export default function ProductionAreaFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  selectedArea,
  categories,
  isConfirmDialogOpen,
  setIsConfirmDialogOpen
}) {
  const [assignedCategories, setAssignedCategories] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignedCategories = async () => {
      try {
        const response = await productionAreaService.getAssignedCategories()
        if (response.success) {
          const assigned = {}
          response.data.forEach(assignment => {
            assigned[assignment.categoria_id] = assignment.area_nombre
          })
          setAssignedCategories(assigned)
        }
      } catch (error) {
        console.error("Error al cargar categorías asignadas:", error)
        setError("Error al cargar las categorías asignadas")
      }
    }

    if (isOpen) {
      fetchAssignedCategories()
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error en el formulario:", error)
      // Manejo del error aquí si es necesario
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium text-text">
                    {isEditing ? "Editar Área de Producción" : "Nueva Área de Producción"}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-text-light hover:text-text transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descripción</label>
                    <textarea
                      rows="3"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Categorías</label>
                    <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                      {categories.map(category => {
                        const isAssigned = assignedCategories[category.id] && 
                                       (!isEditing || assignedCategories[category.id] !== selectedArea?.nombre)
                        
                        return (
                          <label 
                            key={category.id} 
                            className={`flex items-center space-x-2 p-2 rounded cursor-pointer
                              ${isAssigned ? 'opacity-50 bg-gray-100' : 'hover:bg-accent/5'}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.categorias.includes(category.id)}
                              onChange={(e) => {
                                if (!isAssigned) {
                                  const newCategorias = e.target.checked
                                    ? [...formData.categorias, category.id]
                                    : formData.categorias.filter(id => id !== category.id)
                                  setFormData({ ...formData, categorias: newCategorias })
                                }
                              }}
                              disabled={isAssigned}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                            />
                            <span className="text-sm text-text">
                              {category.nombre}
                              {isAssigned && (
                                <span className="ml-2 text-xs text-text-light">
                                  (Asignada a: {assignedCategories[category.id]})
                                </span>
                              )}
                            </span>
                          </label>
                        )
                      })}
                      {categories.length === 0 && (
                        <p className="text-sm text-text-light text-center py-2">
                          No hay categorías disponibles
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-text-light mt-1">
                      Selecciona las categorías aplicables
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 rounded-lg text-text-light hover:bg-accent/10 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                    >
                      {isEditing ? "Guardar Cambios" : "Crear Área"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}