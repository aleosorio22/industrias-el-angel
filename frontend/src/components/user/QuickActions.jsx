import { Link } from "react-router-dom"
import { FiPackage, FiClock, FiMapPin } from "react-icons/fi"

export default function QuickActions() {
  const actions = [
    {
      icon: FiPackage,
      title: "Nuevo Pedido",
      to: "/user/orders/new",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: FiClock,
      title: "Mis Pedidos",
      to: "/user/orders",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: FiMapPin,
      title: "Sucursales",
      to: "/user/branches",
      color: "bg-green-100 text-green-600"
    }
  ]
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link 
            key={action.to}
            to={action.to} 
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-medium text-center text-gray-700">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}