const Estudiante = require('../models/Estudiante');

// Registrar estudiante y bloquear número
exports.registrarEstudiante = async (req, res) => {
    try {
        const { nombre, documento, programa, celular, numero } = req.body;
        
        // Validar campos obligatorios
        if (!nombre || !documento || !programa || !celular || !numero) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios: nombre, documento, programa, celular, numero'
            });
        }
        
        // Validar formato del documento (solo números, mínimo 5 caracteres)
        if (!/^\d{5,20}$/.test(documento)) {
            return res.status(400).json({
                error: 'El documento debe contener solo números (5-20 dígitos)'
            });
        }
        
        // Validar formato del celular
        if (!/^\d{10}$/.test(celular)) {
            return res.status(400).json({
                error: 'El celular debe contener 10 dígitos (ej: 3123456789)'
            });
        }
        
        // Validar nombre (mínimo 3 caracteres)
        if (nombre.length < 3) {
            return res.status(400).json({
                error: 'El nombre debe tener al menos 3 caracteres'
            });
        }
        
        // Validar programa
        const programasValidos = ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Arquitectura'];
        if (!programasValidos.includes(programa)) {
            return res.status(400).json({
                error: `Programa no válido. Opciones: ${programasValidos.join(', ')}`
            });
        }
        
        // Registrar estudiante
        const resultado = await Estudiante.registrarConNumero({
            nombre,
            documento,
            programa,
            celular,
            numero
        });
        
        res.status(201).json(resultado);
        
    } catch (error) {
        console.error('Error registrando estudiante:', error);
        
        // Manejar errores específicos
        if (error.message === 'El número ya está ocupado') {
            return res.status(409).json({ error: error.message });
        }
        if (error.message === 'El documento ya está registrado') {
            return res.status(409).json({ error: error.message });
        }
        if (error.message === 'Número no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todos los estudiantes
exports.getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.getAll();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error obteniendo estudiantes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener estudiantes con números ocupados
exports.getEstudiantesConNumeros = async (req, res) => {
    try {
        const estudiantes = await Estudiante.getEstudiantesConNumeros();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error obteniendo estudiantes con números:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};