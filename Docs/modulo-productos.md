# **📌 1. Objetivo del sistema**

El sistema debe permitir:

1. **Gestionar productos** con sus unidades de medida base (Ej. libras, unidades).
2. **Calcular la producción** en base a conversiones dinámicas (Ej. unidades → latas → libras).
3. **Manejar diferentes presentaciones** (Ej. bolsas de 4 unidades, cajas de 20 unidades).
4. **Escalar fácilmente**, permitiendo agregar nuevas unidades o conversiones sin modificar la estructura.

---

# **📌 2. Lógica de Negocio**

Cada producto:
✅ **Tiene una unidad base**, que representa su forma más fundamental de medición (**Ejemplo: libras, unidades**).

✅ **Puede transformarse en otras unidades**, dependiendo de su método de producción (**Ejemplo: latas, bandejas, sartenes**).

✅ **Puede venderse en diferentes presentaciones**, con cantidades variables (**Ejemplo: bolsas de 4, cajas de 20**).

✅ **Las conversiones son dinámicas y configurables**, evitando estructuras rígidas.

---

# **📌 3. Diseño de la Base de Datos**

Para lograr la máxima flexibilidad, usaremos **seis tablas principales**:

1. **`productos`** → Información de cada producto.
2. **`categorias`** → Clasificación de los productos.
3. **`unidades`** → Lista de unidades de medida (Ej. unidades, libras, latas).
4. **`conversion_produccion`** → Factores de conversión entre unidades.
5. **`presentaciones`** → Formas en que un producto se vende (Ej. bolsas, cajas).
6. **`producto_presentacion`** → Relación entre productos y presentaciones.

---

## **📌 3.1 Tabla de Productos (`productos`)**

📌 Almacena los productos disponibles en el sistema.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID único del producto |
| `nombre` | VARCHAR(100) | Nombre del producto (Ej. "Concha de Queso") |
| `categoria_id` | INT FK | Relación con la tabla de categorías |
| `unidad_base_id` | INT FK | Relación con la tabla `unidades` |

> Ejemplo:
> 
> - **Concha de Queso** → Unidad base: **Unidades**
> - **Masa para Pan** → Unidad base: **Libras**

---

## **📌 3.2 Tabla de Categorías (`categorias`)**

📌 Clasifica los productos (Ej. Panes, Pasteles, Repostería).

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID único de la categoría |
| `nombre` | VARCHAR(50) | Nombre de la categoría (Ej. "Panes") |

> Ejemplo:
> 
> - Categoría **Panes** → Concha de Queso
> - Categoría **Repostería** → Muffin de Chocolate

---

## **📌 3.3 Tabla de Unidades (`unidades`)**

📌 Lista todas las unidades de medida disponibles en el sistema.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID único de la unidad |
| `nombre` | VARCHAR(50) | Nombre de la unidad (Ej. "Unidades", "Libras", "Latas") |

> Ejemplo:
> 
> - `1 → Unidades`
> - `2 → Libras`
> - `3 → Latas`
> - `4 → Arrobas`

---

## **📌 3.4 Tabla de Conversión de Producción (`conversion_produccion`)**

📌 Define cómo convertir un producto de una unidad a otra.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID de la conversión |
| `producto_id` | INT FK | Producto relacionado |
| `unidad_origen_id` | INT FK | Relación con la tabla `unidades` (Ej. Unidades) |
| `unidad_destino_id` | INT FK | Relación con la tabla `unidades` (Ej. Latas) |
| `factor_conversion` | FLOAT | Factor de conversión |

> Ejemplo para Concha de Queso:
> 
> - 1 lata = **15 unidades**
> - 1 lata = **1.02 libras**
> - 1 arroba = **25 libras**

---

## **📌 3.5 Tabla de Presentaciones (`presentaciones`)**

📌 Define los tipos de presentaciones en las que se vende un producto.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID de la presentación |
| `nombre` | VARCHAR(50) | Nombre de la presentación (Ej. "Bolsa de 4 unidades") |

> Ejemplo:
> 
> - `1 → Bolsa de 4 unidades`
> - `2 → Caja de 20 unidades`

---

## **📌 3.6 Tabla de Producto-Presentación (`producto_presentacion`)**

📌 Relaciona productos con sus presentaciones.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | INT PK | ID único |
| `producto_id` | INT FK | Relación con `productos` |
| `presentacion_id` | INT FK | Relación con `presentaciones` |
| `cantidad` | INT | Cantidad de unidades en esa presentación |

