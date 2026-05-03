const express = require('express');
const router = express.Router();
const sorteoController = require('../controllers/sorteoController');

// POST /api/sorteo/realizar - Realizar sorteo
router.post('/realizar', sorteoController.realizarSorteo);

// GET /api/sorteo/verificar - Verificar si hay sorteo activo
router.get('/verificar', sorteoController.verificarSorteo);

// GET /api/sorteo/historial - Obtener historial de sorteos
router.get('/historial', sorteoController.getHistorial);

// POST /api/sorteo/reiniciar - Reiniciar sistema (solo administrador)
router.post('/reiniciar', sorteoController.reiniciarSistema);

module.exports = router;