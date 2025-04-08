import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiMapPin, FiPackage, FiClipboard, FiTruck } from 'react-icons/fi';
import OrderService from '../../services/OrderService';
import { formatDate } from '../../utils/dateUtils';

// Eliminar cualquier función formatDate local
export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getOrderById(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Error al cargar el detalle del pedido');
      }
    } catch (err) {
      console.error('Error al cargar detalle del pedido:', err);
      setError(err.message || 'Error al cargar el detalle del pedido');
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha para mostrar
  // Eliminar la función formatDate local si existe
  
  // Obtener color de badge según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'solicitado':
        return 'bg-purple-100 text-purple-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatear estado para mostrar
  const formatStatus = (status) => {
    switch (status) {
      case 'solicitado':
        return 'Solicitado';
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En proceso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="p-4 text-red-500 text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="p-8 text-center text-gray-500">
            No se encontró el pedido
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-lg">
      <div className="bg-white rounded-lg shadow-md mb-4">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <Link to="/admin/orders" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <FiArrowLeft className="mr-2" />
            Volver a pedidos
          </Link>
          
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-semibold">Pedido #{order.id}</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.estado)}`}>
              {formatStatus(order.estado)}
            </span>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <h2 className="font-medium mb-3">Información del pedido</h2>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="mr-2" size={16} />
              <span>Fecha: {formatDate(order.fecha)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="mr-2" size={16} />
              <span>Cliente: {order.cliente_nombre || 'No especificado'}</span>
            </div>
            
            {order.sucursal_nombre && (
              <div className="flex items-center text-sm text-gray-600">
                <FiMapPin className="mr-2" size={16} />
                <span>Sucursal: {order.sucursal_nombre}</span>
              </div>
            )}
            
            {order.observaciones && (
              <div className="flex items-start text-sm text-gray-600">
                <FiClipboard className="mr-2 mt-1" size={16} />
                <span>Observaciones: {order.observaciones}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 sm:p-4">
          <h2 className="font-medium mb-3">Productos</h2>
          
          {order.detalles && order.detalles.length > 0 ? (
            <div className="space-y-3">
              {order.detalles.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FiPackage className="mr-3 text-gray-400" size={18} />
                    <div>
                      <p className="font-medium">{item.producto_nombre}</p>
                      {item.presentacion_nombre && (
                        <p className="text-xs text-gray-500">{item.presentacion_nombre}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {item.cantidad} x Q{parseFloat(item.precio_unitario || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">Q{(item.cantidad * parseFloat(item.precio_unitario || 0)).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total</p>
                  <p className="font-bold text-lg">
                    Q{order.detalles.reduce((total, item) => total + (item.cantidad * parseFloat(item.precio_unitario || 0)), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No hay productos en este pedido</p>
          )}
        </div>
      </div>
    </div>
  );
}