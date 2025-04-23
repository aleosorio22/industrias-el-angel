import React from 'react';
import { FiTag } from 'react-icons/fi';

export default function ExploreCategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const categoryList = Array.isArray(categories) ? categories : [];

  // No renderizar si no hay categorías o si solo hay una (aparte de "Todas")
  // Puedes ajustar esta lógica si quieres mostrar el filtro incluso con una sola categoría
  if (categoryList.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
        <FiTag className="mr-1.5" size={14} /> Categorías
      </h3>
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide -mx-4 px-4">
        {/* "All" Button */}
        <button
          onClick={() => onSelectCategory(null)}
          aria-pressed={selectedCategory === null}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
            selectedCategory === null
              ? 'bg-primary text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>

        {/* Category Buttons */}
        {categoryList.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            aria-pressed={selectedCategory === category.id}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}