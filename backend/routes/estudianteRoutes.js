const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

// POST /api/estudiantes/registrar - Registrar estudiante y bloquear número
router.post('/registrar', estudianteController.registrarEstudiante);

// GET /api/estudiantes - Obtener todos los estudiantes
router.get('/', estudianteController.getEstudiantes);

// GET /api/estudiantes/ocupados - Obtener estudiantes con números ocupados
router.get('/ocupados', estudianteController.getEstudiantesConNumeros);

module.exports = router;