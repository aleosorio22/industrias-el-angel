# 📘 Guía de Integración: Sistema de Recomendación en PanTrack

Este documento explica paso a paso cómo implementar un **Sistema de Recomendación de Productos** en PanTrack utilizando **Neo4j como motor de grafos**. El objetivo es ofrecer sugerencias a los usuarios basadas en sus compras previas y las de otros usuarios similares.

---

## 🧠 ¿Cómo funciona el sistema?

1. Los usuarios hacen pedidos en PanTrack (registro en MySQL).
2. Cada vez que un pedido se registra, también se guarda una relación en **Neo4j** entre el usuario y el producto.
3. Neo4j analiza las relaciones y permite generar recomendaciones personalizadas.
4. Desde el frontend, los usuarios pueden ver sugerencias de productos en una nueva sección llamada `Explorar`.

---

## 🧱 Estructura general

MySQL → [Base de datos central] Neo4j → [Base de datos de grafos para recomendaciones] Node.js API → [Backend que conecta ambas bases] React Frontend → [Interfaz con módulo "Explorar"]


---

## 🔧 1. Requisitos previos

### Backend
- Node.js (v16+)
- Neo4j Desktop (o instancia remota)
- MySQL
- npm

### Librerías necesarias
```bash
npm install neo4j-driver mysql2 express cors
```

---
🌐 2. Configurar conexión a Neo4j en Node.js

const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "TU_CONTRASEÑA")
);

module.exports = driver;

🔁 3. Insertar relación en Neo4j al registrar un pedido
En tu controlador de pedidos (ej: controllers/pedidos.js)
js
Copy
Edit
const driver = require("../config/neo4j");

async function registrarEnNeo4j(usuario, producto) {
  const session = driver.session();

  try {
    await session.run(`
      MERGE (u:Usuario {nombre: $usuario})
      MERGE (p:Producto {nombre: $producto})
      MERGE (u)-[:HA_PEDIDO]->(p)
    `, { usuario, producto });
  } finally {
    await session.close();
  }
}
Llamá esa función justo después de guardar un pedido en MySQL.

📬 4. Endpoint para obtener recomendaciones
Ruta: GET /api/recomendaciones/:usuario
js
Copy
Edit
router.get('/recomendaciones/:usuario', async (req, res) => {
  const { usuario } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (u1:Usuario {nombre: $usuario})-[:HA_PEDIDO]->(p:Producto)<-[:HA_PEDIDO]-(u2:Usuario),
            (u2)-[:HA_PEDIDO]->(rec:Producto)
      WHERE NOT (u1)-[:HA_PEDIDO]->(rec)
      RETURN DISTINCT rec.nombre AS producto, COUNT(*) AS score
      ORDER BY score DESC
      LIMIT 5
    `, { usuario });

    const recomendaciones = result.records.map(row => ({
      producto: row.get("producto"),
      score: row.get("score").toNumber()
    }));

    res.json(recomendaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});
🎨 5. Frontend: Sección Explorar
Pantalla: Explorar.jsx
jsx
Copy
Edit
import React, { useEffect, useState } from "react";
import axios from "axios";

function Explorar({ usuario }) {
  const [recomendaciones, setRecomendaciones] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3500/api/recomendaciones/${usuario}`)
      .then(res => setRecomendaciones(res.data))
      .catch(err => console.error(err));
  }, [usuario]);

  return (
    <div>
      <h2>Recomendaciones para ti</h2>
      <ul>
        {recomendaciones.map((item, index) => (
          <li key={index}>
            {item.producto} — Relevancia: {item.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Explorar;
📌 Podés incluir esta vista en el dashboard de PanTrack.

✅ Resultado esperado
Cada vez que un usuario hace un pedido, también queda registrado en Neo4j.

Al entrar a la sección "Explorar", el usuario verá recomendaciones basadas en lo que han comprado otros usuarios similares.

Las sugerencias se actualizan en tiempo real sin depender de archivos CSV.

🚀 Futuras mejoras
Agregar pesos según frecuencia ([:HA_PEDIDO {veces: n}])

Recomendar por categoría o tipo de producto.

Mostrar recomendaciones con imágenes en el frontend.

Panel de visualización de nodos (admin/analítica).
