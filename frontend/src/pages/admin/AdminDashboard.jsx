import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiPieChart, 
  FiSettings,
  FiDollarSign,
  FiTruck,
  FiAlertCircle
} from 'react-icons/fi';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Ventas del día', value: '$25,430', change: '+12%', up: true },
    { label: 'Usuarios activos', value: '48', change: '+3', up: true },
    { label: 'Productos bajos', value: '12', change: '-2', up: false },
    { label: 'Pedidos pendientes', value: '35', change: '+5', up: true },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-soft">
            <p className="text-text-light text-sm">{stat.label}</p>
            <p className="text-text text-2xl font-semibold mt-2">{stat.value}</p>
            <p className={`text-sm mt-2 flex items-center ${stat.up ? 'text-primary' : 'text-red-500'}`}>
              {stat.up ? '↑' : '↓'} {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Módulos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/admin/users')}
          className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FiUsers className="text-2xl text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-primary">Usuarios</h2>
          </div>
          <p className="text-text-light mb-4">Gestión completa de usuarios del sistema</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light">48 usuarios activos</span>
            <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
              Administrar <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FiPackage className="text-2xl text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-primary">Productos</h2>
          </div>
          <p className="text-text-light mb-4">Control de inventario y productos</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light">12 productos bajos</span>
            <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
              Gestionar <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FiShoppingCart className="text-2xl text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-primary">Ventas</h2>
          </div>
          <p className="text-text-light mb-4">Registro y control de ventas</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light">35 ventas hoy</span>
            <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
              Ver detalles <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FiPieChart className="text-2xl text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-primary">Reportes</h2>
          </div>
          <p className="text-text-light mb-4">Estadísticas y análisis detallado</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light">4 reportes nuevos</span>
            <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
              Ver reportes <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FiSettings className="text-2xl text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-primary">Configuración</h2>
          </div>
          <p className="text-text-light mb-4">Ajustes generales del sistema</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light">Sistema actualizado</span>
            <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
              Configurar <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}