import { FiTool } from "react-icons/fi"

export default function UnderConstruction({ title = "Página en construcción" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <FiTool className="text-primary" size={24} />
      </div>
      <h2 className="text-xl font-semibold text-text mb-2">{title}</h2>
      <p className="text-text-light max-w-md">
        Estamos trabajando en esta sección. Pronto estará disponible con todas las funcionalidades.
      </p>
    </div>
  )
}