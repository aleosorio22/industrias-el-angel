📘 Manual Técnico y de Uso: Módulo de Plantillas de Pedidos

---

## 🧩 Descripción General

El módulo de **plantillas de pedidos** permite a los usuarios crear, guardar y reutilizar configuraciones frecuentes de pedidos, con cantidades personalizadas por producto. Está diseñado para optimizar el proceso de creación de pedidos recurrentes, como los que hacen tiendas o rutas semanalmente.

---

## 🎯 Objetivo

Facilitar el trabajo de los usuarios al permitirles cargar pedidos frecuentes sin tener que seleccionar productos uno por uno cada vez, brindando además la posibilidad de ajustar cantidades en el momento sin modificar la plantilla original.

---

## 🧑‍💻 Manual Técnico

### 🔸 Tablas en la Base de Datos

### `plantillas_pedidos`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| id | INT (PK) | ID único de la plantilla |
| usuario_id | INT | Usuario que creó la plantilla |
| nombre | VARCHAR(100) | Nombre de la plantilla (ej. Lunes) |
| fecha_creacion | DATETIME | Fecha y hora de creación |

### `plantilla_pedido_detalle`

| Campo | Tipo | Descripción |
| --- | --- | --- |
| id | INT (PK) | ID del detalle |
| plantilla_id | INT (FK) | Referencia a `plantillas_pedidos` |
| producto_id | INT | Producto incluido |
| presentacion_id | INT | Presentación seleccionada |
| cantidad | DECIMAL(10,2) | Cantidad preestablecida |

---

### 🔹 Endpoints API

### Crear una nueva plantilla

```
css
CopyEdit
POST /api/plantillas
Body:
{
  "nombre": "Pedido Lunes",
  "productos": [
    { "producto_id": 1, "presentacion_id": 2, "cantidad": 500 },
    ...
  ]
}

```

### Listar plantillas del usuario

```
bash
CopyEdit
GET /api/plantillas

```

### Obtener plantilla por ID

```
bash
CopyEdit
GET /api/plantillas/:id

```

### Usar plantilla (cargar al pedido actual)

```
bash
CopyEdit
POST /api/plantillas/:id/usar

```

### Eliminar plantilla

```
bash
CopyEdit
DELETE /api/plantillas/:id

```

---

## 📱 Manual de Uso

### 🔹 Crear Plantilla

1. Ir al módulo **Plantillas**.
2. Hacer clic en **“Nueva Plantilla”**.
3. Asignar un nombre (ej. Pedido lunes).
4. Agregar productos con presentaciones y cantidades.
5. Guardar.

### 🔹 Cargar una Plantilla

1. Dentro del módulo **Pedidos**, hacer clic en **“Cargar Plantilla”**.
2. Seleccionar la plantilla deseada.
3. El sistema llenará automáticamente los productos y cantidades.
4. (Opcional) Modificar cantidades según necesidades del día.

### 🔹 Usar la Plantilla para Pedido

1. Revisar los productos precargados.
2. Editar cantidades si es necesario.
3. Confirmar el pedido normalmente.
4. La plantilla **NO se modifica**.

---

## 💡 Casos de Uso

- **Pedidos semanales** por ruta o tienda.
- **Pedidos por turnos (Lunes, Miércoles, Viernes)**.
- **Plantillas por temporada (Navidad, Feria, etc.)**.

---

## ✅ Ventajas

- Ahorro de tiempo para el usuario.
- Reducción de errores en pedidos repetitivos.
- Mejora la experiencia del usuario en pedidos grandes.
- Escalable: puede extenderse a múltiples tipos de plantillas por tienda, sucursal o ruta.