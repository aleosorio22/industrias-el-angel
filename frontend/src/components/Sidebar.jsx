"use client"

import logoImage from "../assets/logo-panaderia.jpg";

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

  // Add this function to handle menu item clicks
  // Update this function to handle menu item clicks for both mobile and desktop
  const handleMenuItemClick = () => {
  // Close mobile sidebar
  if (window.innerWidth < 768) {
    setIsMobileOpen(false);
  }
  
  // Collapse desktop sidebar if expanded
  if (window.innerWidth >= 768 && isExpanded) {
    setIsExpanded(false);
  }
  }

  return (
    <>
      {/* Sidebar para desktop - Actualizado según el diseño de Figma */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-secondary text-sidebar-text transition-all duration-300 ease-in-out
                   ${isExpanded ? "w-64" : "w-[80px]"} 
                   hidden md:flex shadow-sm border-r border-gray-100`}
      >
        {/* Logo y toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link to="/admin/dashboard" className="flex items-center">
            <div className="h-10 w-10 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden">
              <img 
                src={logoImage} 
                alt="El Ángel Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            {isExpanded && <span className="ml-3 text-sidebar-text font-display font-semibold">El Ángel</span>}
          </Link>

          {isExpanded && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
            className="absolute -right-3 top-20 bg-primary p-1.5 rounded-full text-white hover:bg-primary/90 shadow-md transition-colors"
            aria-label="Expandir menú"
          >
            <FiMenu size={16} />
          </button>
        )}

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-gray-50 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ul className="space-y-1.5 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick} // Add click handler
                  className={`flex items-center ${isExpanded ? "px-4" : "justify-center px-0"} py-3 rounded-md transition-all duration-200
                            ${
                              isActive(item.path)
                                ? "bg-sidebar-active text-white shadow-sm"
                                : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active"
                            }`}
                >
                  <item.icon
                    className={`${isExpanded ? "mr-3" : ""} transition-transform ${isActive(item.path) ? "scale-110" : ""} ${isActive(item.path) ? "text-white" : "text-sidebar-icon"}`}
                    size={20}
                  />
                  {isExpanded && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className={`flex items-center ${isExpanded ? "px-4" : "justify-center px-0"} py-3 w-full text-sidebar-text hover:text-sidebar-active rounded-md hover:bg-sidebar-hover transition-colors`}
            title="Cerrar Sesión"
          >
            <FiLogOut className={`${isExpanded ? "mr-3" : ""} text-sidebar-icon`} size={20} />
            {isExpanded && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar - también actualizado */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out transform ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeMobileSidebar}></div>

          {/* Sidebar content */}
          <div className="absolute inset-y-0 left-0 w-[280px] bg-sidebar flex flex-col shadow-xl">
            {/* Header with close button */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
              <Link to="/admin/dashboard" className="flex items-center" onClick={closeMobileSidebar}>
                <div className="h-10 w-10 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoImage} 
                    alt="El Ángel Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="ml-3 text-sidebar-text font-display font-semibold">El Ángel</span>
              </Link>
              <button
                onClick={closeMobileSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Cerrar menú"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-sidebar-active text-white shadow-sm"
                          : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active"
                      }`}
                      onClick={closeMobileSidebar} // This was already here, which is good
                    >
                      <item.icon className={`mr-3 ${isActive(item.path) ? "scale-110" : ""} ${isActive(item.path) ? "text-white" : "text-sidebar-icon"}`} size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  logout()
                  closeMobileSidebar()
                }}
                className="flex items-center w-full px-4 py-3 text-sidebar-text hover:text-sidebar-active rounded-md hover:bg-sidebar-hover transition-colors"
              >
                <FiLogOut className="mr-3 text-sidebar-icon" size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

