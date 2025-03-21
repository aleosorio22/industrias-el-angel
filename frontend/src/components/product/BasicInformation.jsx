import React from 'react'

export default function BasicInformation({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
      <h2 className="text-xl font-semibold text-text mb-6 flex items-center">
        <span className="bg-primary/10 p-2 rounded-lg mr-3">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        Información Básica
      </h2>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-500">Código</span>
            <p className="font-medium mt-1">{product.codigo}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-500">Nombre</span>
            <p className="font-medium mt-1">{product.nombre}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="text-sm text-gray-500">Descripción</span>
          <p className="font-medium mt-1">{product.descripcion || "Sin descripción"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-500">Categoría</span>
            <p className="font-medium mt-1">{product.categoria_nombre}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-500">Precio Base</span>
            <p className="font-medium mt-1">${Number(product.precio_base).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="text-sm text-gray-500">Estado</span>
          <div className="mt-1">
            <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
              product.estado === "activo" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {product.estado.charAt(0).toUpperCase() + product.estado.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}