> Ejemplo:
> 
> - Concha de Queso → **Bolsa** de **4 unidades**
> - Concha de Queso → **Caja** de **20 unidades**

---

# **📌 4. Ejemplo Completo en la Práctica**

### **Pedido: 64 Conchas de Queso**

1️⃣ **Convertimos unidades a latas:**

- `64 ÷ 15 = 4.27 latas`

2️⃣ **Convertimos latas a libras:**

- `4.27 × 1.02 = 4.36 libras`

3️⃣ **Convertimos libras a arrobas:**

- `4.36 ÷ 25 = 0.17 arrobas`

🎯 **Si queremos empacar las 64 conchas en bolsas de 4 unidades:**

- `64 ÷ 4 = 16 bolsas`

🎯 **Si queremos empacar en cajas de 20 unidades:**

- `64 ÷ 20 = 3.2 → Se necesitan 3 cajas y 4 unidades sueltas`

---

# **📌 5. Casos de Error y Validaciones**

✅ **Caso 1: Un producto sin conversiones registradas**

- Si intentamos convertir un producto que no tiene factores de conversión, el sistema debe **arrojar un error**.

✅ **Caso 2: Presentaciones mal configuradas**

- Si queremos empacar un producto en una presentación que **no está registrada**, el sistema debe **mostrar un mensaje de error**.

✅ **Caso 3: Factores de conversión incorrectos**

- Si alguien registra **1 lata = 100 unidades**, los cálculos serán incorrectos. Se debe validar que los factores de conversión sean realistas.

## **📌 Cómo Funciona Paso a Paso**

Flujo completo con la estructura que definimos.

---

### **🎯 Paso 1: Pedido del Usuario**

📌 **El usuario solicita un pedido de 64 conchas de queso**.

---

### **🎯 Paso 2: Conversión a Producción**

Aquí el sistema **automáticamente busca las conversiones** en la base de datos.

1️⃣ **Convertir unidades a latas**

- Según la tabla `conversion_produccion`:
- **1 lata = 15 conchas**
- 🔹 **64 ÷ 15 = 4.27 latas**

2️⃣ **Convertir latas a libras**

- **1 lata usa 1.02 libras de masa**
- 🔹 **4.27 × 1.02 = 4.36 libras**

3️⃣ **Convertir libras a arrobas**

- **1 arroba = 25 libras**
- 🔹 **4.36 ÷ 25 = 0.17 arrobas**

---

### **🎯 Paso 3: Respuesta del Sistema**

El sistema puede **mostrar la conversión en todos los niveles** al usuario:

| Concepto | Cantidad |
| --- | --- |
| Pedido en Unidades | 64 Conchas |
| Latas necesarias | 4.27 Latas |
| Libras de masa | 4.36 Libras |
| Arrobas necesarias | 0.17 Arrobas |

---

## **📌 Otras Variaciones**

📌 **Si el usuario cambia la cantidad del pedido, el sistema recalcula en tiempo real**.

📌 **Si un producto no usa latas, simplemente no se registra esa conversión y el cálculo sigue sin errores**.

📌 **Se pueden agregar más unidades de producción sin modificar la estructura** (Ej. si en el futuro agregamos "bandejas" o "sartenes").

---

## **📌 ¿Cómo se ve la consulta en SQL?**

Cuando el usuario ingresa **"64 conchas"**, la API consulta los factores de conversión:

```sql
sql
CopyEdit
SELECT
    p.nombre AS producto,
    cp.unidad_origen_id,
    u1.nombre AS unidad_origen,
    cp.unidad_destino_id,
    u2.nombre AS unidad_destino,
    cp.factor_conversion
FROM conversion_produccion cp
JOIN unidades u1 ON cp.unidad_origen_id = u1.id
JOIN unidades u2 ON cp.unidad_destino_id = u2.id
JOIN productos p ON cp.producto_id = p.id
WHERE cp.producto_id = 1; -- ID del producto "Concha de Queso"

```

📌 **Esta consulta traerá todas las conversiones del producto** para poder calcular todo automáticamente.

[📘 Manual de Uso: Gestión de Productos y Conversiones](https://www.notion.so/Manual-de-Uso-Gesti-n-de-Productos-y-Conversiones-1bc40b86464f809ea336fa18ed54542d?pvs=21)

[📘 Manual de Uso: Gestión de Presentaciones de Productos](https://www.notion.so/Manual-de-Uso-Gesti-n-de-Presentaciones-de-Productos-1bd40b86464f80e9a7ddec0e0350c309?pvs=21)