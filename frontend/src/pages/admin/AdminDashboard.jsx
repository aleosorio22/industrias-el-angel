import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiTruck,
  FiShoppingCart,
  FiPieChart,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi"
import { Link } from "react-router-dom"

import StatCard from "../../components/dashboard/StatCard"
import DashboardSection from "../../components/dashboard/DashboardSection"
import ActivityItem from "../../components/dashboard/ActivityItem"

export default function AdminDashboard() {
  const stats = [
    { label: "Ventas del día", value: "$25,430", change: "+12%", up: true, icon: FiDollarSign },
    { label: "Usuarios activos", value: "48", change: "+3", up: true, icon: FiUsers },
    { label: "Productos bajos", value: "12", change: "-2", up: false, icon: FiPackage },
    { label: "Pedidos pendientes", value: "35", change: "+5", up: true, icon: FiTruck },
  ]

  const modules = [
    {
      title: "Usuarios",
      description: "Gestión completa de usuarios del sistema",
      icon: FiUsers,
      stats: "48 usuarios activos",
      route: "/admin/users",
    },
    {
      title: "Productos",
      description: "Control de inventario y productos",
      icon: FiPackage,
      stats: "12 productos bajos",
      route: "/admin/products",
    },
    {
      title: "Ventas",
      description: "Registro y control de ventas",
      icon: FiShoppingCart,
      stats: "35 ventas hoy",
      route: "/admin/sales",
    },
    {
      title: "Reportes",
      description: "Estadísticas y análisis detallado",
      icon: FiPieChart,
      stats: "4 reportes nuevos",
      route: "/admin/reports",
    },
  ]

  const recentActivity = [
    {
      title: "Nueva venta registrada",
      time: "Hace 5 min",
      description: "Venta #1234 por $1,250.00",
      icon: FiShoppingCart,
      type: "sale",
    },
    {
      title: "Producto bajo en stock",
      time: "Hace 10 min",
      description: "Pan Integral - Quedan 5 unidades",
      icon: FiAlertCircle,
      type: "alert",
    },
    {
      title: "Nuevo usuario registrado",
      time: "Hace 1 hora",
      description: "María González se ha registrado",
      icon: FiUsers,
      type: "info",
    },
  ]

  return (
    <div>
      {/* Bienvenida personalizada */}
      <div className="mb-10 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-text">
          ¡Bienvenido al Panel Administrativo!
        </h1>
        <p className="text-text-light mt-3 max-w-2xl mx-auto">
          Aquí tienes un resumen de la actividad reciente y acceso rápido a las funciones principales.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <DashboardSection title="Resumen del día" className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </DashboardSection>

      {/* Layout de dos columnas para desktop, una columna para móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2">
          {/* Módulos principales */}
          <DashboardSection title="Módulos principales" className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {modules.map((module, index) => (
                <Link
                  key={index}
                  to={module.route}
                  className="bg-background p-5 sm:p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 block group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-accent rounded-lg text-primary group-hover:bg-accent-hover transition-colors">
                      <module.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-display font-semibold text-text">{module.title}</h2>
                  </div>
                  <p className="text-text-light text-sm mb-4">{module.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light">{module.stats}</span>
                    <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center text-sm font-medium">
                      Ver más <span className="ml-1">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </DashboardSection>
        </div>

        {/* Columna lateral */}
        <div>
          {/* Actividad reciente */}
          <div className="bg-background rounded-lg shadow-soft p-5 sm:p-6 mb-6">
            <h3 className="font-display font-semibold text-text mb-5 flex items-center text-lg">
              <FiActivity className="mr-2 text-primary" />
              Actividad Reciente
            </h3>
            <div className="divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Link
                to="/admin/activity"
                className="text-primary hover:text-primary-dark text-sm font-medium inline-flex items-center"
              >
                Ver todas las actividades <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

