import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import productService from "../../services/ProductService"
import conversionService from "../../services/ConversionService"
import { toast } from "react-hot-toast"
import BasicInformation from "../../components/product/BasicInformation"
import Conversions from "../../components/product/Conversions"
import ConversionFormModal from "../../components/product/ConversionFormModal"
import ConfirmDialog from "../../components/ConfirmDialog"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [conversions, setConversions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false)
  const [selectedConversion, setSelectedConversion] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [conversionToDelete, setConversionToDelete] = useState(null)
  const [pendingFormData, setPendingFormData] = useState(null)

  const handleAddConversion = () => {
    setSelectedConversion(null)
    setIsConversionModalOpen(true)
  }

  const handleEditConversion = (conversion) => {
    setSelectedConversion(conversion)
    setIsConversionModalOpen(true)
  }

  const handleSubmitConversion = async (formData) => {
    setPendingFormData(formData)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    try {
      if (selectedConversion) {
        await conversionService.updateConversion(selectedConversion.id, {
          ...pendingFormData,
          producto_id: id
        })
      } else {
        await conversionService.createConversion({
          ...pendingFormData,
          producto_id: id
        })
      }
      
      const updatedConversions = await conversionService.getProductConversions(id)
      setConversions(updatedConversions)
      toast.success(
        selectedConversion 
          ? 'Conversión actualizada exitosamente'
          : 'Conversión creada exitosamente'
      )
      setIsConversionModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Error al guardar la conversión')
    } finally {
      setIsConfirmDialogOpen(false)
      setPendingFormData(null)
    }
  }

  const handleDeleteConversion = (conversion) => {
    setConversionToDelete(conversion)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await conversionService.deleteConversion(conversionToDelete.id)
      const updatedConversions = await conversionService.getProductConversions(id)
      setConversions(updatedConversions)
      toast.success('Conversión eliminada exitosamente')
    } catch (error) {
      toast.error(error.message || 'Error al eliminar la conversión')
    } finally {
      setIsDeleteDialogOpen(false)
      setConversionToDelete(null)
    }
  }

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)
        const [productData, conversionsData] = await Promise.all([
          productService.getProductById(id),
          conversionService.getProductConversions(id)
        ])
        setProduct(productData)
        setConversions(conversionsData)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error("Error al cargar el producto")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center text-text-light hover:text-primary transition-colors mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Regresar a Productos
        </button>
        <h1 className="text-3xl font-display font-bold text-text">
          {product?.nombre}
        </h1>
        <p className="text-text-light mt-1">Ficha técnica del producto</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BasicInformation product={product} />
        <Conversions 
          conversions={conversions}
          onAddConversion={handleAddConversion}
          onEditConversion={handleEditConversion}
          onDeleteConversion={handleDeleteConversion}
        />
      </div>
      
      <ConversionFormModal
        isOpen={isConversionModalOpen}
        onClose={() => setIsConversionModalOpen(false)}
        onSubmit={handleSubmitConversion}
        initialData={selectedConversion}
      />
      
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false)
          setPendingFormData(null)
        }}
        onConfirm={handleConfirmAction}
        title={selectedConversion ? "Confirmar Edición" : "Confirmar Creación"}
        message={selectedConversion 
          ? "¿Estás seguro de que deseas guardar los cambios en esta conversión?"
          : "¿Estás seguro de que deseas crear esta nueva conversión?"}
      />
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Conversión"
        message="¿Estás seguro de que deseas eliminar esta conversión? Esta acción no se puede deshacer."
      />
    </div>
  )
}