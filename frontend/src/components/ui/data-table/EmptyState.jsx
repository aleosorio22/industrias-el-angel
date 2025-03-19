import { FiInbox } from "react-icons/fi"

export default function EmptyState({ message = "No hay datos disponibles", icon: Icon = FiInbox }) {
  return (
    <div className="bg-white rounded-lg shadow-soft p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-accent/20 rounded-full">
          <Icon size={32} className="text-text-light" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-text mb-2">Sin resultados</h3>
      <p className="text-text-light">{message}</p>
    </div>
  )
}

