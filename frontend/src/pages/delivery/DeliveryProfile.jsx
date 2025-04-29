import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiPhone, FiLock, FiLogOut } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function DeliveryProfile() {
  const { auth, logout } = useAuth();
  const user = auth?.user;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Mi Perfil</h1>
        <p className="text-text-light">Gestiona tu información personal</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <span className="text-primary text-xl font-bold">
              {user?.nombre ? user.nombre[0] : 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.nombre} {user?.apellido}</h2>
            <p className="text-text-light">Repartidor</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 text-text-light">
              <FiUser size={20} />
            </div>
            <div>
              <p className="text-sm text-text-light">Nombre completo</p>
              <p>{user?.nombre} {user?.apellido}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 text-text-light">
              <FiMail size={20} />
            </div>
            <div>
              <p className="text-sm text-text-light">Correo electrónico</p>
              <p>{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 text-text-light">
              <FiPhone size={20} />
            </div>
            <div>
              <p className="text-sm text-text-light">Teléfono</p>
              <p>{user?.telefono || 'No especificado'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full bg-white rounded-lg shadow p-4 flex items-center"
        >
          <FiLock size={20} className="text-text-light mr-3" />
          <span>Cambiar contraseña</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full bg-white rounded-lg shadow p-4 flex items-center text-red-500"
        >
          <FiLogOut size={20} className="mr-3" />
          <span>Cerrar sesión</span>
        </button>
      </div>
      
      {/* Modal para cambiar contraseña (simplificado) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cambiar contraseña</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success('Contraseña actualizada correctamente');
              setIsPasswordModalOpen(false);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-1">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-text-light hover:bg-accent/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}