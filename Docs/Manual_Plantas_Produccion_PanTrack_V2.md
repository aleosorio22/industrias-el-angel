# **📘 Manual de Uso: Gestión de Plantas de Producción en PanTrack (Versión Relacional)**

---

## **📌 1. Objetivo del módulo**

El módulo de plantas de producción tiene como objetivo organizar y segmentar la producción por **sedes físicas**, permitiendo:

1. Asignar áreas de producción a **una única planta** mediante una tabla de relación.
2. Obtener el consolidado de producción filtrado por planta, mostrando solo las áreas y categorías correspondientes.
3. Mantener una estructura **relacional flexible**, evitando alterar tablas existentes directamente.

---

## **📌 2. Lógica de Negocio**

✅ Una **planta de producción** puede tener múltiples **áreas de producción**.

✅ Una **área de producción** pertenece a **una sola planta**.

✅ Cada **área** está asociada a una o más **categorías de productos** (como ya está implementado).

✅ El consolidado por planta se construye identificando qué áreas le pertenecen, luego qué categorías están en esas áreas, y finalmente qué productos están en esas categorías.

---

## **📌 3. Diseño de la Base de Datos**

### **📌 3.1 Tabla `plantas_produccion`**

Almacena las distintas sedes físicas de producción.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID único |
| `nombre` | VARCHAR(100) | Nombre de la planta |
| `ubicacion` | VARCHAR(255) | Ubicación física |
| `estado` | ENUM('activo', 'inactivo') | Estado actual |

```sql
CREATE TABLE plantas_produccion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(255),
  estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);
```

---

### **📌 3.2 Tabla `planta_area` (Nueva Relación)**

Relaciona cada área con su planta. Como una **área solo puede pertenecer a una planta**, esta relación es **1:1**.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID único |
| `planta_id` | INT FK | ID de la planta |
| `area_id` | INT FK | ID de la área de producción |

```sql
CREATE TABLE planta_area (
  id INT AUTO_INCREMENT PRIMARY KEY,
  planta_id INT NOT NULL,
  area_id INT NOT NULL,
  UNIQUE(area_id),
  FOREIGN KEY (planta_id) REFERENCES plantas_produccion(id),
  FOREIGN KEY (area_id) REFERENCES areas_produccion(id)
);
```

> 🔐 El `UNIQUE(area_id)` garantiza que **una área solo esté en una planta**.

---

## **📌 4. Lógica del Backend**

### **📌 4.1 Modelo: `PlantModel.js`**

```js
const db = require('../../../core/config/database');

class PlantModel {
  static async create(data) {
    const { nombre, ubicacion } = data;
    const [result] = await db.execute(
      'INSERT INTO plantas_produccion (nombre, ubicacion) VALUES (?, ?)',
      [nombre, ubicacion]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.execute(
      'SELECT * FROM plantas_produccion WHERE estado = "activo"'
    );
    return rows;
  }

  static async assignAreas(planta_id, area_ids) {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      await conn.execute('DELETE FROM planta_area WHERE planta_id = ?', [planta_id]);

      for (const area_id of area_ids) {
        await conn.execute(
          'INSERT INTO planta_area (planta_id, area_id) VALUES (?, ?)',
          [planta_id, area_id]
        );
      }

      await conn.commit();
      conn.release();
      return true;
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  }
}
```

---

## **📌 5. Consolidado por Planta**

### 🔄 Método en `OrderModel`:

```js
static async getProductionConsolidated(date, planta_id) {
  const query = `
    WITH areas_planta AS (
      SELECT area_id FROM planta_area WHERE planta_id = ?
    ),
    categorias_area AS (
      SELECT categoria_id FROM area_categoria WHERE area_id IN (SELECT area_id FROM areas_planta)
    ),
    pedidos_del_dia AS (
      SELECT pd.producto_id, p.nombre AS producto_nombre, p.categoria_id, cat.nombre AS categoria_nombre,
             p.unidad_base_id, pd.presentacion_id, pd.cantidad, pp.cantidad AS unidades_por_presentacion
      FROM pedidos pe
      JOIN pedido_detalle pd ON pe.id = pd.pedido_id
      JOIN productos p ON pd.producto_id = p.id
      JOIN categorias cat ON p.categoria_id = cat.id
      JOIN producto_presentacion pp ON pd.producto_id = pp.producto_id AND pd.presentacion_id = pp.presentacion_id
      WHERE DATE(pe.fecha) = ? AND pe.estado != 'cancelado'
        AND p.categoria_id IN (SELECT categoria_id FROM categorias_area)
    )
    -- Continúa la lógica de agregación
  `;

  const [results] = await db.execute(query, [planta_id, date]);
  return results;
}
```

---

## **📌 6. Cambios en el Frontend**

- Mostrar un `select` para elegir la planta de producción.
- Al consultar el consolidado, enviar `planta_id` al backend.
- Mostrar las áreas y productos correspondientes a esa planta.

---

## **📌 7. Beneficios del enfoque relacional**

✅ No modifica tablas existentes (`areas_produccion`, `categorias`).

✅ Estructura limpia y escalable como en `area_categoria`.

✅ Permite reasignar fácilmente áreas a otra planta si se necesita.

✅ Validación clara: una **área** solo puede estar en una **planta**.

---

## **📌 8. Recomendaciones**

- Validar en backend que **no se repita un área en más de una planta**.
- Mostrar advertencias en frontend si el usuario intenta asignar duplicados.
- Agregar lógica para consultar todas las áreas de una planta desde `plantModel`.

---

**Fin del manual.**
