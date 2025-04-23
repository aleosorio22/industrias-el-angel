const driver = require('../../../core/config/neo4j');

class GraphModel {
  static async registrarPedido(usuario, producto) {
    const session = driver.session();
    try {
      await session.run(`
        MERGE (u:Usuario {id: $usuario_id})
          ON CREATE SET u.nombre = $usuario_nombre, u.label = $usuario_nombre
          ON MATCH SET u.nombre = $usuario_nombre, u.label = $usuario_nombre
  
        MERGE (p:Producto {id: $producto_id})
          ON CREATE SET p.nombre = $producto_nombre, p.label = $producto_nombre
          ON MATCH SET p.nombre = $producto_nombre, p.label = $producto_nombre
  
        MERGE (u)-[:HA_PEDIDO]->(p)
      `, {
        usuario_id: usuario.id,
        usuario_nombre: usuario.nombre,
        producto_id: producto.id,
        producto_nombre: producto.nombre,
      });
    } catch (err) {
      console.error("❌ Error Neo4j:", err);
    } finally {
      await session.close();
    }
  }
  
  

  static async recomendarProductos(usuario_id) {
    const session = driver.session();
    try {
      const result = await session.run(`
        MATCH (u:Usuario {id: $usuario_id})-[:HA_PEDIDO]->(:Producto)<-[:HA_PEDIDO]-(otros:Usuario)-[:HA_PEDIDO]->(rec:Producto)
        WHERE NOT (u)-[:HA_PEDIDO]->(rec)
        RETURN DISTINCT rec.id AS producto_id, rec.nombre AS nombre
        LIMIT 5
      `, { usuario_id: Number(usuario_id) }); // 👈 Asegura que sea número
  
      return result.records.map(r => ({
        id: r.get('producto_id'),
        nombre: r.get('nombre'),
      }));
    } finally {
      await session.close();
    }
  }
  
  static async testConnection() {
    try {
        const session = driver.session();
        const result = await session.run('RETURN "Conexión exitosa con Neo4j" AS mensaje');
        const mensaje = result.records[0].get('mensaje');
        console.log('[Neo4j] ✅ Conectado correctamente:', mensaje);
        await session.close();
        return mensaje;
    } catch (error) {
        console.error('[Neo4j] ❌ Error de conexión:', error);
        throw error;
    }
  }
  
}

module.exports = GraphModel;
