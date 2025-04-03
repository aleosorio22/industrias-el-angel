import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPlus, FiPackage, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import OrderCard from "../../components/user/orders/OrderCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
// Importamos los componentes de la carpeta ui/data-table
import { EmptyState } from "../../components/ui/data-table/index";

export default function UserOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  
  useEffect(() => {
    fetchOrders();
    
    // Limpiar mensaje de éxito después de 5 segundos
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await OrderService.getMyOrders();
      
      if (response.success) {
        // Ordenar del más reciente al más antiguo
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.fecha) - new Date(a.fecha)
        );
        
        setOrders(sortedOrders);
      } else {
        setError("No se pudieron cargar los pedidos");
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError(err.message || "Error al cargar los pedidos");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll al inicio de la lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calcular órdenes para la página actual
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Componente simple de paginación
  const PaginationSimple = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Anterior
        </button>
        
        <span className="text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Siguiente
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <main className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Mis Pedidos</h1>
            <p className="text-sm text-gray-500">Gestiona tus pedidos y realiza nuevas compras</p>
          </div>
          <Link
            to="/user/orders/new"
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FiPlus className="mr-1" />
            <span className="hidden sm:inline">Nuevo Pedido</span>
            <span className="sm:hidden">Nuevo</span>
          </Link>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-green-700">
              &times;
            </button>
          </div>
        )}
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchOrders} 
              className="text-red-700 hover:bg-red-100 p-1 rounded-full"
              title="Reintentar"
            >
              <FiRefreshCw />
            </button>
          </div>
        ) : orders.length > 0 ? (
          <>
            <div>
              {currentOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            
            <PaginationSimple 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState 
            icon={<FiPackage className="h-12 w-12 text-gray-300" />}
            title="No tienes pedidos aún"
            description="Comienza realizando tu primer pedido con nosotros"
            action={
              <Link
                to="/user/orders/new"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <FiPlus className="mr-2" />
                Crear Pedido
              </Link>
            }
          />
        )}
      </main>
    </div>
  );
}