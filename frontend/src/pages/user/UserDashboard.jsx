import React from 'react';

export default function UserDashboard() {
  return (
    <div className="p-6">
      <h1 className="font-display text-heading-2 text-text mb-8">Mi Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
          <h2 className="text-lg font-display font-semibold mb-3 text-primary">Mi Perfil</h2>
          <p className="text-text-light mb-4">Gestiona tu información personal</p>
          <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
            Editar perfil <span className="ml-2">→</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
          <h2 className="text-lg font-display font-semibold mb-3 text-primary">Mis Ventas</h2>
          <p className="text-text-light mb-4">Historial de ventas realizadas</p>
          <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
            Ver historial <span className="ml-2">→</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
          <h2 className="text-lg font-display font-semibold mb-3 text-primary">Nueva Venta</h2>
          <p className="text-text-light mb-4">Registrar una nueva venta</p>
          <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
            Iniciar venta <span className="ml-2">→</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
          <h2 className="text-lg font-display font-semibold mb-3 text-primary">Productos</h2>
          <p className="text-text-light mb-4">Consulta de productos disponibles</p>
          <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center transition-colors">
            Ver productos <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}