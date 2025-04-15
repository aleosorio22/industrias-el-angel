import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { FiUser, FiMail, FiPhone, FiLock, FiLogOut, FiList } from "react-icons/fi" // Agregamos FiList
import { toast } from "react-hot-toast"
import UnderConstruction from "../../components/user/UnderConstruction"
import clientService from "../../services/ClientService"
import { Link } from "react-router-dom" // Importamos Link

export default function UserProfile() {
  const { auth, logout } = useAuth()
  const user = auth?.user
  const [clientData, setClientData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  
  // Obtener datos adicionales del cliente
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true)
        const data = await clientService.getMyClientData()
        setClientData(data)
      } catch (error) {
        console.error("Error al cargar datos del cliente:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchClientData()
  }, [])
  
  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada exitosamente")
  }
  
  // Combinar datos de auth.user y clientData
  const userData = {
    nombre: clientData?.nombre || user?.nombre || 'Usuario',
    email: user?.email || clientData?.email || 'No disponible',
    telefono: clientData?.telefono || user?.telefono || 'No disponible',
    rol: user?.rol || 'Cliente'
  }
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Mi Perfil</h1>
          <p className="text-gray-500">Gestiona tu información personal</p>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <FiUser className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData.nombre}</h2>
                <p className="text-gray-500">{userData.rol}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center border-b border-gray-100 pb-4">
                <FiMail className="text-gray-400 mr-3" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Correo electrónico</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-100 pb-4">
                <FiPhone className="text-gray-400 mr-3" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{userData.telefono}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <Link 
            to="/user/templates"
            className="w-full px-4 py-3 flex items-center text-left hover:bg-gray-50 transition-colors"
          >
            <FiList className="text-gray-400 mr-3" size={18} />
            <span>Gestionar mis plantillas</span>
          </Link>
          
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full px-4 py-3 flex items-center text-left hover:bg-gray-50 transition-colors"
          >
            <FiLock className="text-gray-400 mr-3" size={18} />
            <span>Cambiar contraseña</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3" size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
        
        {/* Sección en construcción para editar perfil */}
        <UnderConstruction title="Edición de perfil en desarrollo" />
      </main>
      
      {/* Modal para cambiar contraseña - Por implementar */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>
              <p className="text-gray-500 mb-4">
                Esta funcionalidad estará disponible próximamente.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}