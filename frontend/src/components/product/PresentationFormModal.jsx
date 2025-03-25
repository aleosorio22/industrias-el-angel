import { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { FiX } from "react-icons/fi"
import presentationService from "../../services/PresentationService"

export default function PresentationFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [presentations, setPresentations] = useState([])
  const [formData, setFormData] = useState({
    presentacion_id: "",
    cantidad: "",
    precio: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const data = await presentationService.getAllPresentations()
        setPresentations(data)
      } catch (error) {
        console.error("Error loading presentations:", error)
      }
    }
    fetchPresentations()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        presentacion_id: initialData.presentacion_id,
        cantidad: initialData.cantidad,
        precio: initialData.precio
      })
    } else {
      setFormData({
        presentacion_id: "",
        cantidad: "",
        precio: ""
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold">
              {initialData ? "Editar Presentación" : "Nueva Presentación"}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presentación
              </label>
              <select
                value={formData.presentacion_id}
                onChange={(e) => setFormData({ ...formData, presentacion_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Seleccione una presentación</option>
                {presentations.map((pres) => (
                  <option key={pres.id} value={pres.id}>
                    {pres.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                min="0.01"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : initialData ? "Guardar Cambios" : "Crear Presentación"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}