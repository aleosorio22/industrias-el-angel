import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiLayers } from 'react-icons/fi';
import AreaDetailsHeader from '../../components/admin/production-areas/AreaDetailsHeader';
import AssignedCategories from '../../components/admin/production-areas/AssignedCategories';
import AssignedUsers from '../../components/admin/production-areas/AssignedUsers';
import productionAreaService from '../../services/ProductionAreaService';

export default function ProductionAreaDetails() {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAreaDetails();
  }, [id]);

  const fetchAreaDetails = async () => {
    try {
      setIsLoading(true);
      const response = await productionAreaService.getAreaById(id);
      if (response.success) {
        setArea(response.data);
      } else {
        setError(response.message || 'Error al cargar los detalles del área');
      }
    } catch (err) {
      setError('Error al cargar los detalles del área');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AreaDetailsHeader area={area} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AssignedCategories area={area} />
        <AssignedUsers areaId={area.id} />
      </div>
    </div>
  );
}