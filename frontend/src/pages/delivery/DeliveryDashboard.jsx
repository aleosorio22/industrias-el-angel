import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiTruck, FiCheckSquare, FiClock } from "react-icons/fi";
import OrderService from "../../services/OrderService";

export default function DeliveryDashboard() {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    pendingOrders: 0,
    completedToday: 0,
    inProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Aquí podrías cargar estadísticas reales desde tu API
    // Por ahora usamos datos de ejemplo
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Simulamos una llamada a la API
        setTimeout(() => {
          setStats({
            pendingOrders: 5,
            completedToday: 8,
            inProgress: 2
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Obtener el nombre del repartidor
  const displayName = auth?.user?.nombre 
    ? auth.user.nombre.split(' ')[0] 
    : 'Repartidor';
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Hola, {displayName}</h1>
        <p className="text-text-light">Bienvenido a tu panel de repartidor</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-light text-sm">Pendientes</p>
                  <p className="text-2xl font-bold text-text">{stats.pendingOrders}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiClock className="text-primary" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-light text-sm">En progreso</p>
                  <p className="text-2xl font-bold text-text">{stats.inProgress}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiTruck className="text-primary" size={20} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light text-sm">Completadas hoy</p>
                <p className="text-2xl font-bold text-text">{stats.completedToday}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FiCheckSquare className="text-primary" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Próximas entregas</h2>
            {stats.pendingOrders > 0 ? (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="font-medium">Panadería El Trigal</p>
                  <p className="text-sm text-text-light">Calle Principal #123</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pendiente</span>
                    <span className="text-xs text-text-light">10:30 AM</span>
                  </div>
                </div>
                
                <div className="border-b pb-3">
                  <p className="font-medium">Cafetería Central</p>
                  <p className="text-sm text-text-light">Av. Reforma #456</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">En progreso</span>
                    <span className="text-xs text-text-light">11:15 AM</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-text-light text-center py-4">No hay entregas pendientes</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}