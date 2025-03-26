import { NavLink } from "react-router-dom"
import { FiHome, FiPackage, FiMapPin, FiUser } from "react-icons/fi"

export default function UserNavigation() {
  const navItems = [
    { to: "/user/dashboard", icon: FiHome, label: "Inicio" },
    { to: "/user/orders", icon: FiPackage, label: "Pedidos" },
    { to: "/user/branches", icon: FiMapPin, label: "Sucursales" },
    { to: "/user/profile", icon: FiUser, label: "Perfil" }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-3 ${
                  isActive ? "text-primary" : "text-text-light"
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}