import React from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function Presentations({ presentations, onAddPresentation, onEditPresentation, onDeletePresentation }) {
  // Asegurarse de que presentations siempre sea un array, incluso si es null o undefined
  const presentationsArray = Array.isArray(presentations) ? presentations : [];
  
  // Función de renderizado segura para cada presentación
  const renderPresentation = (presentation) => {
    if (!presentation || typeof presentation !== 'object') return null;
    
    return (
      <div key={presentation.id || Math.random()} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-medium">
            {presentation.presentacion_nombre || 'Sin nombre'}
          </p>
          <p className="text-sm text-gray-500">
            {presentation.cantidad || 0} unidades - Q{Number(presentation.precio || 0).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditPresentation && onEditPresentation(presentation)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDeletePresentation && onDeletePresentation(presentation)}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizado seguro para la lista de presentaciones
  const renderPresentationsList = () => {
    try {
      if (!Array.isArray(presentationsArray) || presentationsArray.length === 0) {
        return (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay presentaciones</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva presentación para este producto.</p>
          </div>
        );
      }
      
      return (
        <div className="space-y-4">
          {presentationsArray.map(renderPresentation)}
        </div>
      );
    } catch (error) {
      console.error("Error al renderizar presentaciones:", error);
      return (
        <div className="text-center py-6 text-red-500">
          Error al cargar las presentaciones. Por favor, intenta de nuevo.
        </div>
      );
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text flex items-center">
          <span className="bg-primary/10 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </span>
          Presentaciones
        </h2>
        <button
          onClick={onAddPresentation}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" />
          Agregar Presentación
        </button>
      </div>

      {renderPresentationsList()}
    </div>
  )
}