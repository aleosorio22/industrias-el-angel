"use client"

import { Outlet } from "react-router-dom"
import { useState } from "react"
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import { FiBell, FiSearch, FiSettings, FiMenu } from "react-icons/fi"

// Componente para el contenido principal que se ajusta al sidebar
function MainContent() {
  const { isExpanded, isMobileOpen, setIsMobileOpen } = useSidebar()
  const { auth } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: "Nueva venta registrada", time: "5 min" },
    { id: 2, text: "Producto bajo en stock", time: "10 min" },
    { id: 3, text: "Nuevo usuario registrado", time: "1 hora" },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out bg-background-alt
                 ${isExpanded ? "md:ml-64" : "md:ml-[80px]"}`}
    >
      {/* Top navigation - Ahora con el nuevo esquema de colores */}
      <header className="bg-background text-text shadow-soft sticky top-0 z-20">
        <div className="flex justify-between items-center h-16 px-4 md:px-6">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-md text-text hover:bg-accent transition-colors mr-2"
              aria-label="Abrir menú"
            >
              <FiMenu size={24} />
            </button>

            <h1 className="text-xl font-display font-semibold hidden md:block">Panel Administrativo</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-text-light" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
              />
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-md hover:bg-accent text-text relative transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FiBell size={20} />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  3
                </span>
              </button>

              {/* Dropdown Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-medium py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <h3 className="font-semibold text-text">Notificaciones</h3>
                  </div>
                  {notifications.map((note) => (
                    <div key={note.id} className="px-4 py-3 hover:bg-accent cursor-pointer">
                      <p className="text-sm text-text">{note.text}</p>
                      <p className="text-xs text-text-light">Hace {note.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-border">
                    <button className="text-primary text-sm hover:text-primary-dark w-full text-center">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 rounded-md hover:bg-accent text-text transition-colors">
              <FiSettings size={20} />
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-md bg-accent hover:bg-accent-hover transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">{auth?.user?.nombre?.[0] || "U"}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text">{auth?.user?.nombre || "Usuario"}</p>
                <p className="text-xs text-text-light capitalize">{auth?.user?.rol || "admin"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <MainContent />
    </SidebarProvider>
  )
}

