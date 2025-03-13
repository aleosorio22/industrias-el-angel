const db = require("../config/db");
const BodegaProducto = require("./bodegaProductoModel");
const Producto = require("./productoModel");
const Caja = require("./cajaModel");

const Venta = {};

// Validar stock en bodega de despacho
Venta.validarStock = (bodega_id, detalles) => {
  return new Promise((resolve, reject) => {
    const validaciones = detalles.map(detalle => {
      return new Promise((resolve, reject) => {
        BodegaProducto.getStock(
          bodega_id, 
          detalle.producto_id,
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            
            // Si no hay resultados o está vacío, significa que el producto no está asignado
            if (!result || result.length === 0) {
              reject({
                error: "Producto no asignado",
                producto_id: detalle.producto_id,
                mensaje: "El producto no está asignado a la bodega de despacho"
              });
              return;
            }

            const stockActual = result[0].stock_actual;
            
            // Si no hay suficiente stock
            if (stockActual < detalle.cantidad) {
              resolve({
                producto_id: detalle.producto_id,
                cantidad_solicitada: detalle.cantidad,
                stock_disponible: stockActual,
                stockSuficiente: false
              });
              return;
            }

            resolve({
              ...detalle,
              stockSuficiente: true,
              stockActual: stockActual
            });
          }
        );
      });
    });

    Promise.all(validaciones)
      .then(resultados => {
        const insuficientes = resultados.filter(r => !r.stockSuficiente);
        if (insuficientes.length > 0) {
          reject({
            error: "Stock insuficiente",
            detalles: insuficientes.map(item => ({
              producto_id: item.producto_id,
              cantidad_solicitada: item.cantidad_solicitada,
              stock_disponible: item.stock_disponible
            }))
          });
          return;
        }
        resolve(true);
      })
      .catch(reject);
  });
};

