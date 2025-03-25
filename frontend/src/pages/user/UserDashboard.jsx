import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import clientService from "../../services/ClientService"
import branchService from "../../services/BranchService"

// Componentes
import ClientInfoCard from "../../components/user/ClientInfoCard"
import QuickActions from "../../components/user/QuickActions"
import BranchesPreview from "../../components/user/BranchesPreview"
import { FiBarChart2 } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function UserDashboard() {
  const { auth } = useAuth()  // Cambiado de user a auth
  const [clientData, setClientData] = useState(null)
  const [branches, setBranches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Obtener el usuario del objeto auth
  const user = auth?.user
  
  // Depuración - ver la estructura del objeto auth y user
  useEffect(() => {
    console.log("Auth object:", auth)
    console.log("User object:", user)
  }, [auth, user])
  
  // Obtener el nombre o la primera parte del nombre para mostrar
  const displayName = user?.nombre 
    ? user.nombre.split(' ')[0] 
    : user?.email?.split('@')[0] || 'Usuario'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch client data
        const clientResponse = await clientService.getMyClientData()
        setClientData(clientResponse)
        
        // Fetch branches
        const branchesResponse = await branchService.getMyBranches()
        setBranches(branchesResponse)
      } catch (err) {
        setError(err.message || "Error al cargar los datos")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Cargando información...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Bienvenido, {displayName}</h1>
        <p className="text-gray-500">Gestiona tus pedidos y sucursales</p>
      </div>
      
      <div className="space-y-6">
        {/* Información del cliente */}
        <ClientInfoCard client={clientData} />
        
        {/* Acciones rápidas */}
        <QuickActions />
        
        {/* Pedidos recientes */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pedidos recientes</h2>
            <Link to="/user/orders" className="text-green-500 text-sm">Ver todos</Link>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <FiBarChart2 className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">
              Próximamente podrás ver tus pedidos recientes aquí
            </p>
          </div>
        </div>
        
        {/* Sucursales */}
        <BranchesPreview branches={branches} />
      </div>
    </div>
  )
}