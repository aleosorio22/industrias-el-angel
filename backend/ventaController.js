const Venta = require("../models/ventaModel");
const ConfigBodegaDespacho = require("../models/configBodegaDespachoModel");
const db = require("../config/db");

// Crear nueva venta
exports.crearVenta = async (req, res) => {
  const { detalles, pagos, cliente_id } = req.body;
  const usuario_id = req.usuario.id;
  const caja_id = req.body.caja_id;

  if (!detalles || !detalles.length || !pagos || !pagos.length) {
    return res.status(400).json({
      mensaje: "Datos incompletos",
      detalles: "Se requieren detalles de venta y pagos"
    });
  }

  try {
    // 1. Validar caja abierta
    await Venta.validarCaja(caja_id);

    // 2. Obtener bodega de despacho configurada
    const configBodega = await new Promise((resolve, reject) => {
      ConfigBodegaDespacho.getActual((err, result) => {
        if (err) reject(err);
        if (!result || !result.length) {
          reject(new Error("No hay una bodega de despacho configurada"));
        }
        resolve(result[0]);
      });
    });

    // 3. Validar stock en bodega
    await Venta.validarStock(configBodega.bodega_id, detalles);

    // 4. Obtener y validar precios
    const detallesConPrecios = await Venta.obtenerPrecios(detalles);

    // 5. Calcular totales
    let subtotal = 0;
    let impuestos = 0;
    let total = 0;
    const descuento = req.body.descuento || 0;

    detallesConPrecios.forEach(detalle => {
      subtotal += detalle.subtotal;
      impuestos += detalle.impuesto;
      total += detalle.total;
    });

    total = total - descuento;

    // 6. Validar que la suma de pagos coincida con el total
    const totalPagos = pagos.reduce((sum, pago) => {
        // Si es efectivo (asumiendo que tipo_pago_id = 1 es efectivo)
        if (pago.tipo_pago_id === 1) {
          // Calculamos el cambio
          const cambio = pago.monto > (total - sum) ? pago.monto - (total - sum) : 0;
          // Ajustamos el monto real después del cambio
          pago.cambio = cambio;
          pago.monto_final = pago.monto - cambio;
          return sum + pago.monto_final;
        }
        return sum + pago.monto;
      }, 0);
  
      if (Math.abs(totalPagos - total) > 0.01) {
        return res.status(400).json({
          mensaje: "Error en los pagos",
          detalles: "El total de pagos no cubre el total de la venta"
        });
      }

    const ventaData = {
      caja_id,
      usuario_id,
      cliente_id,
      bodega_id: configBodega.bodega_id,
      subtotal,
      descuento,
      impuestos,
      total
    };

    // 7. Crear la venta
    const resultado = await Venta.crear(ventaData, detallesConPrecios, pagos);


    // 8. Actualizar saldo en caja
   /* await new Promise((resolve, reject) => {
        db.query(
          `UPDATE cajas 
           SET ingresos_ventas = ingresos_ventas + ?
           WHERE id = ?`,
          [total, caja_id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
    });*/

    res.status(201).json({
        mensaje: "Venta creada exitosamente",
        id: resultado.id,
        detalles: {
          subtotal,
          descuento,
          impuestos,
          total
        },
        pagos: pagos.map(p => ({
          tipo_pago_id: p.tipo_pago_id,
          monto: p.monto,
          cambio: p.cambio || 0,
          monto_final: p.monto_final || p.monto
        }))
    });

  } catch (error) {
    console.error("Error en venta:", error);
   // Manejo de errores más específico
   let statusCode = 400;
   let errorResponse = {
     mensaje: "Error al procesar la venta",
     error: error.message || "Error desconocido"
   };

   // Errores específicos
   if (error.error === "Producto no asignado") {
     errorResponse.detalles = {
       tipo: "producto_no_asignado",
       producto_id: error.producto_id,
       mensaje: error.mensaje
     };
   } else if (error.error === "Stock insuficiente") {
     errorResponse.detalles = {
       tipo: "stock_insuficiente",
       productos: error.detalles
     };
   }

   res.status(statusCode).json(errorResponse);
 }
};

// Obtener venta por ID
exports.getVentaById = (req, res) => {
  Venta.getById(req.params.id, (err, venta) => {
    if (err) {
      console.error("Error al obtener venta:", err);
      return res.status(500).json({
        mensaje: "Error al obtener la venta",
        error: err
      });
    }
    
    if (!venta) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    res.json(venta);
  });
};

// Obtener ventas por caja
exports.getVentasByCaja = (req, res) => {
  const { caja_id } = req.params;

  if (!caja_id) {
    return res.status(400).json({
      mensaje: "ID de caja requerido"
    });
  }

  Venta.getByCaja(caja_id, (err, results) => {
    if (err) {
      return res.status(500).json({
        mensaje: "Error al obtener las ventas",
        error: err
      });
    }

    res.status(200).json(results);
  });
};

// Anular venta
exports.anularVenta = (req, res) => {
  const { id } = req.params;

  // Primero verificamos el estado actual de la venta
  Venta.getById(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        mensaje: "Error al verificar la venta",
        error: err
      });
    }

    if (!result.length) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    if (result[0].estado === 'anulada') {
      return res.status(400).json({
        mensaje: "La venta ya está anulada"
      });
    }

    // Si todo está bien, procedemos a anular
    Venta.anular(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al anular la venta",
          error: err
        });
      }

      res.status(200).json({
        mensaje: "Venta anulada exitosamente"
      });
    });
  });
};



// Agregar el nuevo método
exports.generarTicket = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar primero si la venta existe
    const venta = await new Promise((resolve, reject) => {
      Venta.getTicketData(id, (err, result) => {
        if (err) {
          console.error('Error al obtener datos del ticket:', err);
          reject(err);
          return;
        }
        
        if (!result) {
          reject(new Error("No se obtuvieron resultados"));
          return;
        }

        if (result.length === 0) {
          reject(new Error(`Venta con ID ${id} no encontrada`));
          return;
        }

        console.log('Datos de venta obtenidos:', result[0]); // Para debugging
        resolve(result[0]);
      });
    });

    // Formatear datos para el ticket
    const ticketData = await Venta.formatearTicket(venta);
    console.log('Ticket formateado:', ticketData); // Para debugging

    res.status(200).json(ticketData);
  } catch (error) {
    console.error('Error completo:', error);
    res.status(404).json({
      mensaje: "Error al generar ticket",
      error: error.message
    });
  }
};