"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiPieChart,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiTag,
  FiHash,
  FiBox, 
  FiLayers,
  FiDollarSign
} from "react-icons/fi"

// Creamos un contexto para compartir el estado del sidebar
import { createContext, useContext } from "react"
const SidebarContext = createContext()
export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Detectar tamaño de pantalla para colapsar automáticamente en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false)
      }
      // Eliminamos la expansión automática en pantallas grandes
    }

    // Inicializar
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default function Sidebar() {
  const { logout } = useAuth()
  const location = useLocation()
  const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen } = useSidebar()

  const menuItems = [
    { name: "Dashboard", icon: FiHome, path: "/admin/dashboard" },
    { name: "Usuarios", icon: FiUsers, path: "/admin/users" },
    { name: "Categorías", icon: FiTag, path: "/admin/categories" },
    { name: "Productos", icon: FiPackage, path: "/admin/products" },
    { name: "Unidades", icon: FiHash, path: "/admin/units"},
    { name: "Presentaciones", icon: FiBox, path: "/admin/presentations" },
    { name: "Pedidos", icon: FiShoppingCart, path: "/admin/orders" },
    { name: "Reportes", icon: FiPieChart, path: "/admin/reports" },
    { name: "Configuración", icon: FiSettings, path: "/admin/settings" },
    { name: "Ayuda", icon: FiHelpCircle, path: "/admin/help" },
    { name: "Clientes", icon: FiUsers, path: "/admin/clients" },
    { name: "Cobro de ventas", icon: FiDollarSign, path: "/admin/accounts-receivable" },
    { name: "Áreas de Producción", icon: FiLayers, path: "/admin/production-areas" },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Sidebar para desktop - Ahora con el nuevo esquema de colores */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1e1e1e] text-white transition-all duration-300 ease-in-out
                   ${isExpanded ? "w-64" : "w-[80px]"} 
                   hidden md:flex shadow-medium`}
      >
        {/* Logo y toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            {isExpanded && <span className="ml-3 text-text-inverted font-display font-semibold">El Ángel</span>}
          </Link>

          {isExpanded && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Colapsar menú"
            >
              <FiChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Toggle button for collapsed sidebar */}
        {!isExpanded && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-primary p-1.5 rounded-full text-white hover:bg-primary-dark shadow-md transition-colors"
            aria-label="Expandir menú"
          >
            <FiMenu size={16} />
          </button>
        )}

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
          <ul className="space-y-1.5 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isExpanded ? "px-4" : "justify-center px-0"} py-3 rounded-md transition-all duration-200
                            ${
                              isActive(item.path)
                                ? "bg-primary text-white shadow-md"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                >
                  <item.icon
                    className={`${isExpanded ? "mr-3" : ""} transition-transform ${isActive(item.path) ? "scale-110" : ""}`}
                    size={20}
                  />
                  {isExpanded && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className={`flex items-center ${isExpanded ? "px-4" : "justify-center px-0"} py-3 w-full text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors`}
            title="Cerrar Sesión"
          >
            <FiLogOut className={`${isExpanded ? "mr-3" : ""}`} size={20} />
            {isExpanded && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out transform ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeMobileSidebar}></div>

          {/* Sidebar content */}
          <div className="absolute inset-y-0 left-0 w-[280px] bg-[#1e1e1e] flex flex-col shadow-xl">
            {/* Header with close button */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <Link to="/admin/dashboard" className="flex items-center" onClick={closeMobileSidebar}>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">EA</span>
                </div>
                <span className="ml-3 text-text-inverted font-display font-semibold">El Ángel</span>
              </Link>
              <button
                onClick={closeMobileSidebar}
                className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar menú"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-primary text-white shadow-md"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={closeMobileSidebar}
                    >
                      <item.icon className={`mr-3 ${isActive(item.path) ? "scale-110" : ""}`} size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  logout()
                  closeMobileSidebar()
                }}
                className="flex items-center w-full px-4 py-3 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                <FiLogOut className="mr-3" size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

