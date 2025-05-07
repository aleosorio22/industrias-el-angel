import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiDollarSign, FiFileText, FiCheck, FiCalendar, FiUser, FiPrinter } from "react-icons/fi";
import OrderService from "../../services/OrderService";
import ClientService from "../../services/ClientService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { DataTable, SearchAndFilter } from "../../components/ui/data-table";
import { formatDate } from "../../utils/dateUtils";
import ClientGroupedOrders from "../../components/accounts/ClientGroupedOrders";

export default function AccountsReceivable() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    clientId: "",
    groupByClient: false,
    dateFilter: false,
    dateType: "Pago de Fecha"
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  // Separamos los useEffect para evitar llamadas duplicadas
  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchPendingPayments();
  }, [pagination.currentPage, pagination.pageSize, filters.clientId]);

  const fetchPendingPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await OrderService.getPendingPaymentOrders(
        filters.clientId || null,
        pagination.currentPage,
        pagination.pageSize
      );
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setPagination({
          ...pagination,
          totalItems: response.data.total || 0,
          totalPages: Math.ceil((response.data.total || 0) / pagination.pageSize)
        });
      } else {
        setError(response.message || "Error al cargar los pedidos pendientes de pago");
      }
    } catch (err) {
      console.error("Error al cargar pedidos pendientes:", err);
      setError(err.message || "Error al cargar los pedidos pendientes de pago");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await ClientService.getAllClients();
      
      if (response.success) {
        setClients(response.data);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, currentPage: 1 });
    
    // If client filter changed, fetch new data immediately
    if (newFilters.clientId !== undefined && newFilters.clientId !== filters.clientId) {
      fetchPendingPayments();
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({ 
      ...pagination, 
      pageSize: newSize,
      currentPage: 1
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount || 0);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchLower = filters.search.toLowerCase();
    return (
      order.id?.toString().includes(searchLower) ||
      (order.cliente_nombre && order.cliente_nombre.toLowerCase().includes(searchLower)) ||
      (order.sucursal_nombre && order.sucursal_nombre.toLowerCase().includes(searchLower))
    );
  });

  // Group orders by client if needed
  const groupedOrders = filters.groupByClient
    ? filteredOrders.reduce((acc, order) => {
        const clientName = order.cliente_nombre || "Cliente sin nombre";
        if (!acc[clientName]) {
          acc[clientName] = [];
        }
        acc[clientName].push(order);
        return acc;
      }, {})
    : null;

  // Definir las columnas para la tabla
  const columns = [
    {
      field: "id",
      header: "ID Pedido",
      sortable: true,
      render: (row) => <span>#{row.id}</span>
    },
    {
      field: "fecha",
      header: "Fecha",
      sortable: true,
      render: (row) => formatDate(row.fecha)
    },
    {
      field: "cliente_nombre",
      header: "Cliente",
      sortable: true
    },
    {
      field: "sucursal_nombre",
      header: "Sucursal",
      sortable: true,
      render: (row) => row.sucursal_nombre || "Principal"
    },
    {
      field: "total_productos",
      header: "Productos",
      sortable: true
    },
    {
      field: "monto",
      header: "Monto",
      sortable: true,
      render: (row) => formatCurrency(row.monto || 0)
    },
    {
      field: "estado",
      header: "Estado",
      sortable: true
    }
  ];

  // Renderizar acciones para cada fila
  const renderRowActions = (row) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/admin/delivered-orders/${row.id}`}
        className="text-blue-600 hover:text-blue-800"
        title="Ver detalle de entrega"
      >
        <FiFileText />
      </Link>
      <button
        className="text-green-600 hover:text-green-800"
        title="Marcar como pagado"
        onClick={() => handleMarkAsPaid(row.id)}
      >
        <FiCheck />
      </button>
    </div>
  );

  const handleMarkAsPaid = (orderId) => {
    // Implementar lógica para marcar como pagado
    console.log("Marcar como pagado:", orderId);
    // Aquí iría la llamada al servicio para actualizar el estado
  };

  // Opciones de filtro para el componente SearchAndFilter
  const filterOptions = [
    {
      id: "clientId",
      label: "Cliente",
      type: "select",
      options: [
        { value: "", label: "Todos los clientes" },
        ...clients.map(client => ({
          value: client.id.toString(),
          label: client.nombre
        }))
      ]
    },
    {
      id: "groupByClient",
      label: "Agrupar por cliente",
      type: "select",
      options: [
        { value: false, label: "No" },
        { value: true, label: "Sí" }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Encabezado con título y botón de imprimir */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cuentas por Cobrar</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los pagos pendientes de los pedidos entregados
          </p>
        </div>
        <button 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => console.log("Imprimir informe")}
        >
          <FiPrinter className="mr-2" />
          Imprimir
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <SearchAndFilter
          onSearch={(value) => handleFilterChange({ search: value })}
          onFilter={handleFilterChange}
          filters={filterOptions}
          currentFilters={filters}
          totalItems={pagination.totalItems}
          searchPlaceholder="Buscar por cliente o ID..."
        />
      </div>

      {/* Pestañas de tipo de vista */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-3 px-4 font-medium flex items-center ${
            !filters.viewType || filters.viewType === 'pending' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleFilterChange({ viewType: 'pending' })}
        >
          <FiDollarSign className="mr-2" />
          Ver deudas pendientes
        </button>
        <button 
          className={`py-3 px-4 font-medium flex items-center ${
            filters.viewType === 'paid' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleFilterChange({ viewType: 'paid' })}
        >
          <FiCheck className="mr-2" />
          Ver deudas pagadas
        </button>
        <button 
          className={`py-3 px-4 font-medium flex items-center ${
            filters.viewType === 'installments' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleFilterChange({ viewType: 'installments' })}
        >
          <FiCalendar className="mr-2" />
          Ver amortizaciones
        </button>
        <button 
          className={`py-3 px-4 font-medium flex items-center ${
            filters.viewType === 'canceled' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleFilterChange({ viewType: 'canceled' })}
        >
          <FiFileText className="mr-2" />
          Ver anuladas
        </button>
      </div>

      {/* Mensajes de error */}
      {error && <ErrorMessage message={error} />}

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <LoadingSpinner />
        ) : filters.groupByClient ? (
          // Vista agrupada por cliente
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedOrders || {}).length > 0 ? (
              Object.entries(groupedOrders).map(([clientName, clientOrders]) => (
                <ClientGroupedOrders
                  key={clientName}
                  clientName={clientName}
                  orders={clientOrders}
                  formatCurrency={formatCurrency}
                  onMarkAsPaid={handleMarkAsPaid}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No hay pedidos pendientes de pago
              </div>
            )}
          </div>
        ) : (
          // Vista de tabla normal
          <DataTable
            data={filteredOrders}
            columns={columns}
            pagination={true}
            initialPageSize={pagination.pageSize}
            rowKeyField="id"
            renderRowActions={renderRowActions}
            onRowClick={(row) => console.log("Row clicked:", row)}
            emptyMessage="No hay pedidos pendientes de pago"
          />
        )}
      </div>
    </div>
  );
}