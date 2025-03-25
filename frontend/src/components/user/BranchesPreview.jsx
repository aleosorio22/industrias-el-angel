import { Link } from "react-router-dom"
import { FiMapPin, FiPhone, FiChevronRight } from "react-icons/fi"

export default function BranchesPreview({ branches = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mis sucursales</h2>
        <Link to="/user/branches" className="text-primary text-sm flex items-center">
          Ver todas <FiChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      
      {branches.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <FiMapPin className="mx-auto h-8 w-8 text-text-light/30" />
          <p className="mt-2 text-text-light">No tienes sucursales registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {branches.slice(0, 2).map(branch => (
            <div key={branch.id} className="border border-gray-100 rounded-lg p-3">
              <h3 className="font-medium">{branch.nombre}</h3>
              {branch.direccion && (
                <div className="text-sm text-text-light mt-1">
                  <div className="flex items-start">
                    <FiMapPin className="mt-1 mr-2 flex-shrink-0" size={14} />
                    <span>{branch.direccion}</span>
                  </div>
                </div>
              )}
              {branch.telefono && (
                <div className="text-sm text-text-light mt-1">
                  <div className="flex items-center">
                    <FiPhone className="mr-2 flex-shrink-0" size={14} />
                    <span>{branch.telefono}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {branches.length > 2 && (
            <p className="text-center text-sm text-text-light">
              +{branches.length - 2} sucursales más
            </p>
          )}
        </div>
      )}
    </div>
  )
}