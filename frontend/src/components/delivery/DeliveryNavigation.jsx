import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTruck, FiUser, FiCheckSquare } from 'react-icons/fi';

export default function DeliveryNavigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-top z-10">
      <div className="flex justify-around items-center">
        <Link 
          to="/delivery/dashboard" 
          className={`flex flex-col items-center py-3 px-5 ${
            isActive('/delivery/dashboard') ? 'text-primary' : 'text-text-light'
          }`}
        >
          <FiHome size={20} />
          <span className="text-xs mt-1">Inicio</span>
        </Link>
        
        <Link 
          to="/delivery/orders" 
          className={`flex flex-col items-center py-3 px-5 ${
            isActive('/delivery/orders') ? 'text-primary' : 'text-text-light'
          }`}
        >
          <FiTruck size={20} />
          <span className="text-xs mt-1">Entregas</span>
        </Link>
        
        <Link 
          to="/delivery/completed" 
          className={`flex flex-col items-center py-3 px-5 ${
            isActive('/delivery/completed') ? 'text-primary' : 'text-text-light'
          }`}
        >
          <FiCheckSquare size={20} />
          <span className="text-xs mt-1">Completadas</span>
        </Link>
        
        <Link 
          to="/delivery/profile" 
          className={`flex flex-col items-center py-3 px-5 ${
            isActive('/delivery/profile') ? 'text-primary' : 'text-text-light'
          }`}
        >
          <FiUser size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}