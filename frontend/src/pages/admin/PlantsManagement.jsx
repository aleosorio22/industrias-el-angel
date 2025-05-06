"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiServer } from "react-icons/fi"; // Usamos FiServer para plantas
import { DataTable, SearchAndFilter } from "../../components/ui/data-table";
import ConfirmDialog from "../../components/ConfirmDialog";
import PlantService from "../../services/PlantService"; // Asegúrate que exista y esté configurado
import { toast } from "react-hot-toast";
import PlantFormModal from "../../components/PlantFormModal"; // Importar el modal

export default function PlantsManagement() {
  const navigate = useNavigate(); // Podría usarse para una vista de detalles si se implementa
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    estado: "activo", // Por defecto mostrar activos
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null); // Para editar, eliminar o restaurar

  // Opciones para el filtro de estado
  const filterOptions = [
    {
      id: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "all", label: "Todos" },
        { value: "activo", label: "Activos" },
        { value: "inactivo", label: "Inactivos" },
      ],
      defaultValue: "activo", // Valor por defecto
    },
  ];

  // Definición de columnas para la DataTable
  const columns = [
    {
      field: "nombre",
      header: "Nombre",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <FiServer className="text-blue-600" /> {/* Icono diferente */}
          </div>
          <span className="font-medium text-text">{row.nombre}</span>
        </div>
      ),
    },
    {
      field: "ubicacion",
      header: "Ubicación",
      sortable: true,
      render: (row) => row.ubicacion || <span className="text-gray-400">N/A</span>,
    },
     {
      field: "areas_count", // Asumiendo que el backend devuelve este contador
      header: "Áreas Asignadas",
      sortable: false, // Opcional: ordenar por contador
      render: (row) => row.areas_count ?? 0, // Mostrar 0 si no viene el dato
    },
    {
      field: "estado",
      header: "Estado",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
      field: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* Botón de Detalles (opcional, si se crea PlantDetails.jsx) */}
          {/* <button onClick={() => navigate(`/admin/plants/${row.id}/details`)} ...> <FiEye /> </button> */}
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-text-light hover:text-text transition-colors"
            title="Editar Planta"
          >
            <FiEdit2 size={18} />
          </button>
          {row.estado === "activo" ? (
            <button
              onClick={() => handleDelete(row)}
              className="p-1 text-text-light hover:text-destructive transition-colors"
              title="Desactivar Planta"
            >
              <FiTrash2 size={18} />
            </button>
          ) : (
            <button
              onClick={() => handleRestore(row)}
              className="p-1 text-text-light hover:text-primary transition-colors"
              title="Restaurar Planta"
            >
              <FiRefreshCw size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Función para cargar las plantas desde el servicio
  const fetchPlants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Pasar el filtro de estado al servicio si es necesario, o filtrar localmente
      const response = await PlantService.getAllPlants(
        filters.estado === "inactivo" || filters.estado === "all" // Indica si incluir inactivos
      );

      let plantsData = [];
      // Manejo consistente de la estructura de respuesta
      if (response.success && Array.isArray(response.data)) {
         plantsData = response.data;
      } else if (Array.isArray(response)) { 
         plantsData = response;
      } else if (response.data && Array.isArray(response.data.data)) {
         // Manejar caso donde la respuesta tiene estructura anidada
         plantsData = response.data.data;
      } else {
        console.error("Formato de respuesta inesperado:", response);
        throw new Error(response.message || "Formato de respuesta de plantas inesperado");
      }

      // Aplicar filtro de estado localmente si el servicio devolvió todo
       if (filters.estado !== "all") {
         plantsData = plantsData.filter(plant => plant.estado === filters.estado);
       }

      // Aplicar filtro de búsqueda localmente
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        plantsData = plantsData.filter(
          plant =>
            plant.nombre.toLowerCase().includes(searchTerm) ||
            (plant.ubicacion && plant.ubicacion.toLowerCase().includes(searchTerm))
        );
      }

      // Asumiendo que el backend puede devolver `areas_count`
      // Si no, podrías calcularlo aquí si `getAllPlants` devuelve las áreas anidadas
      // plantsData = plantsData.map(p => ({ ...p, areas_count: p.areas?.length || 0 }));

      setPlants(plantsData);
    } catch (err) {
      console.error("Error completo al cargar plantas:", err);
      const errorMessage = err.message || "Error desconocido al cargar las plantas";
      setError(errorMessage);
      toast.error("Error al cargar plantas: " + errorMessage);
      setPlants([]); // Limpiar en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales y cuando cambian los filtros
  useEffect(() => {
    fetchPlants();
  }, [filters]); // Dependencia de los filtros

  // --- Manejadores de acciones CRUD ---

  const handleCreate = () => {
    setSelectedPlant(null); // Asegurarse que no hay planta seleccionada para modo creación
    setIsFormModalOpen(true);
  };

  const handleEdit = async (plant) => {
     // Es buena idea recargar los datos frescos de la planta, incluyendo sus áreas asignadas
     try {
      setIsLoading(true); // Mostrar feedback de carga
      const response = await PlantService.getPlantById(plant.id); // Asume que este método existe y devuelve las áreas
      if (response.success && response.data) {
        setSelectedPlant(response.data); // Guardar la planta completa con sus áreas
        setIsFormModalOpen(true);
      } else {
        throw new Error(response.message || 'No se pudieron cargar los detalles de la planta.');
      }
    } catch (error) {
      console.error("Error fetching plant details for edit:", error);
      toast.error(error.message || "Error al cargar datos para editar.");
      setSelectedPlant(null); // Limpiar si falla
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (plant) => {
    setSelectedPlant(plant);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlant) return;
    try {
      setIsLoading(true); // Opcional: mostrar carga durante la eliminación
      await PlantService.deletePlant(selectedPlant.id);
      toast.success(`Planta "${selectedPlant.nombre}" desactivada exitosamente`);
      setIsDeleteDialogOpen(false);
      setSelectedPlant(null);
      fetchPlants(); // Recargar lista
    } catch (error) {
      toast.error(error.message || "Error al desactivar la planta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (plant) => {
    setSelectedPlant(plant);
    setIsRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    if (!selectedPlant) return;
    try {
      setIsLoading(true); // Opcional: mostrar carga
      await PlantService.restorePlant(selectedPlant.id);
      toast.success(`Planta "${selectedPlant.nombre}" restaurada exitosamente`);
      setIsRestoreDialogOpen(false);
      setSelectedPlant(null);
      fetchPlants(); // Recargar lista
    } catch (error) {
      toast.error(error.message || "Error al restaurar la planta");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para enviar el formulario (llamado por el modal via onSubmit prop)
  const handleSubmitForm = async (formDataFromModal) => {
    // Este try/catch es crucial aquí para manejar errores del servicio y dar feedback
    try {
      if (selectedPlant) {
        // Actualizar
        await PlantService.updatePlant(selectedPlant.id, formDataFromModal);
        toast.success("Planta actualizada exitosamente");
      } else {
        // Crear
        await PlantService.createPlant(formDataFromModal);
        toast.success("Planta creada exitosamente");
      }
      // Si llegamos aquí, la operación fue exitosa
      setIsFormModalOpen(false); // Cierra el modal (el modal ya no se cierra solo)
      setSelectedPlant(null);    // Limpia la selección
      fetchPlants();             // Recarga los datos
    } catch (error) {
      console.error("Error saving plant:", error);
      toast.error(error.message || `Error al ${selectedPlant ? 'actualizar' : 'crear'} la planta.`);
      // Lanzamos el error para que el modal sepa que no debe cerrarse
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold text-text">Gestión de Plantas de Producción</h1>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" />
          Nueva Planta
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <SearchAndFilter
        onSearch={(term) => setFilters(prev => ({ ...prev, search: term }))}
        onFilter={(newFilters) => {
          // newFilters contendrá solo el filtro cambiado, ej: { estado: 'inactivo' }
          // Asegúrate de mantener el término de búsqueda si existe
          setFilters(prev => ({ ...prev, ...newFilters }));
        }}
        filters={filterOptions}
        totalItems={plants.length} // Muestra el total de elementos filtrados actualmente
        currentFilters={filters} // Pasa los filtros actuales para que los inputs/selects se inicialicen correctamente
        searchPlaceholder="Buscar por nombre o ubicación..."
      />

      {/* Tabla de datos */}
      <div className="mt-6">
        <DataTable
          data={plants}
          columns={columns}
          isLoading={isLoading}
          error={error} // Pasar el estado de error para mostrar mensaje si es necesario
          emptyMessage="No se encontraron plantas de producción con los filtros actuales"
          emptyIcon={FiServer} // Icono para tabla vacía
          rowKeyField="id" // Campo único para key de cada fila
          pagination={true} // Habilitar paginación
        />
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Desactivar Planta"
        message={`¿Estás seguro de que deseas desactivar la planta "${selectedPlant?.nombre}"? Las áreas asignadas podrían ser desvinculadas.`} // Mensaje más informativo
      />

      {/* Diálogo de confirmación para restaurar */}
      <ConfirmDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
        title="Restaurar Planta"
        message={`¿Estás seguro de que deseas restaurar la planta "${selectedPlant?.nombre}"?`}
      />

      {/* Modal para crear/editar */}
      {isFormModalOpen && ( // Renderizar el modal solo cuando esté abierto para asegurar la carga de datos frescos
        <PlantFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedPlant(null); // Limpiar al cerrar
          }}
          onSubmit={handleSubmitForm} // Pasamos la función que llama al servicio
          isEditing={!!selectedPlant}
          selectedPlant={selectedPlant} // Pasamos la planta seleccionada (con áreas si se cargaron en handleEdit)
        />
      )}
    </div>
  );
}