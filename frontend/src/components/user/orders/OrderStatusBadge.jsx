import React from 'react';
import { FiClock, FiLoader, FiCheck, FiX, FiTruck, FiPackage } from 'react-icons/fi';

const OrderStatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';
  let icon = null;
  let label = 'Desconocido';

  switch (status) {
    case 'solicitado':
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-600';
      icon = <FiClock />;
      label = 'Solicitado';
      break;
    case 'en_proceso':
    case 'en proceso':
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-600';
      icon = <FiLoader />;
      label = 'En proceso';
      break;
    case 'completado':
      bgColor = 'bg-green-50';
      textColor = 'text-green-600';
      icon = <FiCheck />;
      label = 'Completado';
      break;
    case 'cancelado':
      bgColor = 'bg-red-50';
      textColor = 'text-red-600';
      icon = <FiX />;
      label = 'Cancelado';
      break;
    // Nuevos estados para entregas
    case 'listo para entregar a ruta':
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-600';
      icon = <FiPackage />;
      label = 'Listo para entregar';
      break;
    case 'en ruta':
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-600';
      icon = <FiTruck />;
      label = 'En ruta';
      break;
    case 'entregado':
      bgColor = 'bg-green-50';
      textColor = 'text-green-600';
      icon = <FiCheck />;
      label = 'Entregado';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  );
};

export default OrderStatusBadge;