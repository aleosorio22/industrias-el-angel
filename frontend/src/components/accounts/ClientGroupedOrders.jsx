import { FiUser, FiFileText, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";

export default function ClientGroupedOrders({ 
  clientName, 
  orders, 
  formatCurrency,
  onMarkAsPaid
}) {
  const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.monto || 0), 0);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
      <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <div className="flex items-center">
          <FiUser className="text-blue-500 mr-2" />
          <h2 className="font-semibold text-lg">{clientName}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total pendiente:</div>
          <div className="font-bold text-blue-600">
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sucursal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(order.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.sucursal_nombre || "Principal"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.total_productos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {formatCurrency(order.monto || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                      <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiFileText />
                    </Link>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Marcar como pagado"
                      onClick={() => onMarkAsPaid(order.id)}
                    >
                      <FiCheck />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}