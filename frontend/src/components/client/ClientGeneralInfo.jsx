import { FiEdit2 } from "react-icons/fi"

export default function ClientGeneralInfo({ client, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-text mb-4">Información General</h2>
        <button
          onClick={onEdit}
          className="p-2 text-text-light hover:text-primary transition-colors"
        >
          <FiEdit2 size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-text-light">Nombre</p>
          <p className="text-text">{client.nombre}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">NIT</p>
          <p className="text-text">{client.nit}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Dirección</p>
          <p className="text-text">{client.direccion}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Teléfono</p>
          <p className="text-text">{client.telefono}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Estado</p>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            client.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {client.estado}
          </span>
        </div>
      </div>
    </div>
  )
}