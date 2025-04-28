# Manual de Implementación
## Manejando Pedidos y Entregas en PanTrack

---

## 🎯 Objetivo General

Implementar una solución profesional donde:
- El cliente pueda ver lo que **solicitó** y lo que **recibió**.
- El sistema garantice **transparencia**.
- El pedido original **no se modifique**.
- Se maneje de forma clara cualquier **diferencia** entre pedido y entrega.
- Se permita la **entrega parcial** de productos conforme estén disponibles.

---

## 📂 Cambios a Realizar

### 1. Base de Datos

Agregar nueva tabla para registro de entregas parciales:

```sql
CREATE TABLE pedido_entrega (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad_entregada DECIMAL(10,2) NOT NULL,
  comentario VARCHAR(255),
  fecha_entrega DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Relaciones:**
- `pedido_entrega.pedido_id` referencia a `pedido.id`.
- `pedido_entrega.producto_id` referencia a `producto.id`.

**Nota:** No es necesario agregar un nuevo campo de estado, ya que el pedido ya contiene el estado:

```sql
estado ENUM('solicitado', 'listo para entregar a ruta', 'en ruta', 'entregado') DEFAULT 'solicitado'
```

### 2. Backend (API)

Cuando se consulte `GET /mis-pedidos`, modificar la respuesta para incluir:

```json
[
  {
    "pedido_id": 123,
    "fecha_pedido": "2025-04-29",
    "productos_pedidos": [
      { "nombre": "Pan de Elote", "cantidad_pedida": 50 }
    ],
    "productos_entregados": [
      { "nombre": "Pan de Elote", "cantidad_entregada": 48 }
    ],
    "comentario_entrega": "Entrega incompleta por merma en producción."
  }
]
```

**Notas:**
- Si no existe una entrega registrada, mostrar solo lo solicitado.
- Si existe entrega parcial, mostrar diferencia.

**Nuevos endpoints a crear:**
- `POST /api/entregas` ➔ Registrar productos entregados parciales.
- `PATCH /api/entregas/listo/:pedidoId` ➔ Cambiar estado del pedido a `listo para entregar a ruta`.
- `PATCH /api/entregas/enruta/:pedidoId` ➔ Cambiar estado del pedido a `en ruta`.
- `PATCH /api/entregas/entregado/:pedidoId` ➔ Cambiar estado del pedido a `entregado`.

### 3. Frontend (Aplicación Cliente)

En el módulo **Pedidos del Día** para repartidor:

- Mostrar pedidos filtrados por fecha.
- Al ingresar a un pedido:
  - Mostrar productos solicitados.
  - Permitir editar cantidad entregada por producto.
  - Permitir registrar entrega parcial.
  - Botón "Listo para entregar a ruta" ➔ cambia el estado del pedido.
  - Botón "En ruta" ➔ cambia el estado a `en ruta`.
  - Botón "Entregar pedido" ➔ cambia el estado a `entregado`.

### 4. Producción y Entregas

- El repartidor puede **armar los pedidos por partes**.
- Cada producto entregado se registra en `pedido_entrega` conforme esté listo.
- Permitir registrar mermas o diferencias por producto.


---

## 🔄 Flujo Completo

1. **Cliente** realiza su pedido ➔ Se guarda en `pedido` y `pedido_detalle`.
2. **Producción** prepara productos.
3. **Repartidor** va registrando productos entregados en `pedido_entrega`.
4. **Repartidor** presiona "Listo para entregar a ruta" ➔ cambia estado.
5. **Repartidor** presiona "En ruta" al salir con los productos.
6. **Cuando completa la entrega**, presiona "Entregado".
7. **Cliente** ve su pedido con solicitud original y entrega real, diferencias visibles.

---

## 📈 Ventajas de Este Enfoque

| Ventaja | Explicación |
|:---|:---|
| ✅ Transparencia | El cliente ve lo que pidió y recibió. |
| ✅ Auditoría | Se puede rastrear calidad de producción y entrega. |
| ✅ Escalabilidad | Permite entregas parciales, registros flexibles. |
| ✅ Profesionalismo | Mejora la confianza del cliente en el sistema. |

---

# Fin del Manual 🔧

> Listo para implementarse en PanTrack Production & Delivery versión avanzada.

