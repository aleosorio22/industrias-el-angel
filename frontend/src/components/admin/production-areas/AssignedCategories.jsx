import React from 'react';
import { FiTag } from 'react-icons/fi';

export default function AssignedCategories({ area }) {
  if (!area) {
    return <div className="animate-pulse bg-white rounded-lg shadow-md p-6 h-32"></div>;
  }

  const categories = area.categorias || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <FiTag className="mr-2" />
        Categorías Asignadas
      </h2>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay categorías asignadas</p>
      ) : (
        <div className="space-y-2">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="p-3 bg-gray-50 rounded-lg flex items-center"
            >
              <span className="text-gray-800">{category.nombre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}