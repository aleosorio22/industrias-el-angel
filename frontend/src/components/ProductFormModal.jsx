import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { FiX } from "react-icons/fi"

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  selectedProduct,
  categories,
  units
}) {
  useEffect(() => {
    if (isEditing && selectedProduct) {
      setFormData({
        codigo: selectedProduct.codigo,
        nombre: selectedProduct.nombre,
        descripcion: selectedProduct.descripcion,
        categoria_id: selectedProduct.categoria_id,
        unidad_base_id: selectedProduct.unidad_base_id,
        precio_base: selectedProduct.precio_base,
        estado: selectedProduct.estado,
      })
    }
  }, [isEditing, selectedProduct, setFormData])

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-text/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-medium transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-display font-semibold text-text">
                    {isEditing ? "Editar Producto" : "Nuevo Producto"}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-text-light hover:text-text">
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Código</label>
                    <input
                      type="text"
                      required
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

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
                    <label className="block text-sm font-medium text-text mb-1">Categoría</label>
                    <select
                      required
                      value={formData.categoria_id}
                      onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Seleccione una categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Unidad Base</label>
                    <select
                      required
                      value={formData.unidad_base_id}
                      onChange={(e) => setFormData({ ...formData, unidad_base_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Seleccione una unidad</option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.nombre} ({unit.simbolo})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Precio Base</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.precio_base}
                      onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Estado</label>
                      <select
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-text-light hover:bg-accent/10 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                    >
                      {isEditing ? "Guardar Cambios" : "Crear Producto"}
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