// Validar caja abierta
Venta.validarCaja = (caja_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT c.* 
       FROM cajas c 
       WHERE c.id = ? 
       AND c.estado = 'abierta'`,
      [caja_id],
      (err, result) => {
        if (err) reject(err);
        if (!result || !result.length) {
          reject(new Error("La caja no está abierta"));
        }
        resolve(true);
      }
    );
  });
};


// En el método obtenerPrecios
Venta.obtenerPrecios = (detalles) => {
  return new Promise((resolve, reject) => {
    const consultas = detalles.map(detalle => {
      return new Promise((resolve, reject) => {
        Producto.getById(detalle.producto_id, (err, result) => {
          if (err) reject(err);
          if (!result || !result.length) {
            reject(new Error(`Producto ${detalle.producto_id} no encontrado`));
          }
          const producto = result[0];
          const precioConIVA = producto.precio_venta;
          const factor = 1.12; // 12% IVA
          const precioSinIVA = precioConIVA / factor;
          const impuesto = precioConIVA - precioSinIVA;
          
          resolve({
            ...detalle,
            precio_unitario: precioConIVA,
            subtotal: precioSinIVA * detalle.cantidad,
            impuesto: impuesto * detalle.cantidad,
            total: precioConIVA * detalle.cantidad
          });
        });
      });
    });

    Promise.all(consultas)
      .then(resolve)
      .catch(reject);
  });
};

// Crear nueva venta
Venta.crear = (ventaData, detalles, pagos) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction(async err => {
      if (err) reject(err);

      try {
        // Insertar venta
        const resultVenta = await new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO ventas (
              caja_id, usuario_id, cliente_id, bodega_id,
              subtotal, descuento, impuestos, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              ventaData.caja_id,
              ventaData.usuario_id,
              ventaData.cliente_id,
              ventaData.bodega_id,
              ventaData.subtotal,
              ventaData.descuento,
              ventaData.impuestos,
              ventaData.total
            ],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });

        const ventaId = resultVenta.insertId;

        // Insertar detalles
        await new Promise((resolve, reject) => {
          const detallesValues = detalles.map(d => [
            ventaId,
            d.producto_id,
            d.cantidad,
            d.precio_unitario,
            d.subtotal,
            d.impuesto,
            d.total
          ]);

          db.query(
            `INSERT INTO detalles_venta (
              venta_id, producto_id, cantidad, precio_unitario,
              subtotal, impuesto, total
            ) VALUES ?`,
            [detallesValues],
            err => {
              if (err) reject(err);
              resolve();
            }
          );
        });

        // Insertar pagos
        await new Promise((resolve, reject) => {
          const pagosValues = pagos.map(p => [
            ventaId,
            p.tipo_pago_id,
            p.monto,
            p.referencia || null
          ]);

          db.query(
            `INSERT INTO pagos_venta (
              venta_id, tipo_pago_id, monto, referencia
            ) VALUES ?`,
            [pagosValues],
            err => {
              if (err) reject(err);
              resolve();
            }
          );
        });

        // Actualizar stock
        await Promise.all(detalles.map(detalle => {
          return new Promise((resolve, reject) => {
            db.query(
              `UPDATE bodega_productos 
               SET stock_actual = stock_actual - ? 
               WHERE bodega_id = ? AND producto_id = ?`,
              [detalle.cantidad, ventaData.bodega_id, detalle.producto_id],
              (err) => {
                if (err) reject(err);
                resolve();
              }
            );
          });
        }));

        // Actualizar la caja
        await new Promise((resolve, reject) => {
          db.query(
            `UPDATE cajas 
             SET ingresos_ventas = ingresos_ventas + ?,
                 total_ventas = total_ventas + 1
             WHERE id = ?`,
            [ventaData.total, ventaData.caja_id],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });

        await new Promise((resolve, reject) => {
          db.commit(err => {
            if (err) reject(err);
            resolve();
          });
        });

        resolve({ id: ventaId });
      } catch (error) {
        db.rollback(() => {
          reject(error);
        });
      }
    });
  });
};


// Obtener datos completos para el ticket
Venta.getTicketData = (id, callback) => {
  db.query(
    `SELECT 
      v.*,
      c.nombre as cliente_nombre,
      c.direccion as cliente_direccion,
      u.nombre as vendedor_nombre,
      GROUP_CONCAT(DISTINCT 
        JSON_OBJECT(
          'id', dv.id,
          'producto_id', dv.producto_id,
          'cantidad', dv.cantidad,
          'precio_unitario', dv.precio_unitario,
          'subtotal', dv.subtotal,
          'impuesto', dv.impuesto,
          'total', dv.total,
          'producto_nombre', p.nombre
        )
      ) as detalles,
      GROUP_CONCAT(DISTINCT
        JSON_OBJECT(
          'id', pv.id,
          'tipo_pago_id', pv.tipo_pago_id,
          'monto', pv.monto,
          'referencia', pv.referencia,
          'tipo_pago_nombre', tp.nombre
        )
      ) as pagos
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    LEFT JOIN detalles_venta dv ON v.id = dv.venta_id
    LEFT JOIN productos p ON dv.producto_id = p.id
    LEFT JOIN pagos_venta pv ON v.id = pv.venta_id
    LEFT JOIN tipos_pago tp ON pv.tipo_pago_id = tp.id
    WHERE v.id = ?
    GROUP BY v.id`,
    [id],
    callback
  );
};

// Formatear datos para el ticket
Venta.formatearTicket = async (venta) => {
  // Parsear los strings JSON
  const detalles = JSON.parse(`[${venta.detalles}]`);
  const pagos = JSON.parse(`[${venta.pagos}]`);

  // Calcular el cambio basado en el monto pagado y el total de la venta
  const totalPagado = pagos.reduce((sum, p) => sum + parseFloat(p.monto), 0);
  const cambio = totalPagado - venta.total;

  return {
    empresa: {
      nombre: "Pollo frito Josue 1:9",
      direccion: "Comapa, Jutiapa",
      telefono: "0000-0000",
      nit: "CF"
    },
    venta: {
      numero: venta.id,
      fecha: new Date(venta.created_at).toLocaleString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      cajero: venta.vendedor_nombre
    },
    cliente: {
      nombre: venta.cliente_nombre || "Consumidor Final",
      nit: venta.cliente_nit || "C/F",
      direccion: venta.cliente_direccion || ""
    },
    detalles: detalles.map(d => ({
      cantidad: d.cantidad,
      descripcion: d.producto_nombre,
      precioUnitario: parseFloat(d.precio_unitario),
      subtotal: parseFloat(d.total)
    })),
    totales: {
      subtotal: parseFloat(venta.subtotal),
      descuento: parseFloat(venta.descuento || 0),
      impuestos: parseFloat(venta.impuestos),
      total: parseFloat(venta.total)
    },
    pagos: pagos.map(p => ({
      tipo: p.tipo_pago_nombre,
      monto: parseFloat(p.monto)
    })),
    resumen_pago: {
      total_pagado: totalPagado,
      cambio: cambio
    }
  };
};

module.exports = Venta;


Venta.getById = (id, callback) => {
  db.query(
    `SELECT 
      v.*,
      c.nombre as cliente_nombre,
      c.nit as cliente_nit
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    WHERE v.id = ?`,
    [id],
    (err, venta) => {
      if (err) return callback(err)
      if (!venta.length) return callback(null, null)

      // Obtener detalles de la venta
      db.query(
        `SELECT 
          dv.*,
          p.nombre as producto_nombre,
          p.codigo as producto_codigo
        FROM detalles_venta dv
        JOIN productos p ON dv.producto_id = p.id
        WHERE dv.venta_id = ?`,
        [id],
        (err, detalles) => {
          if (err) return callback(err)
          
          // Obtener pagos de la venta
          db.query(
            `SELECT * FROM pagos WHERE venta_id = ?`,
            [id],
            (err, pagos) => {
              if (err) return callback(err)
              
              const ventaCompleta = {
                ...venta[0],
                detalles,
                pagos
              }
              
              callback(null, ventaCompleta)
            }
          )
        }
      )
    }
  )
}