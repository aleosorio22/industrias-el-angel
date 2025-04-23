const GraphModel = require('../models/graphModel');

class GraphController {
  static async recomendar(req, res) {
    try {
      const usuario = req.user.nombre || req.user.email || `Usuario${req.user.id}`;
      const productos = await GraphModel.recomendarProductos(usuario);
      res.json({ success: true, data: productos });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error en recomendación' });
    }
  }
}

module.exports = GraphController;
