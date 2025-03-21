import { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { FiX } from "react-icons/fi"
import unitService from "../../services/UnitService"

export default function ConversionFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [units, setUnits] = useState([])
  const [formData, setFormData] = useState({
    unidad_origen_id: "",
    unidad_destino_id: "",
    factor_conversion: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const unitsData = await unitService.getAllUnits()
        setUnits(unitsData)
      } catch (error) {
        console.error("Error loading units:", error)
      }
    }
    fetchUnits()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        unidad_origen_id: initialData.unidad_origen_id,
        unidad_destino_id: initialData.unidad_destino_id,
        factor_conversion: initialData.factor_conversion
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
              {initialData ? "Editar Conversión" : "Nueva Conversión"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Origen
              </label>
              <select
                value={formData.unidad_origen_id}
                onChange={(e) => setFormData({ ...formData, unidad_origen_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Seleccione una unidad</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Destino
              </label>
              <select
                value={formData.unidad_destino_id}
                onChange={(e) => setFormData({ ...formData, unidad_destino_id: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Seleccione una unidad</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Factor de Conversión
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.factor_conversion}
                onChange={(e) => setFormData({ ...formData, factor_conversion: e.target.value })}
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
                {isLoading ? "Guardando..." : initialData ? "Guardar Cambios" : "Crear Conversión"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}