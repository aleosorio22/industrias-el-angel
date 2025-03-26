import { Dialog } from "@headlessui/react"
import { FiX } from "react-icons/fi"

export default function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  users,
  isEditing,
  selectedClient
}) {
  // Asegurarse de que users sea un array antes de usar map
  const availableUsers = users?.data || [];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <Dialog.Title className="text-lg font-display text-text">
              {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-text-light hover:text-text transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="usuario_id" className="block text-sm font-medium text-text">
                Usuario Asignado
              </label>
              <select
                id="usuario_id"
                value={formData.usuario_id}
                onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                disabled={isEditing}
              >
                <option value="">Seleccionar usuario</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} - {user.nombre} {user.apellido}
                  </option>
                ))}
              </select>
              {availableUsers.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No hay usuarios disponibles para asignar
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-text">
                Nombre del Cliente
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nit" className="block text-sm font-medium text-text">
                NIT
              </label>
              <input
                type="text"
                id="nit"
                value={formData.nit}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="direccion" className="block text-sm font-medium text-text">
                Dirección
              </label>
              <textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telefono" className="block text-sm font-medium text-text">
                Teléfono
              </label>
              <input
                type="text"
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-lg text-text-light hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                {isEditing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}