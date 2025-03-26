import { FiShoppingBag, FiMapPin, FiPhone } from "react-icons/fi"

export default function ClientInfoCard({ client }) {
  if (!client) return null
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
          <FiShoppingBag className="text-primary" size={20} />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{client.nombre}</h2>
          {client.direccion && (
            <div className="flex items-start mt-1">
              <FiMapPin className="text-text-light mt-1 mr-1 flex-shrink-0" size={14} />
              <p className="text-text-light text-sm">{client.direccion}</p>
            </div>
          )}
          {client.telefono && (
            <div className="flex items-center mt-1">
              <FiPhone className="text-text-light mr-1" size={14} />
              <p className="text-text-light text-sm">{client.telefono}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}