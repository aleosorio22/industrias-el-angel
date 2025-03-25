import { Link } from "react-router-dom"
import { FiUser, FiBell, FiLogOut } from "react-icons/fi"
import { useAuth } from "../../context/AuthContext"

export default function UserHeader() {
  const { auth, logout } = useAuth()  // Cambiado de user a auth
  
  // Obtener el usuario del objeto auth
  const user = auth?.user
  
  // Obtener el nombre o la primera parte del nombre para mostrar
  const displayName = user?.nombre 
    ? user.nombre.split(' ')[0] 
    : user?.email?.split('@')[0] || 'Usuario'
  
  return (
    <header className="bg-white shadow-sm py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/user/dashboard" className="flex items-center">
            <div className="h-9 w-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
              IEA
            </div>
            <span className="text-lg font-semibold text-gray-800">Industrias El Ángel</span>
          </Link>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                <FiBell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full"></span>
              </button>
            </div>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <FiUser size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{displayName}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mi Perfil
                </Link>
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-2" size={14} />
                    Cerrar Sesión
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}