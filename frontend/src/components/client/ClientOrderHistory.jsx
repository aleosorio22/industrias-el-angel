import { FiPackage } from "react-icons/fi"

export default function ClientOrderHistory({ clientId, orders, onRefresh }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text">Historial de Pedidos</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <FiPackage className="mx-auto h-12 w-12 text-text-light/50" />
          <p className="mt-2 text-text-light">No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lista de pedidos irá aquí */}
        </div>
      )}
    </div>
  )
}