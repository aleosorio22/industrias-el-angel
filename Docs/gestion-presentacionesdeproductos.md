## 📌 Introducción

Este manual detalla el proceso para gestionar las **presentaciones** de productos en el sistema, permitiendo asignar diferentes formatos de venta como **bolsas, cajas, domos, etc.** a cada producto. También se incluye el cálculo de producción en base a pedidos.

---

## 🏗️ **Estructura de la Base de Datos**

El sistema utiliza las siguientes tablas clave:

1. **`productos`**: Contiene los productos registrados.
2. **`presentaciones`**: Lista las presentaciones disponibles (bolsa, caja, etc.).
3. **`producto_presentacion`**: Relaciona productos con sus presentaciones y la cantidad de unidades que representa cada presentación.
4. **`conversion_unidades`**: Define las conversiones entre unidades para la producción.

---

## 🛠️ **Registro de una Nueva Presentación**

### 1️⃣ **Insertar Presentación**

Ejemplo de consulta para agregar presentaciones al sistema:

```sql
INSERT INTO presentaciones (nombre, descripcion) VALUES
('Bolsa 4 unidades', 'Bolsa con 4 panes'),
('Bolsa 10 unidades', 'Bolsa con 10 panes'),
('Caja 20 unidades', 'Caja con 20 panes');

```

### 2️⃣ **Asociar Presentación a un Producto**

Cada presentación debe estar vinculada a un producto en la tabla `producto_presentacion`.

Ejemplo para **Pan Chatio (id = 5) y Pan Integral (id = 2):**

```sql
sql
CopyEdit
-- Asociamos presentaciones a Pan Chatio
INSERT INTO producto_presentacion (producto_id, presentacion_id, cantidad, precio) VALUES
(5, 2, 4, 0.80),   -- Bolsa de 4 unidades
(5, 1, 10, 1.80),  -- Bolsa grande de 10 unidades
(5, 4, 15, 2.50);  -- Domo de 15 unidades

-- Asociamos presentaciones a Pan Integral
INSERT INTO producto_presentacion (producto_id, presentacion_id, cantidad, precio) VALUES
(2, 2, 6, 1.00),   -- Bolsa de 6 unidades
(2, 1, 12, 2.00),  -- Bolsa grande de 12 unidades
(2, 3, 24, 4.50);  -- Caja mediana de 24 unidades

```

**Explicación de los campos:**

- `producto_id`: ID del producto en `productos`.
- `presentacion_id`: ID de la presentación en `presentaciones`.
- `cantidad`: Número de unidades que representa la presentación.
- `precio`: Precio de venta de la presentación.

---

## 📊 **Consulta para Calcular Producción a Partir de Pedidos**

Esta consulta permite calcular la cantidad total de unidades requeridas y la materia prima necesaria.

```sql
sql
CopyEdit
WITH conversiones AS (
    SELECT
        cu.producto_id,
        LOWER(u1.nombre) AS unidad_origen,
        LOWER(u2.nombre) AS unidad_destino,
        cu.factor_conversion
    FROM conversion_unidades cu
    JOIN unidades u1 ON cu.unidad_origen_id = u1.id
    JOIN unidades u2 ON cu.unidad_destino_id = u2.id
    WHERE cu.producto_id IN (5, 2) -- Pan chatio y Pan Integral
),
pedido_simulado AS (
    SELECT 5 AS producto_id, 'Pan chatio' AS producto,
        (4 * 4) + (1 * 10) + (30) AS total_unidades -- Pedido simulado de Pan chatio
    UNION ALL
    SELECT 2 AS producto_id, 'Pan Integral' AS producto,
        (6 * 6) + (2 * 24) + (20) AS total_unidades -- Pedido simulado de Pan Integral
)

SELECT
    p.producto,
    p.total_unidades,

    -- Cálculo de latas necesarias
    ROUND(p.total_unidades / MAX(CASE
        WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' THEN c.factor_conversion
    END), 2) AS latas_necesarias,

    -- Cálculo de libras necesarias
    ROUND(
        (p.total_unidades / MAX(CASE
            WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' THEN c.factor_conversion
        END))
        / MAX(CASE
            WHEN c.unidad_origen = 'arroba' AND c.unidad_destino = 'lata' THEN c.factor_conversion
        END) * 25, 4
    ) AS libras_necesarias,

    -- Cálculo de arrobas necesarias
    ROUND(
        (p.total_unidades / MAX(CASE
            WHEN c.unidad_origen = 'lata' AND c.unidad_destino = 'unidad' THEN c.factor_conversion
        END))
        / MAX(CASE
            WHEN c.unidad_origen = 'arroba' AND c.unidad_destino = 'lata' THEN c.factor_conversion
        END), 4
    ) AS arrobas_necesarias

FROM pedido_simulado p
JOIN conversiones c ON p.producto_id = c.producto_id
GROUP BY p.producto, p.total_unidades;

```

---

## ✅ **Ejemplo de Salida**

Si ejecutamos la consulta con los pedidos simulados, obtendremos:

| Producto | Total Unidades | Latas Necesarias | Libras Necesarias | Arrobas Necesarias |
| --- | --- | --- | --- | --- |
| Pan chatio | 56 | (calculado) | (calculado) | (calculado) |
| Pan Integral | 104 | (calculado) | (calculado) | (calculado) |

---

## 📝 **Casos de Uso**

### 📌 **Caso 1: Registrar una nueva presentación**

1. Un administrador accede a la sección de **Presentaciones**.
2. Ingresa un nombre y una descripción para la presentación (Ej: "Bolsa 6 unidades").
3. Guarda la presentación.

### 📌 **Caso 2: Asociar una presentación a un producto**

1. En el módulo de **Productos**, elige un producto existente.
2. Selecciona **"Agregar Presentación"**.
3. Escoge la presentación y define la cantidad de unidades que representa.
4. Guarda los cambios.

### 📌 **Caso 3: Calcular la producción necesaria**

1. Se registran los pedidos en la base de datos.
2. Se ejecuta la consulta SQL para obtener:
    - **Total de unidades** de cada producto.
    - **Materia prima necesaria** en latas, libras y arrobas.
3. Se genera un reporte para producción.

---

## 🎯 **Conclusiones**

- Permite gestionar múltiples presentaciones por producto.
- Asegura que las órdenes de producción sean estandarizadas en unidades base.
- Facilita el cálculo automático de materia prima para pedidos.
- Mejora la trazabilidad y planificación en la panadería.