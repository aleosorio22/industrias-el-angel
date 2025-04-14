import React from 'react';
import { FiX, FiPackage, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProductionConsolidated = ({ data, onClose, isLoading, error }) => {
  const contentRef = React.useRef(null);
  const [generatingPDF, setGeneratingPDF] = React.useState(false);

  // Mover la lógica de agrupación aquí y agregar verificación
  const groupedData = React.useMemo(() => {
    if (!data) return {};
    
    return data.reduce((acc, item) => {
      if (!acc[item.categoria_nombre]) {
        acc[item.categoria_nombre] = [];
      }
      acc[item.categoria_nombre].push(item);
      return acc;
    }, {});
  }, [data]);

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      const content = contentRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Consolidado_Produccion_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-4 px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-primary text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiPackage className="text-lg" />
            <h2 className="text-lg font-semibold">Consolidado de Producción</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center"
              title="Descargar PDF"
            >
              {generatingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"/>
              ) : (
                <FiDownload size={16} />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        <div ref={contentRef} className="p-4">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Consolidado de Producción</h1>
            <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>

          {error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="space-y-4">
              {groupedData && Object.entries(groupedData).map(([categoria, items]) => (
                <div key={categoria}>
                  <h3 className="text-base font-semibold text-gray-700 mb-2">{categoria}</h3>
                  <div className="overflow-x-auto bg-gray-50 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unid.
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Latas
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Libras
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Arrob.
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                          <tr 
                            key={index}
                            className={item.producto_nombre.startsWith('Total') ? 
                              'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {item.producto_nombre}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                              {item.total_unidades?.toLocaleString() || '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                              {item.latas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                              {item.libras_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                              {item.arrobas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionConsolidated;