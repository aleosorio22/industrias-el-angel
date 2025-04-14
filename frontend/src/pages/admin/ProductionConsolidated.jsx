import React from 'react';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import OrderService from '../../services/OrderService';

const ProductionConsolidated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [generatingPDF, setGeneratingPDF] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [dateFilter, setDateFilter] = React.useState(
    location.state?.selectedDate || formatDateForInput(new Date())
  );

  function formatDateForInput(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    let month = '' + (d.getUTCMonth() + 1);
    let day = '' + d.getUTCDate();
    const year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  const fetchConsolidated = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getProductionConsolidated(dateFilter);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConsolidated();
  }, [dateFilter]);

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
      
      // Crear nuevo documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 20;

      // Configurar fuentes
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      
      // Título
      pdf.text("Consolidado de Producción", margin, yPosition);
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${dateFilter}`, margin, yPosition + 10);
      yPosition += 25;

      // Por cada categoría
      Object.entries(groupedData).forEach(([categoria, items]) => {
        // Verificar si necesitamos nueva página
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        // Título de categoría
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text(categoria, margin, yPosition);
        yPosition += 10;

        // Configurar columnas
        const columns = [
          "Producto",
          "Unidades",
          "Arrobas",
          "Latas",
          "Libras"
        ];
        
        const columnWidths = {
          Producto: 60,
          Unidades: 25,
          Arrobas: 25,
          Latas: 25,
          Libras: 25
        };

        // Encabezados de tabla
        pdf.setFontSize(10);
        let xPosition = margin;
        columns.forEach((column) => {
          pdf.text(column, xPosition, yPosition);
          xPosition += columnWidths[column];
        });
        yPosition += 5;

        // Línea separadora
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;

        // Datos
        pdf.setFont("helvetica", "normal");
        items.forEach((item) => {
          // Verificar si necesitamos nueva página
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
            
            // Repetir encabezados en nueva página
            pdf.setFont("helvetica", "bold");
            xPosition = margin;
            columns.forEach((column) => {
              pdf.text(column, xPosition, yPosition);
              xPosition += columnWidths[column];
            });
            yPosition += 5;
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
            pdf.setFont("helvetica", "normal");
          }

          xPosition = margin;
          
          // Producto
          pdf.text(item.producto_nombre, xPosition, yPosition);
          xPosition += columnWidths.Producto;

          // Valores numéricos alineados a la derecha
          const values = [
            item.total_unidades?.toLocaleString() || '-',
            item.arrobas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-',
            item.latas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-',
            item.libras_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'
          ];

          values.forEach((value, index) => {
            const textWidth = pdf.getStringUnitWidth(value) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            const columnWidth = columnWidths[columns[index + 1]];
            const textX = xPosition + columnWidth - textWidth - 2;
            pdf.text(value, textX, yPosition);
            xPosition += columnWidth;
          });

          yPosition += 6;
        });

        yPosition += 10;
      });

      pdf.save(`Consolidado_Produccion_${dateFilter}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Consolidado de Producción</h1>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPDF || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {generatingPDF ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"/>
            ) : (
              <>
                <FiDownload size={16} />
                <span>Descargar PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Eliminamos el ref={contentRef} ya que no lo necesitamos */}
          <div className="space-y-6">
            {Object.entries(groupedData).map(([categoria, items]) => (
              <div key={categoria} className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">{categoria}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidades
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Arrobas
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Latas
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Libras
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr 
                          key={index}
                          className={item.producto_nombre.startsWith('Total') ? 
                            'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.producto_nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.total_unidades?.toLocaleString() || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.arrobas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.latas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.libras_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionConsolidated;