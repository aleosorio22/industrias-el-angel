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

  // En la función useEffect donde cargas los datos iniciales
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener datos del producto
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Obtener conversiones
        const conversionsData = await conversionService.getProductConversions(id);
        setConversions(Array.isArray(conversionsData) ? conversionsData : []);
        
        // Obtener presentaciones con manejo de errores mejorado
        try {
          console.log("Solicitando presentaciones para producto ID:", id);
          const presentationsData = await presentationProductService.getProductPresentations(id);
          console.log("Presentaciones recibidas:", presentationsData);
          
          // Asegurarse de que presentationsData sea un array
          if (Array.isArray(presentationsData)) {
            setPresentations(presentationsData);
          } else if (presentationsData && Array.isArray(presentationsData.data)) {
            setPresentations(presentationsData.data);
          } else {
            console.error("Formato de presentaciones inesperado:", presentationsData);
            setPresentations([]);
          }
        } catch (presentationsError) {
          console.error("Error al cargar presentaciones:", presentationsError);
          setPresentations([]);
          toast.error("No se pudieron cargar las presentaciones");
        }
        
      } catch (error) {
        console.error("Error al cargar datos del producto:", error);
        toast.error("Error al cargar datos del producto");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProductData();
  }, [id]);

  // Función para volver a la página anterior
  const handleGoBack = () => {
    navigate('/admin/products');
  };

  // Renderizado del componente
  return (
    <div className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-text">
              {product?.nombre || 'Detalles del producto'}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {product && (
              <BasicInformation product={product} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Conversions 
                conversions={Array.isArray(conversions) ? conversions : []} 
                onAddConversion={handleAddConversion}
                onEditConversion={handleEditConversion}
                onDeleteConversion={handleDeleteConversion}
              />
              
              <Presentations 
                presentations={Array.isArray(presentations) ? presentations : []} 
                onAddPresentation={handleAddPresentation}
                onEditPresentation={handleEditPresentation}
                onDeletePresentation={handleDeletePresentation}
              />
            </div>
          </div>

          {/* Modales y diálogos */}
          {isConversionModalOpen && (
            <ConversionFormModal
              isOpen={isConversionModalOpen}
              onClose={() => setIsConversionModalOpen(false)}
              onSubmit={handleSubmitConversion}
              conversion={selectedConversion}
              productId={id}
            />
          )}

          {isPresentationModalOpen && (
            <PresentationFormModal
              isOpen={isPresentationModalOpen}
              onClose={() => setIsPresentationModalOpen(false)}
              onSubmit={handleSubmitPresentation}
              presentation={selectedPresentation}
              productId={id}
            />
          )}

          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleConfirmAction}
            title={`Confirmar ${confirmAction === 'conversion' ? 'conversión' : 'presentación'}`}
            message={`¿Estás seguro de que deseas ${selectedConversion || selectedPresentation ? 'actualizar' : 'crear'} esta ${confirmAction === 'conversion' ? 'conversión' : 'presentación'}?`}
            confirmText="Guardar"
            cancelText="Cancelar"
          />

          <ConfirmDialog
            isOpen={isDeleteConversionDialogOpen}
            onClose={() => setIsDeleteConversionDialogOpen(false)}
            onConfirm={handleConfirmDeleteConversion}
            title="Eliminar conversión"
            message="¿Estás seguro de que deseas eliminar esta conversión? Esta acción no se puede deshacer."
            confirmText="Eliminar"
            cancelText="Cancelar"
            isDanger
          />

          <ConfirmDialog
            isOpen={isDeletePresentationDialogOpen}
            onClose={() => setIsDeletePresentationDialogOpen(false)}
            onConfirm={handleConfirmDeletePresentation}
            title="Eliminar presentación"
            message="¿Estás seguro de que deseas eliminar esta presentación? Esta acción no se puede deshacer."
            confirmText="Eliminar"
            cancelText="Cancelar"
            isDanger
          />
        </>
      )}
    </div>
  );
}