## 📌 Introducción

Este documento detalla el proceso de registro y uso de productos y conversiones en la base de datos. Se explica paso a paso cómo agregar productos, definir conversiones de unidades y calcular la producción con base en los pedidos.

---

## 🏗️ **Estructura de la Base de Datos**

Nuestra base de datos está conformada por las siguientes tablas clave:

1. **`productos`**: Almacena los productos registrados con sus datos básicos.
2. **`unidades`**: Contiene las unidades de medida disponibles (Unidad, Libra, Lata, Arroba, etc.).
3. **`conversion_unidades`**: Define las conversiones entre unidades para cada producto.
4. **`producto_presentacion`**: Relaciona productos con sus presentaciones comerciales.

---

## 🛠️ **Registro de un Nuevo Producto**

Para agregar un nuevo producto, se sigue este procedimiento:

### 1️⃣ **Insertar el Producto**

Ejemplo de consulta para registrar el producto **Harinado**:

```sql
INSERT INTO productos (codigo, nombre, descripcion, categoria_id, unidad_base_id, precio_base)
VALUES ('H001', 'Harinado', 'Pan harinado tradicional', 1, 1, 0.30);

```

- `codigo`: Código único del producto.
- `nombre`: Nombre del producto.
- `descripcion`: Breve descripción.
- `categoria_id`: Categoría a la que pertenece (Ej: Panes = 1).
- `unidad_base_id`: Unidad base (Unidad = 1).
- `precio_base`: Precio de referencia.

### 2️⃣ **Definir las Conversiones del Producto**

Las conversiones determinan cómo se transforma una unidad en otra dentro del proceso de producción.

Ejemplo de conversiones para **Harinado**:

```sql
sql
CopyEdit
-- Conversión de Lata a Unidad (1 lata = 15 unidades)
INSERT INTO conversion_unidades (producto_id, unidad_origen_id, unidad_destino_id, factor_conversion)
VALUES ((SELECT id FROM productos WHERE nombre = 'Harinado'),
        (SELECT id FROM unidades WHERE nombre = 'Lata'),
        (SELECT id FROM unidades WHERE nombre = 'Unidad'),
        15);

-- Conversión de Arroba a Lata (1 arroba = 21.48 latas)
INSERT INTO conversion_unidades (producto_id, unidad_origen_id, unidad_destino_id, factor_conversion)
VALUES ((SELECT id FROM productos WHERE nombre = 'Harinado'),
        (SELECT id FROM unidades WHERE nombre = 'Arroba'),
        (SELECT id FROM unidades WHERE nombre = 'Lata'),
        21.48);

```

🔹 **Explicación**:

- Se almacena la relación entre unidades.
- Permite calcular los insumos necesarios al producir un número específico de unidades.

---

## 📊 **Consulta para Calcular la Producción**

Esta consulta calcula la **cantidad de materia prima necesaria** para un pedido dado, en función de las conversiones.

Ejemplo para un pedido de **64 unidades de Harinado**:

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
    WHERE cu.producto_id = (SELECT id FROM productos WHERE nombre = 'Harinado')
)

SELECT
    'Harinado' AS producto,
    64 AS cantidad_pedida,

    -- Conversión a latas necesarias
    ROUND(64 / MAX(CASE WHEN unidad_origen = 'lata' AND unidad_destino = 'unidad' THEN factor_conversion END), 2)
    AS latas_necesarias,

    -- Conversión de latas a libras necesarias
    ROUND((64 / MAX(CASE WHEN unidad_origen = 'lata' AND unidad_destino = 'unidad' THEN factor_conversion END))
        / MAX(CASE WHEN unidad_origen = 'arroba' AND unidad_destino = 'lata' THEN factor_conversion END) * 25, 4)
    AS libras_necesarias,

    -- Conversión de libras a arrobas necesarias
    ROUND((64 / MAX(CASE WHEN unidad_origen = 'lata' AND unidad_destino = 'unidad' THEN factor_conversion END))
        / MAX(CASE WHEN unidad_origen = 'arroba' AND unidad_destino = 'lata' THEN factor_conversion END), 4)
    AS arrobas_necesarias

FROM conversiones;

```

---

## ✅ **Ejemplo de Salida**

Para **64 unidades de Harinado**, la consulta devuelve:

| Producto | Cantidad Pedida | Latas Necesarias | Libras Necesarias | Arrobas Necesarias |
| --- | --- | --- | --- | --- |
| Harinado | 64 | 4.27 | 4.9735 | 0.1981 |

🔹 **Interpretación**:

- Se necesitan **4.27 latas** para producir 64 unidades.
- Para esas latas, se requieren **4.9735 libras** de masa.
- Eso equivale a **0.1981 arrobas**.

---

## 📝 **Notas Finales**

- Todas las conversiones están estructuradas en la tabla `conversion_unidades`.
- Si se agregan nuevos productos, es crucial definir correctamente sus conversiones.
- Los cálculos dependen de los factores de conversión almacenados, por lo que cualquier error en estos valores afectará los resultados.