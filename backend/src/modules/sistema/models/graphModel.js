const driver = require('../../../core/config/neo4j');

class GraphModel {
  static async registrarPedido(usuario, producto) {
    const session = driver.session();
    try {
      await session.run(`
        MERGE (u:Usuario {nombre: $usuario})
        MERGE (p:Producto {nombre: $producto})
        MERGE (u)-[:HA_PEDIDO]->(p)
      `, { usuario, producto });
    } catch (err) {
      console.error("❌ Error Neo4j:", err);
    } finally {
      await session.close();
    }
  }

  static async recomendarProductos(usuario) {
    const session = driver.session();
    try {
      const result = await session.run(`
        MATCH (u:Usuario {nombre: $usuario})-[:HA_PEDIDO]->(:Producto)<-[:HA_PEDIDO]-(otros:Usuario)-[:HA_PEDIDO]->(recomendado:Producto)
        WHERE NOT (u)-[:HA_PEDIDO]->(recomendado)
        RETURN DISTINCT recomendado.nombre AS producto
        LIMIT 5
      `, { usuario });

      return result.records.map(r => r.get('producto'));
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
