const GraphModel = require('../models/graphModel');

class GraphController {
  static async recomendar(req, res) {
    try {
      const usuario_id = req.user.id;
      const productos = await GraphModel.recomendarProductos(usuario_id);
      res.json({ success: true, data: productos });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error en recomendación' });
    }
  }
}

module.exports = GraphController;
