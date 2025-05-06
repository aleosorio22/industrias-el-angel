import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiServer, FiLayers } from 'react-icons/fi';
import PlantService from '../../services/PlantService';
import { toast } from 'react-hot-toast';

export default function PlantDetails() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlantDetails();
  }, [id]);

  const fetchPlantDetails = async () => {
    try {
      setIsLoading(true);
      const response = await PlantService.getPlantById(id);
      if (response.success && response.data) {
        setPlant(response.data);
      } else {
        setError(response.message || 'Error al cargar los detalles de la planta');
        toast.error('Error al cargar los detalles de la planta');
      }
    } catch (err) {
      console.error("Error fetching plant details:", err);
      setError('Error al cargar los detalles de la planta');
      toast.error('Error al cargar los detalles de la planta');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Link 
          to="/admin/plants" 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Volver a plantas de producción
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <FiServer className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{plant?.nombre}</h1>
              <p className="text-gray-500">{plant?.ubicacion || 'Sin ubicación especificada'}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            plant?.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {plant?.estado === 'activo' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Áreas Asignadas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiLayers className="mr-2" />
          Áreas Asignadas
        </h2>

        {!plant?.areas || plant.areas.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay áreas asignadas a esta planta</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plant.areas.map(area => (
              <div 
                key={area.id} 
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="font-medium text-gray-800">{area.nombre}</div>
                {area.descripcion && (
                  <div className="text-sm text-gray-500 mt-1">{area.descripcion}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}