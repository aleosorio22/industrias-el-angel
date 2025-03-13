import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiBell, 
  FiLogOut, 
  FiMenu,
  FiX,
  FiSettings 
} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Nueva venta registrada', time: '5 min' },
    { id: 2, text: 'Producto bajo en stock', time: '10 min' },
    { id: 3, text: 'Nuevo usuario registrado', time: '1 hora' },
  ];

  return (
    <nav className="bg-white shadow-soft">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y Título */}
          <div className="flex items-center">
            <h1 className="text-xl font-display text-text font-semibold hidden md:block">
              Panel Administrativo
            </h1>
            <button 
              className="text-text p-2 rounded-lg md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-accent/10">
              <FiUser className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text">{user?.nombre}</p>
                <p className="text-xs text-text-light capitalize">{user?.rol}</p>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button 
                className="p-2 rounded-lg hover:bg-accent/10 text-primary relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
              </button>

              {/* Dropdown Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-medium py-2 z-50">
                  {notifications.map(note => (
                    <div key={note.id} className="px-4 py-3 hover:bg-accent/10">
                      <p className="text-sm text-text">{note.text}</p>
                      <p className="text-xs text-text-light">{note.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/admin/profile')}
              className="p-2 rounded-lg hover:bg-accent/10 text-primary"
            >
              <FiSettings size={20} />
            </button>

            <button 
              onClick={logout}
              className="p-2 rounded-lg hover:bg-accent/10 text-primary"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isOpen && (
          <div className="md:hidden py-2 border-t border-accent/20">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-white">
              <div className="p-2 bg-primary/10 rounded-full">
                <FiUser className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-text font-medium">{user?.nombre}</p>
                <p className="text-text-light text-sm capitalize">{user?.rol}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-1">
              <button 
                onClick={() => navigate('/admin/notifications')}
                className="w-full flex items-center justify-between px-4 py-3 text-text hover:bg-accent/10 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FiBell className="text-primary" />
                  <span>Notificaciones</span>
                </div>
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">3</span>
              </button>

              <button 
                onClick={() => navigate('/admin/profile')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-text hover:bg-accent/10 rounded-lg transition-colors"
              >
                <FiSettings className="text-primary" />
                <span>Configuración</span>
              </button>

              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-text hover:bg-accent/10 rounded-lg transition-colors"
              >
                <FiLogOut className="text-primary" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}