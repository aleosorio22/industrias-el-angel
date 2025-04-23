import { useState } from 'react';
import jsPDF from 'jspdf';

const usePDFGenerator = (groupedData, dateFilter) => {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const generatePDF = async () => {
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

  return { generatePDF, generatingPDF };
};

export default usePDFGenerator;