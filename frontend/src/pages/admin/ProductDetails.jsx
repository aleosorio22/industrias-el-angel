import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import productService from "../../services/ProductService"
import conversionService from "../../services/ConversionService"
import presentationProductService from "../../services/PresentationProductService"
import { toast } from "react-hot-toast"
import BasicInformation from "../../components/product/BasicInformation"
import Conversions from "../../components/product/Conversions"
import ConversionFormModal from "../../components/product/ConversionFormModal"
import Presentations from "../../components/product/Presentations"
import PresentationFormModal from "../../components/product/PresentationFormModal"
import ConfirmDialog from "../../components/ConfirmDialog"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [conversions, setConversions] = useState([])
  const [presentations, setPresentations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estados para conversiones
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false)
  const [selectedConversion, setSelectedConversion] = useState(null)
  const [isDeleteConversionDialogOpen, setIsDeleteConversionDialogOpen] = useState(false)
  const [conversionToDelete, setConversionToDelete] = useState(null)
  
  // Estados para presentaciones
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState(null)
  const [isDeletePresentationDialogOpen, setIsDeletePresentationDialogOpen] = useState(false)
  const [presentationToDelete, setPresentationToDelete] = useState(null)
  
  // Estado compartido para formularios pendientes
  const [pendingFormData, setPendingFormData] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  // Manejadores para conversiones
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
    setConfirmAction('conversion')
    setIsConfirmDialogOpen(true)
  }

  const handleDeleteConversion = (conversion) => {
    setConversionToDelete(conversion)
    setIsDeleteConversionDialogOpen(true)
  }

  // Manejadores para presentaciones
  const handleAddPresentation = () => {
    setSelectedPresentation(null)
    setIsPresentationModalOpen(true)
  }

  const handleEditPresentation = (presentation) => {
    setSelectedPresentation(presentation)
    setIsPresentationModalOpen(true)
  }

  const handleSubmitPresentation = async (formData) => {
    setPendingFormData(formData)
    setConfirmAction('presentation')
    setIsConfirmDialogOpen(true)
  }

  const handleDeletePresentation = (presentation) => {
    setPresentationToDelete(presentation)
    setIsDeletePresentationDialogOpen(true)
  }

  // Manejadores de confirmación
  const handleConfirmAction = async () => {
    try {
      if (confirmAction === 'conversion') {
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
        setIsConversionModalOpen(false)
        toast.success(
          selectedConversion 
            ? 'Conversión actualizada exitosamente'
            : 'Conversión creada exitosamente'
        )
      } else {
        if (selectedPresentation) {
          await presentationProductService.updatePresentation(selectedPresentation.id, {
            ...pendingFormData,
            producto_id: id
          })
        } else {
          await presentationProductService.createPresentation({
            ...pendingFormData,
            producto_id: id
          })
        }
        const updatedPresentations = await presentationProductService.getProductPresentations(id)
        setPresentations(updatedPresentations)
        setIsPresentationModalOpen(false)
        toast.success(
          selectedPresentation 
            ? 'Presentación actualizada exitosamente'
            : 'Presentación creada exitosamente'
        )
      }
    } catch (error) {
      toast.error(error.message || `Error al guardar ${confirmAction === 'conversion' ? 'la conversión' : 'la presentación'}`)
    } finally {
      setIsConfirmDialogOpen(false)
      setPendingFormData(null)
      setConfirmAction(null)
    }
  }

  const handleConfirmDeleteConversion = async () => {
    try {
      await conversionService.deleteConversion(conversionToDelete.id)
      const updatedConversions = await conversionService.getProductConversions(id)
      setConversions(updatedConversions)
      toast.success('Conversión eliminada exitosamente')
    } catch (error) {
      toast.error(error.message || 'Error al eliminar la conversión')
    } finally {
      setIsDeleteConversionDialogOpen(false)
      setConversionToDelete(null)
    }
  }

  const handleConfirmDeletePresentation = async () => {
    try {
      await presentationProductService.deletePresentation(presentationToDelete.id)
      const updatedPresentations = await presentationProductService.getProductPresentations(id)
      setPresentations(updatedPresentations)
      toast.success('Presentación eliminada exitosamente')
    } catch (error) {
      toast.error(error.message || 'Error al eliminar la presentación')
    } finally {
      setIsDeletePresentationDialogOpen(false)
      setPresentationToDelete(null)
    }
  }

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true)
        const [productData, conversionsData, presentationsData] = await Promise.all([
          productService.getProductById(id),
          conversionService.getProductConversions(id),
          presentationProductService.getProductPresentations(id)
        ])
        setProduct(productData)
        setConversions(conversionsData)
        setPresentations(presentationsData)
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
        <div className="space-y-8">
          <Conversions 
            conversions={conversions}
            onAddConversion={handleAddConversion}
            onEditConversion={handleEditConversion}
            onDeleteConversion={handleDeleteConversion}
          />
          <Presentations 
            presentations={presentations}
            onAddPresentation={handleAddPresentation}
            onEditPresentation={handleEditPresentation}
            onDeletePresentation={handleDeletePresentation}
          />
        </div>
      </div>
      
      <ConversionFormModal
        isOpen={isConversionModalOpen}
        onClose={() => setIsConversionModalOpen(false)}
        onSubmit={handleSubmitConversion}
        initialData={selectedConversion}
      />

      <PresentationFormModal
        isOpen={isPresentationModalOpen}
        onClose={() => setIsPresentationModalOpen(false)}
        onSubmit={handleSubmitPresentation}
        initialData={selectedPresentation}
      />
      
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false)
          setPendingFormData(null)
          setConfirmAction(null)
        }}
        onConfirm={handleConfirmAction}
        title={
          confirmAction === 'conversion'
            ? (selectedConversion ? "Confirmar Edición" : "Confirmar Creación")
            : (selectedPresentation ? "Confirmar Edición" : "Confirmar Creación")
        }
        message={
          confirmAction === 'conversion'
            ? (selectedConversion 
                ? "¿Estás seguro de que deseas guardar los cambios en esta conversión?"
                : "¿Estás seguro de que deseas crear esta nueva conversión?")
            : (selectedPresentation
                ? "¿Estás seguro de que deseas guardar los cambios en esta presentación?"
                : "¿Estás seguro de que deseas crear esta nueva presentación?")
        }
      />
      
      <ConfirmDialog
        isOpen={isDeleteConversionDialogOpen}
        onClose={() => setIsDeleteConversionDialogOpen(false)}
        onConfirm={handleConfirmDeleteConversion}
        title="Eliminar Conversión"
        message="¿Estás seguro de que deseas eliminar esta conversión? Esta acción no se puede deshacer."
      />

      <ConfirmDialog
        isOpen={isDeletePresentationDialogOpen}
        onClose={() => setIsDeletePresentationDialogOpen(false)}
        onConfirm={handleConfirmDeletePresentation}
        title="Eliminar Presentación"
        message="¿Estás seguro de que deseas eliminar esta presentación? Esta acción no se puede deshacer."
      />
    </div>
  )
}