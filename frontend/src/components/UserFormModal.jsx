import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function UserFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  isEditing,
  selectedUser 
}) {
  useEffect(() => {
    if (isEditing && selectedUser) {
      setFormData({
        nombre: selectedUser.nombre,
        apellido: selectedUser.apellido,
        email: selectedUser.email,
        telefono: selectedUser.telefono,
        rol: selectedUser.rol,
        estado: selectedUser.estado
      });
    }
  }, [isEditing, selectedUser, setFormData]);

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
                    {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-text-light hover:text-text">
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  {!isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Rol
                    </label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({...formData, rol: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="admin">Administrador</option>
                      <option value="produccion">Produccion</option>
                      <option value="repartidor">Repartidor</option>
                    </select>
                  </div>

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">
                        Estado
                      </label>
                      <select
                        value={formData.estado}
                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                      {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}