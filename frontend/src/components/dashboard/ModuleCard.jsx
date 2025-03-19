"use client"
import { useNavigate } from "react-router-dom"

export default function ModuleCard({ title, description, icon: Icon, stats, route, onClick }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (route) {
      navigate(route)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-background p-5 sm:p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center space-x-4 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 bg-accent rounded-lg group-hover:bg-accent-hover transition-colors">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <h2 className="text-base sm:text-lg font-display font-semibold text-text">{title}</h2>
      </div>
      <p className="text-text-light text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs sm:text-sm text-text-light">{stats}</span>
        <button className="text-primary hover:text-primary-dark font-medium inline-flex items-center text-sm transition-colors">
          Ver más <span className="ml-1 sm:ml-2">→</span>
        </button>
      </div>
    </div>
  )
}

