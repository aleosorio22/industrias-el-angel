import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoIndustrias from '../../assets/logo-panaderia.jpg';

export default function DeliveryHeader() {
  const { auth, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logoIndustrias} alt="Logo" className="h-10 w-auto mr-2" />
          <h1 className="text-lg font-semibold text-primary">PanTrack Delivery</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-text-light">
            <FiBell size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center text-text-light"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {auth?.user?.nombre ? auth.user.nombre[0] : 'U'}
                </span>
              </div>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <Link 
                  to="/delivery/profile" 
                  className="block px-4 py-2 text-sm text-text hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}