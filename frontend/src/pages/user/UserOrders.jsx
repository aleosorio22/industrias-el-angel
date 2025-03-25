import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPlus, FiPackage, FiClock, FiCheck, FiX } from "react-icons/fi"

// Eliminamos la importación de UserHeader
// import UserHeader from "../../components/user/UserHeader"
// import UserNavigation from "../../components/user/UserNavigation"

export default function UserOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Código de ejemplo para la página de pedidos
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Eliminamos el UserHeader de aquí */}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Mis Pedidos</h1>
            <p className="text-gray-500">Gestiona tus pedidos y realiza nuevas compras</p>
          </div>
          <Link
            to="/user/orders/new"
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FiPlus className="mr-2" />
            Nuevo Pedido
          </Link>
        </div>

        {/* Contenido de la página */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No tienes pedidos aún</h3>
          <p className="text-gray-500 mb-6">
            Comienza realizando tu primer pedido con nosotros
          </p>
          <Link
            to="/user/orders/new"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FiPlus className="mr-2" />
            Crear Pedido
          </Link>
        </div>
      </main>
      
      {/* También eliminamos UserNavigation */}
      {/* <UserNavigation /> */}
    </div>
  )
}