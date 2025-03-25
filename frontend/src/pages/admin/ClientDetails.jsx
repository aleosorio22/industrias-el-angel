"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi"
import ClientGeneralInfo from "../../components/client/ClientGeneralInfo"
import ClientUserInfo from "../../components/client/ClientUserInfo"
import ClientBranches from "../../components/client/ClientBranches"
import ClientOrderHistory from "../../components/client/ClientOrderHistory"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ErrorMessage from "../../components/ui/ErrorMessage"
import clientService from "../../services/ClientService"
import { toast } from "react-hot-toast"

export default function ClientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClientDetails()
  }, [id])

  const fetchClientDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await clientService.getClientById(id)
      setClient(data)
    } catch (error) {
      setError(error.message || 'Error al cargar los detalles del cliente')
      toast.error('Error al cargar los detalles del cliente')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchClientDetails()
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-lg text-text-light">Cliente no encontrado</p>
        <button
          onClick={() => navigate('/admin/clients')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Volver al listado
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/clients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-display text-text">Detalles del Cliente</h1>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar"
        >
          <FiRefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientGeneralInfo 
          client={client} 
          onEdit={() => navigate(`/admin/clients/${id}/edit`)}
          onRefresh={handleRefresh}
        />
        <ClientUserInfo 
          client={client}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ClientBranches 
          clientId={id}
          branches={client.sucursales || []}
          onRefresh={handleRefresh}
        />
        <ClientOrderHistory 
          clientId={id}
          orders={client.pedidos || []}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}