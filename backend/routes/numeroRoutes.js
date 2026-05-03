const express = require('express');
const router = express.Router();
const numeroController = require('../controllers/numeroController');

// GET /api/numeros - Obtener todos los números
router.get('/', numeroController.getAllNumeros);

// GET /api/numeros/libres - Obtener números libres
router.get('/libres', numeroController.getNumerosLibres);

// GET /api/numeros/ocupados - Obtener números ocupados
router.get('/ocupados', numeroController.getNumerosOcupados);

// ========== NUEVAS RUTAS DE VALIDACIÓN ==========
// GET /api/numeros/validar/:numero - Validar un número (rango y disponibilidad)
router.get('/validar/:numero', numeroController.validarNumero);

// PUT /api/numeros/:numero/bloquear - Bloquear un número
router.put('/:numero/bloquear', numeroController.bloquearNumero);

// GET /api/numeros/reporte/libres - Reporte de números libres
router.get('/reporte/libres', numeroController.getReporteLibres);

// GET /api/numeros/reporte/ocupados - Reporte de números ocupados
router.get('/reporte/ocupados', numeroController.getReporteOcupados);

module.exports = router;