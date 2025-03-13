const express = require("express");
const { 
  crearVenta, 
  getVentaById, 
  getVentasByCaja, 
  anularVenta,
  generarTicket
} = require("../controllers/ventaController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rutas básicas de ventas
router.post("/", verifyToken, crearVenta);
router.get("/:id", verifyToken, getVentaById);
router.get("/caja/:caja_id", verifyToken, getVentasByCaja);
router.post("/:id/anular", verifyToken, anularVenta);
// Nuevo endpoint para tickets
router.get("/:id/ticket", verifyToken, generarTicket);

module.exports = router;