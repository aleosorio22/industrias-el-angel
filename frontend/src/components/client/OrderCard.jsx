import { FiCalendar, FiUser, FiInfo, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OrderCard({ order, formatDate, getStatusColor }) {
  const navigate = useNavigate();

  if (!order) return null;

  const fecha_pedido = order.fecha || order.created_at;
  const estado = order.estado || 'pendiente';
  
  const handleClick = () => {
    // Navegamos a la ruta de admin
    navigate(`/admin/orders/${order.id}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white cursor-pointer hover:border-primary"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg text-gray-900">Pedido #{order.id}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(estado)}`}>
              {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FiCalendar className="mr-2" size={14} />
            {formatDate(fecha_pedido)}
          </div>
        </div>
        
        {order.created_at !== order.updated_at && (
          <div className="text-xs text-gray-500">
            <FiClock className="inline mr-1" size={12} />
            Actualizado: {formatDate(order.updated_at)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiUser className="mr-2" size={14} />
          <span>Solicitado por: {order.usuario_email}</span>
        </div>

        {order.cliente_nombre && (
          <div className="flex items-center text-sm text-gray-600">
            <FiUser className="mr-2" size={14} />
            <span>Cliente: {order.cliente_nombre}</span>
          </div>
        )}
      </div>

      {order.observaciones && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-start">
            <FiInfo className="mr-2 mt-0.5 text-gray-500" size={14} />
            <p className="text-sm text-gray-600">{order.observaciones}</p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>ID: {order.id}</span>
          <span>Cliente ID: {order.cliente_id}</span>
          {order.sucursal_id && <span>Sucursal ID: {order.sucursal_id}</span>}
        </div>
      </div>
    </div>
  );
}