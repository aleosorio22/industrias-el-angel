import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import clientService from "../../services/ClientService"
import branchService from "../../services/BranchService"
import OrderService from "../../services/OrderService" // Añadimos esta importación
import RecentOrders from "../../components/user/RecentOrders" // Añadimos esta importación

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
  const [recentOrders, setRecentOrders] = useState([]) // Añadimos este estado
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
        
        // Fetch all data in parallel
        const [clientResponse, branchesResponse, ordersResponse] = await Promise.all([
          clientService.getMyClientData(),
          branchService.getMyBranches(),
          OrderService.getMyOrders()
        ]);

        setClientData(clientResponse);
        setBranches(branchesResponse);
        
        // Procesamos los pedidos recientes
        if (ordersResponse.success && ordersResponse.data.data) {
          const sortedOrders = [...ordersResponse.data.data]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 2); // Solo tomamos los últimos 2 pedidos
          setRecentOrders(sortedOrders);
        }
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
        
        {/* Pedidos recientes - Reemplazamos el div anterior por el nuevo componente */}
        <RecentOrders orders={recentOrders} />
        
        {/* Sucursales */}
        <BranchesPreview branches={branches} />
      </div>
    </div>
  )
}