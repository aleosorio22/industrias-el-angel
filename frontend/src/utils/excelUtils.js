import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportOrderToExcel = async (order) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Detalle de Pedido');

  // Definir ancho de columnas
  worksheet.columns = [
    { width: 35 },
    { width: 25 },
    { width: 12 },
    { width: 18 },
    { width: 18 },
  ];

  // Estilo general de bordes
  const borderStyle = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Título
  worksheet.mergeCells('A1:E1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'DETALLE DE PEDIDO';
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = borderStyle;

  // Datos generales
  const generalData = [
    [''],
    ['Número de Pedido:', `#${order.id}`],
    ['Fecha:', new Date(order.fecha).toLocaleDateString('es-GT', {
      year: 'numeric', month: 'long', day: 'numeric'
    })],
    ['Cliente:', order.cliente_nombre || 'No especificado'],
    ['Sucursal:', order.sucursal_nombre || 'No especificada'],
    ['Estado:', order.estado?.charAt(0).toUpperCase() + order.estado?.slice(1)],
    ['Observaciones:', order.observaciones || 'Sin observaciones'],
    ['']
  ];

  generalData.forEach((row, index) => {
    const excelRow = worksheet.addRow(row);
    excelRow.getCell(1).font = { bold: true, color: { argb: 'FF1B5E20' } };
    excelRow.getCell(2).border = borderStyle;
  });

  // Encabezado de tabla
  const tableHeader = worksheet.addRow(['Producto', 'Presentación', 'Cantidad', 'Precio Unitario', 'Subtotal']);
  tableHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B5E20' } };
    cell.alignment = { horizontal: 'center' };
    cell.border = borderStyle;
  });

  // Detalles del pedido
  order.detalles.forEach((item) => {
    const row = worksheet.addRow([
      item.producto_nombre,
      item.presentacion_nombre || 'N/A',
      item.cantidad,
      parseFloat(item.precio_unitario || 0).toFixed(2),
      (item.cantidad * parseFloat(item.precio_unitario || 0)).toFixed(2)
    ]);
    row.eachCell((cell) => {
      cell.border = borderStyle;
    });
  });

  // Fila de total
  worksheet.addRow([]); // espacio
  const totalRow = worksheet.addRow(['', '', '', 'TOTAL:', order.detalles.reduce(
    (sum, item) => sum + item.cantidad * parseFloat(item.precio_unitario || 0), 0
  ).toFixed(2)]);

  totalRow.getCell(4).font = { bold: true };
  totalRow.getCell(5).font = { bold: true };
  totalRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8E6C9' } };
  totalRow.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8E6C9' } };
  totalRow.getCell(4).border = borderStyle;
  totalRow.getCell(5).border = borderStyle;

  // Establecer área de impresión
  const totalRowIndex = totalRow.number;
  worksheet.pageSetup.printArea = `A1:E${totalRowIndex}`;


  // Generar y descargar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Pedido_${order.id}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
