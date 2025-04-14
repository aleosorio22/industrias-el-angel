import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLayers } from 'react-icons/fi';

export default function AreaDetailsHeader({ area }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Link 
        to="/admin/production-areas" 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <FiArrowLeft className="mr-2" />
        Volver a áreas de producción
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
            <FiLayers className="text-primary h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{area?.nombre}</h1>
            <p className="text-gray-500">{area?.descripcion}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          area?.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {area?.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  );
}