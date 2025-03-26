import React from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function Conversions({ conversions = [], onAddConversion, onEditConversion, onDeleteConversion }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text flex items-center">
          <span className="bg-primary/10 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </span>
          Conversiones
        </h2>
        <button
          onClick={onAddConversion}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" />
          Agregar Conversión
        </button>
      </div>

      {conversions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay conversiones</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva conversión para este producto.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversions.map((conversion) => (
            <div key={conversion.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">
                  1 {conversion.unidad_origen_nombre} = {conversion.factor_conversion} {conversion.unidad_destino_nombre}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditConversion(conversion)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => onDeleteConversion(conversion)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}